using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public static class Accounts
{
    public static readonly string[] Roles = ["Guardian", "Clinician", "Editor", "Reviewer", "HospitalAdmin", "PlatformAdmin"];
    public static async Task EnsureRoles(IServiceProvider services)
    {
        var manager = services.GetRequiredService<RoleManager<IdentityRole>>();
        foreach (var role in Roles) if (!await manager.RoleExistsAsync(role)) Check(await manager.CreateAsync(new IdentityRole(role)));
    }
    static void Check(IdentityResult result) { if (!result.Succeeded) throw new InvalidOperationException(string.Join(" ", result.Errors.Select(x => x.Description))); }
    public static async Task CreateFirstAdmin(IServiceProvider services)
    {
        var users = services.GetRequiredService<UserManager<IdentityUser>>();
        var db = services.GetRequiredService<WaneesDb>();
        await using var tx = await db.Database.BeginTransactionAsync();
        await db.Database.ExecuteSqlRawAsync("SELECT pg_advisory_xact_lock(76192610)");
        if ((await users.GetUsersInRoleAsync("PlatformAdmin")).Count != 0) throw new InvalidOperationException("An administrator already exists. Use account administration.");
        var email = Environment.GetEnvironmentVariable("WANEES_ADMIN_EMAIL") ?? throw new InvalidOperationException("Set WANEES_ADMIN_EMAIL.");
        var password = Environment.GetEnvironmentVariable("WANEES_ADMIN_PASSWORD") ?? throw new InvalidOperationException("Set WANEES_ADMIN_PASSWORD.");
        var user = new IdentityUser { UserName = email.Trim(), Email = email.Trim() };
        Check(await users.CreateAsync(user, password));
        Check(await users.AddToRoleAsync(user, "PlatformAdmin"));
        Check(await users.AddClaimAsync(user, new Claim("hospital", "al-bahar")));
        await tx.CommitAsync();
        Console.WriteLine("First administrator created. Sign in through the account page.");
    }
    public static async Task ValidateSession(CookieValidatePrincipalContext context)
    {
        if (context.Principal?.FindFirst("stamp") is not { } stamp)
        {
            if (context.HttpContext.RequestServices.GetRequiredService<IConfiguration>().GetValue<bool>("DemoMode")) return;
            context.RejectPrincipal(); await context.HttpContext.SignOutAsync("Wanees"); return;
        }
        var users = context.HttpContext.RequestServices.GetRequiredService<UserManager<IdentityUser>>();
        var user = await users.FindByIdAsync(context.Principal.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (user == null || await users.GetSecurityStampAsync(user) != stamp.Value || await users.IsLockedOutAsync(user))
        { context.RejectPrincipal(); await context.HttpContext.SignOutAsync("Wanees"); }
    }
    static async Task SignIn(HttpContext c, IdentityUser user, UserManager<IdentityUser> users)
    {
        var claims = new List<Claim> { new(ClaimTypes.NameIdentifier, user.Id), new(ClaimTypes.Email, user.Email!), new("stamp", await users.GetSecurityStampAsync(user)) };
        claims.AddRange((await users.GetRolesAsync(user)).Select(r => new Claim(ClaimTypes.Role, r)));
        claims.AddRange((await users.GetClaimsAsync(user)).Where(x => x.Type == "hospital"));
        await c.SignInAsync("Wanees", new ClaimsPrincipal(new ClaimsIdentity(claims, "Wanees")));
    }
    public static void Map(RouteGroupBuilder v, bool demo)
    {
        v.MapPost("/auth/register", async (Register input, UserManager<IdentityUser> users, WaneesDb db) =>
        {
            if (demo) return Results.Problem(statusCode: 409, title: "Accounts require PostgreSQL account mode.");
            if (!input.Consent || string.IsNullOrWhiteSpace(input.Email) || input.Email.Length > 200 || string.IsNullOrEmpty(input.Password) || input.Password.Length > 128) return Results.BadRequest();
            await using var tx = await db.Database.BeginTransactionAsync();
            var user = new IdentityUser { UserName = input.Email.Trim(), Email = input.Email.Trim() };
            var result = await users.CreateAsync(user, input.Password);
            if (!result.Succeeded) return Results.Problem(statusCode: 400, title: "Account could not be created", detail: "Use a valid, unused email and at least 12 characters including upper/lowercase, a number and a symbol.");
            Check(await users.AddToRoleAsync(user, "Guardian"));
            db.Records.Add(new OwnedRecord { Id = Guid.NewGuid(), OwnerId = user.Id, Kind = "consents", Data = System.Text.Json.JsonSerializer.Serialize(new { adultAccount = true, policyVersion = "2026-09-23", at = DateTimeOffset.UtcNow }) });
            await db.SaveChangesAsync();
            await tx.CommitAsync();
            return Results.Ok(new { created = true });
        }).RequireRateLimiting("auth");
        v.MapPost("/auth/login", async (Login input, HttpContext c, UserManager<IdentityUser> users) =>
        {
            if (demo) return Results.NotFound();
            if (string.IsNullOrWhiteSpace(input.Email) || input.Email.Length > 200 || string.IsNullOrEmpty(input.Password) || input.Password.Length > 128) return Results.Unauthorized();
            var user = await users.FindByEmailAsync(input.Email.Trim());
            if (user == null || await users.IsLockedOutAsync(user)) return Results.Unauthorized();
            if (!await users.CheckPasswordAsync(user, input.Password)) { await users.AccessFailedAsync(user); return Results.Unauthorized(); }
            await users.ResetAccessFailedCountAsync(user); await SignIn(c, user, users);
            return Results.Ok(new { authenticated = true });
        }).RequireRateLimiting("auth");
        v.MapPost("/auth/logout", async (HttpContext c) => { await c.SignOutAsync("Wanees"); return Results.NoContent(); });
        v.MapPost("/auth/password", async (PasswordChange input, HttpContext c, UserManager<IdentityUser> users) =>
        {
            if (demo) return Results.NotFound();
            var user = await users.GetUserAsync(c.User);
            if (user == null || input.NewPassword?.Length > 128 || string.IsNullOrEmpty(input.CurrentPassword) || string.IsNullOrEmpty(input.NewPassword)) return Results.BadRequest();
            var result = await users.ChangePasswordAsync(user, input.CurrentPassword, input.NewPassword);
            if (!result.Succeeded) return Results.Problem(statusCode: 400, title: "Password could not be changed", detail: "Check your current password and use a strong new password of at least 12 characters.");
            await c.SignOutAsync("Wanees"); return Results.NoContent();
        }).RequireAuthorization().RequireRateLimiting("auth");
        v.MapDelete("/account", async (HttpContext c, IStore store, UserManager<IdentityUser> users, WaneesDb db) =>
        {
            var id = c.User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            if (!demo)
            {
                await using var tx = await db.Database.BeginTransactionAsync();
                var user = await users.FindByIdAsync(id);
                if (user == null) return Results.NotFound();
                if (await users.IsInRoleAsync(user, "PlatformAdmin")) return Results.Problem(statusCode: 409, title: "Transfer your administrator role before deleting your account.");
                await db.Records.Where(r => r.OwnerId == id).ExecuteDeleteAsync();
                Check(await users.DeleteAsync(user)); await tx.CommitAsync();
            }
            else { while (true) { var rows = await store.List(null, id); if (rows.Count == 0) break; foreach (var row in rows) await store.Delete(row.Id); } }
            await c.SignOutAsync("Wanees"); return Results.NoContent();
        }).RequireAuthorization();
        var admin = v.MapGroup("/admin").RequireAuthorization(p => p.RequireRole("PlatformAdmin", "HospitalAdmin"));
        admin.MapGet("/users", async (HttpContext c, UserManager<IdentityUser> users, WaneesDb db) =>
        {
            var platform = c.User.IsInRole("PlatformAdmin");
            var hospital = c.User.FindFirstValue("hospital");
            var list = await db.Users.Where(u => platform || db.UserClaims.Any(cl => cl.UserId == u.Id && cl.ClaimType == "hospital" && cl.ClaimValue == hospital)).OrderBy(u => u.Email).Take(200).ToListAsync();
            var result = new List<object>();
            foreach (var u in list) result.Add(new { u.Id, u.Email, roles = await users.GetRolesAsync(u), hospital = (await users.GetClaimsAsync(u)).FirstOrDefault(x => x.Type == "hospital")?.Value });
            return Results.Ok(result);
        });
        admin.MapPut("/users/{id}/role", async (string id, RoleChange input, HttpContext c, UserManager<IdentityUser> users, WaneesDb db) =>
        {
            if (!c.User.IsInRole("PlatformAdmin")) return Results.Forbid();
            if (id == c.User.FindFirstValue(ClaimTypes.NameIdentifier)) return Results.Problem(statusCode: 409, title: "You cannot change your own administrator role.");
            if (!Roles.Contains(input.Role) || (input.Role != "Guardian" && input.Hospital != "al-bahar")) return Results.BadRequest();
            await using var tx = await db.Database.BeginTransactionAsync();
            await db.Database.ExecuteSqlRawAsync("SELECT pg_advisory_xact_lock(76192610)");
            var actor = await users.GetUserAsync(c.User);
            if (actor == null || !await users.IsInRoleAsync(actor, "PlatformAdmin")) return Results.Forbid();
            var user = await users.FindByIdAsync(id); if (user == null) return Results.NotFound();
            if (await users.IsInRoleAsync(user, "PlatformAdmin") && input.Role != "PlatformAdmin" && (await users.GetUsersInRoleAsync("PlatformAdmin")).Count <= 1) return Results.Conflict();
            Check(await users.RemoveFromRolesAsync(user, await users.GetRolesAsync(user)));
            Check(await users.AddToRoleAsync(user, input.Role));
            Check(await users.RemoveClaimsAsync(user, (await users.GetClaimsAsync(user)).Where(x => x.Type == "hospital")));
            if (input.Role != "Guardian") Check(await users.AddClaimAsync(user, new Claim("hospital", input.Hospital!)));
            Check(await users.UpdateSecurityStampAsync(user));
            db.Records.Add(new OwnedRecord { Id = Guid.NewGuid(), Kind = "audit", OwnerId = input.Hospital ?? "platform", Data = System.Text.Json.JsonSerializer.Serialize(new { action = "account-role-changed", actor = c.User.FindFirstValue(ClaimTypes.NameIdentifier), userId = id, role = input.Role, at = DateTimeOffset.UtcNow }) });
            await db.SaveChangesAsync(); await tx.CommitAsync(); return Results.NoContent();
        });
    }
}
public record PasswordChange(string CurrentPassword, string NewPassword);
public record RoleChange(string Role, string? Hospital);

# Deployment and operations

## Local desktop delivery

The launcher serves the built React app on loopback port 5180 and starts the .NET API on 5088. The included Python server is a small local same-origin proxy, not a substitute backend. All persistence/authorization remains in the .NET API. It serves only `apps/web/dist`, never API data or source folders.

Caregiver JSON demo data is at `local-data/synthetic-demo.json`. Session protection keys are generated under `apps/api/publish/data/keys`. Neither is included as seeded private data in the release. Do not share runtime data or keys accidentally when copying a used demo.

## Frontend deployment

Run `npm ci` with Node 24 and npm 11, then `npm run build` in `apps/web`. Host `dist` behind HTTPS with SPA fallback to index.html. Proxy `/api` to the separately deployed .NET service under the same origin. Never cache `/api`, account/private pages or signed share responses. The service worker's exact public whitelist must remain intact.

## API deployment

Build/publish with .NET 10 SDK. Run with an actively patched .NET 10 runtime. Set a real PostgreSQL connection string through secret management, configure allowed hosts and trusted reverse proxies, and bind the service behind TLS. Do not expose the local Python launcher as a production server.

Apply migrations explicitly during deployment (`dotnet ef database update`) or use the reviewed idempotent SQL. Compose opts into `MigrateOnStartup` only for the local synthetic stack. Avoid concurrent migration execution across application replicas.

**Live release is gated on unfinished work in DELIVERY.md.** `DemoMode=false` is not sufficient evidence of safe production readiness. Complete staff authentication/MFA, hospital membership, consent, retention, normalized clinical content workflow, upload validation/storage, email/password recovery and independent security review first.

## Backups and recovery

For PostgreSQL, use encrypted scheduled `pg_dump` backups plus the hosting provider's point-in-time recovery where available. Keep access keys in a secret manager. Back up persistent session-protection keys separately with access restricted to the API operators. Do not keep them in source control.

Before launch, restore a backup into an isolated environment, check migration version, compare non-sensitive record counts, verify ownership restrictions and test revoked/expired share behavior. Record recovery time and recovery point objectives with the hospital. **A database restore drill was not executed in this environment.** Define how deletions are reapplied to restored backups and document retention honestly.

## Health and logging

`GET /api/health` reports mode and storage adapter. It currently checks process readiness, not database health; extend before operating live. Use structured logs without notes, passport answers, identifiers or share tokens. Configure reverse-proxy access logs to redact `/shared/{token}`. Add request IDs and alerting without third-party session replay on child/private pages.

## External integrations

No Google OAuth, email/calendar push, Pannellum photography, object storage, hospital scheduling or EHR connection is configured. Each needs explicit credentials, security design, consent where appropriate and end-to-end verification. Keep unconfigured services unavailable rather than simulating success.

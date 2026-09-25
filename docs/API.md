# API and data ownership

The API is ASP.NET Core on .NET 10. Public reference endpoints are under `/api/v1`. OpenAPI JSON is exposed at `/openapi/v1.json`; health is `/api/health`.

## Session sequence

1. `GET /api/v1/session` obtains an antiforgery cookie and request token.
2. Send that token as `X-CSRF-TOKEN` on every POST/PUT/DELETE. The HTTP cookie must accompany the request.
3. In demo mode only, `POST /api/v1/demo/session` with `{"role":"Guardian"}` starts a synthetic, disposable workspace. Editor and Reviewer are supported only as explicit demo roles.
4. Fetch `/session` again after sign-in because the token is bound to the authenticated identity. Authentication middleware executes before antiforgery validation.
5. `POST /auth/logout` ends the session. The frontend clears server-state caches when identity changes. No bearer tokens are stored in localStorage.

Cookies are HttpOnly, SameSite Strict, two-hour non-sliding sessions. Secure is mandatory in live mode, same-as-request only when explicit LocalHttp=true for local development. A public demo must never contain real records.

## Public

`GET /hospitals`, `GET /pathways`: one fictional hospital and draft pathway metadata. The authored story version `demo-1` lives in `apps/web/src/content.ts` and is bundled with the frontend.

## Caregiver records

`GET/POST /records/{kind}`, `PUT/DELETE /records/{kind}/{id}` require Guardian. Kinds: profiles, appointments, passports, checklists, feelings, notes, consents. Unused kinds are API foundations, not a claim of delivered UI.

Create body: `{"data":{...}}`. Update body: `{"data":{...},"version":1}`. The authenticated owner is always set on the server and cannot be supplied by the client. IDs belonging to another owner return 404. `profileId`, when present, must refer to the current guardian's profile. Updates require the current version; stale input returns 409.

The record wrapper contains id, ownerId, kind, a JSON-string `data`, version, and createdAt. JSON content is rendered as text in React, not injected HTML. The body size limit is 16,000 characters, with more specific checks for profile names, appointment date/time, and reviewed passport choices. Per-domain production validation is still incomplete.

`GET /account/export` exports up to 200 owned records. `DELETE /account` removes all owned record batches and signs out. In the demo this removes the disposable workspace; it is not a complete live Identity account-erasure workflow.

## Shares

`POST /shares {passportId}` requires ownership of a passport. The server generates 32 random bytes, stores a SHA-256 token hash, and expires access after one hour. `GET /shared/{token}` returns only that passport if valid. `DELETE /shares/{id}` requires owner and immediately revokes the link. Passport deletion also causes the lookup to fail. The URL is an access credential: do not log it in production. No public listing of passports exists.

## Editorial

`GET/POST /staff/content`, `POST /staff/content/{id}/transition`, `GET /staff/audit` require staff policies and hospital scope. Transition sequence: draft → in-review → approved → published → retired. Only Reviewer can approve/publish/retire in the implemented transition handler. Revision creation stores `sourceId`; no approved text is overwritten. A changed body must be saved as a new draft.

Production independent-review checks are present for approval, but real staff enrollment and live hospital membership are not exposed. Demo role switching is not production authentication. A production workflow must complete transactional supersession, due dates, translations, and reviewer scope metadata.

## Storage

`IStore` selects `PgStore` when a PostgreSQL connection string is present. Without one, only demo mode may use `DemoFileStore`. The latter uses a semaphore and atomic file replacement for a single local process. It is not a scalable production database.

EF Core migration files create Identity plus `Records`, indexed by OwnerId/Kind. Data is JSONB, Version is a concurrency token. See `infrastructure/schema.sql`. The full normalized model requested in the brief remains a later production milestone.

## Persistent accounts and character conversation (23 September)

Normal launch uses `DemoMode=false`. `POST /auth/register` accepts email, password and adult consent and always assigns Guardian. `POST /auth/login` reads persisted roles and hospital claims; it no longer forces every account into Guardian. `POST /auth/password` requires current/new passwords, changes the security stamp and signs out. Cookie stamps are checked against the database on every request. `DELETE /account` deletes the Identity user and all owned records transactionally; platform administrators must first transfer their role. `GET /account/export` returns all owned records in account mode, including conversations.

`GET /admin/users` is restricted to platform/hospital administrators; hospital administrators see their own tenant. `PUT /admin/users/{id}/role` is platform-only, rejects self-editing and unsupported roles/tenants, updates the security stamp and records an audit event. First-admin creation is an offline CLI operation, not an HTTP endpoint.

`GET /chat/status`, `GET/POST /chat/conversations`, `DELETE /chat/conversations/{id}`, `POST /chat/conversations/{id}/messages` and `GET /chat/conversations/{id}/audio/{messageId}` require authentication. New conversations require adult consent and an allowlisted character/language. Message writes require the current version. Only the owner may read, mutate or speak a conversation. Missing/failing model services return 503 without saving a fake reply. Conversation JSON is stored in the existing versioned PostgreSQL Records table under kind `conversations`; no migration was needed for this addition.

The API has no user-selected model URL, file path or arbitrary role enrollment field. Server configuration supplies private provider addresses. See `OPEN-SOURCE-AI.md` for model limits and `../deploy/README.md` for operation.

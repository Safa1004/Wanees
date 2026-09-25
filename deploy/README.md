# Deploy Wanees on your own server

The application remains React + TypeScript + Three.js, ASP.NET Core 10 + Identity + EF Core, and PostgreSQL 18. Python is used only by the private speech workers. There are no paid AI APIs or hosted authentication services. This package prepares deployment; it has not been deployed to your server.

## Start with these files

Use a Linux server with Docker Engine and Compose. CPU inference is supported. As an initial planning estimate, allow 16 GB RAM and 30 GB free disk for the application, Qwen 4B and both speech engines; benchmark your actual concurrency before choosing hardware. Arabic synthesis can be slow on CPU. The included images deliberately use CPU PyTorch. GPU hosting needs a CUDA-compatible PyTorch image and Docker GPU configuration; adding `gpus: all` alone does not change those CPU wheels.

1. Point your domain’s DNS to the server. Permit inbound 80/443. Keep PostgreSQL, Ollama and voice ports private: the Compose file does not publish them.
2. In this directory, copy `.env.example` to `.env`. Set your domain and a fresh database password (`python3 -c 'import secrets; print(secrets.token_hex(32))'`). Restrict `.env` to your account (`chmod 600 .env`). Do not reuse the placeholder.
3. Run `docker compose build` and `docker compose up -d`. Caddy obtains HTTPS certificates for your domain. Do not set `LocalHttp=true` on the hosted installation.
4. Run `docker compose exec ollama ollama pull qwen3:4b`. It downloads the openly licensed model; the first run needs outbound internet. You can select another compatible, appropriately licensed model through `CHAT_MODEL` and recreate the API container.
5. Run `python3 create-admin.py`. You choose the first administrator email and password interactively. This command refuses when a platform administrator already exists; there is no public bootstrap endpoint or default administrator password.
6. Run `docker compose exec voice python app.py --reference-pack`. This downloads Kokoro and generates the three synthetic stock voice references. The references contain no user conversation data.
7. For Arabic voices, run `docker compose --profile arabic up -d --build voice-ar`. The first Arabic request downloads Chatterbox’s multilingual weights. Leave that service private. Test all three voices before inviting children; this is not a claim of native Omani pronunciation.
8. Open your domain, sign in, create a conversation and test a spoken reply. Use fictional examples during evaluation. Read `../docs/OPEN-SOURCE-AI.md` and the verification reports.

The basic Compose startup includes English speech. Arabic is an explicit profile because its model has a substantially larger resource requirement. Text chat supports English and Arabic regardless of the speech profile. Missing or busy model services return an explicit error; the application does not replace them with pretend AI replies.

## Accounts and permissions

Public exploration is available without login. Registration creates only a **Guardian** (parent / user) account. Child profiles live inside that account and never receive independent passwords.

Staff first register normally, then a platform administrator assigns their role from **My account → Administration**. Roles are Guardian, Clinician, Editor, Reviewer, HospitalAdmin and PlatformAdmin. Clinicians open caregiver-issued, one-hour share links; they cannot search private family records. Editors draft content. Reviewers approve/publish, with independent review enforced in account mode. Hospital administrators view their hospital team and manage that hospital’s editorial content. Only platform administrators assign roles. The current sample tenant is `al-bahar`; adding real hospitals requires reviewed tenant configuration and content, not changing an arbitrary client input.

Role and password changes invalidate existing sessions. Passwords are hashed by ASP.NET Core Identity. Cookies are HTTP-only, SameSite Strict, HTTPS-only in hosted mode, expire after two hours, and are checked against the current security stamp on every request. Writes require an anti-forgery token. Password failures trigger Identity lockout. Auth and AI calls are rate limited. The API accepts forwarded HTTPS/client-IP metadata only from the known Caddy proxy (172.29.181.2), allowing secure cookies and per-client authentication limits behind TLS termination. The Compose network reserves 172.29.181.0/24; if that subnet conflicts with your infrastructure, change the subnet, Caddy address and TrustedProxy together. Never trust arbitrary internet-supplied forwarded headers. Add appropriate edge limits before scaling beyond a small pilot.

No SMTP delivery, email verification, forgotten-password emails or staff invitations are claimed. Public registration does not prove ownership of an email address. Plan and implement verified email/recovery before public release. Administrators cannot retrieve passwords or read family conversations through the admin UI.

## Persistence and operations

Back up PostgreSQL **and** `account-keys` (cookie encryption keys). Model caches can be downloaded again; keep the synthetic reference volume to retain voice consistency. Caddy’s certificate state is persistent. Keep backups encrypted and define their expiry. Deleting an account removes its Identity record and owned records, including conversations, from the live database; it cannot erase older operator backups. Published staff content and audit records remain in their hospital workspace.

Conversation history is limited to 40 stored conversations and 20 exchanges per conversation. Users can delete conversations or export/delete their account. There is no automatic timed retention worker yet. Chat receives only the conversation and a character system prompt, never the caregiver’s stored profiles or medical notes. Speech receives only the selected assistant reply. Models run inside your deployment; runtime input is not sent to a commercial AI API. First-run package/model downloads use their upstream repositories.

Use `docker compose logs --tail=100 api` for service failures. Request bodies and chat text are not intentionally logged. Do not enable sensitive EF logging. `docker compose down` stops services and keeps volumes; avoid `down -v` unless intentionally destroying the deployment. Before updating, back up the database, test migrations on a restored copy, and record image digests. Application packages and Ollama are pinned; base OS/.NET/Caddy/PostgreSQL tags receive patch updates and should be pinned to reviewed digests for production promotion.

This remains a development/pilot build with fictional hospital content. Prompt rules are not a clinically validated child-safety or moderation system. Review Arabic, safety behavior, access controls and operational recovery before real clinical use.

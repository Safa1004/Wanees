# Wanees · ونيس

A bilingual, Omani-inspired hospital preparation **demonstration**, with a reference-led animated 3D sheep and Omani child companions, a six-step sample X-ray journey, games, comfort tools, caregiver records, an editorial workflow, persistent adult accounts, role administration, and self-hosted AI character chat.

## Open the delivered build on this Mac

Double-click **Start Wanees.command**. Keep its Terminal window open. It starts the .NET API and opens **http://127.0.0.1:5180/**. Press Control+C in that window to stop.

The launcher uses the installed .NET 10 runtime, Python 3, and Docker Desktop for PostgreSQL 18. Start Docker Desktop before opening Wanees. It serves the included production frontend and API build, so npm installation is not needed to view this delivered build. If macOS asks which app should open `.command`, choose Terminal. The application stays on this computer; nothing is published online.

## Important scope

This is a working competition demonstration, **not a hospital-ready clinical system**. The fictional Al Bahar Children's Centre is not a real partner. Every medical text and pacing configuration is draft demonstration content. Do not enter real child or medical information.

Read [DELIVERY.md](docs/DELIVERY.md) for the delivered/partial/deferred register and [VERIFICATION.md](docs/VERIFICATION.md) for actual test results. The brief's entire production scope is not represented as complete.

## Rebuild / develop

Requirements: Node 24+, npm 11, .NET 10 SDK. Use the pinned packages and committed lockfiles.

```sh
cd apps/web
npm ci
npm run dev -- --port 5173
```

In a second terminal from the project root:

```sh
# Set your local PostgreSQL connection; do not commit the password.
export ConnectionStrings__Postgres='Host=127.0.0.1;Database=wanees;Username=wanees;Password=YOUR_LOCAL_PASSWORD'
DemoMode=false LocalHttp=true MigrateOnStartup=true DOTNET_USE_POLLING_FILE_WATCHER=1 dotnet run --project apps/api --urls http://127.0.0.1:5090
```

Vite proxies `/api` to the local .NET backend. `DOTNET_USE_POLLING_FILE_WATCHER=1` avoids a file-watcher startup stall seen in the macOS sandbox. Do not change HOME. A direct API start without PostgreSQL now fails clearly; opting into the file adapter requires `DemoMode=true AllowFileDemo=true` explicitly.

Build the double-click launcher outputs:

```sh
cd apps/web
npm ci
npm run build
cd ../..
dotnet publish apps/api -c Release -o apps/api/publish
```

## Accounts, chat and your future server

The normal launcher now uses **persistent PostgreSQL accounts**. Open **My account** to register or sign in. Public exploration still works without login. Registration creates a parent / user account; child profiles are managed inside it.

To create the first local platform administrator, stop the running launcher and run `python3 scripts/serve.py --create-admin` from this folder. Enter your own email and password when asked. Start Wanees normally afterwards. There is no default administrator password. Staff can register normally; the platform administrator assigns Clinician, Editor, Reviewer, HospitalAdmin or PlatformAdmin in **My account → Administration**.

**Companion chat** saves owner-scoped conversations and connects to your private Ollama/Qwen and speech services. If those services are not configured, it says so clearly. Account and care tools continue working. For the optional local CPU preview, stop the normal launcher and double-click **Start Wanees with AI.command**. It starts Docker-based Qwen3 0.6B and Kokoro English speech; first setup downloads models and can be slow. The larger hosted model remains configurable. The local launcher also accepts `AI__ChatUrl`, `AI__VoiceUrl` and `AI__ArabicVoiceUrl` environment variables for an existing local/private deployment.

For your future hosted server, follow **[deploy/README.md](deploy/README.md)**. That package contains HTTPS hosting, private PostgreSQL, Ollama/Qwen, English Kokoro speech, optional Arabic Chatterbox speech, persistent model volumes and interactive administrator creation. Nothing has been published online. Read **[OPEN-SOURCE-AI.md](docs/OPEN-SOURCE-AI.md)** for casting, licenses and current limitations.

The old disposable demonstration mode remains explicit: `python3 scripts/serve.py --demo` uses PostgreSQL with synthetic sessions; `--file-demo` uses the synthetic JSON adapter. Both are for fictional data. The default no longer creates disposable demo identities.

## Check

```sh
cd apps/web
npm run lint
npm test
npm run build
cd ../..
dotnet build apps/api
# Persistent account integration suite (isolated PostgreSQL container):
python3 tests/accounts-chat.py
# For an explicitly running demo-mode API only:
node tests/api-smoke.mjs
```

OpenAPI: `http://127.0.0.1:5090/openapi/v1.json`. Health: `/api/health`. [API notes](docs/API.md) describe authentication, anti-forgery, ownership, review gates, and demo storage.

## Demo route

Open `http://127.0.0.1:5180/?hospital=al-bahar&pathway=routine-xray&lang=ar`. The only configured hospital/pathway is the fictional demo; query parameters carry no child data. See [the four-minute demonstration](docs/DEMO.md).

## Source map

- `apps/web/src`: React/TypeScript, bilingual content, 3D scenes, forms, and feature routes.
- `apps/api`: ASP.NET Core 10, Identity accounts and roles, EF Core/PostgreSQL, API and migrations.
- `assets/brand`: editable vector identity, outlined bilingual wordmarks, usage sheet, supplied raster reference, font licenses.
- `assets/characters`: original GLB and model/animation notes.
- `apps/web/public/resources`: original bilingual printable HTML downloads.
- `infrastructure`: container definitions, proxy config, relational schema.
- `services/voice`: private open-source English and Arabic speech workers.
- `deploy`: future self-hosted deployment and administrator setup.
- `tests`: API integration, ownership, role, chat and model-asset checks.
- `docs`: acceptance register, operation and launch requirements, content sources and evaluation plan.

## Voice auditions

Open **Voice-auditions.html** to compare the three real generated English voice samples. The chat companion panel also has a sample button. These are initial synthetic casting choices, not verified native Omani recordings.

## Revised 3D handoff

Open **Models.html** for a visual index. **assets/blender/** contains editable `.blend` files and the reproducible Blender script. **apps/web/public/models/** contains 14 real GLBs: the companion cast, three medical equipment models, five hospital rooms, and a coastal scene. Use **Choose your companion** on the home page to try the Omani welcome outfits, everyday alternatives, skin tones, glasses and walking support.

See [3D-ASSET-HANDOFF.md](docs/3D-ASSET-HANDOFF.md), [STACK-AUDIT.md](docs/STACK-AUDIT.md) and the updated [DELIVERY.md](docs/DELIVERY.md). Cultural and clinical review remain necessary; these are original stylized educational models, not representations of a real hospital or a device manufacturer’s procedure.


### New play and story experiences

Explore now opens a discovery club with room questions and exploration stamps. Quiet Moments includes a sleepy flower, shell beach and kindness garden. Stories includes four complete original English/Arabic storybooks with optional choices and page navigation. The healthcare guide has isolated character animations, greeting replay and working local pause. See `docs/PLAY-AND-STORIES.md` for content, research, rights and verification.


### Playable games — September 25

Five new games are now directly available in Explore: Ocean pairs, Wanees’ star trail, Star painter, My tiny ocean and Rainbow echoes. Quiet Moments includes the three gentler creative/music games alongside the existing activities. Games offer shuffled boards, multiple levels, hints, completion feedback, touch/keyboard controls and optional sound. Aquarium creatures remain saved in the current browser tab. See `docs/ARCADE-GAMES.md`.

Latest update: separated play/quiet activities, distinct female guide, streamed chat, security hardening and mobile fixes. See [the verification report](docs/SECURITY-PERFORMANCE-UPDATE.md).

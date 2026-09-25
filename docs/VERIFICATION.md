# Latest update — 25 September 2026

See [SECURITY-PERFORMANCE-UPDATE.md](SECURITY-PERFORMANCE-UPDATE.md) for the current 18 frontend tests, 40 API checks, streaming timing and responsive/security results. The sections below are historical verification records.

# Verification · 17 September 2026

## Passed locally

- TypeScript check and Vite production build.
- ESLint and Prettier checks. Five Vitest assertions across calendar conversion and bilingual content tests.
- Pinned frontend dependency installation; npm audit reported zero known vulnerabilities at verification time (see npm-audit.json).
- .NET release build and publish, with no compiler warnings or errors.
- API integration smoke suite against the actual .NET API: anonymous denial, anti-forgery checks, caregiver ownership isolation, invalid appointment rejection, cross-profile rejection, stale-write conflict, share access and revocation, role and hospital boundaries, editorial review transitions, account deletion and logout.
- Browser interactions: English/Arabic and RTL layouts, visit progress retained during language switching, mobile navigation at 390 × 844, caregiver profile creation, appointment persistence after reload, passport review gate and save, 3D and reading fallback views.
- WebMCP public progress read/update, including rejection of an invalid step.
- Production HTTP checks for 14 resources, including all eight bilingual printable downloads, models, icons and manifest.
- axe-core scans of the main content region on home and visit routes: zero reported violations after contrast and canvas-label fixes. These are limited automated scans, not an accessibility certification.
- Editable bilingual brand lockup visually reviewed after separating the Arabic and English lettering.

- Clean Desktop copy: local launcher started successfully, API health returned 200 in synthetic-demo mode, and the production home page rendered in the browser. Test server stopped so the double-click launcher can use its normal ports.

## Not verified / still required

The earlier host PostgreSQL restriction was resolved by using Docker PostgreSQL 18. Migrations and the API smoke suite passed against that database. Full Compose orchestration, backup restoration and load testing still need validation. No claim is made of Safari/VoiceOver coverage, complete keyboard audit, clinical validation, measured performance budgets, penetration testing or production readiness. Browser checks used synthetic data only. See DELIVERY.md for incomplete requirements.


## Revision checks · 18 September 2026

- Official Blender 4.5.14 Python tooling generated 14 editable Blender files and GLBs, with CPU-rendered fallback images. Native macOS Blender startup hit a Metal initialization crash; no claim of native interactive editing verification is made.
- `node tests/assets.mjs` passed: valid embedded GLBs, all eight named clips on each character, actual skeletons on the four human models, optional appearance nodes, and each GLB below 3 MB. Details in 3D-ASSET-VERIFICATION.json.
- PostgreSQL 18 integration smoke suite passed: ownership, CSRF, stale updates, shared passports/revocation, hospital scoping, review gate, deletion and logout.
- The revised default Python launcher started the real .NET API against PostgreSQL and returned `storage: postgresql` from its health endpoint.
- Reopened all 14 delivered `.blend` files successfully with Blender 4.5.14 in the CPU container.
- Rebuilt TypeScript/Vite and reran ESLint and five Vitest tests successfully after the model changes.
- Final launcher regression: a second launch exits before touching database state; the first server remains healthy and the full PostgreSQL API smoke suite passes afterward.
- Browser-checked the compiled room viewer, selected X-ray detector highlighting, Arabic outfit/glasses controls and language retention, and visible clinician cap/mask toggles. Reviewed the camera framing and corrected self-shadow artifacts.

- Final Desktop copy launched against its own PostgreSQL volume; health returned `postgresql`. The API rejects startup without PostgreSQL unless `AllowFileDemo=true` is explicitly set. Revised clinician mask/cap rendering and accessible selected states were checked in the Desktop-served build.

## Softer character revision · 23 September 2026

- Rebuilt the sheep, Amer, Maryam and both clinicians with softer facial shapes and matte materials. Reviewed individual renders and the three-character cast render.
- Rebuilt 14 self-contained GLBs. The more detailed models replace the earlier prototype asset budget: all are below 8 MB; actual values are in `3D-ASSET-VERIFICATION.json`.
- Compression decodes every encoded buffer and checks exact byte equality before writing the optimized file.
- `tests/models-runtime.mjs` passed for all 14 assets using Three.js and its meshopt decoder. All five characters have finite bounds, moving greeting poses, and blink shape keys that close and reopen at the expected times.
- `tests/blender-scenes.py` reopened all 15 editable Blender scenes (14 assets and the cast scene), including rig/NLA/shape-key checks on the individual characters. See `BLENDER-SCENE-VERIFICATION.json`.
- ESLint, TypeScript and the five existing Vitest tests passed. Backend behavior was not changed in this revision; the earlier backend verification results above are historical, not newly rerun.
- The refreshed browser preview visibly renders the softer Maryam, Omani welcome clothing, and local studio environment lighting. An older Vite process cached previous source; verification uses a fresh preview process and versioned model URLs.
- Vite production build and Prettier checks passed. All 14 production GLBs match the verified source exports byte-for-byte. The refreshed browser also displayed the detailed reception environment with Maryam in everyday clothing.
- Child preference testing, professional television production polish and the production readiness work listed in STACK-AUDIT.md remain outside these checks.

## 24 September 2026 — accounts and self-hosted conversation

- ASP.NET API compiles and publishes; Linux deployment API image builds successfully.
- `tests/accounts-chat.py` exercises real PostgreSQL/Identity in an isolated container, including role escalation prevention, owner isolation, lockout, session revocation, independent content review, chat version conflicts and transactional account deletion. Its model fixture is explicitly labelled. See `ACCOUNT-CHAT-VERIFICATION.json`.
- Browser checks: administrator login, populated user-role table, logout and normal parent/user login succeeded.
- Three genuine Kokoro English samples were synthesized. WAV format, sample rate, duration and SHA-256 are recorded in `VOICE-SAMPLE-VERIFICATION.json`. A real FastAPI synthesis request also passed (`REAL-VOICE-CHECK.json`); first cold load took about 177 seconds on this Mac.
- Qwen3-4B downloaded successfully, but cold CPU startup exceeded the initial four-minute local test timeout. This is a performance limitation of this test environment, not a successful model-response check. Smaller-model verification is tracked separately if completed.
- Arabic speech is an optional Chatterbox deployment service; no native Omani pronunciation quality claim is made.
- Blender motion preview verified: 640 × 426, 49 frames. Existing 3D asset and rig verification reports remain included.

Final checks: real Qwen3-0.6B response through authenticated `/chat` passed (`REAL-CHAT-END-TO-END.json`), with persistence and cleanup. Both requested local accounts were verified in the workspace and Desktop databases. Caddy configuration validation passed, and a trusted forwarded-HTTPS request produced a secure session/CSRF cookie. Arabic dependency import and generation signature checks passed during build; Arabic speech synthesis/voice quality remain unverified.


## Play and stories — 24 September 2026

Eight frontend tests passed. New reader tests cover all four-page navigation, restart, optional choice feedback, Arabic responses, shell collection/reset and unchanged global motion preferences. The female GLB passed actual Three.js mesh decoding, greeting motion and blink reopening. Browser checks passed female clothing toggles and clinician switching, pause, all six shells, cloud changing, garden planting/prompt changes, flower motion/colour, room discovery questions/stamps and bilingual story navigation. Arabic story and garden layouts were checked at 390px width with no horizontal overflow. Five transparent 600px illustrations were rendered from the editable Blender scenes for the new cards and stories.


## Arcade games — 25 September 2026

14 frontend tests pass, including six new game-rule and interaction tests. All maze collectibles and exits are reachable. Browser gameplay verified memory/maze/star completion, aquarium placement/editing and tab persistence, plus musical echo playback. TypeScript, ESLint and production build pass. Details and limits are recorded in `ARCADE-GAMES.md`.

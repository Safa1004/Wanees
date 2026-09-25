# Delivery register

Updated 24 September 2026. This release is a working local competition demonstration. It does **not** complete every production requirement in the original brief.

## Working screens and services

| Area | Delivered | Evidence / limits |
|---|---|---|
| Entry and preferences | Direct child home, optional 3-stage setup, English/Arabic switch, age and companion selection, illustrated mode | `/`, `/setup`, preferences dialog. One fictional hospital and one 5–10 pathway. Other ages deliberately unavailable. |
| Identity | Child-and-companion emblem, horizontal/stacked lockups, Arabic/English path outlines, mono/reversed versions, icons, usage sheet | `assets/brand`; original supplied PNG retained as a reference. Trademark and fluent Arabic typography review still required. |
| Original 3D | Reusable cast and eight named animation clips, interactive camera, separate medical props, five hospital rooms and a coastal scene | 14 GLBs and editable Blender sources. Maryam, Amer and two clinicians now have skeletal rigs, clothing/appearance controls, eight clips and rendered fallbacks. Still stylized art requiring cultural/clinical review. |
| Visit | Six connected bilingual sample X-ray steps, replay/start again, reading mode, optional browser speech | `/visit`. Public progress survives reload in sessionStorage. Clinical review not performed. |
| Equipment | X-ray equipment, stethoscope, thermometer, mouse/touch rotation and zoom | `/explore/equipment`. Detailed generic educational models with named-part highlighting; not device-specific operating models. |
| Tour | Entrance, reception, assessment, X-ray, exit choices; corresponding illustrative arrangements, narration text, reset camera | `/explore`. Not real photography or a measured hospital floor plan. |
| Comfort interview | Six optional questions, skip/back/edit, caregiver review gate, printable PDF through browser, text download | `/care/passport`; printing uses browser shaping and bidi. |
| Passport persistence | .NET-backed save, list per selected profile, read, delete, one-hour share, revocation | `/care`, `/care/passport`; opaque share token carries no child details. Persistent parent accounts in the normal launcher; explicit synthetic mode remains available. |
| Appointment notes | Create, edit, delete, profile association, date/time validation, calendar download | `/care/appointments`; Asia/Muscat to UTC conversion tested. Not a booking system. |
| Preparation | Selectable checklist, profile-specific backend save and reload, printable copy | `/care/checklist`; no generic fasting/food advice. |
| Games | Dress-up with two clinician choices and visible equipment, 12-bubble activity, packing, equipment matching | `/explore/games`; pause/restart/back, keyboard buttons, no timer pressure or sound. Canvas marine scene with accessible HTML bubble controls. |
| Calm | Stoppable paced visual and body animation, imagination-only coast text, noticing activity, optional speech | `/calm`; draft pacing, no breath holds, no clinical claims. Blender coastal environment and Amer are present; stretching instructions remain unreviewed and are not supplied. |
| Feelings | Four original drawn faces and optional choice, neutral acknowledgement | Ephemeral only. Consented longitudinal recording and parent trend view deferred. |
| Resources | Search, audience filter, four bilingual items and eight real HTML downloads, print support | `/explore/resources`; authored sample content. No captioned video library. |
| Caregiver | Multiple nicknames, selected profile, questions saved privately, saved passports, export, delete all owned records, logout | `/care`; no medical identifiers collected. Login, registration, password change, export and account deletion are now available. Profile rename remains deferred. |
| Editorial | Persistent Editor/Reviewer/admin roles plus explicit demo sessions, draft creation, revised draft creation, review/approval/publication/retirement transitions, audit trail | `/staff`; role and hospital checks server-side. State changes are synthetic, not clinical approval. |
| Evaluation | Qualitative pilot measures and no invented outcome metrics | `/staff`, `EVALUATION.md`. No analytics collected. |
| Offline | Explicit opt-in cache of selected public HTML resources and emblem | Whitelist only; no account pages, API, passport, appointment, or auth responses cached. PWA shell is not fully offline. |
| Backend | ASP.NET Core 10, cookie authentication, CSRF, rate-limited session/auth endpoints, ownership, tenant guard, optimistic version field, Problem Details, OpenAPI | Actual API. Default launcher now uses EF Core/PostgreSQL. The file adapter requires explicit --file-demo opt-in. |
| PostgreSQL foundation | EF Core/Npgsql adapter, Identity schema, migrations, idempotent SQL, Compose | Migrations and API integration suite passed against Docker PostgreSQL 18. Full Compose deployment and load testing still pending. |
| Local handoff | Prebuilt web and API, double-click Mac launcher, source and pinned lockfiles | `Start Wanees.command`; .NET 10 and Python 3 required. No hosting performed. |

## Partial architecture and release gaps

- The relational model currently uses Identity tables plus an indexed owner/kind record table with JSONB payloads. It is **not** the brief's fully normalized set of hospital, pathway, clinical-review, room, consent, media and evaluation entities. The public story remains versioned frontend content; editorial changes do not automatically replace it.
- PostgreSQL has been executed and the smoke suite passed; it has not been load-tested here. Concurrent review operations across multiple instances need transactional publication checks and independent reviewer enforcement tests against the database.
- Persistent Identity registration/login, staff role assignment, password changes and account deletion now have working UI and database checks. MFA, forgotten-password recovery, email verification, independently verified adult consent and step-up authentication for sensitive actions remain incomplete.
- API record listings return at most 200 records. A production paginated API and generated TypeScript client are deferred. Account deletion drains all returned batches, but export currently returns the first 200.
- Profile ownership is checked on server reads/mutations/references. A production retention controller, cascade policy for all domain entities, encrypted backups, and independently tested restores are still required.
- Staff review is a working sandbox, not a complete hospital/facility/room/media administration product. Revised drafts keep a source reference; automatic supersession, publication scheduling, review-due management, and a clinical signing policy remain to build.
- Audio uses optional browser speech, not professionally recorded Omani narration. Voices and Arabic pronunciation vary by device. Local language and cultural review remain essential.
- The sheep and four human models have seven-bone skeletal rigs and animated blink shape keys. Welcome/everyday clothing, skin-tone choices, glasses and walking support are implemented. Professional facial/hand rigs, hairstyle choices, a seated wheelchair rig, exact clinically approved procedure poses and broader low-end-device tests remain.
- The settings dialog handles keyboard trapping and Escape. Automated accessibility checks and browser review are not a WCAG certification. VoiceOver, mobile Safari, 200% text zoom and broader device testing need completion.
- No S3 upload service, validated upload UI, Google OAuth sync, email, notifications, hospital scheduler, EHR, or production deployment was configured. Pannellum is installed and wired to reviewed/authorized media metadata, but no real hospital photos are supplied. No interface claims those are connected.
- No xUnit or Playwright CLI suite was run. Browser flows were exercised using the connected in-app browser; executable Node API tests and Vitest tests are included. CI is supplied but has not run on a remote runner.

## Intentionally deferred content

Other age bands and procedures require authorship and review. The eating-related roadmap is explicitly unresolved: the partner must distinguish **feeding assessment** from **eating-disorder assessment** before content is written. No meal plans, treatment advice, diagnosis or emotion inference were added. The new AI character conversation is for supervised general comfort and exploration, not medical advice. The optional corridor transport game and stay-still practice remain disabled/unimplemented pending review.

## Before a real hospital launch

Complete the production domain/auth/consent/retention work above; obtain clinical and local cultural review; commission/authorize media; establish controller, hosting and cross-border responsibilities through qualified local review; run tenant/security/backup/accessibility/performance tests in the actual deployment; and conduct an appropriately designed usability pilot. No legal compliance or clinical efficacy claim is made by this release.

## 23 September: accounts and hosted character conversation

- Added `/account` and `/login`, PostgreSQL Identity registration/sign-in, parent/user accounts, managed child profiles, password change, export and full live account deletion.
- Added persisted Clinician, Editor, Reviewer, HospitalAdmin and PlatformAdmin roles. Public registration cannot select a privileged role. Only platform administrators assign roles; role changes revoke prior sessions. Clinicians open caregiver-supplied shares, not a list of private family records.
- Added `/chat` with fixed companion/language, adult consent, bounded stored history, owner-only deletion, real Ollama HTTP integration and private character audio. No simulated AI fallback.
- Added self-hosted Docker deployment with Qwen, Kokoro and optional Arabic Chatterbox. Deployment is prepared for the user's later server; no server was supplied or deployed. Voice casting and native Omani pronunciation require audition review.
- Actual PostgreSQL security tests are recorded in `ACCOUNT-CHAT-VERIFICATION.json`; its model provider is a deterministic fixture, not evidence of model quality.
- Softened Blender characters, all 14 GLBs, editable Blender scenes and the 49-frame motion preview are included.
- Email verification/recovery, MFA, automated retention, reviewed clinical retrieval and validated child-safety moderation remain incomplete. This addition does not turn the sample into a hospital-ready clinical service.

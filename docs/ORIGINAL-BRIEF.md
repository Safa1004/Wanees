# Wanees — ونيس: Complete Product and Build Prompt

Copy everything between BEGIN PROMPT and END PROMPT into your development agent. This is a complete product brief; it is not a claim that the product has been implemented, clinically validated, or approved by a hospital. The accompanying generated logo is a visual concept, not a trademark-cleared or vector production asset.

---

BEGIN PROMPT

Build **Wanees — ونيس**, a distinctive, bilingual, Omani-rooted web application that helps children and their caregivers prepare for hospital visits through interactive 3D characters, understandable procedure stories, hospital tours, calming activities, and practical preparation tools.

Act as a product designer, full-stack engineer, interaction designer, and accessibility-minded implementer. Deliver a working application with a coherent visual identity and a polished competition demonstration. Aim for a memorable, credible presentation through execution and usefulness; do not claim that the product is guaranteed to win a prize.

Do not deliver only a landing page, static screenshots, a generic dashboard, or a collection of disconnected components. Build the experience and connect its states. Work in incremental, testable milestones. If a required runtime, asset, or integration is unavailable, document it explicitly and continue with a clearly identified demonstration substitute where appropriate. Never claim a substitute is a completed production integration.

## A. Purpose, audience, and product boundaries

Wanees means a companion whose presence brings comfort. Make companionship the central interaction: children meet a familiar guide, explore what will happen, express preferences, and practise coping activities at their own pace.

Primary audiences:
- Children preparing for a hospital visit, with an initial complete pathway for ages 5–10.
- Parents and caregivers preparing alongside them.
- Authorized healthcare staff who review content or view caregiver-shared comfort preferences.
- Hospital administrators maintaining local visit information.

Support age-band configuration for younger children and older children/teens. Do not present the same childish appearance and explanations to every age group. Initially implement the 5–10 content fully; label any additional age content accurately until reviewed and complete.

Intended outcomes are better understanding, improved preparation, and potentially less distress. Staff time savings and clinical benefits are hypotheses to evaluate, not established results. The app provides preparation and support, not diagnosis, treatment decisions, triage, or a substitute for the treating team.

## B. Brand identity and logo

Use the exact brand spellings **Wanees** and **ونيس** consistently. Arabic must be properly connected and legible. Do not use Wenni or My Medical Buddy as the product name.

Use the revised child-and-companion logo direction: two simple, soft figures, a small child and a larger caring companion, holding hands or forming an open protective embrace. Communicate reassurance, support, and togetherness. Frame them with a restrained architectural arch inspired by Omani doorways, keeping the human connection visually dominant. The arch is a subtle cultural reference, not an official or religious symbol. Avoid making the logo resemble a wildlife brand, a real-estate company, or a religious institution. The emblem should be recognizable at app-icon size without depending on detailed illustration. Do not combine multiple unrelated symbols into one mark.

The primary logo must not contain the oryx, horns, or other animals. The Arabian oryx remains an in-app animated companion; the logo and mascot serve different roles. Use the latest child-and-companion concept as the visual reference, superseding the earlier animal-led logo. Refine it into clean, flat production artwork rather than reproducing raster artifacts or unwanted shading.

Develop:
- An emblem-only version.
- Arabic and English wordmarks.
- A balanced bilingual horizontal lockup.
- A compact stacked lockup.
- Single-colour and reversed versions.
- Favicon and PWA app icons.
- A concise usage sheet showing clear space and minimum sizes.

Use genuine editable SVG paths for production marks, with licensed typography or appropriately outlined lettering. A generated raster logo may guide the design but must not be embedded inside an SVG and described as vector artwork. Verify Arabic typography manually. Avoid official national emblems, hospital logos, protected humanitarian symbols, and imitation of existing brands. Record that trademark and name availability require separate clearance.

## C. Art direction: crafted, not template-generated

Create a recognizable children's product with restrained editorial layout, tactile materials, thoughtful typography, and high-quality character art. Make it warm and imaginative while giving parents confidence in its clarity.

Do not prescribe a generic palette simply because it is a healthcare app. Select a deliberate, accessible visual system inspired subtly by Oman's landscapes, coast, architecture, and material culture. No mandatory hex codes are supplied. Establish semantic design tokens after exploring a coherent direction.

Avoid default purple-to-blue gradients, excessive glass panels, neon glows, random floating blobs, repeated identical rounded cards, oversized pill buttons everywhere, stock AI sparkles, and unnecessary decorative charts. Gradients and rounded shapes are permitted only when they serve the chosen design.

Use hierarchy and composition rather than filling every area. Let the character and visit scene be the focus of the child's home. Keep parent and staff screens calm and practical. Use responsive layouts that look intentionally designed on phones, tablets, and desktop rather than merely shrinking a desktop grid.

Use a consistent SVG icon family such as Lucide for interface controls. Add custom vector icons only when needed, matching stroke and proportion. **No emojis as navigation icons, status indicators, feature illustrations, placeholders, or decorative bullets.** Feelings selectors can use custom illustrated faces with text labels; these must not be Unicode emojis.

## D. Omani identity and character appearance

Make cultural identity observable through specific, respectful details, not a flag pasted on a generic app. Present Oman as contemporary and diverse. Do not make every room look like a heritage attraction.

Create the following original character cast:

1. **Wanees, the animal companion:** a stylized young Arabian oryx with a gentle silhouette, expressive eyes, modest facial markings, and a calm personality. Use rounded stylization without losing the species' visual identity. The companion can carry a small visit bag with a subtle locally inspired textile detail. It does not claim to be a doctor. This character belongs inside the experience and supporting illustrations; it must not replace the child-and-companion brand emblem or app icon.
2. **Maryam, a child guide:** an Omani girl of primary-school age with natural, varied facial proportions and appropriate everyday clothing. Include an optional locally informed embroidered outfit for home or welcome scenes. Do not assume that every girl wears identical clothing or a head covering.
3. **Amer, a child guide:** an Omani boy of primary-school age. A dishdasha and embroidered kumma can be an optional welcome/home appearance, alongside everyday casual clothing. Reference Omani garments accurately rather than generic Gulf costume.
4. **Healthcare guides:** female and male clinicians in role-appropriate scrubs or clinical attire, with varied appearances. Allow culturally appropriate head coverings where relevant. Do not put ceremonial clothing or unsafe accessories into sterile-procedure scenes.

Offer a small number of curated character and appearance choices, including different skin tones, hair, glasses, and optional mobility aids. Avoid forcing a gender choice before accessing the app. Outfit choices must not be tied to personality, ability, or treatment outcomes.

Use subtle environmental references: a coastal relaxation scene informed by Sur, shaded courtyards, mountain silhouettes, and textile details. Do not use religious text, national symbols, or ceremonial objects as collectible game items. Do not assume generic Arabic assets are authentically Omani. Record reference sources and request local review for garments, pronunciation, and cultural details before release.

## E. 3D system and animation requirements

Make actual interactive 3D part of the experience, not just a flat image with a parallax effect. Use Three.js through React Three Fiber and Drei. Keep menus, buttons, readable text, and accessibility controls in semantic HTML outside the canvas.

Implement reusable optimized GLB/glTF characters and props. Use original or properly licensed assets and maintain an asset register. If final models are unavailable, build clearly identified original stylized models with a replaceable asset interface; do not pretend a generated picture is a rigged 3D model.

Character states: idle, greeting, listening, pointing, demonstrating, breathing, gentle encouragement, and goodbye. Provide smooth transitions, grounded movement, readable facial expressions, and restrained secondary motion. Avoid constantly bouncing characters or uncanny photorealistic faces.

Required 3D moments:
- Wanees greets the child on the home screen.
- The child can inspect selected medical props with touch or mouse controls.
- Wanees demonstrates an approved preparation sequence in a sample procedure scene.
- A breathing activity coordinates character movement and a visual pacing object.
- A medical dress-up activity changes visible equipment or clothing.

Use soft lighting, controlled shadows, and tactile stylized materials. Avoid expensive effects that obscure medical equipment. Do not require VR hardware. Do not require a camera or microphone for core features. Pre-rendered clips may supplement scenes but must be identified accurately in the implementation notes.

Provide a fully usable illustrated 2D mode for reduced motion, unavailable WebGL, slow devices, or user preference. Pause rendering when hidden, unmount inactive scenes, dispose resources, and recover gracefully from context loss. Lazy-load models and progressively reveal content. Prioritize a responsive interface over decorative frame rate.

## F. Technical stack and project structure

Use this coherent default architecture, with supported compatible package versions verified against official documentation at implementation time. Pin dependencies and include lockfiles. Do not silently substitute a different backend to satisfy a preview environment.

Frontend:
- React with TypeScript and Vite.
- React Router for navigation.
- Tailwind CSS with deliberate design tokens and custom compositions, not an unchanged component template.
- Accessible headless components where helpful.
- TanStack Query for server state.
- Zustand only for shared transient state such as tour or character controls; avoid duplicating server data.
- React Hook Form and Zod for forms.
- i18next/react-i18next for Arabic and English.
- Three.js, React Three Fiber, and Drei for 3D.
- Motion for purposeful interface transitions.
- Lucide React for interface icons.
- Pannellum for photograph-based 360-degree tours; load it only where used.
- Canvas for simple 2D games, reusing accessible HTML controls.
- A service worker/PWA setup for explicitly selected public offline resources.

Backend:
- ASP.NET Core Web API using a supported LTS .NET release.
- Entity Framework Core and PostgreSQL for portable development across macOS and Linux.
- ASP.NET Core Identity for adult and staff identities.
- Prefer same-origin secure HttpOnly cookie sessions with CSRF protection for this browser application. Do not store bearer tokens in localStorage.
- Policy-based authorization with guardian ownership and hospital scoping checked on the server.
- OpenAPI documentation and consistent Problem Details errors.
- Validated uploads and S3-compatible object storage through an abstraction.
- Optional email and calendar integrations behind configured service interfaces.

Engineering:
- Docker Compose for API, database, and local development dependencies.
- Environment example files without secrets.
- Frontend linting, formatting, and strict TypeScript checks.
- Vitest/React Testing Library, Playwright, axe-core, and xUnit where meaningful.
- CI for build, tests, and checks; production deployment is a distinct configured step.

Suggested structure: apps/web, apps/api, assets/characters, assets/brand, content, docs, and infrastructure. Use feature-oriented modules. Start as a modular application; do not introduce microservices without a demonstrated need.

## G. Entry, onboarding, and navigation

The public entry page should briefly communicate the purpose and allow immediate exploration. Avoid a long generic sales page before the child can use the product.

Support hospital-specific links and QR codes that preselect the correct hospital and pathway without embedding child information in the URL. Manual selection remains available.

Flow:
1. Choose language and accessibility preferences; keep these changeable later.
2. Select a hospital and available pathway, or use the preselected link.
3. Choose the relevant age band and optional companion.
4. Show a concise welcome and the actual upcoming visit steps.
5. Enter the child's home with easy access to visit preparation, comfort tools, and exploration.

Use a fictional demonstration hospital until a partner provides permission and verified content. Sur may inform the setting; do not imply a partnership with Sur Hospital.

Public exploration does not require registration. Optional saving belongs to a caregiver account. Do not ask children to supply email addresses, phone numbers, exact birth dates, or medical identifiers.

Organize the full feature set into understandable navigation: visit journey, care preferences, appointments, information/checklist, tour, games, relaxation, and preparation resources. Reduce the number of top-level child navigation choices by grouping related activities. Parent and staff areas have their own layouts.

## H. My Visit and medical preparation

Build one complete sample routine X-ray pathway from welcome through returning home. Treat every medical explanation as draft demonstration content until approved by a qualified reviewer. Keep other procedures configurable rather than inventing detailed instructions.

A pathway consists of ordered steps with audience, age band, language, room, story, media, optional interaction, and content version. Do not force every appointment into assessment/diagnosis/treatment if that is not how it works.

For each step explain, at an appropriate level: what the child might see, what equipment is for, what staff may ask them to do, what sensations or sounds may occur, and how to request help. Allow replay, pause, skip, and a simple reading mode. Never promise that a procedure cannot hurt or that a parent can always remain in a room.

Include inspectable stethoscope, thermometer, and imaging-equipment examples. Distinguish X-ray, MRI, and CT content; never reuse one procedure's safety instructions for another. Remove default movement or sound from equipment unless accurate and reviewed.

Retain the proposed eating-related pathway in the roadmap and content system. Explicitly distinguish feeding assessment from eating disorder assessment. Require the hospital to define which it means before authoring. Mental-health services, meal plans, and crisis content require appropriate specialist and local review. Do not fabricate treatment advice.

## I. Care Profile and Comfort Passport

Replace a formal-feeling test with an optional character-led conversation using one question at a time. Ask about previous visits, preferred explanations, comfort objects, sounds, communication needs, and what helps the child feel supported. Include skip and edit options.

Generate a concise Comfort Passport from selected answers. Caregivers must review it before saving or sharing. It is a preference summary, not a medical diagnosis, psychological score, or clinical record. Requests must not appear as guarantees.

Provide screen, print, and downloadable versions. Use a generator that supports Arabic shaping and bidirectional text. Do not include sensitive details in QR codes. If sharing is enabled, use explicit adult action and a revocable, expiring, narrowly scoped access token; default to showing or printing the passport without public sharing.

## J. Appointments and preparation checklist

Allow caregivers to create, view, edit, and delete their own appointment notes: hospital, pathway, date, arrival time, location, and optional private note. Use the hospital's configured time zone; Oman demo appointments use Asia/Muscat. Store and display time consistently.

Provide a downloadable calendar event and optional Google Calendar connection. The first is an export; the second requires real OAuth, consent, secure token handling, and configured credentials. Never show a fake connected state. Use a generic event title by default to reduce unintended disclosure.

These are reminders and notes, not confirmed bookings. Do not imply a connection to a hospital booking system unless one exists.

Create procedure-specific checklists. Cover appointment documents, requested questionnaires, medication information, comfort objects, a quiet activity, and practical items. Food, drink, medication instructions, and fasting guidance must come from the relevant approved pathway. Never apply a generic snack checklist across procedures. Include a concise parent view and optional progress saving.

## K. Information and preparation resources

Provide a searchable, filterable library scoped to hospital, pathway, language, and audience. Include short parent articles, child stories, captioned videos, and printable resources. Show author/reviewer information and review dates where available; do not fabricate credentials.

Resources include colouring pages, visit planners, packing activities, equipment matching, feelings activities, illustrated stories, and approved practical preparation activities. Support printable A4 output and functional downloads. Every downloadable asset must exist and be licensed or original.

Do not expose internal development status messages as routine product copy. In the demonstration environment, clearly distinguish sample content from approved hospital guidance at an appropriate entry point and in content metadata.

## L. Interactive hospital tour

Support entrance, reception/waiting area, assessment room, clinician/procedure room, and exit/return-home steps, adapted to the selected pathway.

Provide two accurately named viewing modes:
- A 360-degree photographic tour using hospital-authorized panoramas.
- An illustrative 3D demonstration environment when real photography is unavailable.

Do not label an invented 3D room or generated panorama as a photograph of a real hospital. Use a floor/room map, obvious navigation, accessible hotspot lists, narration, captions, and a reset-view control. Avoid uncontrolled auto-rotation or forced camera travel.

Wanees can point to a hotspot or explain a room. Where a 3D overlay appears over a panorama, prevent clipping and keep interaction simple. An illustrated companion overlay is an acceptable photographic-tour option, while actual 3D remains available elsewhere.

Include a low-bandwidth image-and-text alternative. Store media rights, source, location, and review metadata. Real photography requires authorization and inspection for people, patient details, screens, and sensitive signage.

## M. Games and gentle rewards

Build complete playable activities with instructions, restart, pause, mute, and accessible controls. Progress should never block medical preparation. No public leaderboards, advertising, purchases, streak pressure, or rewards for suppressing fear or tears.

Required activities:
1. Medical dress-up: choose a clinician character; select scrubs, cap, mask, and protective glasses where appropriate; rotate or inspect; explain each item's purpose. Do not imply every item is needed for every procedure.
2. Underwater bubble activity: tap or select bubbles in a calm marine scene inspired subtly by Oman's coast. Offer an untimed default and optional timer/score. Include a keyboard-accessible alternative.
3. Pack for the visit: choose relevant items from the approved checklist and place them into a bag. Provide helpful feedback without harsh failure effects.
4. Equipment matching: match approved equipment names, illustrations, and uses.
5. Optional stay-still practice: a brief, stoppable, clinician-reviewed activity with no camera monitoring and no implication that it substitutes for procedure instructions.

Retain the original corridor-game idea only as an optional, disabled-by-default review item. If enabled after review, use a gentle fictional transport game with controlled speed, left/right movement, collectible hearts, optional points/timer, and non-threatening obstacles. No collisions with patients, frightening crashes, or suggestion that real hospital transport is a race. Document this intentional revision; the first demonstration should prioritize calmer activities.

## N. Relaxation and feelings

Build a breathing activity with Maryam or Wanees, a paced visual object, and gentle body animation. The balloon can be an abstract pacing illustration rather than an instruction to blow into a physical balloon. Use clinician-reviewed pacing configuration, no forced breath holds, and immediate stop controls. Do not present it as treatment.

Build an imagination/stretching activity with Amer in a quiet coastal scene. Provide a seated or imagination-only alternative, and never assume movement is appropriate before or after a procedure. Movement instructions need clinical review.

Add optional grounding through noticing the surroundings and a quiet sensory scene. Audio is off until intentionally enabled. Provide captions/transcripts and remember user preferences.

Allow an optional feelings check-in with original illustrated faces and short labels. A caregiver can see a simple change over time if consented. Do not convert it into an anxiety diagnosis, readiness score, or proof of effectiveness. Every feeling is an acceptable response; no score should restrict access or trigger medical advice.

## O. Parent experience

Create a parent area for saved profiles, appointments, checklists, Comfort Passports, relevant articles, accessibility settings, and consent/data controls. Support multiple child profiles without exposing one child's information to another profile accidentally.

Offer clinician-reviewed conversation guidance and a place to note questions for the care team. Clearly identify whether a note is merely saved or actually shared; do not imply monitoring by a clinician.

Provide profile editing, download/export, deletion requests, and logout. Deletion must explain any configured retention limits accurately. Returning from the child area to account changes requires an appropriate adult session check; a decorative parental gate is not authorization.

## P. Hospital administration and editorial workflow

Provide distinct permissions for platform administration, hospital administration, content editing, and clinical review. Authorized staff should not receive access to all child profiles by default.

Manage hospitals, facilities, rooms, pathways, steps, articles, checklist templates, translations, resources, character assets, and media rights. Support draft, in-review, approved, published, retired, and superseded content states. Record reviewer, scope, date, version, and review-due information.

Production publication requires the configured review gate. Demonstration content may be visible in demo mode without being falsely marked clinically approved. Changing approved medical content creates a new reviewable version. Preserve a visit's content-version reference where needed.

Supply useful preview tools for age, language, accessibility mode, and hospital. Include an audit trail for permission changes, publication, and access to sensitive data. Keep private information out of ordinary application logs.

## Q. Data model and API

Implement a documented relational model with clear ownership and deletion behaviour. Core entities include Hospital, Facility/Room, Pathway, PathwayStep, LocalizedContentVersion, ClinicalReview, MediaAsset, GuardianUser, ChildProfile, ConsentRecord, AppointmentNote, ChecklistTemplate, ChecklistItem, ChecklistProgress, ComfortPreference, PassportSnapshot, ShareGrant, ActivityProgress, FeelingsCheckIn, Resource, StaffMembership, AuditEvent, and AggregateMetric.

Minimize fields. Prefer age band to exact birth date and optional nickname to full child identity. Distinguish public content from private profile data. Store asset binaries separately from database metadata.

Build versioned APIs for public hospital/pathway content, caregiver-owned records, preference passports, revocable shares, resources, and staff content workflows. Validate identifiers, pagination, inputs, media types, and authorization server-side. Check ownership for every read and mutation. Check hospital scope independently from role. Use concurrency/version guards for editorial updates and consistent error responses. Generate a typed frontend client from OpenAPI when practical.

## R. Privacy, security, and deployment boundaries

Separate demonstration mode from live mode. Demo records must be synthetic; real child records must never be seeded into a public demo. Do not embed working staff credentials in a production frontend. Public judge demonstrations may use a sandboxed read-only or resettable fictional workspace with no real staff privileges.

Before real-world collection, document guardian consent, purpose, retention, controller responsibilities, applicable Omani child/health-data requirements, hosting location, and any cross-border transfer or permit requirements for qualified review. Do not claim compliance merely because controls exist.

Require TLS, secure session handling, appropriate rate limits, staff MFA where supported, least privilege, encrypted storage/backups, secret management, CSRF protection, and safe content rendering. Validate uploads and sanitize or disallow unsafe SVG/HTML. Provide deletion/revocation workflows and test backup recovery. Do not install advertising trackers or third-party session replay on child/private pages.

Public offline caching must exclude personalized API responses, appointments, passports, auth responses, and other sensitive content. Clear account-specific local state on logout. Do not request camera, microphone, location, or notifications unless an actual optional function needs them and the adult explicitly enables it.

No open-ended medical chatbot, automated diagnosis, facial emotion inference, or AI-generated treatment advice. Core personalization should use transparent preferences and authored content.

## S. Arabic, English, accessibility, and natural writing

Use natural, concise language. Avoid stock marketing phrases, exaggerated transformation claims, repetitive exclamation marks, and generic AI wording. Do not call every interaction magical or revolutionary. Do not hard-code a slogan into every screen.

All visible content must be localized, including errors, dates, buttons, transcripts, downloads, alt text, and accessibility labels. Arabic should be composed naturally and reviewed by a fluent speaker rather than mechanically translated. Use a clear Arabic register appropriate to children; optional Omani narration must be locally reviewed. Avoid fabricated accents.

Use proper RTL layout, CSS logical properties, and bidirectional handling for mixed identifiers and times. Mirror navigation where appropriate, not logos, medical equipment, text baked into images, or real-world spatial instructions. Preserve visit progress during language changes. Choose a licensed Arabic/Latin type pairing and test Arabic at small sizes.

Target WCAG 2.2 AA and verify the applicable requirements instead of claiming automatic compliance. Include keyboard support, visible focus, accessible dialogs, landmarks, large touch controls, contrast checks, text resizing, reduced motion, pause controls, and screen-reader alternatives to 3D. Do not convey state by colour alone. Test real assistive navigation in addition to automated checks.

## T. Performance and resilience

Treat budgets as targets to measure, not achieved results. Target a usable initial screen within common Core Web Vitals thresholds on a representative mid-range phone/network; defer 3D so it does not block interaction. Aim for at least 30 fps during supported interactive scenes under defined test conditions, with adaptive quality when needed.

Compress textures and geometry appropriately, reuse assets, cap device pixel ratio, and avoid multiple active canvases. Load only the selected language/pathway media where possible. Provide progress indicators and image fallbacks. Respect reduced-data preferences where available.

Implement offline, retry, not-found, forbidden, session-expired, empty, invalid-form, upload-failed, asset-unavailable, and integration-unconfigured states. Preserve unsaved adult form work appropriately without leaking sensitive information. Never replace a failed API call with a fake success toast.

## U. Full screen inventory

Deliver and connect: public entry; language/accessibility setup; hospital/pathway selection; age/companion selection; child home; visit step/story; equipment explorer; tour map/viewer; preference conversation; Comfort Passport preview/export; appointments list/form/detail; checklist; information library/article; games hub and individual games; relaxation hub/player; feelings check-in; resources library; parent account/profile/settings; privacy/consent/data controls; staff login; staff overview; hospital/room/pathway editor; content/translation editor; review queue; media/resources manager; aggregate evaluation view; and relevant failure states.

Use routes and deep links that restore the intended non-sensitive context. Browser back and refresh must work. No button should appear functional while doing nothing. Where a feature belongs to a later milestone, make that status explicit in the delivery checklist and avoid presenting it as complete.

## V. Competition demonstration and credible storytelling

Prepare a resettable, coherent 3–5 minute demonstration:
1. Open a fictional Omani hospital's pathway link.
2. Enter the Arabic child experience and meet the animated Wanees character.
3. Explore a hospital room and inspect equipment.
4. Watch the companion demonstrate one complete preparation step.
5. Try a short calming interaction.
6. Capture a comfort preference and show its parent-reviewed passport.
7. Switch to English without losing progress.
8. Show how staff review/update content and how evaluation would be measured.

Let the strongest visual moment be purposeful: the child sees a companion experience the procedure first and then chooses how to prepare. Pair that with the practical handoff to the caregiver or nurse.

Use only labelled synthetic metrics in demonstration dashboards. Do not fabricate testimonials, awards, hospital partnerships, clinical approval, patient counts, or anxiety reduction percentages. Explain the product's differentiators as proposed strengths: Omani cultural fit, bilingual experience, accessible 3D preparation, and useful caregiver/staff handoff. Do not claim to be the first or only such product without evidence.

## W. Evaluation and business support

Include a configurable evaluation plan covering usability, understanding of the visit, parent confidence, staff usefulness, and technical performance. Any clinical distress or staff-time study must be designed with the hospital and appropriate review. A small usability pilot cannot establish clinical effectiveness.

Aggregate events should be minimal, purposeful, and consent-aware. Avoid child-identifying analytics payloads, free-text medical notes, and misleading small-group dashboards. Suppress or combine small cohorts where needed. Separate engagement from clinical outcomes.

Document a possible hospital-funded setup and annual-support model, with costs for clinical review, media production, localization, hosting, updates, and support. Treat willingness to pay as unvalidated. Do not build a child-facing paywall or purchasing flow for the demonstration.

## X. Build order and scope control

Milestone 1: brand exploration, design tokens, bilingual shell, data model, API foundation, original character direction, and a functioning 3D greeting with fallback.

Milestone 2: one complete sample visit pathway, equipment inspection, illustrative tour, parent checklist, and basic content administration.

Milestone 3: preference interview, Comfort Passport, appointment notes/calendar export, relaxation, and the first complete games.

Milestone 4: remaining games/resources, multiple child profiles, editorial review flow, public offline resources, and evaluation view.

Milestone 5: visual refinement, accessibility/RTL testing, permissions/security verification, performance measurement, and rehearsed demo.

Later integrations: authorized real-hospital photography, Google OAuth synchronization, notification delivery, hospital scheduling/EHR integrations, and clinically reviewed additional pathways. Implement adapters and clear configuration requirements; do not simulate these as connected live services.

Do not abandon the project at a plan or frontend mockup when the environment supports implementation. Conversely, do not claim that a large full-stack brief is complete after building only the most visible screens. Maintain a delivered/partial/deferred register.

## Y. Verification and acceptance criteria

The main end-to-end journey works after a clean setup and seed. Changes persist through the intended backend. Arabic and English render correctly. Core tasks remain usable without 3D. Games have functioning input and pause/restart. Downloads exist. Calendar export works. Staff can edit and review a content version. Sensitive routes reject unauthorized access and cross-family/cross-hospital requests.

Test meaningful risks: guardian ownership, tenant isolation, publication gates, expiring/revoked shares, CSRF/session behaviour, input validation, local-time/calendar conversion, RTL forms, refresh/deep links, offline-cache exclusions, and WebGL failure. Check mobile Safari and representative desktop browsers where available. Use screenshot review for key screens in both languages. Report actual tests and remaining gaps honestly.

Keep a concise acceptance matrix tying each feature to its working screen/API/test or a documented limitation. No missing assets, placeholder links, unlabelled sample data, or fabricated success states in the final demonstration.

## Z. Required deliverables and completion report

Deliver source code, setup README, environment example, database migrations and synthetic seed, documented API, reproducible development commands, original/licensed asset inventory, editable logo assets where actually created, character/animation notes, bilingual content files, admin instructions, test results, and a competition demo script.

Include an asset handoff list for items needing professional illustration, modelling, animation, voice recording, local cultural review, or hospital photography. State which items are generated concepts versus production-ready assets. Do not imply that a generated logo or photograph supplies a 3D model.

Include separate deployment instructions for the frontend and .NET backend if the host cannot run both. Document backups, restore, health checks, and secret configuration. Do not expose credentials, publish live child information, or change access settings to work around deployment limitations.

The final report must state what works, how to run it, what was verified, which content/integrations remain demonstration-only, and what must happen before a real hospital launch. Make the finished experience specific to Wanees: a recognizable Omani companion, clear preparation, meaningful interaction, and practical support for families.

END PROMPT

---

## Reference notes for the project owner

These references informed the brief; they are not evidence that Wanees itself has been clinically validated.

- Existing comparable preparation product: [Little Journey](https://play.google.com/store/apps/details?hl=en_US&id=com.littlesparkshospital.littlejourney).
- Research-design reference, explicitly a protocol: [Little Journey trial protocol](https://pubmed.ncbi.nlm.nih.gov/40010809/).
- Child-friendly, truthful preparation: [Nationwide Children's Hospital guidance](https://www.nationwidechildrens.org/conditions/health-library/preparing-the-preschooler-for-surgery).
- Oman data-protection implementation context: [MTCIT regulation overview](https://prod.mtcit.gov.om/ITAPortal/MediaCenter/NewsDetail.aspx?NID=91274).
- 3D implementation and React-version compatibility: [React Three Fiber documentation](https://r3f.docs.pmnd.rs/getting-started/introduction).
- Panoramic web tours: [Pannellum documentation](https://pannellum.org/documentation/overview/).

## Logo generation brief

Create an original, vector-friendly logo concept for Wanees / ونيس, an Omani children's hospital-preparation app. Show a small child and a larger caring companion through two simple rounded figures holding hands or forming an open protective embrace. Frame their connection with a subtle arch inspired by Omani doorways. Keep the human relationship dominant and immediately readable: reassurance, support, and togetherness. Use a clean bilingual lockup, precise legible Arabic, and restrained distinctive flat design. No prescribed colour palette, no animals or horns, no generic medical cross/heart mashup, no emoji, no stock AI sparkles, no official national symbols, no tagline. Avoid religious-institution or real-estate branding cues. The emblem must stand alone at small sizes. Present one polished identity on a clean background. Treat a generated result as a raster concept for later vector refinement and trademark checks. This brief supersedes the earlier oryx-logo brief; the oryx remains an in-app character only.

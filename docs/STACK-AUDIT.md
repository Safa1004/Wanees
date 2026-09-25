# Stack audit — revision of 18 September 2026

This compares the requested technology choices with executable project files. A package being installed does not imply every production feature is finished.

| Requirement | Implementation |
|---|---|
| React + TypeScript + Vite | React 19, strict TypeScript, Vite 8; `apps/web/package.json` and lockfile |
| React Router | Connected feature routes in `main.tsx` and `Pages.tsx` |
| Tailwind CSS | Tailwind 4 Vite integration, semantic tokens and custom CSS compositions |
| TanStack Query | API queries/mutations; no copied caregiver server data in Zustand |
| Zustand | Public visit/character/accessibility state; profile selection only, no private record payloads |
| React Hook Form + Zod | Caregiver forms and input schemas |
| i18next/react-i18next | English/Arabic, RTL switching with preserved public progress |
| Three.js / R3F / Drei | Interactive GLB assets, orbit controls, lazy scene loading, illustrated fallback |
| Motion | Purposeful interface motion, reduced-motion handling |
| Lucide | Interface icon family; no emoji navigation |
| Pannellum | Pinned dependency, lazy photographic viewer, rights/review metadata gate; no authorized hospital photography yet |
| Canvas | Marine activity backdrop; interactive controls remain accessible HTML |
| PWA | Explicit public-resource cache; account/API data excluded |
| ASP.NET Core | .NET 10 LTS Web API; no Node/Python replacement API |
| EF Core + PostgreSQL | EF/Npgsql, migrations, Docker PostgreSQL 18; integration suite now passed against PostgreSQL |
| Identity / cookies / CSRF | Identity foundation and same-origin HttpOnly session/CSRF; live identity lifecycle still partial |
| Authorization | Guardian ownership, role policies and independent hospital checks |
| OpenAPI / Problem Details | Actual generated API document and error responses |
| Object storage / uploads | Still missing: validated upload service and S3 adapter. Not simulated as working. |
| Email / calendar integrations | Working .ics export; Google OAuth and email remain unconfigured, not fake connections |
| Docker / configuration | Compose, Dockerfiles, environment example; launcher now uses PostgreSQL through Docker by default |
| Verification | Strict TS, ESLint, Prettier, Vitest, axe, executable API suite. Broader RTL/assistive-tech and production tests remain |

The Python launcher only serves compiled static assets and proxies to the .NET API. The optional `--file-demo` switch is an explicitly named fallback, not the default stack.

Official compatibility references checked for this revision:
- https://r3f.docs.pmnd.rs/getting-started/installation — Fiber 9 pairs with React 19.
- https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core — .NET 10 is an active LTS release.
- https://pannellum.org/documentation/overview/ — JavaScript viewer, equirectangular formats and hotspot support.
- https://github.com/KhronosGroup/glTF-Blender-IO — Blender glTF import/export integration.

See DELIVERY.md for the broader product requirements. This audit does not label unfinished hospital integrations or clinical review as complete.

The API now fails clearly when PostgreSQL is missing. The file adapter requires both `DemoMode=true` and explicit `AllowFileDemo=true`; CI is configured with a PostgreSQL service.

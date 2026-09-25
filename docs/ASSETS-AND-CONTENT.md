# Asset and content register

| Asset | Origin and rights | Status |
|---|---|---|
| Supplied logo PNG | Provided by project owner; preserved as `assets/brand/supplied-raster-concept.png` | Reference only; no trademark clearance assumed. |
| Wanees emblem/lockups | Original vector refinement authored for this project | Genuine editable SVG paths, no embedded raster. Needs brand/local typography/trademark review. |
| Arabic wordmark | Noto Sans Arabic outlines shaped with HarfBuzz | SIL Open Font License copied alongside assets. Visually checked for connected letters; fluent local review pending. |
| English wordmark / UI | DM Sans | SIL Open Font License included. Self-hosted font. |
| Arabic UI | Noto Sans Arabic | SIL Open Font License included. Self-hosted font. |
| Interface icons | Lucide React | ISC; upstream license in installed package. No emoji navigation. |
| Wanees sheep GLB | Newly authored Blender geometry based on the user’s sheep reference; skeletal clips and blink shape keys | Replaces the earlier oryx at the user’s request. See `3D-ASSET-HANDOFF.md` for reference provenance and editable sources. |
| Children/clinicians/rooms/props | Original procedural Three.js geometry | Simplified demonstration models. Local cultural/device accuracy review pending. |
| 2D posters | SVGRenderer outputs of the original 3D geometry, then rasterized where appropriate | Real fallback assets, not generated photos. |
| Story/planner/colouring sheets | Original bilingual authored content and vector emblem | Eight standalone HTML downloads exist; clinical/language review pending. |
| Narration | Optional browser speech synthesis | User-initiated only; device-dependent. No recorded Omani voice or claims of reviewed pronunciation. |

## Reference sources checked

- [React Three Fiber introduction](https://r3f.docs.pmnd.rs/getting-started/introduction): React 19 / Fiber 9 pairing. Package peer constraints required React 19.2 rather than 19.3 for the selected Fiber release.
- [.NET support policy](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core): .NET 10 LTS. API packages pinned to the available 10.0.12 patch, Npgsql 10.0.3. Installed test runtime was 10.0.9; deploy with a current supported runtime.
- [Great Ormond Street Hospital: X-rays](https://www.gosh.nhs.uk/conditions-and-treatments/procedures-and-treatments/x-rays/): reference for ordinary room preparation and possible clothing changes.
- [RadiologyInfo: Pediatric X-ray](https://www.radiologyinfo.org/en/info/pediatric-xray): reference for equipment purpose and team-led preparation.
- [DM Sans source/license](https://github.com/google/fonts/tree/main/ofl/dmsans) and [Noto Sans Arabic source/license](https://github.com/google/fonts/tree/main/ofl/notosansarabic).

These are reference sources, not approvals of Wanees. The medical story is deliberately general, original draft wording. Hospital-specific instructions, sensations/sounds and individual positioning must be supplied and signed off by the relevant team. No research results are attributed to this product.

## Professional handoff needed

A local Omani reviewer should review names, Arabic phrasing, voice pronunciation and garments. The September 18 reference-led Blender revision replaces the oryx with a sheep and rebuilds Maryam, Amer and clinicians. Further professional character/animation polish and local garment review remain possible; these are stylized procedural models, not finished television production assets. A clinical team should approve procedure/device representations and activity pacing. A media team must obtain authorized hospital photography and inspect it for patients, screens and sensitive details before a real tour. Recorded narration, video and appearance/mobility variants remain uncommissioned.


## 18 September revision
The former procedural people/room placeholders have been replaced by original Blender GLB assets. See 3D-ASSET-HANDOFF.md and 3D-ASSET-VERIFICATION.json for the current 14-file inventory, rigs, rendered fallbacks and cultural references. The photographic-tour adapter uses Pannellum; no authorized real-hospital photographs are supplied.

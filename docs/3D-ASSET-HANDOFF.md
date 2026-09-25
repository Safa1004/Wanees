# Reference-led Blender revision · 23 September 2026

Open `Models.html` for the rendered asset gallery. `Cast-preview.png` shows the three companions together; `Cast-motion.mp4` is rendered from the actual Blender animation. Open `assets/blender/Cast.blend` for the editable group scene, or the individual named `.blend` files for each character, prop and environment. Press Space in an individual character scene to preview idle motion. The NLA editor contains eight named tracks; enable one at a time to preview another action.

The September 23 pass softens the characters after user feedback: inset eyes, simpler facial contours, lighter brows, matte surfaces and gentler colors. See `CHARACTER-REVISION.md`.

## What changed

The latest user request supersedes the original brief’s oryx direction. **Wanees is now a sheep**, with a charcoal face, floppy ears, modeled cream wool curls, expressive eyes, slender limbs and ochre boots. **Amer** wears a sage dishdasha with piping/furakha and an ivory kumma with olive petal embroidery. **Maryam** has long dark hair, a crimson floral tunic, green/cream trim and gold welcome-scene jewelry. The two clinicians share the upgraded facial geometry and hands, with separate cap, mask and glasses controls.

The five characters have skeletal bindings, eight named clips (idle, greeting, listening, pointing, demonstrating, breathing, encouragement, goodbye) and blink shape keys. Geometry is grouped by bone, material and visibility feature to reduce draw calls. These remain seven-bone stylized rigs with simple gestures; they do not include production facial controls, lip-sync, articulated fingers, cloth simulation or professional television character animation.

Welcome outfits are the initial choice. Saved user choices continue to apply. Hospital scenes retain everyday clothing and hide welcome jewelry. The existing skin-tone, glasses, walking-support, pause and 2D fallback controls remain available. Hair-style choices and seated wheelchair rigs are not implemented.

Hospital environments include entrance/courtyard, reception, assessment, X-ray, exit and a coastal imagination scene. This revision adds wall protection, curtains, wayfinding, softer materials, chair arms and stitching, desk details, bed rails, casters and trolley details. Equipment adds thermometer digits/probe finish, stethoscope chest-piece and metal details, and X-ray control buttons, rails, detector markings and cable conduit. These are fictional explanatory settings and generic devices, not scans of a real hospital or operating instructions.

## References and authorship

The user supplied two visual references:

- `shaun-the-sheep-cute-cartoon-sheep-with-woolly-fleece-muwgWEG1.jpg`: sheep appearance reference.
- `stock-vector-cute-cartoon-omani-kids-vector-illustration-2171599283.jpg`: Amer/Maryam appearance and clothing reference; the supplied image bears a Shutterstock watermark.

Meshes, curves, shaders, rigs and animation keys were authored in Blender’s Python API for this project. The reference pictures are not packaged as runtime textures, their watermarks were not removed, and no license or ownership of those reference designs is claimed. The new models are reference-led adaptations. The supplied Wanees brand emblem remains separate from the mascot.

## Files and rebuilding

`assets/blender/` contains 14 individual editable source scenes plus the cast presentation scene. `apps/web/public/models/` contains 14 self-contained animated/static GLBs. Matching Cycles-rendered PNG alternatives are in `apps/web/public/posters/`. Detailed Blender shaders include procedural micro-surface effects; the real-time GLBs preserve geometry, material colors/roughness/metallicity, skeletons and morph animation, but not Blender-only procedural bump nodes or studio lights. Web lighting is provided by React Three Fiber.

The existing stack remains React/TypeScript/Vite, React Three Fiber/Drei/Three.js, and the .NET/PostgreSQL application. No rendered image is substituted for interactive 3D when 3D is enabled.

Generation uses official Blender 4.5.14 Python tooling inside the supplied CPU Docker image. Native macOS Blender previously crashed during Metal startup; native interactive editing has not been verified. The files are saved as Blender 4.5 scenes.

```sh
# Build the toolchain once (requires registry access):
docker build -f infrastructure/Dockerfile.blender -t wanees-blender-build:4.5.14 .
# Then, from apps/web, with dependencies installed:
npm run assets
npm run build
# Optional cast still and video, from project root:
docker run --rm --network none --mount "type=bind,source=$PWD,target=/project" wanees-blender-build:4.5.14 python assets/blender/render_cast.py --movie
```

`build_assets.py` is the entry point; `build_cinematic.py` authors the characters, and `build_environments.py` authors the props/rooms. `compress-models.mjs` applies self-contained EXT_meshopt_compression using the decoder already bundled with Drei; each encoded buffer is decoded and compared byte-for-byte before saving. Blender sources retain the uncompressed geometry. A compatible glTF viewer must support meshopt; use `.blend` files for Blender editing.

`docs/3D-ASSET-VERIFICATION.json` records actual asset sizes, mesh counts, skeletons and clips. The more detailed character exports have an 8 MB per-file transfer budget, replacing the earlier 3 MB prototype budget. This is not a verified low-end mobile frame-rate guarantee. Existing 2D alternatives remain available.

The visual target is a warmer, more detailed TV-cartoon-inspired style. This is still a procedural stylized implementation, not a claim of finished studio-quality character production. Local cultural and clinical approval, the production readiness gaps in `STACK-AUDIT.md`, and broader device testing remain outstanding.

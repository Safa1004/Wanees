# Original demonstration characters

`wanees.glb` is a reusable original model, generated from Three.js geometry by `apps/web/scripts/build-models.mjs`. It has named nodes and eight animation clips: idle, greeting, listening, pointing, demonstrating, breathing, encouragement, goodbye. Transitions fade over roughly 0.3 seconds; greeting/goodbye gestures finish into idle. Pausing and hidden tabs suspend continuous rendering. A 2D poster is available when WebGL is unavailable or reading mode is selected.

The model is deliberately a stylized oryx: pale body, long dark horns, modest eye markings, a small visit bag, warm tactile materials. It is a prototype, not a medically accurate procedure demonstrator or finished culturally reviewed production mascot.

Maryam, Amer and two clinicians now have original Blender sources and exported skeletal GLBs, each with eight animation clips. Welcome/everyday clothing, three skin tones, glasses and walking support are connected to the app. See `docs/3D-ASSET-HANDOFF.md` and the root `Models.html` for the new assets, review limits and source files. Full facial/hand rigs and a wheelchair/seated variant remain future work.

The GLB can be opened in Blender or another glTF editor. Replace `/public/models/wanees.glb` while preserving named clip contracts, or update the adapter in `src/Scene.tsx`. Do not replace the child-and-companion brand emblem with this animal character.

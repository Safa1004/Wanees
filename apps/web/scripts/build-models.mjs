import * as T from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import fs from "node:fs/promises";
class Reader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((b) => {
      this.result = b;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((b) => {
      this.result =
        "data:application/octet-stream;base64," +
        Buffer.from(b).toString("base64");
      this.onloadend?.();
    });
  }
}
globalThis.FileReader = Reader;
const mat = (c) => new T.MeshStandardMaterial({ color: c, roughness: 0.85 });
function ball(parent, name, p, s, c) {
  const mesh = new T.Mesh(new T.SphereGeometry(1, 24, 16), mat(c));
  mesh.name = name;
  mesh.position.set(...p);
  mesh.scale.set(...s);
  parent.add(mesh);
  return mesh;
}
function rod(parent, name, p, r, h, c, rot = [0, 0, 0]) {
  const mesh = new T.Mesh(new T.CylinderGeometry(r * 0.65, r, h, 16), mat(c));
  mesh.name = name;
  mesh.position.set(...p);
  mesh.rotation.set(...rot);
  parent.add(mesh);
  return mesh;
}
function box(parent, name, p, s, c) {
  const mesh = new T.Mesh(new T.BoxGeometry(...s), mat(c));
  mesh.name = name;
  mesh.position.set(...p);
  parent.add(mesh);
  return mesh;
}
const root = new T.Group();
root.name = "Wanees";
ball(root, "Body", [0, 0.85, 0], [0.54, 0.66, 0.39], "#f6ecdb");
const head = new T.Group();
head.name = "Head";
head.position.set(0, 1.67, 0.06);
root.add(head);
ball(head, "Face", [0, 0, 0], [0.53, 0.56, 0.43], "#fff7e8");
ball(head, "Muzzle", [0, -0.27, 0.35], [0.33, 0.23, 0.19], "#e9d2b3");
for (const k of [-1, 1]) {
  const side = k < 0 ? "Left" : "Right";
  rod(root, "Leg" + side, [k * 0.25, 0.27, 0], 0.13, 0.5, "#efe4d2");
  ball(
    root,
    "Hoof" + side,
    [k * 0.25, 0.08, 0.06],
    [0.17, 0.1, 0.21],
    "#48473e",
  );
  ball(
    head,
    "Ear" + side,
    [k * 0.56, 0.3, -0.06],
    [0.29, 0.12, 0.14],
    "#f4e9d6",
  );
  ball(
    head,
    "InnerEar" + side,
    [k * 0.57, 0.31, 0.04],
    [0.18, 0.055, 0.045],
    "#c09175",
  );
  rod(head, "Horn" + side, [k * 0.22, 0.78, -0.11], 0.053, 0.83, "#48473e", [
    0.11,
    0,
    k * -0.06,
  ]);
  ball(
    head,
    "Marking" + side,
    [k * 0.22, 0.08, 0.377],
    [0.11, 0.135, 0.035],
    "#5e5143",
  );
  ball(
    head,
    "Eye" + side,
    [k * 0.22, 0.09, 0.411],
    [0.057, 0.08, 0.02],
    "#232c2a",
  );
  ball(
    head,
    "Glint" + side,
    [k * 0.2, 0.13, 0.43],
    [0.019, 0.026, 0.01],
    "#fff",
  );
  ball(
    head,
    "Cheek" + side,
    [k * 0.32, -0.19, 0.337],
    [0.087, 0.04, 0.02],
    "#d49b83",
  );
  const arm = new T.Group();
  arm.name = "Arm" + side;
  arm.position.set(k * 0.49, 1.2, 0.03);
  root.add(arm);
  ball(arm, "Hand" + side, [0, -0.21, 0], [0.13, 0.36, 0.14], "#f4e9d6");
}
ball(head, "Nose", [0, -0.18, 0.53], [0.092, 0.06, 0.027], "#55483c");
rod(root, "Collar", [0, 1.21, 0], 0.35, 0.12, "#246b68");
box(root, "VisitBag", [0.45, 0.65, 0.31], [0.38, 0.43, 0.17], "#c47b50");
rod(root, "BagStrap", [0.39, 0.98, 0.32], 0.016, 0.7, "#976245", [0, 0, -0.22]);
const clips = [];
function rotateClip(name, target, axis, angles, times) {
  const values = [];
  for (const angle of angles) {
    const q = new T.Quaternion().setFromAxisAngle(
      new T.Vector3(...axis),
      angle,
    );
    values.push(...q.toArray());
  }
  clips.push(
    new T.AnimationClip(name, -1, [
      new T.QuaternionKeyframeTrack(target + ".quaternion", times, values),
    ]),
  );
}
rotateClip(
  "greeting",
  "ArmRight",
  [0, 0, 1],
  [0, -0.9, -0.65, -0.9, 0],
  [0, 0.5, 1, 1.5, 2.4],
);
rotateClip("listening", "Head", [0, 0, 1], [0, 0.1, 0.1, 0], [0, 1, 2, 3]);
rotateClip("pointing", "ArmLeft", [0, 0, 1], [0, 0.8, 0.8, 0], [0, 1, 2, 3]);
rotateClip(
  "demonstrating",
  "Head",
  [1, 0, 0],
  [0, 0.12, 0.12, 0],
  [0, 1, 2, 3],
);
rotateClip(
  "encouragement",
  "Head",
  [1, 0, 0],
  [0, 0.08, 0, 0.08, 0],
  [0, 0.5, 1, 1.5, 2],
);
rotateClip(
  "goodbye",
  "ArmRight",
  [0, 0, 1],
  [0, -0.8, -0.4, -0.8, 0],
  [0, 0.5, 1, 1.5, 2],
);
clips.push(
  new T.AnimationClip("idle", 4, [
    new T.VectorKeyframeTrack(
      "Body.scale",
      [0, 2, 4],
      [0.54, 0.66, 0.39, 0.548, 0.67, 0.395, 0.54, 0.66, 0.39],
    ),
  ]),
);
clips.push(
  new T.AnimationClip("breathing", 8, [
    new T.VectorKeyframeTrack(
      "Body.scale",
      [0, 4, 8],
      [0.54, 0.66, 0.39, 0.575, 0.71, 0.42, 0.54, 0.66, 0.39],
    ),
  ]),
);
const exporter = new GLTFExporter();
const binary = await exporter.parseAsync(root, {
  binary: true,
  animations: clips,
});
await fs.writeFile("public/models/wanees.glb", Buffer.from(binary));
await fs.copyFile(
  "public/models/wanees.glb",
  "../../assets/characters/wanees.glb",
);
console.log(
  "Created original reusable Wanees GLB with 8 named animation clips",
);

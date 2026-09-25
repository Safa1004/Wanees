import { JSDOM } from "jsdom";
import * as T from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { SVGRenderer } from "three/addons/renderers/SVGRenderer.js";
import fs from "node:fs/promises";
const dom = new JSDOM("<!doctype html><body></body>");
globalThis.document = dom.window.document;
globalThis.window = dom.window;
globalThis.ProgressEvent = class {};
await fs.mkdir("public/posters", { recursive: true });
const buffer = await fs.readFile("public/models/wanees.glb");
const model = await new GLTFLoader().parseAsync(
  buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
  "",
);
function render(obj, name, target = [0, 1.4, 0]) {
  const scene = new T.Scene();
  scene.background = new T.Color("#eee8d7");
  scene.add(obj);
  scene.add(new T.AmbientLight("#ffffff", 1.8));
  const light = new T.DirectionalLight("#ffffff", 2);
  light.position.set(2, 5, 4);
  scene.add(light);
  const camera = new T.PerspectiveCamera(33, 1, 0.1, 100);
  camera.position.set(3, 2.8, 6);
  camera.lookAt(...target);
  scene.updateMatrixWorld(true);
  const renderer = new SVGRenderer();
  renderer.setSize(420, 420);
  renderer.setQuality("high");
  renderer.render(scene, camera);
  return fs.writeFile(
    "public/posters/" + name + ".svg",
    renderer.domElement.outerHTML,
  );
}
await render(model.scene, "wanees");
function box(g, size, p, c) {
  const mesh = new T.Mesh(
    new T.BoxGeometry(...size),
    new T.MeshLambertMaterial({ color: c }),
  );
  mesh.position.set(...p);
  g.add(mesh);
}
let x = new T.Group();
box(x, [0.8, 2, 0.28], [0, 0.8, -0.35], "#e9e7dc");
box(x, [0.7, 0.7, 0.65], [0, 1.6, 0.13], "#bbcaca");
box(x, [1.5, 0.2, 0.85], [0, 0.1, 0.4], "#447c7b");
await render(x, "xray", [0, 1, 0]);
let therm = new T.Group();
box(therm, [0.34, 1.65, 0.2], [0, 1, 0], "#f1eee2");
box(therm, [0.23, 0.38, 0.04], [0, 1.22, 0.12], "#90a9a2");
await render(therm, "thermometer", [0, 1, 0]);
let st = new T.Group();
const ring = new T.Mesh(
  new T.TorusGeometry(0.48, 0.045, 12, 50, Math.PI * 1.65),
  new T.MeshLambertMaterial({ color: "#226966" }),
);
ring.position.y = 1.5;
st.add(ring);
box(st, [0.05, 0.6, 0.05], [0.39, 0.9, 0], "#226966");
const disk = new T.Mesh(
  new T.CylinderGeometry(0.2, 0.2, 0.07, 32),
  new T.MeshLambertMaterial({ color: "#9daba9" }),
);
disk.position.set(0.39, 0.5, 0);
disk.rotation.x = Math.PI / 2;
st.add(disk);
await render(st, "stethoscope", [0, 1, 0]);
console.log("Generated 2D vector renderings from original 3D geometry");

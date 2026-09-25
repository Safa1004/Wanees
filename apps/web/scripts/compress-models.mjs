/** Self-contained EXT_meshopt_compression GLBs. Byte-exact geometry and animation round-trip. */
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { MeshoptEncoder, MeshoptDecoder } from "meshoptimizer";
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const root = path.resolve(import.meta.dirname, "../public/models");
const files = fs
  .readdirSync(root, { recursive: true })
  .filter(
    (x) => x.endsWith(".glb") && (!process.argv[2] || x === process.argv[2]),
  );
for (const file of files) {
  const p = path.join(root, file),
    input = fs.readFileSync(p),
    jl = input.readUInt32LE(12),
    j = JSON.parse(input.toString("utf8", 20, 20 + jl));
  if (j.extensionsRequired?.includes("EXT_meshopt_compression")) continue;
  const bin = input.subarray(28 + jl),
    parts = [];
  let offset = 0,
    fallback = 0,
    compressed = 0;
  const append = (data) => {
    const pos = offset;
    parts.push(Buffer.from(data));
    offset += data.length;
    const pad = (4 - (offset % 4)) % 4;
    if (pad) {
      parts.push(Buffer.alloc(pad));
      offset += pad;
    }
    return pos;
  };
  for (let i = 0; i < j.bufferViews.length; i++) {
    const v = j.bufferViews[i],
      accessors = j.accessors.filter((a) => a.bufferView === i),
      a = accessors[0];
    const bytes = bin.subarray(
      v.byteOffset || 0,
      (v.byteOffset || 0) + v.byteLength,
    );
    const components = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };
    const componentBytes = {
      5120: 1,
      5121: 1,
      5122: 2,
      5123: 2,
      5125: 4,
      5126: 4,
    };
    const stride =
      v.byteStride ||
      (a && components[a.type] * componentBytes[a.componentType]);
    const indices = v.target === 34963;
    const mode = indices ? "INDICES" : "ATTRIBUTES";
    const count = stride ? bytes.length / stride : 0;
    if (
      !a ||
      !Number.isInteger(count) ||
      !(indices
        ? [2, 4].includes(stride)
        : stride % 4 === 0 && stride <= 256) ||
      (indices && count % 3 !== 0)
    ) {
      v.buffer = 0;
      v.byteOffset = append(bytes);
      continue;
    }
    const packed = MeshoptEncoder.encodeGltfBuffer(bytes, count, stride, mode);
    const decoded = new Uint8Array(bytes.length);
    MeshoptDecoder.decodeGltfBuffer(decoded, count, stride, packed, mode);
    assert.ok(Buffer.from(decoded).equals(bytes), `${file} buffer ${i}`);
    if (packed.length >= bytes.length) {
      v.buffer = 0;
      v.byteOffset = append(bytes);
      continue;
    }
    const compressedOffset = append(packed);
    v.buffer = 1;
    v.byteOffset = fallback;
    fallback += bytes.length;
    fallback = (fallback + 3) & ~3;
    v.extensions = {
      ...(v.extensions || {}),
      EXT_meshopt_compression: {
        buffer: 0,
        byteOffset: compressedOffset,
        byteLength: packed.length,
        byteStride: stride,
        count,
        mode,
        filter: "NONE",
      },
    };
    compressed++;
  }
  if (!compressed) continue;
  j.buffers = [
    { byteLength: offset },
    {
      byteLength: fallback,
      extensions: { EXT_meshopt_compression: { fallback: true } },
    },
  ];
  j.extensionsUsed = [
    ...new Set([...(j.extensionsUsed || []), "EXT_meshopt_compression"]),
  ];
  j.extensionsRequired = [
    ...new Set([...(j.extensionsRequired || []), "EXT_meshopt_compression"]),
  ];
  const raw = Buffer.from(JSON.stringify(j));
  const json = Buffer.concat([
      raw,
      Buffer.alloc((4 - (raw.length % 4)) % 4, 32),
    ]),
    data = Buffer.concat(parts);
  const header = Buffer.alloc(20);
  header.write("glTF");
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(28 + json.length + data.length, 8);
  header.writeUInt32LE(json.length, 12);
  header.writeUInt32LE(0x4e4f534a, 16);
  const bh = Buffer.alloc(8);
  bh.writeUInt32LE(data.length);
  bh.writeUInt32LE(0x004e4942, 4);
  fs.writeFileSync(p, Buffer.concat([header, json, bh, data]));
  console.log(
    `${file}: ${(input.length / 1e6).toFixed(2)} → ${(fs.statSync(p).size / 1e6).toFixed(2)} MB; ${compressed} buffers verified`,
  );
}

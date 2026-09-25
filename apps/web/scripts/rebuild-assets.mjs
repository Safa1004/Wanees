import path from "node:path";
import { spawnSync } from "node:child_process";
const root = path.resolve(import.meta.dirname, "../../..");
for (const [command, args] of [
  [
    "docker",
    [
      "run",
      "--rm",
      "--network",
      "none",
      "--mount",
      `type=bind,source=${root},target=/project`,
      "wanees-blender-build:4.5.14",
      "python",
      "assets/blender/build_assets.py",
    ],
  ],
  [
    "docker",
    [
      "run",
      "--rm",
      "--network",
      "none",
      "--mount",
      `type=bind,source=${root},target=/project`,
      "wanees-blender-build:4.5.14",
      "python",
      "assets/blender/build_cinematic.py",
    ],
  ],
  [process.execPath, [path.join(import.meta.dirname, "compress-models.mjs")]],
  [process.execPath, [path.join(root, "tests/assets.mjs")]],
]) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}

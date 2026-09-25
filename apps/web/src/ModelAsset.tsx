import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { clone } from "three/addons/utils/SkeletonUtils.js";

/** Named Blender exports are replaceable without changing scene orchestration. */
export function ModelAsset({
  name,
  action = "idle",
  actionNonce = 0,
  paused = false,
  outfit = "everyday",
  skin,
  glasses = false,
  mobility = false,
  dress = [],
  focus = "",
}: {
  name: string;
  action?: string;
  actionNonce?: number;
  paused?: boolean;
  outfit?: string;
  skin?: string;
  glasses?: boolean;
  mobility?: boolean;
  dress?: string[];
  focus?: string;
}) {
  const model = useGLTF(`/models/${name}.glb?v=guides-20260925`);
  const ref = useRef<THREE.Group>(null);
  const scene = useMemo(() => {
    const copy = clone(model.scene);
    copy.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        o.material = Array.isArray(o.material)
          ? o.material.map((m) => m.clone())
          : o.material.clone();
      }
    });
    return copy;
  }, [model.scene]);
  const { actions, mixer } = useAnimations(model.animations, ref);
  useEffect(() => {
    scene.traverse((o) => {
      if (o.name.startsWith("welcome_")) o.visible = outfit === "welcome";
      if (o.name.startsWith("everyday_")) o.visible = outfit !== "welcome";
      if (o.name.startsWith("glasses_"))
        o.visible = glasses || dress.includes("glasses");
      if (o.name.startsWith("mobility_")) o.visible = mobility;
      if (o.name.startsWith("cap_")) o.visible = dress.includes("cap");
      if (
        name.startsWith("clinician") &&
        (o.name.startsWith("HairCrown") || o.name.startsWith("TiedHair"))
      )
        o.visible = !dress.includes("cap");
      if (o.name.startsWith("mask_")) o.visible = dress.includes("mask");
      if (o instanceof THREE.Mesh) {
        const materials = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of materials) {
          if (m instanceof THREE.MeshStandardMaterial) {
            m.emissive.set(
              focus && o.name.startsWith(focus) ? "#608f79" : "#000000",
            );
            m.emissiveIntensity = 0.35;
          }
          if (
            skin &&
            m.name.startsWith("Skin") &&
            m instanceof THREE.MeshStandardMaterial
          )
            m.color.set(
              { warm: "#d39c7e", deep: "#86573e", light: "#d3a17c" }[skin] ||
                "#bb805c",
            );
          if (
            name.startsWith("clinician") &&
            m.name.startsWith("Scrubs") &&
            m instanceof THREE.MeshStandardMaterial
          )
            m.color.set(dress.includes("scrubs") ? "#45817f" : "#d9ddd6");
        }
      }
    });
  }, [scene, outfit, skin, glasses, mobility, dress, name, focus]);
  useEffect(() => {
    const clip = actions[action] || actions.idle;
    if (!clip) return;
    clip.reset().fadeIn(0.3);
    if (action !== "idle" && action !== "breathing") {
      clip.setLoop(THREE.LoopOnce, 1);
      clip.clampWhenFinished = true;
    }
    clip.play();
    const settle = () => {
      clip.fadeOut(0.3);
      actions.idle
        ?.reset()
        .setLoop(THREE.LoopRepeat, Infinity)
        .fadeIn(0.3)
        .play();
    };
    mixer.addEventListener("finished", settle);
    return () => {
      mixer.removeEventListener("finished", settle);
      clip.fadeOut(0.3);
    };
  }, [actions, action, actionNonce, mixer]);
  useEffect(() => {
    mixer.timeScale = paused ? 0 : 1;
  }, [mixer, paused]);
  useEffect(
    () => () => {
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh)
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
            m.dispose(),
          );
      });
    },
    [scene],
  );
  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  );
}

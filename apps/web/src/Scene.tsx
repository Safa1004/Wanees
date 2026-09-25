import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  Lightformer,
} from "@react-three/drei";
import { Component, memo, useState, useEffect, type ReactNode } from "react";
import { useApp } from "./state";
import { bi } from "./i18n";
import { ModelAsset } from "./ModelAsset";
class Boundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}
function Scene({
  mode = "home",
  kind = "xray",
  dress = [],
  action = "greeting",
  focus = "",
  character,
  motionPaused = false,
  actionNonce = 0,
}: {
  mode?: string;
  kind?: string;
  dress?: string[];
  action?: string;
  focus?: string;
  character?: string;
  motionPaused?: boolean;
  actionNonce?: number;
}) {
  const { flat, paused, companion, outfit, skin, glasses, mobility } = useApp();
  const coastScene = mode === "calm" && kind === "coast";
  const activeCompanion = coastScene ? "Amer" : character || companion;
  const roomScene = mode === "tour" || mode === "visit" || coastScene;
  const personName = activeCompanion === "Amer" ? "amer" : "maryam";
  const [hidden, setHidden] = useState(document.hidden);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const f = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", f);
    return () => document.removeEventListener("visibilitychange", f);
  }, []);
  const fallback = (
    <div className="scene-fallback">
      <img
        src={
          mode === "equipment"
            ? `/posters/${kind}.png`
            : mode === "dress"
              ? `/posters/clinician-${kind === "male" ? "male" : "female"}.png`
              : roomScene
                ? `/posters/rooms-${kind}.png`
                : activeCompanion === "Wanees"
                  ? "/posters/wanees.png"
                  : `/posters/${personName}${outfit === "welcome" ? "" : "-everyday"}.png`
        }
        alt=""
      />
      <strong>{bi("Explore at your own pace.", "استكشف على راحتك.")}</strong>
      <p>
        {bi(
          "Explore the story and controls below at your own pace.",
          "استكشف القصة والخيارات بالسرعة التي تناسبك.",
        )}
      </p>
    </div>
  );
  if (flat || failed) return fallback;
  return (
    <Boundary fallback={fallback}>
      <Canvas
        dpr={[1, 1.5]}
        shadows
        camera={{
          position: roomScene
            ? [6.6, 4.8, 8.5]
            : activeCompanion !== "Wanees" || mode === "dress"
              ? [1.25, 1.45, 4.8]
              : [1.25, 1.45, 4.8],
          fov: 36,
        }}
        frameloop={paused || hidden || motionPaused ? "demand" : "always"}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setFailed(true);
          });
        }}
        fallback={fallback}
        role="img"
        aria-label={bi(
          "Interactive 3D scene. Drag to turn.",
          "مشهد تفاعلي ثلاثي الأبعاد. اسحب للتدوير.",
        )}
      >
        <color
          attach="background"
          args={[mode === "calm" ? "#dbe9e2" : "#eee8d7"]}
        />
        <Environment resolution={128} frames={1} environmentIntensity={0.65}>
          <Lightformer
            form="rect"
            intensity={3}
            color="#fff2dd"
            position={[3, 4, 4]}
            scale={[4, 5, 1]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="rect"
            intensity={2}
            color="#e2edff"
            position={[-4, 2, 1]}
            scale={[3, 4, 1]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="rect"
            intensity={2}
            position={[0, 4, -3]}
            scale={[4, 3, 1]}
            target={[0, 0, 0]}
          />
        </Environment>
        <hemisphereLight args={["#fff5df", "#8b9990", 1.4]} />
        <directionalLight
          position={[-4, 3, -2]}
          intensity={2}
          color="#dbe9ff"
        />
        <directionalLight
          position={[3, 6, 5]}
          intensity={1.7}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-radius={3}
          shadow-bias={-0.001}
          shadow-normalBias={0.04}
        />
        <group position={[0, -1.1, 0]}>
          {mode === "equipment" ? (
            <group position={[0, kind === "xray" ? 0 : 1, 0]}>
              <ModelAsset name={kind} focus={focus} />
            </group>
          ) : mode === "dress" ? (
            <ModelAsset
              key={`clinician-${kind}`}
              name={`clinician-${kind === "male" ? "male" : "female"}`}
              dress={dress}
              action={action}
              actionNonce={actionNonce}
              paused={paused || hidden || motionPaused}
            />
          ) : (
            <>
              {roomScene && <ModelAsset name={`rooms/${kind}`} focus={focus} />}
              <group
                position={roomScene ? [1.8, 0, 1.3] : [0, 0, 0]}
                scale={roomScene ? 0.8 : 1}
              >
                {activeCompanion === "Wanees" ? (
                  <ModelAsset
                    name="wanees"
                    action={mode === "calm" ? "breathing" : action}
                    paused={paused || hidden || motionPaused}
                  />
                ) : (
                  <ModelAsset
                    name={personName}
                    action={mode === "calm" ? "breathing" : action}
                    paused={paused || hidden || motionPaused}
                    outfit={roomScene ? "everyday" : outfit}
                    skin={skin}
                    glasses={glasses}
                    mobility={mobility}
                  />
                )}
              </group>
            </>
          )}
          {!roomScene && (
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.025, 0]}
              receiveShadow
            >
              <circleGeometry args={[6, 64]} />
              <meshBasicMaterial
                toneMapped={false}
                color={mode === "calm" ? "#dbe9e2" : "#eee8d7"}
              />
            </mesh>
          )}
          {!roomScene && (
            <ContactShadows
              frames={1}
              position={[0, 0, 0]}
              opacity={0.22}
              scale={10}
              blur={2.5}
              far={5}
            />
          )}
        </group>
        <OrbitControls
          makeDefault
          target={[0, 0.15, 0]}
          enablePan={false}
          enableZoom={mode === "equipment"}
          minPolarAngle={0.7}
          maxPolarAngle={1.6}
          minDistance={roomScene ? 8.5 : 2.5}
          maxDistance={roomScene ? 16 : 8}
        />
      </Canvas>
    </Boundary>
  );
}

export default memo(Scene);

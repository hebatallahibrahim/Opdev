"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, useFBO } from "@react-three/drei";
import * as THREE from "three";
import { sceneStore } from "@/lib/sceneStore";
import { arrowShape, pShape } from "@/lib/markShapes";

const BRAND_BLUE = "#007ffd";

const GLASS = {
  transmission: 1,
  thickness: 0.9,
  roughness: 0,
  ior: 1.45,
  chromaticAberration: 0.4,
  anisotropicBlur: 0.1,
  distortion: 0.12,
  distortionScale: 0.3,
  temporalDistortion: 0.04,
  clearcoat: 1,
  clearcoatRoughness: 0,
  envMapIntensity: 1.7,
} as const;

const smooth = (x: number) => {
  const t = THREE.MathUtils.clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
};

/* ---------- Choreography: one pose per stage of the story ---------- */
type Pose = {
  rot: [number, number, number]; // whole mark
  scale: number;
  arrow: [number, number, number]; // arrow piece offset, mark-local
  arrowScale: number;
  sway: number; // idle oscillation amplitude
};

const POSES: Pose[] = [
  // 0 Hero — the mark, slightly turned to reveal its depth.
  { rot: [0.12, -0.42, 0], scale: 1, arrow: [0, 0, 0.05], arrowScale: 1, sway: 0.18 },
  // 1 Build — square to camera, the mark presented flat like the brand sheet.
  { rot: [0, 0, 0], scale: 0.92, arrow: [0, 0, 0.02], arrowScale: 1, sway: 0.04 },
  // 2 Execute — three-quarter view, the two pieces layered apart in depth.
  { rot: [0.22, 0.62, -0.06], scale: 1, arrow: [0, 0, 0.7], arrowScale: 1, sway: 0.22 },
  // 3 Grow — the arrow breaks out along its own diagonal, up and to the right.
  { rot: [0.05, -0.22, 0], scale: 0.8, arrow: [1.4, 1.4, 0.6], arrowScale: 1.1, sway: 0.08 },
  // 4 Final CTA — reassembled, facing forward.
  { rot: [0.04, -0.18, 0], scale: 1.04, arrow: [0, 0, 0.05], arrowScale: 1, sway: 0.12 },
];

const lerp3 = (a: number[], b: number[], t: number) =>
  [0, 1, 2].map((i) => THREE.MathUtils.lerp(a[i], b[i], t)) as [number, number, number];

function poseAt(p: number): Pose {
  const i = THREE.MathUtils.clamp(Math.floor(p), 0, POSES.length - 2);
  const t = smooth(p - i);
  const a = POSES[i];
  const b = POSES[i + 1];
  const l = THREE.MathUtils.lerp;
  return {
    rot: lerp3(a.rot, b.rot, t),
    scale: l(a.scale, b.scale, t),
    arrow: lerp3(a.arrow, b.arrow, t),
    arrowScale: l(a.arrowScale, b.arrowScale, t),
    sway: l(a.sway, b.sway, t),
  };
}

/* ---------- Backdrop: blueprint grid + brand-blue glow, refracted by the glass ---------- */
function Backdrop() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPointer: { value: new THREE.Vector2() }, uAspect: { value: 1 }, uP: { value: 0 } }),
    []
  );

  useFrame((state, dt) => {
    const u = mat.current!.uniforms;
    u.uTime.value += dt;
    u.uPointer.value.lerp(new THREE.Vector2(sceneStore.pointer.x, sceneStore.pointer.y), 0.05);
    u.uAspect.value = state.viewport.width / state.viewport.height;
    u.uP.value = THREE.MathUtils.lerp(u.uP.value, sceneStore.progress, 0.06);
  });

  const v = viewport.getCurrentViewport(undefined, [0, 0, -3]);
  return (
    <mesh position={[0, 0, -3]} scale={[v.width * 1.25, v.height * 1.25, 1]}>
      <planeGeometry />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`
          uniform float uTime; uniform vec2 uPointer; uniform float uAspect; uniform float uP;
          varying vec2 vUv;
          float grid(vec2 uv, float s){
            vec2 g = uv * s; vec2 d = fwidth(g);
            vec2 l = abs(fract(g - 0.5) - 0.5) / d;
            return 1.0 - min(min(l.x, l.y), 1.0);
          }
          void main(){
            vec2 uv = vUv; vec2 a = vec2(uv.x * uAspect, uv.y);
            vec3 col = vec3(0.094, 0.094, 0.133); // #181822
            col += grid(a, 9.0) * 0.03 + grid(a, 36.0) * 0.008;
            // thin light streaks along the brand's 45° axis, split into spectra by the glass
            float streakMask = smoothstep(0.38, 0.8, uv.x) * smoothstep(0.0, 0.25, uv.y);
            for (int i = 0; i < 3; i++) {
              float fi = float(i);
              vec2 n = normalize(vec2(1.0, 1.0));
              float off = 0.15 + fi * 0.13 + 0.025 * sin(uTime * 0.25 + fi * 1.7);
              float d = abs(dot(a - vec2(uAspect * 0.62, 0.0), n) - off);
              vec3 lc = mod(fi, 2.0) < 1.0 ? vec3(0.92, 0.95, 1.0) : vec3(0.0, 0.5, 0.99);
              col += lc * exp(-d * 320.0) * 0.5 * streakMask;
            }
            // brand-blue glow
            vec2 home = uAspect < 1.0 ? vec2(0.95, 0.12) : vec2(0.9, 0.78);
            vec2 c1 = home + vec2(0.04 * sin(uTime * 0.21) + uPointer.x * 0.03, 0.05 * cos(uTime * 0.17) + uPointer.y * 0.03);
            float d1 = length((uv - c1) * vec2(uAspect, 1.0));
            vec3 blue = mix(vec3(0.0, 0.5, 0.99), vec3(0.58, 0.81, 0.99), 0.3 + 0.3 * sin(uP * 1.7));
            col += blue * pow(smoothstep(0.85, 0.0, d1), 2.2) * 0.55;
            // lavender counter light
            vec2 c2 = vec2(0.18 + uPointer.x * 0.04, 0.22 + 0.04 * sin(uTime * 0.3));
            float d2 = length((uv - c2) * vec2(uAspect, 1.0));
            col += vec3(0.58, 0.39, 0.96) * pow(smoothstep(0.6, 0.0, d2), 2.0) * 0.2;
            col *= smoothstep(1.25, 0.35, length(uv - 0.5) * 1.6);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

/* ---------- The OP Dev. mark in glass ---------- */
const DEPTH = 0.3;
const EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: DEPTH,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.022,
  bevelSegments: 8,
  curveSegments: 96,
};

// Shaders compile behind the preloader: count a few drawn frames before "ready".
const WARM_FRAMES = 6;
const warm = { frames: 0 };

function Mark({ buffer }: { buffer: THREE.Texture }) {
  const root = useRef<THREE.Group>(null);
  const arrow = useRef<THREE.Group>(null);

  const { pGeo, aGeo } = useMemo(() => {
    const pGeo = new THREE.ExtrudeGeometry(pShape(), EXTRUDE);
    const aGeo = new THREE.ExtrudeGeometry(arrowShape(), EXTRUDE);
    pGeo.translate(0, 0, -DEPTH / 2);
    aGeo.translate(0, 0, -DEPTH / 2);
    return { pGeo, aGeo };
  }, []);

  useFrame((state) => {
    const p = smoothed.current;
    const t = state.clock.elapsedTime;
    const pose = poseAt(p);
    const intro = sceneStore.intro;

    const g = root.current!;
    g.rotation.set(
      pose.rot[0] + Math.sin(t * 0.3) * pose.sway * 0.35,
      pose.rot[1] + Math.sin(t * 0.4) * pose.sway + (1 - intro) * -1.2,
      pose.rot[2]
    );
    g.scale.setScalar(pose.scale * (0.6 + 0.4 * intro));
    g.position.y = Math.sin(t * 0.6) * 0.04;

    // On intro the arrow travels in along its diagonal and locks into place.
    const fly = (1 - smooth(intro * 1.15 - 0.15)) * 2.2;
    arrow.current!.position.set(pose.arrow[0] - fly, pose.arrow[1] - fly, pose.arrow[2] + fly * 0.4);
    arrow.current!.scale.setScalar(pose.arrowScale);
  });

  return (
    <group ref={root}>
      <mesh geometry={pGeo}>
        <MeshTransmissionMaterial {...GLASS} buffer={buffer} color="#f8f8f8" attenuationColor="#d7d7d4" attenuationDistance={3} />
      </mesh>
      <group ref={arrow}>
        <mesh geometry={aGeo}>
          <MeshTransmissionMaterial
            {...GLASS}
            buffer={buffer}
            color="#8cc6ff"
            attenuationColor={BRAND_BLUE}
            attenuationDistance={1.4}
            emissive={BRAND_BLUE}
            emissiveIntensity={0.35}
            iridescence={0.35}
            iridescenceIOR={1.2}
          />
        </mesh>
      </group>
    </group>
  );
}

// Progress smoothed once per frame and shared by the mark.
const smoothed = { current: 0 };

// One refraction buffer for all glass: the scene renders once without the
// mark, and both materials sample that texture.
function Rig() {
  const g = useRef<THREE.Group>(null);
  const fbo = useFBO();
  const { viewport, size } = useThree();
  useFrame((state, dt) => {
    g.current!.visible = false;
    const tone = state.gl.toneMapping;
    state.gl.toneMapping = THREE.NoToneMapping;
    state.gl.setRenderTarget(fbo);
    state.gl.render(state.scene, state.camera);
    state.gl.setRenderTarget(null);
    state.gl.toneMapping = tone;
    g.current!.visible = true;
    if (warm.frames <= WARM_FRAMES && ++warm.frames > WARM_FRAMES) sceneStore.ready = true;

    smoothed.current = THREE.MathUtils.damp(smoothed.current, sceneStore.progress, 4.5, dt);
    const { x, y } = sceneStore.pointer;
    // Side-by-side only when there is room; tablets stack the mark above the copy like phones.
    const desktop = size.width >= 1024;
    const p = smoothed.current;
    // Sits right of the copy on desktop; centred for the final CTA.
    const side = desktop ? viewport.width * 0.25 : 0;
    const targetX = p > 3.5 ? THREE.MathUtils.lerp(side, 0, (p - 3.5) * 2) : side;
    g.current!.position.x = THREE.MathUtils.damp(g.current!.position.x, targetX, 4, dt);
    g.current!.position.y = desktop ? 0.15 : 1.24;
    g.current!.rotation.y = THREE.MathUtils.damp(g.current!.rotation.y, x * 0.3, 3, dt);
    g.current!.rotation.x = THREE.MathUtils.damp(g.current!.rotation.x, -y * 0.2, 3, dt);
    g.current!.scale.setScalar(desktop ? Math.min(viewport.width / 9, 1.15) : 0.5);
  });
  return (
    <group ref={g}>
      <Mark buffer={fbo.texture} />
    </group>
  );
}

export default function Scene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <color attach="background" args={["#181822"]} />
      <Backdrop />
      <Rig />
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="rect" intensity={3} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 0.6, 1]} />
          <Lightformer form="rect" intensity={6} color={BRAND_BLUE} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
          <Lightformer form="ring" intensity={2} color="#9564f5" position={[-6, -3, 4]} scale={3} />
        </group>
      </Environment>
    </Canvas>
  );
}

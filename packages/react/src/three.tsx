import React, { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";

export interface ThreeComponentProps {
  color?: string;
  intensity?: number;
  speed?: number;
  size?: number;
  className?: string;
  height?: number;
}

function PauseWhenOffscreen({
  target,
  reduced,
}: {
  target: { current: HTMLDivElement | null };
  reduced: boolean;
}) {
  const setFrameloop = useThree((state) => state.setFrameloop);
  useEffect(() => {
    const node = target.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) =>
        setFrameloop(
          reduced ? "demand" : entries[0]?.isIntersecting ? "always" : "never"
        ),
      { rootMargin: "100px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, setFrameloop, target]);
  return null;
}

function SceneCanvas({
  children,
  height = 280,
  className,
}: {
  children: React.ReactNode;
  height?: number;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <div
      ref={host}
      className={"li-three-stage " + (className ?? "")}
      role="img"
      aria-label="Interactive 3D visual"
      style={{ "--li-scene-height": height + "px" } as CSSProperties}
    >
      {contextLost ? (
        <div className="li-three-fallback">
          <span>3D viewport paused · WebGL context restored automatically when active</span>
        </div>
      ) : (
        <Canvas
          frameloop={reduced ? "demand" : "always"}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 3.25], fov: 40 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            const canvas = gl.domElement;
            const onLost = (event: Event) => {
              event.preventDefault();
              setContextLost(true);
            };
            const onRestored = () => setContextLost(false);
            canvas.addEventListener("webglcontextlost", onLost, false);
            canvas.addEventListener("webglcontextrestored", onRestored, false);
          }}
          fallback={
            <div className="li-three-fallback">
              <span>Interactive 3D preview · WebGL context unavailable in this environment</span>
            </div>
          }
        >
          <PauseWhenOffscreen target={host} reduced={reduced} />
          {/* Three-Point Studio Lighting: Ambient Base + Warm Key + Cool Fill + Crisp Rim */}
          <ambientLight intensity={0.65} color="#e2e8f0" />
          <directionalLight position={[4, 5, 5]} intensity={2.4} color="#f8fafc" />
          <directionalLight position={[-4, -2, 3]} intensity={1.1} color="#38bdf8" />
          <pointLight position={[0, 3, -4]} intensity={2.6} color="#818cf8" />
          {children}
        </Canvas>
      )}
    </div>
  );
}

function Orb({
  color,
  intensity,
  speed,
  size,
}: {
  color: string;
  intensity: number;
  speed: number;
  size: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const target = useRef({ x: 0, y: 0 });
  useFrame((state, delta) => {
    if (mesh.current) {
      const y = target.current.y + state.clock.elapsedTime * speed * 0.24;
      const x =
        target.current.x +
        Math.sin(state.clock.elapsedTime * 0.25 * speed) * 0.1;
      mesh.current.rotation.y = THREE.MathUtils.damp(
        mesh.current.rotation.y,
        y,
        4,
        delta
      );
      mesh.current.rotation.x = THREE.MathUtils.damp(
        mesh.current.rotation.x,
        x,
        4,
        delta
      );
    }
  });
  return (
    <Float speed={0.85 * speed} floatIntensity={0.22} rotationIntensity={0.15}>
      <mesh
        ref={mesh}
        scale={size}
        onPointerMove={(event) => {
          target.current.x = event.point.y * 0.28;
          target.current.y = event.point.x * 0.36;
        }}
        onPointerLeave={() => {
          target.current = { x: 0, y: 0 };
        }}
      >
        <icosahedronGeometry args={[0.88, 12]} />
        <MeshTransmissionMaterial
          color={color}
          transmission={0.96}
          roughness={0.06}
          thickness={0.75}
          ior={1.32}
          chromaticAberration={0.04 * intensity}
          distortion={0.16 * intensity}
          distortionScale={0.28}
          samples={3}
          resolution={256}
        />
      </mesh>
    </Float>
  );
}

export function LiquidOrb({
  color = "#38bdf8",
  intensity = 0.82,
  speed = 1,
  size = 1,
  ...props
}: ThreeComponentProps) {
  return (
    <SceneCanvas height={props.height} className={props.className}>
      <Orb color={color} intensity={intensity} speed={speed} size={size} />
    </SceneCanvas>
  );
}

export type FloatingGeometry =
  | "sphere"
  | "torus"
  | "knot"
  | "icosahedron"
  | "box";

function Geometry({ shape }: { shape: FloatingGeometry }) {
  if (shape === "torus") return <torusGeometry args={[0.72, 0.24, 24, 96]} />;
  if (shape === "knot")
    return <torusKnotGeometry args={[0.56, 0.18, 110, 18]} />;
  if (shape === "icosahedron") return <icosahedronGeometry args={[0.86, 1]} />;
  if (shape === "box") return <boxGeometry args={[1.15, 1.15, 1.15, 4, 4, 4]} />;
  return <sphereGeometry args={[0.82, 48, 32]} />;
}

export interface FloatingObjectProps extends ThreeComponentProps {
  shape?: FloatingGeometry;
  metalness?: number;
  roughness?: number;
}

function FloatingMesh({
  color,
  speed,
  size,
  shape,
  metalness,
  roughness,
}: Required<
  Pick<
    FloatingObjectProps,
    "color" | "speed" | "size" | "shape" | "metalness" | "roughness"
  >
>) {
  const ref = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed * 0.36 + pointer.current.x * 0.02;
      ref.current.rotation.x += delta * speed * 0.15 + pointer.current.y * 0.02;
    }
  });
  return (
    <Float speed={0.75 * speed} floatIntensity={0.22} rotationIntensity={0.18}>
      <mesh
        ref={ref}
        scale={size}
        onPointerMove={(event) => {
          pointer.current.x = event.point.x;
          pointer.current.y = event.point.y;
        }}
        onPointerLeave={() => {
          pointer.current = { x: 0, y: 0 };
        }}
      >
        <Geometry shape={shape} />
        <meshPhysicalMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          clearcoat={1}
          clearcoatRoughness={0.08}
          reflectivity={0.9}
        />
      </mesh>
    </Float>
  );
}

export function FloatingObject({
  color = "#818cf8",
  intensity = 0.78,
  speed = 1,
  size = 1,
  shape = "knot",
  metalness = 0.32,
  roughness = 0.14,
  ...props
}: FloatingObjectProps) {
  return (
    <SceneCanvas height={props.height} className={props.className}>
      <FloatingMesh
        color={color}
        speed={speed}
        size={size}
        shape={shape}
        metalness={metalness}
        roughness={Math.max(0.04, roughness + (1 - intensity) * 0.15)}
      />
    </SceneCanvas>
  );
}

export type MorphShape = "sphere" | "cube" | "diamond";

function MorphMesh({
  color,
  speed,
  intensity,
  shape,
  size,
}: {
  color: string;
  speed: number;
  intensity: number;
  shape: MorphShape;
  size: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.SphereGeometry(0.82, 40, 28), []);
  const base = useMemo(
    () => Float32Array.from(geometry.attributes.position.array),
    [geometry]
  );
  const currentPower = useRef(2);
  const targetPower = shape === "cube" ? 10 : shape === "diamond" ? 1.18 : 2;
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, delta) => {
    currentPower.current +=
      (targetPower - currentPower.current) * Math.min(1, delta * 3.2);
    const power = currentPower.current;
    const attr = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < base.length; i += 3) {
      const x = base[i];
      const y = base[i + 1];
      const z = base[i + 2];
      const norm =
        Math.pow(
          Math.pow(Math.abs(x), power) +
            Math.pow(Math.abs(y), power) +
            Math.pow(Math.abs(z), power),
          1 / power
        ) || 1;
      attr.array[i] = (x / norm) * 0.82;
      attr.array[i + 1] = (y / norm) * 0.82;
      attr.array[i + 2] = (z / norm) * 0.82;
    }
    attr.needsUpdate = true;
    geometry.computeVertexNormals();
    if (mesh.current) {
      mesh.current.rotation.y += delta * speed * 0.3;
      mesh.current.rotation.x += delta * speed * 0.14;
    }
  });
  return (
    <mesh ref={mesh} geometry={geometry} scale={size}>
      <meshPhysicalMaterial
        color={color}
        metalness={0.22}
        roughness={0.14 + (1 - intensity) * 0.18}
        clearcoat={1}
        clearcoatRoughness={0.08}
      />
    </mesh>
  );
}

export interface MorphingShapeProps extends ThreeComponentProps {
  shape?: MorphShape;
}

export function MorphingShape({
  color = "#38bdf8",
  intensity = 0.82,
  speed = 1,
  size = 1,
  shape = "cube",
  ...props
}: MorphingShapeProps) {
  return (
    <SceneCanvas height={props.height} className={props.className}>
      <MorphMesh
        color={color}
        speed={speed}
        intensity={intensity}
        shape={shape}
        size={size}
      />
    </SceneCanvas>
  );
}


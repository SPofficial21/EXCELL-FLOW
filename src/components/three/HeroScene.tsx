import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { Float, MeshDistortMaterial, RoundedBox, Stars } from "@react-three/drei";
import type { Group, Mesh } from "three";

import { useResolvedTheme } from "@/hooks/use-resolved-theme";

type Palette = {
  core: string;
  cell: string;
  cellAccent: string;
  ring: string;
  key: number;
};

const LIGHT_PALETTE: Palette = {
  core: "#6d3df5",
  cell: "#c9c4ff",
  cellAccent: "#22b573",
  ring: "#8b5cf6",
  key: 0,
};

const DARK_PALETTE: Palette = {
  core: "#8b5cf6",
  cell: "#4c3f9e",
  cellAccent: "#2ee59d",
  ring: "#a78bfa",
  key: 1,
};

function DataCore({ palette }: { palette: Palette }) {
  const mesh = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.35;
    mesh.current.rotation.x = Math.sin(t * 0.25) * 0.25;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.9}>
      <mesh ref={mesh} castShadow>
        <icosahedronGeometry args={[1.15, 6]} />
        <MeshDistortMaterial
          color={palette.core}
          distort={0.38}
          speed={2.1}
          roughness={0.18}
          metalness={0.55}
        />
      </mesh>
    </Float>
  );
}

type CellProps = {
  palette: Palette;
  index: number;
  position: [number, number, number];
  clean: boolean;
};

function DataCell({ palette, index, position, clean }: CellProps) {
  const mesh = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.position.y = position[1] + Math.sin(t * 1.1 + index * 0.55) * 0.14;
    mesh.current.rotation.z = clean ? 0 : Math.sin(t * 0.8 + index) * 0.2;
  });

  return (
    <RoundedBox ref={mesh} args={[0.82, 0.34, 0.14]} radius={0.06} smoothness={4} position={position}>
      <meshStandardMaterial
        color={clean ? palette.cellAccent : palette.cell}
        roughness={0.3}
        metalness={0.45}
        emissive={clean ? palette.cellAccent : palette.core}
        emissiveIntensity={clean ? 0.32 : 0.12}
      />
    </RoundedBox>
  );
}

/**
 * Tracks the pointer on `window` rather than through R3F's event manager: the
 * canvas is `pointer-events-none` so it never steals clicks from the hero CTAs.
 */
function useWindowPointer() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return pointer;
}

function SpreadsheetSwarm({ palette }: { palette: Palette }) {
  const group = useRef<Group>(null);
  const pointer = useWindowPointer();

  const cells = useMemo(() => {
    const rows = 4;
    const cols = 3;
    const out: { position: [number, number, number]; clean: boolean }[] = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        out.push({
          position: [(c - (cols - 1) / 2) * 1.05, ((rows - 1) / 2 - r) * 0.52, 0],
          clean: (r + c) % 3 === 0,
        });
      }
    }
    return out;
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.3) * 0.35 + pointer.current.x * 0.35;
    group.current.rotation.x = -pointer.current.y * 0.22;
  });

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.7}>
        <group position={[-2.6, 0.1, -0.4]} rotation={[0.12, 0.55, 0.05]}>
          {cells.map((cell, index) => (
            <DataCell
              key={`left-${index}`}
              palette={palette}
              index={index}
              position={cell.position}
              clean={false}
            />
          ))}
        </group>
      </Float>

      <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.6}>
        <group position={[2.6, 0.1, -0.4]} rotation={[-0.1, -0.55, -0.03]}>
          {cells.map((cell, index) => (
            <DataCell
              key={`right-${index}`}
              palette={palette}
              index={index}
              position={cell.position}
              clean={cell.clean || index % 2 === 0}
            />
          ))}
        </group>
      </Float>
    </group>
  );
}

function OrbitRing({ palette, radius, tilt }: { palette: Palette; radius: number; tilt: number }) {
  const ring = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ring.current) return;
    ring.current.rotation.z = clock.getElapsedTime() * 0.25;
  });

  const rotation: ThreeElements["mesh"]["rotation"] = [tilt, 0.4, 0];

  return (
    <mesh ref={ring} rotation={rotation}>
      <torusGeometry args={[radius, 0.012, 16, 128]} />
      <meshBasicMaterial color={palette.ring} transparent opacity={0.55} />
    </mesh>
  );
}

function Scene({ palette, isDark }: { palette: Palette; isDark: boolean }) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.5 : 0.85} />
      <directionalLight position={[4, 5, 6]} intensity={isDark ? 1.4 : 1.8} />
      <pointLight position={[-5, -3, -4]} intensity={isDark ? 26 : 14} color={palette.ring} />
      <DataCore palette={palette} />
      <OrbitRing palette={palette} radius={1.9} tilt={1.15} />
      <OrbitRing palette={palette} radius={2.35} tilt={-0.9} />
      <SpreadsheetSwarm palette={palette} />
      {isDark && <Stars radius={40} depth={28} count={900} factor={3} saturation={0} fade speed={0.6} />}
    </>
  );
}

export function HeroScene({ className }: { className?: string }) {
  const { isDark } = useResolvedTheme();
  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;

  return (
    <div className={className} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 45 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene key={palette.key} palette={palette} isDark={isDark} />
        </Suspense>
      </Canvas>
    </div>
  );
}

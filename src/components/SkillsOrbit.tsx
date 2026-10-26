import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { skillGroups } from "@/data/content";
import { settings } from "@/lib/store";

const GROUP_COLORS = ["#9b7bff", "#4fe3f0", "#ffb46b", "#7fa8ff", "#c79bff", "#6ff0c0"];
const EGG_COLORS = ["#ff5fa2", "#c6ff5f", "#ffe45f", "#ff8a5f", "#5fffe0", "#ff5fe9"];

type Drag = { rot: number; vel: number };

function Tile({ label, position, color }: { label: string; position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  useFrame((_, dt) => {
    const m = ref.current;
    if (!m) return;
    const target = hover ? 1.8 : 1;
    const s = m.scale.x + (target - m.scale.x) * (1 - Math.exp(-10 * Math.min(dt, 0.05)));
    m.scale.setScalar(s);
    m.rotation.y += dt * 0.6;
  });
  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[0.32, 0.32, 0.06]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hover ? 1.2 : 0.45} roughness={0.3} metalness={0.4} />
      {hover && (
        <Html center distanceFactor={9} position={[0, 0.45, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <span className="whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 font-mono text-sm text-popover-foreground shadow-lg">
            {label}
          </span>
        </Html>
      )}
    </mesh>
  );
}

function ClusterBadge({ name }: { name: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 140;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, 512, 140);

    // Dark glass pill background
    ctx.fillStyle = "rgba(18, 14, 38, 0.92)";
    ctx.strokeStyle = "rgba(155, 123, 255, 0.5)";
    ctx.lineWidth = 6;

    const x = 24, y = 16, w = 464, h = 108, r = 54;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    ctx.stroke();

    // Category heading text
    ctx.font = "bold 40px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name.toUpperCase(), 256, 72);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [name]);

  if (!texture) return null;

  return (
    <sprite position={[0, 1.45, 0]} scale={[1.85, 0.51, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

function Clusters({ drag, egg }: { drag: React.MutableRefObject<Drag>; egg: boolean }) {
  const root = useRef<THREE.Group>(null);
  const layout = useMemo(() => {
    return skillGroups.map((g, gi) => {
      const a = (gi / skillGroups.length) * Math.PI * 2;
      const radius = 3.2;
      const center: [number, number, number] = [
        Math.cos(a) * radius,
        gi % 2 ? 0.5 : -0.5,
        Math.sin(a) * radius,
      ];
      const tiles = g.skills.map((s, si) => {
        const phi = Math.acos(1 - (2 * (si + 0.5)) / g.skills.length);
        const th = Math.PI * (1 + Math.sqrt(5)) * si;
        const r = 0.85;
        return {
          label: s,
          pos: [
            Math.sin(phi) * Math.cos(th) * r,
            Math.cos(phi) * r,
            Math.sin(phi) * Math.sin(th) * r,
          ] as [number, number, number],
        };
      });
      return { name: g.name, center, tiles };
    });
  }, []);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    const d = drag.current;
    d.rot += d.vel;
    d.vel *= Math.exp(-4 * dt);
    if (root.current) root.current.rotation.y = d.rot + performance.now() * 0.00008;
  });

  const palette = egg ? EGG_COLORS : GROUP_COLORS;
  return (
    <group ref={root} position={[0, 0.2, 0]}>
      {layout.map((g, gi) => (
        <group key={g.name} position={g.center}>
          <ClusterBadge name={g.name} />
          {g.tiles.map((t) => (
            <Tile key={t.label} label={t.label} position={t.pos} color={palette[gi % palette.length]!} />
          ))}
        </group>
      ))}
    </group>
  );
}

export default function SkillsOrbit() {
  const drag = useRef<Drag>({ rot: 0, vel: 0 });
  const start = useRef<{ x: number; y: number; dragging: boolean; locked: boolean } | null>(null);
  const [egg, setEgg] = useState(settings.get().egg);
  const [visible, setVisible] = useState(true);

  useEffect(() => settings.subscribe(() => setEgg(settings.get().egg)), []);
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div
      className="relative h-[440px] w-full select-none md:h-[540px]"
      style={{ touchAction: "pan-y" }}
      onPointerDown={(e) => { start.current = { x: e.clientX, y: e.clientY, dragging: false, locked: false }; }}
      onPointerMove={(e) => {
        const s = start.current;
        if (!s || s.locked) return;
        const dx = e.clientX - s.x, dy = e.clientY - s.y;
        if (!s.dragging) {
          if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { s.locked = true; return; }
          if (Math.abs(dx) > 6) s.dragging = true; else return;
        }
        drag.current.vel = dx * 0.0025;
        s.x = e.clientX; s.y = e.clientY;
      }}
      onPointerUp={() => { start.current = null; }}
      onPointerCancel={() => { start.current = null; }}
      onPointerLeave={() => { start.current = null; }}
      role="img"
      aria-label="Interactive 3D map of skill clusters. Drag sideways to rotate."
    >
      <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 2]} camera={{ position: [0, 1.4, window.innerWidth < 640 ? 13.5 : 8.8], fov: 48 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 5, 6]} intensity={40} />
        <pointLight position={[-5, -3, 4]} intensity={20} color="#4fe3f0" />
        <Clusters drag={drag} egg={egg} />
      </Canvas>
      <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Hover a tile · drag sideways to rotate
      </p>
    </div>
  );
}

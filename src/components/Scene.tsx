// @ts-nocheck -- hot per-frame typed-array math; strict index checks add noise here.
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { scrollState, settings } from "@/lib/store";
import heroAsset from "@/assets/hero-portrait.png.asset.json";

const IMG_ASPECT = 1730 / 909;

// Hero portrait woven into the scene: a textured plane behind the node cloud,
// kept slightly left-of-frame so the right side stays clear for the headline.
function Portrait() {
  const tex = useMemo(() => {
    const t = new THREE.TextureLoader().load(heroAsset.url);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    const s = Math.max(0, Math.min(5, scrollState.section));
    const vis = Math.max(0, 1 - s / 0.9);
    const m = meshRef.current, mat = matRef.current;
    if (!m || !mat) return;
    const k = 1 - Math.exp(-4 * dt);
    mat.opacity += (vis - mat.opacity) * k;
    m.visible = mat.opacity > 0.01;
    const dist = 21; // camera z=12, plane z=-9
    const cam = state.camera as THREE.PerspectiveCamera;
    const fh = 2 * Math.tan((cam.fov * Math.PI) / 360) * dist;
    const fw = fh * state.viewport.aspect;
    const W = Math.max(fw, fh * IMG_ASPECT);
    m.scale.set(W, W / IMG_ASPECT, 1);
    // keep the subject just left of centre, but never let the plane uncover a screen edge
    const fc = 0.3;
    const x0 = Math.min(W * (0.5 - fc), (W - fw) / 2);
    m.position.x += (x0 + state.pointer.x * 0.5 - m.position.x) * k;
    m.position.y += (state.pointer.y * 0.3 - m.position.y) * k;
  });
  return (
    <mesh ref={meshRef} position={[0, 0, -9]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial ref={matRef} map={tex} transparent opacity={0} fog={false} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

const PALETTES = {
  normal: { a: new THREE.Color("#9b7bff"), b: new THREE.Color("#4fe3f0"), warm: new THREE.Color("#ffb46b") },
  egg: { a: new THREE.Color("#ff5fa2"), b: new THREE.Color("#c6ff5f"), warm: new THREE.Color("#ffe45f") },
};

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildTargets(n: number) {
  const r = rng(7);
  const make = () => new Float32Array(n * 3);
  const cloud = make(), ring = make(), clusters = make(), grid = make(), path = make(), field = make();
  const centers = [
    [-6, 2.5, -2], [0, 3.5, -4], [6, 2.5, -2], [-4, -2.5, -1], [4, -2.5, -1], [0, -1, 1],
  ];
  for (let i = 0; i < n; i++) {
    const k = i * 3;
    // cloud: spherical shell
    const u = r() * 2 - 1, th = r() * Math.PI * 2, rad = 3.5 + r() * 6;
    const s = Math.sqrt(1 - u * u);
    cloud[k] = s * Math.cos(th) * rad; cloud[k + 1] = u * rad * 0.7; cloud[k + 2] = s * Math.sin(th) * rad - 2;
    // ring
    const a = (i / n) * Math.PI * 2;
    const rr = 6 + (r() - 0.5) * 1.6;
    ring[k] = Math.cos(a) * rr; ring[k + 1] = Math.sin(a) * rr * 0.6 + (r() - 0.5) * 0.6; ring[k + 2] = (r() - 0.5) * 2 - 2;
    // clusters
    const c = centers[i % centers.length]!;
    const cr = 1.6 * Math.cbrt(r());
    const cu = r() * 2 - 1, ct = r() * Math.PI * 2, cs = Math.sqrt(1 - cu * cu);
    clusters[k] = c[0] + cs * Math.cos(ct) * cr; clusters[k + 1] = c[1] + cu * cr; clusters[k + 2] = c[2] + cs * Math.sin(ct) * cr;
    // depth grid
    grid[k] = (r() - 0.5) * 22; grid[k + 1] = (r() - 0.5) * 11; grid[k + 2] = -2 - r() * 14;
    // helix path
    const t = i / n;
    path[k] = Math.sin(t * 14) * 3 + (r() - 0.5) * 0.8;
    path[k + 1] = Math.cos(t * 14) * 1.6 + (r() - 0.5) * 0.8;
    path[k + 2] = 6 - t * 40;
    // calm field
    field[k] = (r() - 0.5) * 34; field[k + 1] = (r() - 0.5) * 20; field[k + 2] = -4 - r() * 18;
  }
  return { list: [cloud, ring, clusters, grid, path, field], cloud };
}

function makeDotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.3, "rgba(255,255,255,0.6)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const smooth = (x: number) => x * x * (3 - 2 * x);

function Network({ n }: { n: number }) {
  const { list, cloud } = useMemo(() => buildTargets(n), [n]);
  const current = useMemo(() => new Float32Array(cloud), [cloud]);
  const colors = useMemo(() => new Float32Array(n * 3), [n]);
  const tex = useMemo(() => makeDotTexture(), []);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Group>(null);
  const orbMat = useRef<THREE.MeshBasicMaterial>(null);
  const innerMat = useRef<THREE.MeshBasicMaterial>(null);
  const pathMat = useRef<THREE.LineBasicMaterial>(null);
  const lineMat = useRef<THREE.LineBasicMaterial>(null);
  const eggRef = useRef<boolean | null>(null);

  // neighbour pairs from the cloud layout
  const pairs = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < n; i++) {
      let best = [-1, -1], bd = [Infinity, Infinity];
      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const dx = cloud[i * 3] - cloud[j * 3], dy = cloud[i * 3 + 1] - cloud[j * 3 + 1], dz = cloud[i * 3 + 2] - cloud[j * 3 + 2];
        const d = dx * dx + dy * dy + dz * dz;
        if (d < bd[0]) { bd = [d, bd[0]]; best = [j, best[0]]; } else if (d < bd[1]) { bd[1] = d; best[1] = j; }
      }
      if (best[0] > i) out.push(i, best[0]);
      if (best[1] > i) out.push(i, best[1]);
    }
    return new Uint32Array(out);
  }, [n, cloud]);
  const linePos = useMemo(() => new Float32Array(pairs.length * 3), [pairs]);

  const pathGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 300; i++) {
      const t = i / 300;
      pts.push(new THREE.Vector3(Math.sin(t * 14) * 3, Math.cos(t * 14) * 1.6, 6 - t * 40));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  const mouseWorld = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    const s = Math.max(0, Math.min(5, scrollState.section));
    const i0 = Math.min(4, Math.floor(s));
    const f = smooth(s - i0);
    const A = list[i0]!, B = list[i0 + 1]!;
    const k = 1 - Math.exp(-3 * dt);
    const t = state.clock.elapsedTime;

    // mouse in world (approx, z=0 plane)
    const vp = state.viewport;
    mouseWorld.set((state.pointer.x * vp.width) / 2, (state.pointer.y * vp.height) / 2, 0);
    const g = groupRef.current;
    const gz = g ? g.position.z : 0;
    const gry = g ? g.rotation.y : 0;
    const cos = Math.cos(-gry), sin = Math.sin(-gry);
    const mx = mouseWorld.x * cos + 0 * sin, mz = -mouseWorld.x * sin - gz;
    const my = mouseWorld.y;

    for (let i = 0; i < n; i++) {
      const j = i * 3;
      let tx = A[j] + (B[j] - A[j]) * f;
      let ty = A[j + 1] + (B[j + 1] - A[j + 1]) * f;
      const tz = A[j + 2] + (B[j + 2] - A[j + 2]) * f;
      ty += Math.sin(t * 0.6 + i) * 0.08;
      const dx = current[j] - mx, dy = current[j + 1] - my, dz = current[j + 2] - mz;
      const d2 = dx * dx + dy * dy + dz * dz * 0.2;
      if (d2 < 6) {
        const push = (1 - d2 / 6) * 1.4;
        const d = Math.sqrt(d2) || 1;
        tx += (dx / d) * push;
        ty += (dy / d) * push;
      }
      current[j] += (tx - current[j]) * k;
      current[j + 1] += (ty - current[j + 1]) * k;
      current[j + 2] += (tz - current[j + 2]) * k;
    }

    // palette
    const egg = settings.get().egg;
    if (eggRef.current !== egg) {
      eggRef.current = egg;
      const p = egg ? PALETTES.egg : PALETTES.normal;
      const tmp = new THREE.Color();
      for (let i = 0; i < n; i++) {
        tmp.copy(p.a).lerp(p.b, (i % 11) / 10);
        if (i % 29 === 0) tmp.copy(p.warm);
        colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b;
      }
      const cAttr = pointsRef.current?.geometry.getAttribute("color");
      if (cAttr) cAttr.needsUpdate = true;
      orbMat.current?.color.copy(p.a);
      innerMat.current?.color.copy(p.b);
      pathMat.current?.color.copy(p.b);
      lineMat.current?.color.copy(p.a);
    }

    const pAttr = pointsRef.current?.geometry.getAttribute("position");
    if (pAttr) pAttr.needsUpdate = true;

    // lines: hide long segments
    for (let p = 0; p < pairs.length; p += 2) {
      const a = pairs[p] * 3, b = pairs[p + 1] * 3, o = p * 3;
      const dx = current[a] - current[b], dy = current[a + 1] - current[b + 1], dz = current[a + 2] - current[b + 2];
      const ok = dx * dx + dy * dy + dz * dz < 5.5;
      linePos[o] = current[a]; linePos[o + 1] = current[a + 1]; linePos[o + 2] = current[a + 2];
      linePos[o + 3] = ok ? current[b] : current[a];
      linePos[o + 4] = ok ? current[b + 1] : current[a + 1];
      linePos[o + 5] = ok ? current[b + 2] : current[a + 2];
    }
    const lAttr = linesRef.current?.geometry.getAttribute("position");
    if (lAttr) lAttr.needsUpdate = true;
    if (lineMat.current) lineMat.current.opacity = 0.22 - Math.max(0, s - 4) * 0.12;

    // group motion: journey fly-through bump
    if (g) {
      g.visible = s >= 0.5;
      const jl = Math.max(0, Math.min(1.5, s - 3.5)) / 1.5;
      g.position.z = Math.sin(Math.PI * jl) * 22;
      g.rotation.y += dt * (s > 4.5 ? 0.01 : 0.04);
    }

    // orb
    const orb = orbRef.current;
    if (orb) {
      const vis = Math.max(0, 1 - s * 1.4);
      orb.visible = s >= 0.5 && vis > 0.01;
      orb.scale.setScalar(0.4 + vis * 0.6);
      orb.rotation.x += dt * 0.15;
      orb.rotation.y += dt * 0.22;
      const ox = vp.width * 0.3 + state.pointer.x * 1.2;
      const oy = vp.height * 0.26 + state.pointer.y * 0.8;
      orb.position.x += (ox - orb.position.x) * k;
      orb.position.y += (oy - orb.position.y) * k;
      orb.scale.setScalar((0.4 + vis * 0.6) * 0.75);
      if (orbMat.current) orbMat.current.opacity = 0.4 * vis;
      if (innerMat.current) innerMat.current.opacity = 0.35 * vis;
    }
    if (pathMat.current) {
      const pv = Math.max(0, 1 - Math.abs(s - 4) * 1.2);
      pathMat.current.opacity = pv * 0.8;
    }

    // camera parallax
    const cam = state.camera;
    cam.position.x += (state.pointer.x * 0.9 - cam.position.x) * k;
    cam.position.y += (state.pointer.y * 0.6 - cam.position.y) * k;
    cam.lookAt(0, 0, -2);
  });

  return (
    <>
      <group ref={groupRef} visible={false}>
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[current, 3]} />
            <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.22}
            map={tex}
            vertexColors
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
          </bufferGeometry>
          <lineBasicMaterial ref={lineMat} transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
        </lineSegments>
        <lineSegments geometry={pathGeo}>
          <lineBasicMaterial ref={pathMat} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </lineSegments>
      </group>
      <group ref={orbRef} position={[3.2, 0, 0]} visible={false}>
        <mesh>
          <icosahedronGeometry args={[2.4, 1]} />
          <meshBasicMaterial ref={orbMat} wireframe transparent opacity={0.55} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.3, 0]} />
          <meshBasicMaterial ref={innerMat} wireframe transparent opacity={0.35} />
        </mesh>
      </group>
    </>
  );
}

export default function Scene() {
  const [visible, setVisible] = useState(true);
  const [n] = useState(() => (window.innerWidth < 768 ? 260 : 650));

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
      >
        <fog attach="fog" args={["#120d26", 10, 38]} />
        <Network n={n} />
        <Portrait />
      </Canvas>
    </div>
  );
}

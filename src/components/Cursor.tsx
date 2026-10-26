import { useEffect, useRef } from "react";

/** Custom cursor + glow trail. Mounted only for fine pointers with motion allowed. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("has-custom-cursor");
    let x = -100, y = -100, rx = x, ry = y, raf = 0, hot = false;
    const pts: { x: number; y: number }[] = [];
    const c = trail.current!, ctx = c.getContext("2d")!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => { c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      const t = e.target as HTMLElement | null;
      hot = !!t?.closest("a,button,[data-magnetic],input,textarea,[role=button]");
    };
    const tick = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) scale(${hot ? 1.8 : 1})`;
      pts.push({ x: rx, y: ry });
      if (pts.length > 16) pts.shift();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]!, a = i / pts.length;
        ctx.fillStyle = `rgba(150,120,255,${a * 0.18})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3 + a * 10, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", move);
    window.addEventListener("resize", resize);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
      <canvas ref={trail} className="absolute inset-0 h-full w-full" />
      <div ref={ring} className="absolute -left-4 -top-4 h-8 w-8 rounded-full border border-accent transition-[scale] duration-200" />
      <div ref={dot} className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-accent" />
    </div>
  );
}

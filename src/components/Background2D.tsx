import { useEffect, useRef } from "react";
import { settings } from "@/lib/store";

/** Lightweight 2D animated background for calm mode / low-power devices. */
export default function Background2D({ still }: { still: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const count = window.innerWidth < 768 ? 45 : 90;
    const pts = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.00012, vy: (Math.random() - 0.5) * 0.00012,
    }));
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      const egg = settings.get().egg;
      const a = egg ? "255,95,162" : "155,123,255";
      const b = egg ? "198,255,95" : "79,227,240";
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!still) {
          p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1;
        }
      }
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]!;
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j]!;
          const dx = (p.x - q.x) * w, dy = (p.y - q.y) * h;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.strokeStyle = `rgba(${a},${0.18 * (1 - d / 130)})`;
            ctx.beginPath(); ctx.moveTo(p.x * w, p.y * h); ctx.lineTo(q.x * w, q.y * h); ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${i % 3 ? a : b},0.8)`;
        ctx.beginPath(); ctx.arc(p.x * w, p.y * h, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    resize();
    draw();
    const unsub = settings.subscribe(() => { if (still) draw(); });
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); unsub(); };
  }, [still]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}

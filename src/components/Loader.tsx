import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Loader() {
  const [p, setP] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => {
      const v = Math.min(100, ((t - t0) / 1100) * 100);
      setP(v);
      if (v < 100) raf = requestAnimationFrame(step); else setTimeout(() => setDone(true), 150);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-background" role="status" aria-label="Loading">
          <p className="font-display text-3xl font-bold text-foreground">Adithya<span className="text-accent">.</span></p>
          <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-accent" style={{ width: `${p}%` }} />
          </div>
          <p className="mt-3 font-mono text-sm text-muted-foreground">{Math.round(p)}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

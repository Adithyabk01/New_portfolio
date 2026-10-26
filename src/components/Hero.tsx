import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { profile } from "@/data/content";
import { scrollToSection, useSettings, isCalm } from "@/lib/store";
import { Magnetic, btnGhost, btnPrimary } from "./ui-bits";

export default function Hero() {
  const [i, setI] = useState(0);
  const calm = isCalm(useSettings());
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="home" className="relative flex min-h-screen items-center px-5 pt-24 md:px-10">
      {/* readability scrim over the hero photo (right side carries the headline) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-gradient-to-l from-background/85 via-background/35 to-transparent md:block" />
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="max-w-3xl text-panel p-6 md:ml-auto md:bg-transparent md:p-0 md:backdrop-blur-none">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent">Portfolio · 2026</p>
          <h1 className="mt-4 text-5xl font-extrabold leading-[0.95] text-foreground sm:text-6xl md:text-7xl">
            Hi, I'm <span className="text-gradient whitespace-nowrap">{profile.name}</span>
          </h1>
          <div className="mt-5 min-h-10 overflow-hidden text-2xl font-semibold text-foreground md:text-3xl" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p
                key={i}
                initial={calm ? false : { y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={calm ? {} : { y: -30, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {profile.roles[i]}
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">{profile.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic><button className={btnPrimary} onClick={() => scrollToSection("projects")}>View Projects</button></Magnetic>
            <Magnetic><button className={btnGhost} onClick={() => scrollToSection("contact")}>Get in Touch</button></Magnetic>
          </div>
        </div>
      </div>
      <button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent"
      >
        Scroll or drag to explore
        <ArrowDown className={`h-4 w-4 ${calm ? "" : "animate-bounce"}`} />
      </button>
    </section>
  );
}

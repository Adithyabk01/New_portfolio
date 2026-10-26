import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, ExternalLink, Menu, Sparkles, Waves, X, Box } from "lucide-react";
import { motion, useScroll } from "framer-motion";
import { resumes, sections } from "@/data/content";
import { isCalm, scrollToSection, settings, useSettings } from "@/lib/store";

export function ResumeMenu({ align = "right" }: { align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex min-h-10 items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground glow-primary"
      >
        Resume <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div role="menu" className={`absolute top-12 z-50 w-64 rounded-xl border border-border bg-popover p-2 shadow-2xl ${align === "right" ? "right-0" : "left-0"}`}>
          {resumes.map((r) => (
            <div key={r.href} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 hover:bg-muted">
              <a role="menuitem" href={r.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-popover-foreground hover:text-accent">
                {r.label} <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                role="menuitem"
                href={r.href}
                download
                aria-label={`Download ${r.label}`}
                className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 font-mono text-xs text-popover-foreground hover:border-accent hover:text-accent"
              >
                <Download className="h-3.5 w-3.5" /> PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Nav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const s = useSettings();
  const calm = isCalm(s);
  const { scrollYProgress } = useScroll();

  const go = (id: string) => { setOpen(false); scrollToSection(id); };

  return (
    <>
      <motion.div style={{ scaleX: scrollYProgress }} className="fixed inset-x-0 top-0 z-[55] h-0.5 origin-left bg-accent" />
      <header className="fixed inset-x-0 top-0 z-50">
        <nav className="mx-auto mt-3 flex max-w-6xl items-center justify-between gap-3 rounded-full glass px-4 py-2 md:px-6" aria-label="Main">
          <button onClick={() => go("home")} className="font-display text-lg font-bold text-foreground">
            Adithya<span className="text-accent">.</span>
          </button>
          <ul className="hidden items-center gap-1 lg:flex">
            {sections.map((sec) => (
              <li key={sec.id}>
                <button
                  onClick={() => go(sec.id)}
                  aria-current={active === sec.id ? "true" : undefined}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${active === sec.id ? "bg-muted text-accent" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {sec.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => settings.set({ egg: !s.egg })}
              aria-pressed={s.egg}
              aria-label="Toggle hidden color mode (H)"
              title="Hidden color mode (H)"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-warm"
            >
              <Sparkles className="h-4 w-4" />
            </button>
            <button
              onClick={() => settings.set({ userCalm: !calm })}
              aria-pressed={calm}
              aria-label={calm ? "Turn on 3D mode" : "Reduce motion (2D mode)"}
              title={calm ? "3D mode" : "Reduce motion / 2D mode"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-accent"
            >
              {calm ? <Box className="h-4 w-4" /> : <Waves className="h-4 w-4" />}
            </button>
            <div className="hidden sm:block"><ResumeMenu /></div>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
        {open && (
          <div className="mx-3 mt-2 rounded-2xl border border-border bg-popover p-3 lg:hidden">
            <ul className="grid gap-1">
              {sections.map((sec) => (
                <li key={sec.id}>
                  <button
                    onClick={() => go(sec.id)}
                    className={`w-full rounded-lg px-3 py-3 text-left text-base ${active === sec.id ? "bg-muted text-accent" : "text-foreground"}`}
                  >
                    {sec.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-2 sm:hidden"><ResumeMenu align="left" /></div>
          </div>
        )}
      </header>
    </>
  );
}

export function SectionDots({ active }: { active: string }) {
  return (
    <nav aria-label="Section navigation" className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:block">
      <ul className="flex flex-col gap-3">
        {sections.map((sec) => (
          <li key={sec.id}>
            <button
              onClick={() => scrollToSection(sec.id)}
              aria-label={`Go to ${sec.label}`}
              aria-current={active === sec.id ? "true" : undefined}
              className="group flex h-6 w-6 items-center justify-center"
            >
              <span className={`block rounded-full transition-all ${active === sec.id ? "h-3 w-3 bg-accent glow-accent" : "h-2 w-2 bg-muted-foreground/60 group-hover:bg-foreground"}`} />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

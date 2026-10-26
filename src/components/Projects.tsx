import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, X, ArrowUpRight } from "lucide-react";
import { featuredProjects, moreProjects, profile, type Category, type Project } from "@/data/content";
import { isCalm, lenisRef, useSettings } from "@/lib/store";
import { Counter } from "./About";
import ProjectLinks from "./ProjectLinks";
import { Magnetic, SectionHeading, btnGhost, useTilt } from "./ui-bits";

const FILTERS: ("All" | Category)[] = ["All", "Full-Stack", "AI/ML", "Data"];

function FeaturedCard({ p, index, onOpen }: { p: Project; index: number; onOpen: () => void }) {
  const tilt = useTilt(7);
  return (
    <article
      className="tilt group relative flex flex-col rounded-3xl border border-border bg-popover/90 p-6 backdrop-blur-xl transition-shadow hover:glow-primary"
      {...tilt}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
        {p.badge && <span className="rounded-full bg-warm px-2.5 py-0.5 font-mono text-xs font-semibold text-primary-foreground">{p.badge}</span>}
      </div>
      <h3 className="mt-3 text-2xl font-bold text-foreground">{p.title}</h3>
      <p className="text-base font-medium text-accent">{p.subtitle}</p>
      <p className="mt-3 flex-1 text-base leading-relaxed text-foreground/90">{p.description}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {p.stack.slice(0, 5).map((t) => (
          <li key={t} className="rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-xs text-foreground">{t}</li>
        ))}
        {p.stack.length > 5 && <li className="px-1 font-mono text-xs text-muted-foreground">+{p.stack.length - 5}</li>}
      </ul>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <ProjectLinks p={p} />
        <button onClick={onOpen} className="inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-sm font-semibold text-foreground hover:text-accent" aria-label={`Open details for ${p.title}`}>
          Details <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function ProjectModal({ p, onClose }: { p: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const calm = isCalm(useSettings());
  useEffect(() => {
    closeRef.current?.focus();
    lenisRef.current?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = prev; lenisRef.current?.start(); };
  }, [onClose]);
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-background/85 p-0 backdrop-blur-md md:items-center md:p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog" aria-modal="true" aria-labelledby="modal-title"
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-border bg-popover p-6 md:rounded-3xl md:p-10"
        data-lenis-prevent
        initial={calm ? false : { y: 60, scale: 0.96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={calm ? {} : { y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} onClick={onClose} aria-label="Close project details" className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground hover:text-accent">
          <X className="h-5 w-5" />
        </button>
        {p.badge && <span className="rounded-full bg-warm px-2.5 py-0.5 font-mono text-xs font-semibold text-primary-foreground">{p.badge}</span>}
        <h3 id="modal-title" className="mt-3 pr-12 text-3xl font-bold text-foreground md:text-5xl">{p.title}</h3>
        <p className="mt-1 text-lg font-medium text-accent">{p.subtitle}</p>
        <p className="mt-5 text-base leading-relaxed text-popover-foreground md:text-lg">{p.description}</p>
        {p.highlights.length > 0 && (
          <>
            <h4 className="mt-8 font-mono text-sm uppercase tracking-widest text-accent">Key highlights</h4>
            <ul className="mt-3 space-y-2">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-base text-popover-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{h}
                </li>
              ))}
            </ul>
          </>
        )}
        <h4 className="mt-8 font-mono text-sm uppercase tracking-widest text-accent">Tech</h4>
        <ul className="mt-3 flex flex-wrap gap-2">
          {p.stack.map((t) => <li key={t} className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-foreground">{t}</li>)}
        </ul>
        <div className="mt-8"><ProjectLinks p={p} /></div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [open, setOpen] = useState<Project | null>(null);
  const match = (p: Project) => filter === "All" || p.categories.includes(filter);
  const featured = useMemo(() => featuredProjects.filter(match), [filter]);
  const more = useMemo(() => moreProjects.filter(match), [filter]);

  return (
    <section id="projects" className="relative px-5 py-28 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="text-panel p-6"><SectionHeading kicker="03 · Projects" title="Things I've built." /></div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`min-h-10 rounded-full border px-4 text-sm font-medium transition ${filter === f ? "border-accent bg-accent text-accent-foreground" : "border-border bg-panel text-foreground hover:border-accent"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 [perspective:1200px] md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <FeaturedCard key={p.id} p={p} index={featuredProjects.indexOf(p)} onOpen={() => setOpen(p)} />
          ))}
        </div>

        {more.length > 0 && (
          <>
            <h3 className="mt-16 inline-block text-panel px-4 py-2 text-2xl font-bold text-foreground">More projects</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {more.map((p) => (
                <article key={p.id} className="flex flex-col rounded-2xl border border-border bg-popover/90 p-5 backdrop-blur-xl">
                  <h4 className="text-lg font-bold text-foreground">{p.title}</h4>
                  <p className="mt-2 flex-1 text-base text-foreground/85">{p.description}</p>
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline" aria-label={`${p.title} on GitHub`}>
                      <Github className="h-4 w-4" /> GitHub
                    </a>
                  )}
                </article>
              ))}
            </div>
          </>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-6 text-panel p-6">
          <div>
            <p className="font-display text-5xl font-bold text-accent"><Counter value={profile.githubRepos} suffix="" /></p>
            <p className="text-sm text-muted-foreground">public GitHub repositories</p>
          </div>
          <Magnetic>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className={btnGhost}>
              <Github className="h-4 w-4" /> View all on GitHub
            </a>
          </Magnetic>
        </div>
      </div>
      <AnimatePresence>{open && <ProjectModal p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}

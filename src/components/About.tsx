import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { MapPin, GraduationCap, School } from "lucide-react";
import { about, profile } from "@/data/content";
import { isCalm, useSettings } from "@/lib/store";
import { SectionHeading, useTilt } from "./ui-bits";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const calm = isCalm(useSettings());
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (calm) { setV(value); return; }
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 1200);
      setV(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, calm]);
  return <span ref={ref}>{v}{suffix}</span>;
}
export { Counter };

export default function About() {
  const tilt = useTilt(10);
  return (
    <section id="about" className="relative px-5 py-28 md:px-10">
      <div className="mx-auto grid max-w-6xl items-start gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div className="tilt mx-auto w-full max-w-sm rounded-3xl glass p-8 glow-primary md:sticky md:top-28" {...tilt}>
          <img src={about.portrait} alt={profile.name} className="aspect-square w-full rounded-2xl object-cover" loading="lazy" />
          <h3 className="mt-6 text-2xl font-bold text-foreground">{profile.name}</h3>
          <p className="text-muted-foreground">Full-Stack · AI/ML</p>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-accent" />{profile.location}</p>
        </div>
        <div className="text-panel p-6 md:p-8">
          <SectionHeading kicker="01 · About" title="Code that ships, models that matter." />
          <p className="flex items-start gap-2 text-base text-foreground md:text-lg">
            <GraduationCap className="mt-1 h-5 w-5 shrink-0 text-accent" />
            <span>
              CS undergraduate — {about.degree} at {about.college}, {about.period}. CGPA {about.cgpa}.
            </span>
          </p>
          {about.paragraphs.map((p) => (
            <p key={p} className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{p}</p>
          ))}
          <dl className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {about.stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-muted/60 p-4">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-4xl font-bold text-accent"><Counter value={s.value} suffix={s.suffix} /></dd>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </dl>

          {about.academicBackground && about.academicBackground.length > 0 && (
            <div className="mt-8 border-t border-border/60 pt-6">
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                <School className="h-4 w-4" /> Academic Background
              </h4>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {about.academicBackground.map((item) => (
                  <div
                    key={item.institution}
                    className="rounded-2xl border border-border/80 bg-muted/50 p-4 backdrop-blur-sm transition-all duration-200 hover:border-accent/40 hover:bg-muted/70"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-sm font-bold text-foreground leading-snug">
                        {item.institution}
                      </h5>
                      <span className="shrink-0 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">
                        {item.score}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-accent/90 italic">
                      {item.degree}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

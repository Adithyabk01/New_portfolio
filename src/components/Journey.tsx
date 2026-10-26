import { Award } from "lucide-react";
import { certifications, journey } from "@/data/content";
import { SectionHeading } from "./ui-bits";

export default function Journey() {
  return (
    <section id="journey" className="relative px-5 py-28 md:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="text-panel inline-block p-6"><SectionHeading kicker="04 · Journey" title="The path so far." /></div>
        <ol className="relative mt-6 space-y-6 border-l-2 border-accent/50 pl-8">
          {journey.map((j) => (
            <li key={j.title} className="relative">
              <span className="absolute -left-[41px] top-5 h-4 w-4 rounded-full border-2 border-accent bg-background glow-accent" aria-hidden />
              <div className="rounded-2xl border border-border bg-popover/90 p-5 backdrop-blur-xl">
                <p className="font-mono text-sm text-accent">{j.date}</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">{j.title}</h3>
                <p className="text-base text-muted-foreground">{j.org}</p>
                {j.detail && <p className="mt-2 text-base text-foreground/90">{j.detail}</p>}
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 rounded-2xl border border-border bg-popover/90 p-6 backdrop-blur-xl">
          <h3 className="flex items-center gap-2 text-xl font-bold text-foreground"><Award className="h-5 w-5 text-warm" /> Certifications</h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {certifications.map((c) => (
              <li key={c} className="flex gap-2 text-base text-foreground/90"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warm" />{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { skillGroups } from "@/data/content";
import { isCalm, useSettings } from "@/lib/store";
import { SectionHeading } from "./ui-bits";

const SkillsOrbit = lazy(() => import("./SkillsOrbit"));

export default function Skills() {
  const s = useSettings();
  const show3D = !isCalm(s) && !s.lowPower;
  return (
    <section id="skills" className="relative px-5 py-28 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-panel inline-block p-6"><SectionHeading kicker="02 · Skills" title="The toolkit." /></div>
        {show3D && (
          <ClientOnly fallback={<div className="h-[420px] md:h-[520px]" />}>
            <Suspense fallback={<div className="h-[420px] md:h-[520px]" />}>
              <SkillsOrbit />
            </Suspense>
          </ClientOnly>
        )}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g) => (
            <div key={g.name} className="rounded-2xl glass p-5">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-accent">{g.name}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.skills.map((sk) => (
                  <li key={sk} className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-foreground">{sk}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

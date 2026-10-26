import { useRef, type ReactNode, type MouseEvent } from "react";
import { useSettings, isCalm } from "@/lib/store";

/** Magnetic hover on fine pointers when motion is allowed. */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const s = useSettings();
  const active = s.finePointer && !isCalm(s);
  const onMove = (e: MouseEvent) => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <span
      ref={ref}
      data-magnetic
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="inline-block transition-transform duration-200 ease-out"
    >
      {children}
    </span>
  );
}

/** Pointer-driven 3D tilt. */
export function useTilt(max = 8) {
  const s = useSettings();
  const active = s.finePointer && !isCalm(s);
  return {
    onMouseMove: (e: MouseEvent<HTMLElement>) => {
      if (!active) return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--ry", `${px * max * 2}deg`);
      el.style.setProperty("--rx", `${-py * max * 2}deg`);
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      e.currentTarget.style.setProperty("--ry", "0deg");
      e.currentTarget.style.setProperty("--rx", "0deg");
    },
  };
}

export const btnPrimary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground glow-primary transition hover:brightness-110";
export const btnGhost =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-panel px-6 py-3 font-medium text-foreground backdrop-blur transition hover:border-accent hover:text-accent";
export const btnSmall =
  "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-border bg-panel px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent";

export function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-sm uppercase tracking-[0.25em] text-accent">{kicker}</p>
      <h2 className="mt-2 text-4xl font-bold text-foreground md:text-6xl">{title}</h2>
    </div>
  );
}

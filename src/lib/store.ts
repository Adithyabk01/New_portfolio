import { useSyncExternalStore } from "react";
import type Lenis from "lenis";

export type Settings = {
  /** User toggle: null = follow system setting. */
  userCalm: boolean | null;
  systemReduced: boolean;
  egg: boolean;
  finePointer: boolean;
  lowPower: boolean;
};

const initial: Settings = { userCalm: null, systemReduced: false, egg: false, finePointer: false, lowPower: false };
let state: Settings = initial;
const subs = new Set<() => void>();

export const settings = {
  get: () => state,
  set(patch: Partial<Settings>) {
    state = { ...state, ...patch };
    subs.forEach((f) => f());
  },
  subscribe(f: () => void) {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
};

export function isCalm(s: Settings) {
  return s.userCalm ?? s.systemReduced;
}

export function useSettings() {
  return useSyncExternalStore(settings.subscribe, settings.get, () => initial);
}

/** Mutable scroll state read by the 3D scene every frame. */
export const scrollState = { section: 0 };

export const lenisRef: { current: Lenis | null } = { current: null };

export const NAV_OFFSET = 72;

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = id === "home" ? 0 : -NAV_OFFSET;
  if (lenisRef.current) {
    lenisRef.current.scrollTo(el, { offset });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: isCalm(state) ? "auto" : "smooth" });
  }
  history.replaceState(null, "", `#${id}`);
}

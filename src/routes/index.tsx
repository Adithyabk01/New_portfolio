import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import Lenis from "lenis";
import { sections } from "@/data/content";
import { isCalm, lenisRef, scrollState, settings, useSettings } from "@/lib/store";
import { getRequestOrigin } from "@/lib/origin.functions";
import Nav, { SectionDots } from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Journey from "@/components/Journey";
import Contact from "@/components/Contact";
import Loader from "@/components/Loader";
import Background2D from "@/components/Background2D";
import Chatbot from "@/components/Chatbot";

const Scene = lazy(() => import("@/components/Scene"));
const Cursor = lazy(() => import("@/components/Cursor"));

const TITLE = "Adithya B K — Full-Stack Developer & AI/ML Engineer";
const DESC =
  "Portfolio of Adithya B K: full-stack platforms and applied AI/ML, NLP & LLM products — Kisan Sethu, RecoverAI, MediRead and more.";

export const Route = createFileRoute("/")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => {
    const img = loaderData ? `${loaderData.origin}/og-image.jpg` : undefined;
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESC },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESC },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: TITLE },
        { name: "twitter:description", content: DESC },
        ...(img
          ? [
              { property: "og:image", content: img },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
              { name: "twitter:image", content: img },
            ]
          : []),
      ],
    };
  },
  component: Index,
});

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function Index() {
  const s = useSettings();
  const calm = isCalm(s);
  const [active, setActive] = useState("home");

  // environment detection
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    const update = () => settings.set({ systemReduced: mq.matches, finePointer: fine.matches });
    settings.set({ lowPower: !hasWebGL() || (navigator.hardwareConcurrency ?? 8) <= 2 });
    update();
    mq.addEventListener("change", update);
    fine.addEventListener("change", update);
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input,textarea")) return;
      if (e.key === "h" || e.key === "H") settings.set({ egg: !settings.get().egg });
    };
    window.addEventListener("keydown", key);
    return () => { mq.removeEventListener("change", update); fine.removeEventListener("change", update); window.removeEventListener("keydown", key); };
  }, []);

  // smooth scroll
  useEffect(() => {
    if (calm) return;
    const lenis = new Lenis({ lerp: 0.1 });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null; };
  }, [calm]);

  // section float + active section
  useEffect(() => {
    const els = sections.map((x) => document.getElementById(x.id)).filter(Boolean) as HTMLElement[];
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.5;
      let idx = 0;
      for (let i = 0; i < els.length; i++) if (els[i]!.offsetTop <= y) idx = i;
      const el = els[idx]!;
      const f = (y - el.offsetTop) / Math.max(1, el.offsetHeight);
      scrollState.section = Math.max(0, Math.min(els.length - 1, idx + f - 0.5));
      const id = sections[idx]!.id;
      setActive((a) => (a === id ? a : id));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  const use3D = !calm && !s.lowPower;

  return (
    <div className="grain relative min-h-screen overflow-x-clip">
      <Loader />
      <ClientOnly fallback={null}>
        {use3D ? (
          <Suspense fallback={<Background2D still />}><Scene /></Suspense>
        ) : (
          <Background2D still={calm} />
        )}
        {s.finePointer && !calm && <Suspense fallback={null}><Cursor /></Suspense>}
      </ClientOnly>
      <Nav active={active} />
      <SectionDots active={active} />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <ClientOnly fallback={null}>
        <Chatbot />
      </ClientOnly>
    </div>
  );
}

"use client";

import{ useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Tech = { name: string; logo: string; color: string };

const techs: Tech[] = [
  { name: "React", logo: "https://cdn.simpleicons.org/react/61DAFB", color: "#61DAFB" },
  { name: "Next.js", logo: "https://cdn.simpleicons.org/nextdotjs/000000", color: "#ffffff" },
  { name: "TypeScript", logo: "https://cdn.simpleicons.org/typescript/3178C6", color: "#3178C6" },
  { name: "Tailwind", logo: "https://cdn.simpleicons.org/tailwindcss/38BDF8", color: "#38BDF8" },
  { name: "GSAP", logo: "https://cdn.simpleicons.org/greensock/88CE02", color: "#88CE02" },
  { name: "Node.js", logo: "https://cdn.simpleicons.org/nodedotjs/5FA04E", color: "#5FA04E" },
  { name: "Vite", logo: "https://cdn.simpleicons.org/vite/646CFF", color: "#646CFF" },
  { name: "Redux", logo: "https://cdn.simpleicons.org/redux/764ABC", color: "#764ABC" },
  { name: "Zustand", logo: "https://cdn.simpleicons.org/zustand/000000", color: "#FFBF69" },
  { name: "GraphQL", logo: "https://cdn.simpleicons.org/graphql/E10098", color: "#E10098" },
  { name: "Jest", logo: "https://cdn.simpleicons.org/jest/C21325", color: "#C21325" },
  { name: "Cypress", logo: "https://cdn.simpleicons.org/cypress/69D3A7", color: "#69D3A7" },
];

export default function StackPage() {
  return (
    <main className="bg-[#0a0a0c] text-white overflow-x-clip">
      <TechSpreadSection />
    </main>
  );
}

function TechSpreadSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop pinned: stacked -> spread constellation (resize safe)
      mm.add("(min-width: 1024px)", () => {
        const stage = stageRef.current!;
        const rect = () => stage.getBoundingClientRect();

        const targets = [
          { x: -0.36, y: -0.22, r: -10 },
          { x: -0.18, y: -0.32, r: -4 },
          { x: 0.04, y: -0.28, r: 3 },
          { x: 0.28, y: -0.22, r: 8 },
          { x: -0.34, y: 0.02, r: -6 },
          { x: -0.12, y: 0.08, r: -2 },
          { x: 0.14, y: 0.1, r: 2 },
          { x: 0.36, y: 0.06, r: 6 },
          { x: -0.28, y: 0.28, r: -4 },
          { x: -0.04, y: 0.26, r: 0 },
          { x: 0.22, y: 0.30, r: 4 },
          { x: 0.42, y: 0.24, r: 10 },
        ];

        gsap.set(cardsRef.current, {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 0.92,
          opacity: 0,
          z: (i: number) => i,
          transformOrigin: "center",
          force3D: true,
        });

        cardsRef.current.forEach((el, i) => {
          gsap.to(el, {
            yPercent: i % 2 === 0 ? 2 : -2,
            duration: 3 + (i % 3),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            force3D: true,
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=160%",
            scrub: 0.3,
            pin: true,
            anticipatePin: 1,
          },
          defaults: { ease: "power1.out" },
        });

        tl.to(cardsRef.current, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.04 }, 0).to(
          cardsRef.current,
          {
            x: (i) => (targets[i] ? targets[i].x * rect().width : 0),
            y: (i) => (targets[i] ? targets[i].y * rect().height : 0),
            rotate: (i) => targets[i]?.r ?? 0,
            duration: 1.2,
            stagger: 0.06,
            force3D: true,
          },
          0.05
        );

        const ro = new ResizeObserver(() => ScrollTrigger.refresh());
        ro.observe(stage);
        return () => ro.disconnect();
      });

      // Mobile / tablet: no pin, grid reveal
      mm.add("(max-width: 1023px)", () => {
        gsap.from(".tech-grid-item", {
          y: 16,
          opacity: 0,
          stagger: 0.06,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          force3D: true,
        });
      });

      // Hover micro-lift
      cardsRef.current.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { yPercent: "-=3", scale: 1.03, duration: 0.25, ease: "power2.out", force3D: true });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { yPercent: "+=3", scale: 1, duration: 0.35, ease: "power2.out", force3D: true });
        });
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      {/* Backdrop glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 h-56 w-[60vw] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24">
        <header className="mb-10 text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-400">Toolkit</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Tech that powers my builds
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
            A curated stack for speed, DX, and delightful UX — animated into place as you scroll.
          </p>
          <div className="mt-6">
            <a href="/hero" className="text-sm text-indigo-400 hover:text-indigo-300 transition">← Back to Hero</a>
          </div>
        </header>

        {/* Desktop: pinned spread stage */}
        <div className="relative hidden h[82vh] lg:h-[82vh] overflow-visible rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-md lg:block">
          <div
            ref={stageRef}
            className="relative h-full w-full rounded-2xl border border-white/10"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.04), rgba(255,255,255,0.02) 50%, transparent 70%)",
            }}
          >
            {techs.map((t, i) => (
              <div
                key={t.name}
                ref={(el) => { if (el) cardsRef.current[i] = el; }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
              >
                <TechCard tech={t} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/tablet grid fallback */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
          {techs.map((t) => (
            <div key={t.name} className="tech-grid-item">
              <TechCard tech={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechCard({ tech }: { tech: Tech }) {
  return (
    <article
      className="group select-none rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl ring-1 ring-white/10 backdrop-blur-md transition hover:bg-white/10 sm:p-4"
      style={{ boxShadow: `0 10px 30px -12px ${hexToRgba(tech.color, 0.35)}` }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black ring-1 ring-black/10">
          <img src={tech.logo} alt={`${tech.name} logo`} className="h-6 w-6" loading="lazy" decoding="async" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{tech.name}</div>
          <div className="text-[11px] text-zinc-400">Core tool</div>
        </div>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out group-hover:duration-300"
          style={{ width: "72%", background: `linear-gradient(90deg, ${tech.color}, rgba(255,255,255,0.6))` }}
        />
      </div>
    </article>
  );
}

function hexToRgba(hex: string, alpha = 1) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/24/outline";

/* ---------- DATA ---------- */
type Tech = {
  name: string;
  logo: string; // simpleicons CDN
  color: string; // accent
};

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

/* ---------- PAGE ---------- */
export default function Landing() {
  return (
    <main className="bg-[#0a0a0c] text-white overflow-x-clip">
      <HeroSection />
      <TechSpreadSection />
    </main>
  );
}

/* ---------- HERO (GSAP, responsive, premium) ---------- */
function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleStrokeRef = useRef<HTMLHeadingElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Reduced motion
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(titleStrokeRef.current, {
          letterSpacing: "0.06em",
          wordSpacing: "0.03em",
          scale: 1,
          yPercent: 0,
        });
        gsap.set(glowRef.current, { opacity: 0.45, filter: "blur(0px)" });
      });

      // Desktop pinned: calm ranges to keep layout tight
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=120%",
            scrub: 0.25,
            pin: true,
            anticipatePin: 1,
          },
          defaults: { ease: "none" },
        });

        tl.to(
          titleStrokeRef.current,
          {
            letterSpacing: "0.16em", // tightened for responsiveness
            wordSpacing: "0.06em",
            scale: 1.03,
            yPercent: -4,
            force3D: true,
          },
          0
        )
          .to(glowRef.current, { opacity: 0.9, filter: "blur(6px)" }, 0)
          .to(raysRef.current, { rotate: 18, force3D: true }, 0)
          .fromTo(
            shimmerRef.current,
            { xPercent: -30, opacity: 0.28 },
            { xPercent: 140, opacity: 0.5 },
            0.06
          );
      });

      // Mobile/tablets: no pin, gentler motion
      mm.add("(max-width: 1023px)", () => {
        gsap.set(titleStrokeRef.current, {
          letterSpacing: "0.08em",
          wordSpacing: "0.04em",
        });

        gsap.to(titleStrokeRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom 45%",
            scrub: 0.25,
          },
          letterSpacing: "0.12em",
          wordSpacing: "0.06em",
          scale: 1.02,
          yPercent: -2,
          ease: "none",
          force3D: true,
        });

        gsap.to(glowRef.current, {
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom 45%", scrub: 0.25 },
          opacity: 0.8,
          filter: "blur(5px)",
        });
      });

      // Tagline + CTAs entrance
      gsap.from(".hero-enter", {
        y: 12,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.25,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[140vh] overflow-x-clip touch-pan-y">
      {/* Background: ambient ring, glow, rays, grain */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl sm:h-56 sm:w-56" />
        <div
          ref={glowRef}
          className="absolute left-1/2 top-[-16%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            opacity: 0.35,
            background:
              "radial-gradient(ellipse at center, rgba(99,102,241,0.25), rgba(168,85,247,0.12) 55%, transparent 70%)",
          }}
        />
        <div
          ref={raysRef}
          className="absolute inset-0 opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        >
          <div className="size-full bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0deg,rgba(255,255,255,0.35)_8deg,transparent_16deg)]" />
        </div>
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      {/* Sticky viewport on desktop */}
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="relative will-change-transform">
            {/* Shimmer */}
            <div
              ref={shimmerRef}
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-[-30%] z-10 w-[40%] rounded-3xl"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
              }}
            />

            {/* Outline-only headline with premium gradient glow */}
            <h1
              ref={titleStrokeRef}
              className="select-none text-balance text-center font-black uppercase leading-[0.86] tracking-tight text-transparent"
              style={{
                WebkitTextStroke: "1.25px rgba(255,255,255,0.78)",
                fontSize: "clamp(40px, 10vw, 128px)",
                // Premium gradient "text shadow" feel (stacked drop-shadows)
                filter:
                  "drop-shadow(0 0 18px rgba(99,102,241,0.35)) drop-shadow(0 0 36px rgba(168,85,247,0.25)) drop-shadow(0 0 68px rgba(236,72,153,0.18))",
              }}
            >
              Hi, I’m Rahul Dev
              <br />
              Front‑End Developer
            </h1>
          </div>

          <p className="hero-enter mx-auto mt-6 max-w-2xl text-center text-base text-zinc-300 sm:text-lg md:text-xl">
            Interfaces that feel fast, look premium, and scale. I craft experiences with clean code, motion, and intent.
          </p>

          <div className="hero-enter mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:shadow-fuchsia-500/25"
            >
              View Work
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur-md transition hover:bg-white/10"
            >
              <PlayIcon className="h-4 w-4 text-white/70" />
              About Me
            </a>
          </div>

          {/* Chips */}
          <div className="pointer-events-none hero-enter absolute left-0 right-0 top-[-56px] mx-auto hidden max-w-6xl justify-between px-4 md:flex">
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md">
              React • Next.js • TypeScript • Tailwind • GSAP
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md">
              Available for freelance — 2025
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- TECH CARDS SPREAD (GSAP spread-on-scroll) ---------- */
function TechSpreadSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop pinned: stacked -> spread constellation (with resize-safe positions)
      mm.add("(min-width: 1024px)", () => {
        const stage = stageRef.current!;
        const rect = () => stage.getBoundingClientRect(); // dynamic for responsiveness

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
          { x: 0.22, y: 0.3, r: 4 },
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

        // Subtle perpetual float
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

        // Scrubbed spread timeline
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

        // Refresh on resize for accurate positions
        const ro = new ResizeObserver(() => {
          ScrollTrigger.refresh();
        });
        ro.observe(stage);

        return () => {
          ro.disconnect();
        };
      });

      // Mobile / tablet: no pin, staggered grid reveal
      mm.add("(max-width: 1023px)", () => {
        gsap.from(".tech-grid-item", {
          y: 16,
          opacity: 0,
          stagger: 0.06,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
          force3D: true,
        });
      });

      // Hover micro-interaction (all sizes)
      cardsRef.current.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { yPercent: "-=3", scale: 1.03, duration: 0.25, ease: "power2.out", force3D: true });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { yPercent: "+=3", scale: 1, duration: 0.35, ease: "power2.out", force3D: true });
        });
      });
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
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Tech that powers my builds
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
            A curated stack for speed, DX, and delightful UX — animated into place as you scroll.
          </p>
        </header>

        {/* Desktop: pinned spread stage */}
        <div className="relative hidden h-[80vh] overflow-visible rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-md lg:block">
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
                ref={(el) => {
                  if (el) cardsRef.current[i] = el;
                }}
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

/* ---------- CARD ---------- */
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

/* ---------- UTILS ---------- */
function hexToRgba(hex: string, alpha = 1) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
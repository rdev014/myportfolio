"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Tech = { name: string; logo: string; color: string; level: number };

const techs: Tech[] = [
  { name: "HTML5", logo: "https://cdn.simpleicons.org/html5/E34F26", color: "#E34F26", level: 0.95 },
  { name: "CSS3", logo: "https://cdn.simpleicons.org/css3/1572B6", color: "#1572B6", level: 0.93 },
  { name: "JavaScript", logo: "https://cdn.simpleicons.org/javascript/F7DF1E", color: "#F7DF1E", level: 0.94 },
  { name: "React", logo: "https://cdn.simpleicons.org/react/61DAFB", color: "#61DAFB", level: 0.92 },
  { name: "Next.js", logo: "https://cdn.simpleicons.org/nextdotjs/ffffff", color: "#FFFFFF", level: 0.9 },
  { name: "TypeScript", logo: "https://cdn.simpleicons.org/typescript/3178C6", color: "#3178C6", level: 0.9 },
  { name: "Tailwind", logo: "https://cdn.simpleicons.org/tailwindcss/38BDF8", color: "#38BDF8", level: 0.9 },
  { name: "Node.js", logo: "https://cdn.simpleicons.org/nodedotjs/5FA04E", color: "#5FA04E", level: 0.86 },
  { name: "GSAP", logo: "https://cdn.simpleicons.org/greensock/88CE02", color: "#88CE02", level: 0.88 },
  { name: "Vite", logo: "https://cdn.simpleicons.org/vite/646CFF", color: "#646CFF", level: 0.87 },
  { name: "Redux", logo: "https://cdn.simpleicons.org/redux/764ABC", color: "#764ABC", level: 0.82 },
  { name: "Zustand", logo: "https://cdn.simpleicons.org/zustand/ffffff", color: "#FFBF69", level: 0.8 },
  { name: "GraphQL", logo: "https://cdn.simpleicons.org/graphql/E10098", color: "#E10098", level: 0.78 },
  { name: "Jest", logo: "https://cdn.simpleicons.org/jest/C21325", color: "#C21325", level: 0.8 },
  { name: "Cypress", logo: "https://cdn.simpleicons.org/cypress/69D3A7", color: "#69D3A7", level: 0.75 },
  { name: "Git", logo: "https://cdn.simpleicons.org/git/F05032", color: "#F05032", level: 0.9 },
];

export default function StackPage() {
  return (
    <main className="bg-[#0b0d10] text-white overflow-x-clip">
      <TechGridSection />
    </main>
  );
}

function TechGridSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".tech-card");

      // Entry reveal: crisp, no float
      gsap.set(cards, { transformPerspective: 800 });
      gsap.from(cards, {
        y: 26,
        opacity: 0,
        scale: 0.98,
        rotateX: -6,
        duration: 0.6,
        ease: "power3.out",
        stagger: { each: 0.055, from: "edges" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#0b0d10]" />

      <div className="mx-auto max-w-6xl px-6 py-24">
        <header className="mb-10 text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-400">Toolkit</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Tech that powers my builds
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
            Responsive 4×4 grid on desktop, smooth reveal, and realistic 3D cards — no floating.
          </p>
        </header>

        {/* Responsive grid: 2 / 3 / 4 columns => 4×4 on desktop */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
        >
          {techs.map((t) => (
            <TechCard key={t.name} tech={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TechCard({ tech }: { tech: Tech }) {
  // Tunables
  const TILT_X = 10; // deg up/down
  const TILT_Y = 14; // deg left/right
  const MAGNET = 6;  // px translate toward cursor

  const handleMove: React.MouseEventHandler<HTMLElement> = (e) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rx = (0.5 - y) * TILT_X;
    const ry = (x - 0.5) * TILT_Y;
    const tx = (x - 0.5) * MAGNET;
    const ty = (y - 0.5) * MAGNET;

    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--tx", `${tx}px`);
    el.style.setProperty("--ty", `${ty}px`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
  };

  const handleEnter: React.MouseEventHandler<HTMLElement> = (e) => {
    const el = e.currentTarget as HTMLElement;
    el.style.setProperty("--scale", "1.012");
  };

  const handleLeave: React.MouseEventHandler<HTMLElement> = (e) => {
    const el = e.currentTarget as HTMLElement;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--tx", `0px`);
    el.style.setProperty("--ty", `0px`);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `50%`);
    el.style.setProperty("--scale", "1");
  };

  const handleDown: React.MouseEventHandler<HTMLElement> = (e) => {
    (e.currentTarget as HTMLElement).style.setProperty("--scale", "0.99");
  };
  const handleUp: React.MouseEventHandler<HTMLElement> = (e) => {
    (e.currentTarget as HTMLElement).style.setProperty("--scale", "1.012");
  };

  return (
    <article
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      className="tech-card group relative isolate w-full select-none rounded-2xl border border-white/10 bg-[#0e1116] p-3 ring-1 ring-white/10 sm:p-4"
      style={{
        transformStyle: "preserve-3d",
        transform:
          "translate3d(var(--tx,0), var(--ty,0), 0) rotateX(var(--rx,0)) rotateY(var(--ry,0)) scale(var(--scale,1))",
        transition: "transform 160ms ease, box-shadow 220ms ease, background-color 220ms ease",
        boxShadow: `
          0 42px 60px -28px rgba(0,0,0,0.65),
          0 16px 30px -16px rgba(0,0,0,0.55),
          0 2px 6px rgba(0,0,0,0.5),
          0 0 0 1px rgba(255,255,255,0.06)
        `,
      }}
    >
      {/* Shadow catcher */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -bottom-6 -top-4 -z-10"
        style={{
          transform: "translate(var(--tx,0), var(--ty,0))",
          background:
            "radial-gradient(60% 50% at 50% 65%, rgba(0,0,0,0.6), rgba(0,0,0,0.28) 45%, transparent 70%)",
          filter: "blur(16px)",
        }}
      />

      {/* Inner bevel + subtle texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.5), inset 0 10px 20px -18px rgba(255,255,255,0.12), inset 0 -16px 24px -24px rgba(0,0,0,0.8)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.055]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.22'/></feComponentTransfer></filter><rect width='180' height='180' filter='url(%23n)' /></svg>\")",
        }}
      />
      {/* Specular highlight follows cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.08), transparent 60%)",
          mixBlendMode: "screen",
        }}
      />

      <div className="flex items-center gap-3" style={{ transformStyle: "preserve-3d" }}>
        <div
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f1319] ring-1 ring-white/10 shadow-inner"
          style={{
            transform: "translateZ(24px)",
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.06),
              inset 0 -2px 10px rgba(0,0,0,0.65),
              0 10px 24px -12px ${hexToRgba(tech.color, 0.45)}
            `,
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0) 45%, rgba(0,0,0,0.28) 100%)",
              mixBlendMode: "screen",
            }}
          />
          <img
            src={tech.logo}
            alt={`${tech.name} logo`}
            className="relative h-6 w-6"
            loading="lazy"
            decoding="async"
            style={{ transform: "translateZ(2px)" }}
          />
        </div>

        <div style={{ transform: "translateZ(16px)" }}>
          <div className="text-sm font-semibold text-white">{tech.name}</div>
          <div className="text-[11px] text-zinc-400">Core tool</div>
        </div>
      </div>

      <div
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]"
        style={{
          transform: "translateZ(8px)",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div
          className="h-full origin-left rounded-full"
          style={{
            width: `${Math.round(tech.level * 100)}%`,
            backgroundColor: hexToRgba(tech.color, 0.9),
            boxShadow: `0 0 22px ${hexToRgba(tech.color, 0.35)}`,
            transition: "width 700ms ease-out",
            position: "relative",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 bottom-0 w-16 opacity-70"
            style={{
              left: "calc(var(--mx,50%) - 2rem)",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
              filter: "blur(2px)",
            }}
          />
        </div>
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
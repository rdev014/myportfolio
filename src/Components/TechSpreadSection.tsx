import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Tech = {
  name: string;
  logo: string;
  color: string;
  category: string;
  level: number; // 0..1 (for the proficiency bar)
};

const techs: Tech[] = [
  // Requested additions
  { name: "HTML5", logo: "https://cdn.simpleicons.org/html5/E34F26", color: "#E34F26", category: "Language", level: 0.96 },
  { name: "CSS3", logo: "https://cdn.simpleicons.org/css3/1572B6", color: "#1572B6", category: "Style", level: 0.94 },
  { name: "JavaScript", logo: "https://cdn.simpleicons.org/javascript/F7DF1E", color: "#F7DF1E", category: "Language", level: 0.94 },
  { name: "Bootstrap", logo: "https://cdn.simpleicons.org/bootstrap/7952B3", color: "#7952B3", category: "Style", level: 0.82 },
  { name: "WordPress", logo: "https://cdn.simpleicons.org/wordpress/21759B", color: "#21759B", category: "CMS", level: 0.8 },
  { name: "Elementor", logo: "https://cdn.simpleicons.org/elementor/92003B", color: "#92003B", category: "CMS", level: 0.78 },
  { name: "GitHub", logo: "https://cdn.simpleicons.org/github/ffffff", color: "#FFFFFF", category: "Tooling", level: 0.9 },
  { name: "Git", logo: "https://cdn.simpleicons.org/git/F05032", color: "#F05032", category: "Tooling", level: 0.6 },

  // Existing stack (refined)
  { name: "React", logo: "https://cdn.simpleicons.org/react/61DAFB", color: "#61DAFB", category: "Framework", level: 0.92 },
  { name: "Next.js", logo: "https://cdn.simpleicons.org/nextdotjs/ffffff", color: "#FFFFFF", category: "Framework", level: 0.9 },
  { name: "TypeScript", logo: "https://cdn.simpleicons.org/typescript/3178C6", color: "#3178C6", category: "Language", level: 0.9 },
  { name: "Tailwind", logo: "https://cdn.simpleicons.org/tailwindcss/38BDF8", color: "#38BDF8", category: "Style", level: 0.9 },
  { name: "GSAP", logo: "https://cdn.simpleicons.org/greensock/88CE02", color: "#88CE02", category: "Animation", level: 0.88 },
  { name: "Node.js", logo: "https://cdn.simpleicons.org/nodedotjs/5FA04E", color: "#5FA04E", category: "Runtime", level: 0.86 },
  { name: "Vite", logo: "https://cdn.simpleicons.org/vite/646CFF", color: "#646CFF", category: "Build", level: 0.87 },
  { name: "Redux", logo: "https://cdn.simpleicons.org/redux/764ABC", color: "#764ABC", category: "State", level: 0.82 },
  { name: "Zustand", logo: "https://cdn.simpleicons.org/zustand/000000", color: "#FFBF69", category: "State", level: 0.8 },
  { name: "GraphQL", logo: "https://cdn.simpleicons.org/graphql/E10098", color: "#E10098", category: "Data", level: 0.78 },
  { name: "Jest", logo: "https://cdn.simpleicons.org/jest/C21325", color: "#C21325", category: "Testing", level: 0.8 },
  { name: "Cypress", logo: "https://cdn.simpleicons.org/cypress/69D3A7", color: "#69D3A7", category: "Testing", level: 0.75 },
];

export default function StackPage() {
  return (
    <main className="bg-[#0b0d10] text-white overflow-x-clip">
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
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Helpers
      const rect = () => stageRef.current!.getBoundingClientRect();

      // Sunflower spread (adapts to any count)
      const computeSpread = () => {
        const r = rect();
        const count = cardsRef.current.length;
        const minDim = Math.min(r.width, r.height);
        const radiusMax = minDim * 0.38;
        const golden = Math.PI * (3 - Math.sqrt(5)); // ~2.39996 rad (137.5°)

        return Array.from({ length: count }, (_, i) => {
          const t = i + 1;
          const radius = radiusMax * Math.sqrt(t / count);
          const angle = t * golden;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const rot = Math.sin(t) * 8;
          return { x, y, r: rot };
        });
      };

      // Grid positions (centered)
      const gridPos = (i: number) => {
        const s = rect();
        const cols = 5; // tweak if you prefer 4
        const rows = Math.ceil(techs.length / cols);
        const sample = cardsRef.current[0] as HTMLElement | undefined;
        const cw = sample?.offsetWidth ?? 232;
        const ch = sample?.offsetHeight ?? 92;
        const gap = Math.round(Math.max(16, Math.min(28, s.width * 0.018)));
        const gridW = cols * cw + (cols - 1) * gap;
        const gridH = rows * ch + (rows - 1) * gap;
        const startX = -gridW / 2 + cw / 2;
        const startY = -gridH / 2 + ch / 2;
        const col = i % cols;
        const row = Math.floor(i / cols);
        return {
          x: startX + col * (cw + gap),
          y: startY + row * (ch + gap),
        };
      };

      // Desktop: pinned scrollytelling (stack -> spread -> grid)
      mm.add("(min-width: 1024px)", () => {
        const stage = stageRef.current!;

        // Initial state: stacked center
        gsap.set(cardsRef.current, {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 0.94,
          opacity: 0,
          z: (i: number) => i,
          transformOrigin: "center",
          force3D: true,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=200%",
            scrub: 0.35,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "power2.out" },
        });

        // Stage reveal
        tl.fromTo(
          stage,
          { scale: 0.985, filter: "blur(2px) brightness(0.95)" },
          { scale: 1, filter: "blur(0px) brightness(1)", duration: prefersReduced ? 0.2 : 0.6 },
          0
        );

        // Fade in stack
        tl.to(cardsRef.current, { opacity: 1, scale: 1, duration: prefersReduced ? 0.2 : 0.35, stagger: 0.03 }, 0.05);

        // Spread into constellation
        tl.to(
          cardsRef.current,
          {
            x: (i) => computeSpread()[i]?.x ?? 0,
            y: (i) => computeSpread()[i]?.y ?? 0,
            rotate: (i) => computeSpread()[i]?.r ?? 0,
            duration: prefersReduced ? 0.3 : 1.2,
            stagger: { each: 0.04, from: "center" },
            force3D: true,
          },
          0.1
        );

        // Settle into a centered grid
        tl.to(
          cardsRef.current,
          {
            x: (i) => gridPos(i).x,
            y: (i) => gridPos(i).y,
            rotate: 0,
            duration: prefersReduced ? 0.3 : 1.0,
            stagger: { each: 0.03, from: "center" },
            force3D: true,
          },
          0.75
        );

        const ro = new ResizeObserver(() => ScrollTrigger.refresh());
        ro.observe(stage);
        return () => ro.disconnect();
      });

      // Mobile / tablet: crisp grid reveal
      mm.add("(max-width: 1023px)", () => {
        gsap.from(".tech-grid-item", {
          y: 18,
          opacity: 0,
          stagger: 0.06,
          duration: prefersReduced ? 0.25 : 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          force3D: true,
        });
      });

      // Hover micro-lift (desktop)
      const enters: Array<(e: MouseEvent) => void> = [];
      const leaves: Array<(e: MouseEvent) => void> = [];
      cardsRef.current.forEach((card) => {
        const onEnter = () => {
          gsap.to(card, { yPercent: "-=2", duration: 0.25, ease: "power2.out", force3D: true });
        };
        const onLeave = () => {
          gsap.to(card, { yPercent: "+=2", duration: 0.35, ease: "power2.out", force3D: true });
        };
        enters.push(onEnter);
        leaves.push(onLeave);
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
      });

      return () => {
        cardsRef.current.forEach((card, i) => {
          card.removeEventListener("mouseenter", enters[i]);
          card.removeEventListener("mouseleave", leaves[i]);
        });
        mm.revert();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      {/* Clean dark backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#0b0d10]" />

      <div className="mx-auto max-w-6xl px-6 py-24">
        <header className="mb-10 text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-400">Toolkit</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Tech that powers my builds
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
            Purposeful motion: stack → constellation → grid. Crisp, tactile cards on a simple dark canvas.
          </p>
          <div className="mt-6">
            <a href="/hero" className="text-sm text-indigo-400 hover:text-indigo-300 transition">← Back to Hero</a>
          </div>
        </header>

        {/* Desktop: pinned stage */}
        <div className="relative hidden lg:block">
          <div className="relative h-[86vh] overflow-visible rounded-3xl border border-white/10 bg-[#0b0d10] p-2 ring-1 ring-white/5">
            <div
              ref={stageRef}
              className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d10]"
            >
              {/* subtle grid overlay for premium feel */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.18]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                  backgroundSize: "40px 40px, 40px 40px",
                }}
              />
              {/* ultra-subtle noise */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.22'/></feComponentTransfer></filter><rect width='160' height='160' filter='url(%23n)' /></svg>\")",
                }}
              />
              {/* Cards */}
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
        </div>

        {/* Mobile / tablet grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:hidden">
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
  // 3D tilt + glare
  const handleMove: React.MouseEventHandler<HTMLElement> = (e) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * 8;
    const ry = (x - 0.5) * 10;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
  };

  const handleLeave: React.MouseEventHandler<HTMLElement> = (e) => {
    const el = e.currentTarget as HTMLElement;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `50%`);
  };

  return (
    <article
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group relative select-none rounded-2xl border border-white/10 bg-[#0e1116] p-3 ring-1 ring-white/10 sm:p-4"
      style={{
        boxShadow: `
          0 30px 60px -24px rgba(0,0,0,0.55),
          0 12px 24px -12px rgba(0,0,0,0.5),
          0 2px 6px rgba(0,0,0,0.5),
          0 0 0 1px rgba(255,255,255,0.06),
          0 14px 30px -14px ${hexToRgba(tech.color, 0.25)}
        `,
        transform: "translateZ(0) rotateX(var(--rx, 0)) rotateY(var(--ry, 0))",
        transformStyle: "preserve-3d",
        transition: "transform 180ms ease, box-shadow 220ms ease, background-color 220ms ease",
      }}
    >
      {/* inner bevel */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.5)",
        }}
      />
      {/* glare */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(260px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.08), transparent 60%)",
          mixBlendMode: "screen",
        }}
      />
      {/* noise */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.065]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.25'/></feComponentTransfer></filter><rect width='120' height='120' filter='url(%23n)' /></svg>\")",
        }}
      />

      <div className="flex items-center gap-3">
        <div
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f1319] text-black ring-1 ring-white/10 shadow-inner"
          style={{
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.06),
              inset 0 -2px 8px rgba(0,0,0,0.6),
              0 8px 24px -8px ${hexToRgba(tech.color, 0.5)}
            `,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 40%, rgba(0,0,0,0.25) 100%)",
              mixBlendMode: "screen",
            }}
          />
          <img
            src={tech.logo}
            alt={`${tech.name} logo`}
            className="relative h-6 w-6"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{tech.name}</div>
          <div className="text-[11px] text-zinc-400">{tech.category}</div>
        </div>
      </div>

      {/* Dynamic proficiency bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out group-hover:duration-300"
          style={{
            width: `${Math.round(tech.level * 100)}%`,
            backgroundColor: hexToRgba(tech.color, 0.9),
            boxShadow: `0 0 22px ${hexToRgba(tech.color, 0.35)}`,
          }}
        />
      </div>
    </article>
  );
}

function hexToRgba(hex: string, alpha = 1) {
  const clean = hex.replace("#", "");
  const h = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
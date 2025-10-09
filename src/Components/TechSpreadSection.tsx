import React, { useEffect, useRef, forwardRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Tech = {
  name: string;
  logo: string;
  color: string;
  category: string;
  level: number; // 0..1
};

const techs: Tech[] = [
  { name: "HTML5", logo: "https://cdn.simpleicons.org/html5/E34F26", color: "#E34F26", category: "Language", level: 0.96 },
  { name: "CSS3", logo: "https://cdn.simpleicons.org/css3/1572B6", color: "#1572B6", category: "Style", level: 0.94 },
  { name: "JavaScript", logo: "https://cdn.simpleicons.org/javascript/F7DF1E", color: "#F7DF1E", category: "Language", level: 0.94 },
  { name: "Bootstrap", logo: "https://cdn.simpleicons.org/bootstrap/7952B3", color: "#7952B3", category: "Style", level: 0.82 },
  { name: "WordPress", logo: "https://cdn.simpleicons.org/wordpress/21759B", color: "#21759B", category: "CMS", level: 0.8 },
  { name: "Elementor", logo: "https://cdn.simpleicons.org/elementor/92003B", color: "#92003B", category: "CMS", level: 0.78 },
  { name: "GitHub", logo: "https://cdn.simpleicons.org/github/ffffff", color: "#FFFFFF", category: "Tooling", level: 0.9 },
  { name: "Git", logo: "https://cdn.simpleicons.org/git/F05032", color: "#F05032", category: "Tooling", level: 0.6 },
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
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const innerRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Square icon-only layout auto-fit
  const MIN_TILE = 86;
  const MAX_TILE = 118;
  const MIN_COLS = 4;
  const MAX_COLS = 8;
  const GAP_MIN = 10;
  const GAP_MAX = 18;

  const layoutRef = useRef({
    cols: 6,
    rows: 4,
    tile: 96,
    gap: 14,
    aw: 0,
    ah: 0,
    pad: 28,
  });

  const gridActiveRef = useRef(false);

  useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();
    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Skip heavy animations if the user prefers reduced motion
    if (prefersReduced) return;

    // Fit square tiles to stage
    const fitSquares = () => {
      const s = stageRef.current!.getBoundingClientRect();
      const N = techs.length;
      const pad = Math.round(clamp(s.width * 0.04, 22, 36));
      const aw = s.width - pad * 2;
      const ah = s.height - pad * 2;
      const gap = Math.round(clamp(s.width * 0.012, GAP_MIN, GAP_MAX));
      let best: { cols: number; tile: number; rows: number } | null = null;
      const colsMax = Math.min(MAX_COLS, N);

      for (let cols = colsMax; cols >= MIN_COLS; cols--) {
        const rows = Math.ceil(N / cols);
        let tile = (aw - (cols - 1) * gap) / cols;
        const tileH = (ah - (rows - 1) * gap) / rows;
        tile = Math.min(tile, tileH);
        tile = Math.floor(clamp(tile, MIN_TILE, MAX_TILE));
        if (!best || tile > best.tile) best = { cols, tile, rows };
      }
      if (!best) {
        const cols = Math.min(Math.max(MIN_COLS, Math.floor(Math.sqrt(N))), N);
        const rows = Math.ceil(N / cols);
        const tile = Math.floor(clamp((ah - (rows - 1) * gap) / rows, MIN_TILE, MAX_TILE));
        best = { cols, tile, rows };
      }

      layoutRef.current = { cols: best.cols, rows: best.rows, tile: best.tile, gap, aw, ah, pad };
      gsap.set(itemsRef.current, { width: best.tile, height: best.tile });
    };

    const computeSpread = () => {
      const { aw, ah, tile } = layoutRef.current;
      const count = itemsRef.current.length;
      const minDim = Math.min(aw, ah);
      const radiusMax = minDim * 0.44;
      const golden = Math.PI * (3 - Math.sqrt(5));
      const maxX = aw / 2 - tile / 2 - 6;
      const maxY = ah / 2 - tile / 2 - 6;

      return Array.from({ length: count }, (_, i) => {
        const t = i + 1;
        const radius = radiusMax * Math.sqrt(t / count);
        const angle = t * golden;
        let x = Math.cos(angle) * radius;
        let y = Math.sin(angle) * radius;
        x = Math.max(-maxX, Math.min(maxX, x));
        y = Math.max(-maxY, Math.min(maxY, y));
        const rot = Math.sin(t) * 5;
        return { x: Math.round(x), y: Math.round(y), r: rot };
      });
    };

    const gridPos = (i: number) => {
      const { cols, tile, gap } = layoutRef.current;
      const rows = Math.ceil(techs.length / cols);
      const gridW = cols * tile + (cols - 1) * gap;
      const gridH = rows * tile + (rows - 1) * gap;
      const startX = -gridW / 2 + tile / 2;
      const startY = -gridH / 2 + tile / 2;
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        x: Math.round(startX + col * (tile + gap)),
        y: Math.round(startY + row * (tile + gap)),
      };
    };

    let spreadCache: { x: number; y: number; r: number }[] = [];
    let gridCache: { x: number; y: number }[] = [];

    const refreshAll = () => {
      fitSquares();
      spreadCache = computeSpread();
      gridCache = itemsRef.current.map((_, i) => gridPos(i));
    };

    // Desktop pinned stage
    mm.add("(min-width: 1024px)", () => {
      refreshAll();
      gsap.set(stageRef.current, {
        transformPerspective: 1000,
        perspective: 1000,
        backgroundImage:
          "radial-gradient(700px 500px at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.035), transparent 60%)",
      });

      gsap.set(itemsRef.current, {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 0.96,
        opacity: 0,
        z: (i: number) => i,
        transformOrigin: "center",
        force3D: true,
      });
      gsap.set(innerRef.current, { x: 0, y: 0, yPercent: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=170%",
          scrub: 0.35,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            refreshAll();
            gsap.set(itemsRef.current, {
              width: layoutRef.current.tile,
              height: layoutRef.current.tile,
            });
          },
          snap: {
            snapTo: [0, 0.5, 1],
            duration: { min: 0.12, max: 0.3 },
            ease: "power1.inOut",
          },
          onUpdate: (st) => {
            gridActiveRef.current = st.progress >= 0.7;
            if (!gridActiveRef.current)
              gsap.to(innerRef.current, {
                x: 0,
                y: 0,
                duration: 0.25,
                overwrite: true,
              });
          },
        },
        defaults: { ease: "power2.out" },
      });
      tlRef.current = tl;

      tl.fromTo(
        stageRef.current,
        { scale: 0.985, filter: "blur(2px) brightness(0.95)" },
        { scale: 1, filter: "blur(0px) brightness(1)", duration: 0.55 },
        0
      );
      tl.to(
        itemsRef.current,
        { opacity: 1, scale: 1, duration: 0.3, stagger: 0.025 },
        0.05
      );
      tl.to(
        itemsRef.current,
        {
          x: (i) => spreadCache[i]?.x ?? 0,
          y: (i) => spreadCache[i]?.y ?? 0,
          rotate: (i) => spreadCache[i]?.r ?? 0,
          duration: 0.95,
          stagger: { each: 0.03, from: "center" },
          force3D: true,
        },
        0.1
      );
      tl.to(
        itemsRef.current,
        {
          x: (i) => gridCache[i]?.x ?? 0,
          y: (i) => gridCache[i]?.y ?? 0,
          rotate: 0,
          duration: 0.85,
          stagger: { each: 0.025, from: "center" },
          force3D: true,
        },
        "+=0.5"
      );

      const MAG_RADIUS = 240;
      const MAG_STRENGTH = 12;
      const setXArr = innerRef.current.map((el) =>
        gsap.quickSetter(el, "x", "px")
      );
      const setYArr = innerRef.current.map((el) =>
        gsap.quickSetter(el, "y", "px")
      );

      const onMove = (e: MouseEvent) => {
        const stage = stageRef.current!;
        const b = stage.getBoundingClientRect();
        const mx = ((e.clientX - b.left) / b.width) * 100;
        const my = ((e.clientY - b.top) / b.height) * 100;
        stage.style.setProperty("--mx", `${mx.toFixed(2)}%`);
        stage.style.setProperty("--my", `${my.toFixed(2)}%`);

        if (!gridActiveRef.current) return;

        const px = e.clientX - (b.left + b.width / 2);
        const py = e.clientY - (b.top + b.height / 2);

        for (let i = 0; i < itemsRef.current.length; i++) {
          const base = gridCache[i];
          if (!base) continue;
          const vx = base.x - px;
          const vy = base.y - py;
          const d = Math.hypot(vx, vy) || 1;
          const s = Math.max(0, 1 - d / MAG_RADIUS);
          const k = s * MAG_STRENGTH;
          setXArr[i]((vx / d) * k);
          setYArr[i]((vy / d) * k);
        }
      };

      const onLeave = () => {
        gsap.to(innerRef.current, {
          x: 0,
          y: 0,
          duration: 0.25,
          ease: "power2.out",
        });
        const stage = stageRef.current!;
        stage.style.setProperty("--mx", "50%");
        stage.style.setProperty("--my", "50%");
      };

      const stage = stageRef.current!;
      stage.addEventListener("mousemove", onMove);
      stage.addEventListener("mouseleave", onLeave);

      innerRef.current.forEach((inner) => {
        const enter = () =>
          gsap.to(inner, { yPercent: -2, duration: 0.22, ease: "power2.out" });
        const leave = () =>
          gsap.to(inner, { yPercent: 0, duration: 0.3, ease: "power2.out" });
        inner.addEventListener("mouseenter", enter);
        inner.addEventListener("mouseleave", leave);
        (inner as any).__enter = enter;
        (inner as any).__leave = leave;
      });

      const ro = new ResizeObserver(() => {
        refreshAll();
        ScrollTrigger.refresh();
      });
      ro.observe(stage);

      return () => {
        ro.disconnect();
        stage.removeEventListener("mousemove", onMove);
        stage.removeEventListener("mouseleave", onLeave);
        innerRef.current.forEach((inner) => {
          if ((inner as any).__enter)
            inner.removeEventListener("mouseenter", (inner as any).__enter);
          if ((inner as any).__leave)
            inner.removeEventListener("mouseleave", (inner as any).__leave);
        });
      };
    });

    // Mobile/tablet reveal
    mm.add("(max-width: 1023px)", () => {
      gsap.from(".tech-icon-tile", {
        y: 14,
        opacity: 0,
        scale: 0.98,
        stagger: 0.05,
        duration: 0.45,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
        force3D: true,
      });
    });

    return () => mm.revert();
  }, sectionRef);

  // ✅ Use ctx here to fix the unused variable error
  return () => {
    ctx.revert();
    tlRef.current?.kill();
  };
}, []);


  const cubeSize = (tile: number) => Math.round(tile - 14);

  return (
    <section ref={sectionRef} className="relative" id="tech">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#0b0d10]" />

      <div className="mx-auto max-w-6xl px-6 py-20">
        <header className="mb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-400">Toolkit</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Tech I use</h1>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-400">Icon-only dice with realistic shading. Stack → constellation → centered grid.</p>
        </header>

        {/* Desktop pinned stage */}
        <div className="relative hidden lg:block">
          <div className="relative h-[76vh] min-h-[520px] overflow-visible rounded-3xl border border-white/10 bg-[#0b0d10] p-3 ring-1 ring-white/5">
            <div
              ref={stageRef}
              className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d10]"
              style={{ boxShadow: "inset 0 0 55px rgba(0,0,0,0.55), 0 18px 52px rgba(0,0,0,0.3)" }}
            >
              {/* overlays */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.14]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                  backgroundSize: "40px 40px, 40px 40px",
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-soft-light"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.22'/></feComponentTransfer></filter><rect width='160' height='160' filter='url(%23n)' /></svg>\")",
                }}
              />

              {/* Tiles */}
              {techs.map((t, i) => (
                <div
                  key={t.name}
                  title={t.name}
                  aria-label={t.name}
                  ref={(el) => { if (el) itemsRef.current[i] = el; }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                  style={{ width: 96, height: 96 }}
                >
                  {/* inner wrapper (hover/magnet target) */}
                  <div
                    ref={(el) => { if (el) innerRef.current[i] = el; }}
                    className="relative h-full w-full rounded-2xl"
                  >
                    {/* contact shadow (more realistic grounding) */}
                    <div
                      className="pointer-events-none absolute inset-0 -z-10 rounded-[24px]"
                      style={{
                        background:
                          "radial-gradient(60% 60% at 50% 70%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.18) 35%, rgba(0,0,0,0.0) 75%)",
                        filter: "blur(10px)",
                        transform: "translateY(8px) scale(0.96)",
                      }}
                    />
                    {/* colored halo */}
                    <div
                      className="pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-[14px] opacity-70"
                      style={{
                        background: `radial-gradient(60% 80% at 50% 55%, ${hexToRgba(
                          t.color,
                          0.22
                        )} 0%, rgba(0,0,0,0) 70%)`,
                        transform: "translateZ(-1px)",
                      }}
                    />
                    <TechIconCube tech={t} size={cubeSize(layoutRef.current.tile)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile / tablet */}
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:hidden">
          {techs.map((t) => (
            <div key={t.name} className="tech-icon-tile" title={t.name} aria-label={t.name}>
              <IconTile tech={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Robust logo with fallbacks (fixes CSS3/Zustand not appearing)
function LogoImg({ tech, size = "50%" }: { tech: Tech; size?: string }) {
  const [idx, setIdx] = useState(0);

  // try: original -> simpleicons white -> unpkg simple-icons -> repo-specific fallback
  const slugMatch = tech.logo.match(/simpleicons\.org\/([^/]+)/i);
  const slug = slugMatch?.[1]?.toLowerCase();
  const candidates: string[] = [
    tech.logo,
    slug ? `https://cdn.simpleicons.org/${slug}/ffffff` : "",
    slug ? `https://unpkg.com/simple-icons@latest/icons/${slug}.svg` : "",
    // specific fallbacks
    tech.name.toLowerCase() === "zustand"
      ? "https://raw.githubusercontent.com/pmndrs/zustand/main/docs/public/logo.png"
      : "",
    tech.name.toLowerCase() === "css3"
      ? "https://unpkg.com/simple-icons@latest/icons/css3.svg"
      : "",
  ].filter(Boolean) as string[];

  const onError: React.ReactEventHandler<HTMLImageElement> = () => {
    setIdx((i) => (i + 1 < candidates.length ? i + 1 : i));
  };

  return (
    <img
      src={candidates[idx]}
      alt={`${tech.name} logo`}
      onError={onError}
      loading="lazy"
      decoding="async"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        // ensure visibility on dark faces
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))",
      }}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
    />
  );
}

// Icon-only 3D dice cube (static angle, realistic shading, no rotation)
const TechIconCube = forwardRef<HTMLDivElement, { tech: Tech; size?: number }>(function TechIconCube(
  { tech, size = 92 },
  ref
) {
  const faces = [
    { key: "front", transform: `translateZ(${size / 2}px)` },
    { key: "back", transform: `rotateY(180deg) translateZ(${size / 2}px)` },
    { key: "right", transform: `rotateY(90deg) translateZ(${size / 2}px)` },
    { key: "left", transform: `rotateY(-90deg) translateZ(${size / 2}px)` },
    { key: "top", transform: `rotateX(90deg) translateZ(${size / 2}px)` },
    { key: "bottom", transform: `rotateX(-90deg) translateZ(${size / 2}px)` },
  ];

  // face-specific tint for realism
  const faceTint = (face: string) => {
    if (face === "top") return "rgba(255,255,255,0.06)";
    if (face === "bottom") return "rgba(0,0,0,0.22)";
    return "rgba(0,0,0,0.12)";
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <div
        ref={ref}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transformStyle: "preserve-3d",
          transform: "rotateX(-16deg) rotateY(28deg)", // static dice angle
        }}
      >
        {faces.map(({ key, transform }) => (
          <div
            key={key}
            className="absolute inset-0 rounded-[16px] border border-white/10 bg-[#0f1319]"
            style={{
              transform,
              backfaceVisibility: "hidden",
              // deeper, more realistic shadow stack
              boxShadow: `
                0 20px 40px -24px ${hexToRgba(tech.color, 0.35)},
                0 6px 14px -10px rgba(0,0,0,0.55),
                inset 0 1px 0 rgba(255,255,255,0.08),
                inset 0 -1px 0 rgba(0,0,0,0.5)
              `,
            }}
          >
            {/* AO around edges */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[16px]"
              style={{
                boxShadow: "inset 0 0 22px rgba(0,0,0,0.24)",
              }}
            />
            {/* face tint (top brighter, sides/bottom darker) */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[16px]"
              style={{
                background: `linear-gradient(180deg, ${faceTint(key)} 0%, rgba(0,0,0,0) 60%)`,
              }}
            />
            {/* icon */}
            <div className="flex h-full w-full items-center justify-center" style={{ transform: "translateZ(6px)" }}>
              <LogoImg tech={tech} size="50%" />
            </div>
            {/* specular glare following stage mouse vars */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[16px]"
              style={{
                background:
                  "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.085), transparent 60%)",
                mixBlendMode: "screen",
              }}
            />
            {/* subtle edge bevel sparkle */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[16px]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0) 35%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0) 75%)",
                mixBlendMode: "screen",
                opacity: 0.9,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

// Mobile/tablet icon-only tile
function IconTile({ tech }: { tech: Tech }) {
  return (
    <div
      className="relative aspect-square rounded-xl border border-white/10 bg-[#0e1116] p-3 ring-1 ring-white/10"
      style={{
        boxShadow: `
          0 18px 40px -24px rgba(0,0,0,0.55),
          0 10px 22px -14px ${hexToRgba(tech.color, 0.22)},
          0 0 0 1px rgba(255,255,255,0.06)
        `,
      }}
    >
      {/* AO and bevel */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.45), inset 0 0 18px rgba(0,0,0,0.22)",
        }}
      />
      {/* contact shadow */}
      <div
        className="pointer-events-none absolute inset-x-3 bottom-2 h-4 rounded-full"
        style={{
          background: "radial-gradient(50% 100% at 50% 50%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.0) 70%)",
          filter: "blur(6px)",
        }}
      />
      <div className="grid h-full place-items-center">
        <LogoImg tech={tech} size="48%" />
      </div>
    </div>
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
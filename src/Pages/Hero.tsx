

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/24/outline";

import StackPage from "../Components/TechSpreadSection";
import { AboutSection } from "../Components/About";
import { ProjectsSection } from "../Components/Projects";
import { ContactSection } from "../Components/Contact";

export default function HeroPage() {
  return (
    <main className="bg-[#0a0a0c] text-white overflow-x-clip">
      <HeroSection />
      <StackPage />
      <AboutSection />
      <section id="projects">
        <ProjectsSection />
      </section>
      <ContactSection />
    </main>
  );
}

function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);

  const comet1Ref = useRef<SVGGElement>(null);
  const comet2Ref = useRef<SVGGElement>(null);
  const sweep1Ref = useRef<SVGTextElement>(null);
  const sweep2Ref = useRef<SVGTextElement>(null);
  const trailPoolRef = useRef<SVGGElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const r = sectionRef.current!;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: r, start: "top 85%", once: true },
        defaults: { ease: "power3.out" },
      });

      tl.from(r.querySelector("[data-badge]"), {
        y: 16,
        opacity: 0,
        duration: 0.5,
      })
        .from(
          r.querySelector("[data-title-svg]"),
          { y: 22, opacity: 0, duration: 0.65 },
          "-=0.2"
        )
        .from(
          r.querySelector("[data-desc]"),
          { y: 16, opacity: 0, duration: 0.5 },
          "-=0.25"
        )
        .from(
          r.querySelectorAll("[data-cta]"),
          { y: 14, opacity: 0, duration: 0.45, stagger: 0.06 },
          "-=0.25"
        )
        .from(
          r.querySelector("[data-trust]"),
          { y: 16, opacity: 0, duration: 0.5 },
          "-=0.2"
        );

      // Gradient tail sweeping along stroke
      if (!prefersReduced) {
        const setupSweep = (
          el: SVGTextElement | null,
          dash = 160,
          gap = 2200,
          speed = 2.6
        ) => {
          if (!el) return;
          gsap.set(el, {
            strokeDasharray: `${dash} ${gap}`,
            strokeDashoffset: 0,
          });
          gsap.to(el, {
            strokeDashoffset: "-=1600",
            duration: speed,
            repeat: -1,
            ease: "none",
          });
        };
        setupSweep(sweep1Ref.current, 160, 2200, 2.6);
        setupSweep(sweep2Ref.current, 140, 2000, 2.8);
      }

      // Comets: smooth wander + pooled trails, clipped to stroke
      if (!prefersReduced) {
        const SVG = r.querySelector("#hero-stroke-svg") as SVGSVGElement | null;
        if (SVG && trailPoolRef.current) {
          const pool = buildTrailPool(trailPoolRef.current, 80);

          const wander = (g: SVGGElement, speed = 1.2) => {
            const vb = SVG.viewBox.baseVal;
            let lastSpawn = 0;

            const randomPoint = () => ({
              x: vb.x + Math.random() * vb.width,
              y: vb.y + Math.random() * vb.height,
            });

            const hop = () => {
              const target = randomPoint();
              const bbox = g.getBBox();
              const fromX = bbox.x + bbox.width / 2;
              const fromY = bbox.y + bbox.height / 2;
              const angle =
                Math.atan2(target.y - fromY, target.x - fromX) *
                (180 / Math.PI);

              gsap.to(g, {
                x: target.x,
                y: target.y,
                rotate: angle,
                duration: speed + Math.random() * 0.9,
                ease: "sine.inOut",
                onUpdate: () => {
                  const now = performance.now();
                  if (now - lastSpawn > 55) {
                    lastSpawn = now;
                    spawnTrail(pool, g);
                  }
                },
                onComplete: () => {
                  gsap.delayedCall(Math.random() * 0.25, hop);
                },
              });
            };

            // Set an initial transform so bbox center isn't 0,0 forever
            if (!g.getAttribute("transform")) {
              g.setAttribute(
                "transform",
                `translate(${vb.x + vb.width / 2} ${
                  vb.y + vb.height / 2
                }) rotate(0)`
              );
            }
            hop();
          };

          if (comet1Ref.current) wander(comet1Ref.current, 1.0);
          if (comet2Ref.current) wander(comet2Ref.current, 1.3);
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Camera parallax + spotlight
  useEffect(() => {
    const world = worldRef.current;
    const section = sectionRef.current;
    const spec = specRef.current;
    if (!world || !section || !spec) return;

    const onMove = (e: MouseEvent) => {
      const b = section.getBoundingClientRect();
      const nx = (e.clientX - b.left) / b.width - 0.5;
      const ny = (e.clientY - b.top) / b.height - 0.5;
      world.style.setProperty("--camX", `${(0.5 - ny) * 4.5}deg`);
      world.style.setProperty("--camY", `${(nx - 0.5) * 7}deg`);
      spec.style.setProperty("--x", `${(nx + 0.5) * 100}%`);
      spec.style.setProperty("--y", `${(ny + 0.5) * 100}%`);
    };
    const onEnter = () => world.style.setProperty("--play", "running");
    const onLeave = () => {
      world.style.setProperty("--camX", `0deg`);
      world.style.setProperty("--camY", `0deg`);
      world.style.setProperty("--play", "paused");
      spec.style.setProperty("--x", `50%`);
      spec.style.setProperty("--y", `50%`);
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseenter", onEnter);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Magnetic CTA
  const magnetMove: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tx", `${x * 6}px`);
    el.style.setProperty("--ty", `${y * 6}px`);
    el.style.setProperty("--scale", `1.015`);
  };
  const magnetLeave: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    const el = e.currentTarget as HTMLElement;
    el.style.setProperty("--tx", `0px`);
    el.style.setProperty("--ty", `0px`);
    el.style.setProperty("--scale", `1`);
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-x-clip">
      {/* Background layers (subtle, premium) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[42vh] w-[60vw] -translate-x-1/2 rounded-full bg-white/[0.05] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:100px_100px]" />
      </div>

      {/* Sticky stage */}
      <div className="sticky top-0 flex min-h-screen items-center justify-center px-6 py-20">
        <div className="relative mx-auto w-full max-w-7xl">
          {/* Badge */}
          <div className="mb-8 flex justify-center" data-badge>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-zinc-300">
                Available for new projects
              </span>
            </div>
          </div>

          {/* 3D world + spotlight */}
          <div ref={worldRef} className="relative">
            <div
              ref={specRef}
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(22% 12% at var(--x,50%) var(--y,50%), rgba(255,255,255,0.12), transparent 60%)",
                mixBlendMode: "overlay",
              }}
            />

            {/* SVG headline with clipped comets + gradient sweep */}
            <div className="relative flex items-center justify-center">
              <svg
                id="hero-stroke-svg"
                data-title-svg
                viewBox="0 0 1200 460"
                className="w-[min(92vw,1200px)]"
                aria-hidden
                shapeRendering="geometricPrecision"
              >
                <defs>
                  {/* Gradient for comet tails */}
                  <linearGradient id="cometGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                    <stop offset="35%" stopColor="#60a5fa" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                  </linearGradient>

                  {/* Mask stroke-only area to clip comets */}
                  <mask id="strokeMask">
                    <rect width="100%" height="100%" fill="black" />
                    <text
                      x="50%"
                      y="170"
                      textAnchor="middle"
                      fontFamily='system-ui, -apple-system, "Segoe UI", Inter, Roboto, sans-serif'
                      fontWeight="900"
                      fontSize="200"
                      fill="none"
                      stroke="white"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      Hi, I'm Rahul Dev
                    </text>
                    <text
                      x="50%"
                      y="340"
                      textAnchor="middle"
                      fontFamily='system-ui, -apple-system, "Segoe UI", Inter, Roboto, sans-serif'
                      fontWeight="900"
                      fontSize="100"
                      fill="none"
                      stroke="white"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      Front‑End Developer
                    </text>
                  </mask>
                </defs>

                {/* Visible stroke-only headline */}
                <text
                  x="50%"
                  y="170"
                  textAnchor="middle"
                  fontFamily='system-ui, -apple-system, "Segoe UI", Inter, Roboto, sans-serif'
                  fontWeight="900"
                  fontSize="120"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="2"
                  style={{
                    filter:
                      "drop-shadow(0 0 18px rgba(255,255,255,0.12)) drop-shadow(0 0 42px rgba(99,102,241,0.14))",
                  }}
                >
                  Hi, I&apos;m Rahul Dev
                </text>
                <text
                  x="50%"
                  y="340"
                  textAnchor="middle"
                  fontFamily='system-ui, -apple-system, "Segoe UI", Inter, Roboto, sans-serif'
                  fontWeight="900"
                  fontSize="100"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="2"
                  style={{
                    filter:
                      "drop-shadow(0 0 18px rgba(255,255,255,0.12)) drop-shadow(0 0 42px rgba(99,102,241,0.14))",
                  }}
                >
                  Front‑End Developer
                </text>

                {/* Gradient sweeps riding along the stroke */}
                <text
                  ref={sweep1Ref}
                  x="50%"
                  y="170"
                  textAnchor="middle"
                  fontFamily='system-ui, -apple-system, "Segoe UI", Inter, Roboto, sans-serif'
                  fontWeight="900"
                  fontSize="120"
                  fill="none"
                  stroke="url(#cometGrad)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                  style={{ mixBlendMode: "screen" }}
                >
                  Hi, I&apos;m Rahul Dev
                </text>
                <text
                  ref={sweep2Ref}
                  x="50%"
                  y="340"
                  textAnchor="middle"
                  fontFamily='system-ui, -apple-system, "Segoe UI", Inter, Roboto, sans-serif'
                  fontWeight="900"
                  fontSize="100"
                  fill="none"
                  stroke="url(#cometGrad)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                  style={{ mixBlendMode: "screen" }}
                >
                  Front‑End Developer
                </text>

                {/* Masked comets + pooled trail nodes */}
                <g mask="url(#strokeMask)" style={{ mixBlendMode: "screen" }}>
                  <g ref={trailPoolRef} />
                  {/* comet 1 */}
                  <g ref={comet1Ref}>
                    <rect
                      x={-52}
                      y={-5}
                      width={104}
                      height={10}
                      rx={5}
                      fill="url(#cometGrad)"
                    />
                    <rect
                      x={-30}
                      y={-2.5}
                      width={60}
                      height={5}
                      rx={2.5}
                      fill="url(#cometGrad)"
                      opacity="0.8"
                    />
                  </g>
                  {/* comet 2 */}
                  <g ref={comet2Ref}>
                    <rect
                      x={-44}
                      y={-4.5}
                      width={88}
                      height={9}
                      rx={4.5}
                      fill="url(#cometGrad)"
                    />
                    <rect
                      x={-26}
                      y={-2.2}
                      width={52}
                      height={4.4}
                      rx={2.2}
                      fill="url(#cometGrad)"
                      opacity="0.8"
                    />
                  </g>
                </g>
              </svg>
            </div>
          </div>

          {/* Description */}
          <p
            data-desc
            className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-zinc-400 xl:text-md"
          >
            Turning ideas into sleek, interactive web experiences — blending
            clean design, modern technology, and motion-driven storytelling.
            <span className="mt-2 block text-base text-zinc-500">
              MERN + Next.js • TypeScript • Tailwind • React Native • GSAP • 3D
              & animations
            </span>
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              data-cta
              href="/stack"
              onMouseMove={magnetMove}
              onMouseLeave={magnetLeave}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 p-[1.5px]"
              style={{
                transform:
                  "translate3d(var(--tx,0), var(--ty,0), 0) scale(var(--scale,1))",
              }}
            >
              <span className="relative inline-flex items-center gap-2 rounded-full bg-[#0a0a0c] px-6 py-3.5 text-sm font-semibold text-white transition-colors group-hover:bg-transparent">
                Explore My Stack
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>

            <a
              data-cta
              href="/stack"
              onMouseMove={magnetMove}
              onMouseLeave={magnetLeave}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 p-[1.5px]"
              style={{
                transform:
                  "translate3d(var(--tx,0), var(--ty,0), 0) scale(var(--scale,1))",
              }}
            >
              <span className="relative inline-flex items-center gap-2 rounded-full bg-[#0a0a0c] px-6 py-3.5 text-sm font-semibold text-white transition-colors group-hover:bg-transparent">
               
              <PlayIcon className="h-4 w-4 text-white/70" />
              See Projects
              </span>
            </a>
            
          </div>

          {/* Trust indicators */}
          <div
            data-trust
            className="mt-14 flex flex-wrap items-center justify-center gap-8 opacity-85"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                <span data-count-to="50" />30+
              </div>
              <div className="text-xs text-zinc-500">Projects Delivered</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                <span data-count-to="5" />2+
              </div>
              <div className="text-xs text-zinc-500">Years Experience</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-zinc-500">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .headline {
          font-size: clamp(42px, 9vw, 120px);
          line-height: 0.9;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          will-change: transform;
          font-family: system-ui, -apple-system, "Segoe UI", Inter, Roboto, sans-serif;
        }
        @media (prefers-reduced-motion: reduce) {
          /* GSAP handles motion disabling; static CSS is already subtle */
        }
      `}</style>
    </section>
  );
}

/* Trail pool: pre-create tiny capsules to reuse for comet trails */
type TrailPool = { take: () => SVGRectElement };
function buildTrailPool(container: SVGGElement, size = 60): TrailPool {
  const items: SVGRectElement[] = [];
  for (let i = 0; i < size; i++) {
    const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    r.setAttribute("x", "-18");
    r.setAttribute("y", "-2");
    r.setAttribute("width", "36");
    r.setAttribute("height", "4");
    r.setAttribute("rx", "2");
    r.setAttribute("fill", "url(#cometGrad)");
    r.setAttribute("opacity", "0");
    container.appendChild(r);
    items.push(r);
  }
  let idx = 0;
  return {
    take: () => {
      const el = items[idx];
      idx = (idx + 1) % items.length;
      return el;
    },
  };
}

/* Spawn a fading trail piece at the comet’s current transform */
function spawnTrail(pool: TrailPool, comet: SVGGElement) {
  const piece = pool.take();
  const t = comet.getAttribute("transform") || "";
  piece.setAttribute("transform", t);
  piece.setAttribute("opacity", "0.9");
  piece.setAttribute("width", "36");
  gsap.to(piece, {
    opacity: 0,
    width: 0,
    duration: 0.6,
    ease: "power2.out",
  });
}
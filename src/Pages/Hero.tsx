"use client";

import { useEffect, useRef } from "react";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/24/outline";
import StackPage from "../Components/TechSpreadSection";
import { AboutSection } from "../Components/About";

export default function HeroPage() {
  return (
    <main className="bg-[#0a0a0c] text-white overflow-x-clip">
      <HeroSection />
      <StackPage/>  
      <AboutSection/>
    </main>
  );
}

function HeroSection() {
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = titleWrapRef.current;
    const spec = specRef.current;
    if (!wrap || !spec) return;

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      spec.style.setProperty("--x", `${x}%`);
      spec.style.setProperty("--y", `${y}%`);
    };
    wrap.addEventListener("mousemove", onMove);
    return () => wrap.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative min-h-screen overflow-x-clip">
      {/* Enhanced background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Top ambient glow */}
        <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
        
        {/* Main gradient orb */}
        <div className="glow absolute left-1/2 top-[-10%] h-[50vh] w-[70vw] -translate-x-1/2 rounded-full" />
        
        {/* Subtle rays */}
        <div className="rays absolute inset-0 opacity-[0.08] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_65%)]">
          <div className="size-full bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0deg,rgba(255,255,255,0.4)_6deg,transparent_12deg)]" />
        </div>
        
        {/* Fine grain texture */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay [background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:100px_100px]" />
      </div>

      {/* Main content */}
      <div className="sticky top-0 flex min-h-screen items-center justify-center px-6 py-20">
        <div className="relative mx-auto w-full max-w-7xl">
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-zinc-300">Available for new projects</span>
            </div>
          </div>

          <div ref={titleWrapRef} className="relative will-change-transform">
            {/* Refined shimmer beam */}
            <div
              aria-hidden
              className="shimmer pointer-events-none absolute inset-y-0 left-[-40%] z-10 w-[50%] rounded-3xl"
            />

            {/* Specular highlight */}
            <div
              ref={specRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                background:
                  "radial-gradient(35% 18% at var(--x,50%) var(--y,50%), rgba(255,255,255,0.15), transparent 65%)",
                mixBlendMode: "overlay",
              }}
            />

            {/* Premium title treatment */}
            <div className="relative text-center">
              <div className="relative inline-block">
                <h1 className="sr-only">Hi, I'm Rahul Dev — Front‑End Developer</h1>

                {/* Stroke layer with enhanced glow */}
                <div
                  aria-hidden
                  className="headline select-none text-transparent"
                  style={{
                    WebkitTextStroke: "1.5px rgba(255,255,255,0.9)",
                    filter:
                      "drop-shadow(0 0 20px rgba(99,102,241,0.4)) drop-shadow(0 0 40px rgba(168,85,247,0.25)) drop-shadow(0 0 80px rgba(236,72,153,0.15))",
                  }}
                >
                  <span className="block">Hi, I'm Rahul Dev</span>
                  <span className="block mt-2">Front‑End Developer</span>
                </div>

                {/* Gradient fill layer */}
                <div
                  aria-hidden
                  className="headline fillGradient absolute inset-0 select-none"
                >
                  <span className="block">Hi, I'm Rahul Dev</span>
                  <span className="block mt-2">Front‑End Developer</span>
                </div>

                {/* Orb highlights layer */}
                <div
                  aria-hidden
                  className="headline orbs absolute inset-0 select-none"
                >
                  <span className="block">Hi, I'm Rahul Dev</span>
                  <span className="block mt-2">Front‑End Developer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced description with better hierarchy */}
          <p className="mx-auto mt-10 max-w-2xl text-center text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Building interfaces that feel fast, look premium, and scale seamlessly.
            <span className="mt-2 block text-base text-zinc-500">
              Clean code, purposeful motion, and meticulous attention to detail.
            </span>
          </p>

          {/* Premium CTA buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/stack"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 p-[1.5px] transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/30"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0c] px-6 py-3.5 text-sm font-semibold text-white transition-colors group-hover:bg-transparent">
                Explore My Stack
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
            
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
            >
              <PlayIcon className="h-4 w-4 text-white/70" />
              Watch My Work
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-40">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-xs text-zinc-500">Projects Delivered</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">5+</div>
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

      <style>{`
        .headline {
          font-size: clamp(36px, 9vw, 120px);
          line-height: 0.9;
          text-transform: uppercase;
          font-weight: 900;
          letter-spacing: -0.02em;
          will-change: transform;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .fillGradient {
          color: transparent;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          background-image: linear-gradient(
            110deg,
            #60a5fa 0%,
            #a78bfa 25%,
            #f472b6 50%,
            #22d3ee 75%,
            #60a5fa 100%
          );
          background-size: 250% 100%;
          animation: gradient-pan 10s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          mix-blend-mode: screen;
        }

        .orbs {
          color: transparent;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          background-repeat: no-repeat;
          background-image:
            radial-gradient(80px 80px at 25% 45%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0) 70%),
            radial-gradient(140px 140px at 75% 50%, rgba(168, 85, 247, 0.28), rgba(168, 85, 247, 0) 75%),
            radial-gradient(100px 100px at 50% 75%, rgba(99, 102, 241, 0.32), rgba(99, 102, 241, 0) 70%);
          background-size: 250% 100%, 250% 100%, 250% 100%;
          background-position: -80% 0%, 120% 0%, 50% 0%;
          animation: orbs-move 15s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
          mix-blend-mode: screen;
          opacity: 0.85;
        }

        .glow {
          opacity: 0.3;
          background: radial-gradient(
            ellipse at center,
            rgba(99, 102, 241, 0.25),
            rgba(168, 85, 247, 0.15) 50%,
            transparent 70%
          );
          filter: blur(80px);
          animation: pulse 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .rays {
          animation: rays-rotate 30s linear infinite;
          transform-origin: 50% 50%;
        }

        .shimmer {
          background: linear-gradient(
            100deg,
            transparent 0%,
            rgba(255, 255, 255, 0.06) 45%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0.06) 55%,
            transparent 100%
          );
          animation: beam 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          mix-blend-mode: overlay;
        }

        @keyframes gradient-pan {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes orbs-move {
          0% {
            background-position: -80% 0%, 120% 0%, 50% 0%;
          }
          100% {
            background-position: 140% 0%, -40% 0%, -30% 0%;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.5;
          }
        }

        @keyframes rays-rotate {
          to {
            transform: rotate(20deg);
          }
        }

        @keyframes beam {
          0% {
            transform: translateX(-50%) skewX(-10deg);
            opacity: 0;
          }
          40% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(150%) skewX(-10deg);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fillGradient,
          .orbs,
          .glow,
          .rays,
          .shimmer {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
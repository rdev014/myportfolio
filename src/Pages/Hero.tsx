"use client";

import { useEffect, useRef } from "react";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/24/outline";
import StackPage from "../Components/TechSpreadSection";

export default function HeroPage() {
  return (
    <main className="bg-[#0a0a0c] text-white overflow-x-clip">
      <HeroSection />
      <StackPage />
    </main>
  );
}

function HeroSection() {
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);

  // Optional: keep the cursor-follow highlight (no GSAP)
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
    <section className="relative min-h-[140vh] overflow-x-clip touch-pan-y">
      {/* Background: ambient ring, glow, rays, grain (now CSS-animated, no GSAP) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl sm:h-56 sm:w-56" />
        <div className="glow absolute left-1/2 top-[-16%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full" />
        <div className="rays absolute inset-0 opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
          <div className="size-full bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0deg,rgba(255,255,255,0.35)_8deg,transparent_16deg)]" />
        </div>
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      {/* Sticky viewport on desktop */}
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <div className="relative mx-auto w-full max-w-6xl">
          <div ref={titleWrapRef} className="relative will-change-transform">
            {/* Beam shimmer (pure CSS) */}
            <div
              aria-hidden
              className="shimmer pointer-events-none absolute inset-y-0 left-[-30%] z-10 w-[40%] rounded-3xl"
            />

            {/* Specular highlight following cursor */}
            <div
              ref={specRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                background:
                  "radial-gradient(40% 20% at var(--x,50%) var(--y,50%), rgba(255,255,255,0.18), transparent 60%)",
                mixBlendMode: "overlay",
              }}
            />

            {/* Animated gradient title — stroke + moving gradient fill + orb sheen */}
            <div className="relative text-center">
              <div className="relative inline-block">
                {/* Accessible text once; visual layers below are aria-hidden */}
                <h1 className="sr-only">Hi, I’m Rahul Dev — Front‑End Developer</h1>

                {/* 1) Stroke-only outline */}
                <div
                  className="headline select-none text-transparent"
                  style={{
                    WebkitTextStroke: "1.25px rgba(255,255,255,0.85)",
                    filter:
                      "drop-shadow(0 0 18px rgba(99,102,241,0.35)) drop-shadow(0 0 36px rgba(168,85,247,0.25)) drop-shadow(0 0 68px rgba(236,72,153,0.18))",
                  }}
                >
                  <span>Hi, I’m Rahul Dev</span>
                  <br />
                  <span>Front‑End Developer</span>
                </div>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-base text-zinc-300 sm:text-lg md:text-xl">
            Interfaces that feel fast, look premium, and scale. I craft experiences with clean code, motion, and intent.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/stack"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:shadow-fuchsia-500/25"
            >
              Explore Stack
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
        </div>
      </div>

      {/* Local CSS for the gradient animations */}
      <style>{`
        .headline {
          font-size: clamp(40px, 10vw, 128px);
          line-height: 0.86;
          text-transform: uppercase;
          font-weight: 900;
          letter-spacing: 0.02em;
          will-change: transform;
        }

        /* Gradient fill that sweeps across the glyphs (clipped to text) */
        .fillGradient {
          color: transparent;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          background-image: linear-gradient(
            90deg,
            #60a5fa 0%,
            #a78bfa 20%,
            #f472b6 40%,
            #22d3ee 60%,
            #a78bfa 80%,
            #60a5fa 100%
          );
          background-size: 200% 100%;
          animation: gradient-pan 8s linear infinite;
          mix-blend-mode: screen;
        }

        /* Soft moving circular highlights inside the letters */
        .orbs {
          color: transparent;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          background-repeat: no-repeat;
          background-image:
            radial-gradient(60px 60px at 20% 50%, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0) 65%),
            radial-gradient(120px 120px at 80% 40%, rgba(168, 85, 247, 0.35), rgba(168, 85, 247, 0) 70%),
            radial-gradient(90px 90px at 50% 80%, rgba(99, 102, 241, 0.4), rgba(99, 102, 241, 0) 70%);
          background-size: 200% 100%, 200% 100%, 200% 100%;
          background-position: -60% 0%, 100% 0%, 50% 0%;
          animation: orbs-move 12s ease-in-out infinite alternate, hue 14s linear infinite;
          mix-blend-mode: screen;
          opacity: 0.9;
        }

        /* Gentle glow pulse behind the headline */
        .glow {
          opacity: 0.35;
          background: radial-gradient(
            ellipse at center,
            rgba(99, 102, 241, 0.22),
            rgba(168, 85, 247, 0.12) 55%,
            transparent 70%
          );
          filter: blur(6px);
          animation: pulse 6s ease-in-out infinite;
        }

        /* Slow rotation for rays */
        .rays {
          animation: rays-rotate 24s linear infinite;
          transform-origin: 50% 50%;
        }

        /* Shimmer beam sweep */
        .shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.28) 50%,
            transparent 100%
          );
          animation: beam 7.5s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          mix-blend-mode: overlay;
        }

        @keyframes gradient-pan {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        @keyframes orbs-move {
          0% {
            background-position: -60% 0%, 100% 0%, 50% 0%;
          }
          100% {
            background-position: 120% 0%, -20% 0%, -20% 0%;
          }
        }

        @keyframes hue {
          0% {
            filter: hue-rotate(0deg);
          }
          100% {
            filter: hue-rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.6;
          }
        }

        @keyframes rays-rotate {
          to {
            transform: rotate(18deg);
          }
        }

        @keyframes beam {
          0% {
            transform: translateX(-30%);
            opacity: 0.25;
          }
          45% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(140%);
            opacity: 0.25;
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
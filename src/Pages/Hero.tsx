"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/24/outline";
import StackPage from "../Components/TechSpreadSection";

export default function HeroPage() {
  return (
    <main className="bg-[#0a0a0c] text-white overflow-x-clip">
      <HeroSection />
      <StackPage/>

    </main>
  );
}

function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const titleStrokeRef = useRef<HTMLHeadingElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  const shimmerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Scramble-in reveal (lightweight)
      const scramble = (el: HTMLElement, finalText: string, duration = 1.1, delay = 0) => {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
        const targets = finalText.split("");
        const revealMap = targets.map((ch) => (/\s/.test(ch) ? " " : ch));
        const tl = gsap.timeline({ delay });
        tl.to({ p: 0 }, {
          p: 1, duration, ease: "expo.out",
          onUpdate() {
            const p = (this.targets()[0] as any).p as number;
            const count = Math.floor(p * targets.length);
            const out = targets.map((ch, i) => {
              if (revealMap[i] === " ") return " ";
              return i < count ? ch : charset[Math.floor(Math.random() * charset.length)];
            });
            el.textContent = out.join("");
          }
        });
        return tl;
      };

      // Mouse-follow specular highlight
      const wrap = titleWrapRef.current!;
      const spec = specRef.current!;
      const onMove = (e: MouseEvent) => {
        const r = wrap.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        spec.style.setProperty("--x", `${x}%`);
        spec.style.setProperty("--y", `${y}%`);
      };
      wrap.addEventListener("mousemove", onMove);

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

      // Desktop pinned (calm, responsive-safe)
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

        tl.to(titleStrokeRef.current, {
          letterSpacing: "0.16em",
          wordSpacing: "0.06em",
          scale: 1.03,
          yPercent: -4,
          force3D: true,
        }, 0)
        .to(glowRef.current, { opacity: 0.9, filter: "blur(6px)" }, 0)
        .to(raysRef.current, { rotate: 18, force3D: true }, 0)
        .fromTo(
          shimmerRef.current,
          { xPercent: -30, opacity: 0.28 },
          { xPercent: 140, opacity: 0.5 },
          0.06
        );
      });

      // Mobile / tablet: no pin, gentle motion
      mm.add("(max-width: 1023px)", () => {
        gsap.set(titleStrokeRef.current, { letterSpacing: "0.08em", wordSpacing: "0.04em" });
        gsap.to(titleStrokeRef.current, {
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom 45%", scrub: 0.25 },
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

      // Initial scramble reveal
      const t1 = "Hi, I’m Rahul Dev";
      const t2 = "Front‑End Developer";
      if (line1Ref.current) line1Ref.current.textContent = "";
      if (line2Ref.current) line2Ref.current.textContent = "";
      const intro = gsap.timeline({ delay: 0.1 });
      intro.add(scramble(line1Ref.current!, t1, 1.0, 0)).add(scramble(line2Ref.current!, t2, 1.0, 0.1), "-=0.5");

      // Tagline + CTAs entrance
      gsap.from(".hero-enter", {
        y: 12,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.35,
      });

      return () => {
        wrap.removeEventListener("mousemove", onMove);
        mm.revert();
      };
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
          <div ref={titleWrapRef} className="relative will-change-transform">
            {/* Shimmer beam */}
            <div
              ref={shimmerRef}
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-[-30%] z-10 w-[40%] rounded-3xl"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)" }}
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
            {/* Outline-only headline with holographic glow */}
            <h1
              ref={titleStrokeRef}
              className="select-none text-center font-black uppercase leading-[0.86] tracking-tight text-transparent"
              style={{
                WebkitTextStroke: "1.25px rgba(255,255,255,0.8)",
                fontSize: "clamp(40px, 10vw, 128px)",
                filter:
                  "drop-shadow(0 0 18px rgba(99,102,241,0.35)) drop-shadow(0 0 36px rgba(168,85,247,0.25)) drop-shadow(0 0 68px rgba(236,72,153,0.18))",
                willChange: "transform, letter-spacing, word-spacing",
              }}
            >
              <span ref={line1Ref} />
              <br />
              <span ref={line2Ref} />
            </h1>
          </div>

          <p className="hero-enter mx-auto mt-6 max-w-2xl text-center text-base text-zinc-300 sm:text-lg md:text-xl">
            Interfaces that feel fast, look premium, and scale. I craft experiences with clean code, motion, and intent.
          </p>

          <div className="hero-enter mt-6 flex flex-wrap items-center justify-center gap-3">
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
    </section>
  );
}
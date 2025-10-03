

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
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}

function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const r = sectionRef.current!;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: r, start: "top 85%", once: true },
      });

      tl.from(r.querySelector("[data-badge]"), { y: 16, opacity: 0, duration: 0.5, ease: "power3.out" })
        .from(r.querySelector("[data-title-outline]"), { y: 22, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.25")
        // removed the fill layer step
        .from(r.querySelector("[data-desc]"), { y: 16, opacity: 0, duration: 0.5, ease: "power3.out" }, "-=0.25")
        .from(r.querySelectorAll("[data-cta]"), { y: 14, opacity: 0, duration: 0.45, ease: "power3.out", stagger: 0.06 }, "-=0.25")
        .from(r.querySelector("[data-trust]"), { y: 16, opacity: 0, duration: 0.5, ease: "power3.out" }, "-=0.2")
        .from(r.querySelectorAll(".ring-item"), { y: 10, opacity: 0, scale: 0.94, duration: 0.5, ease: "power3.out", stagger: 0.04 }, "-=0.35");

      if (!prefersReduced) {
        const nums = gsap.utils.toArray<HTMLElement>("[data-count-to]");
        nums.forEach((el) => {
          const to = Number(el.dataset.countTo || 0);
          const obj = { val: 0 };
          gsap.to(obj, {
            val: to,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onUpdate: () => {
              el.textContent = Math.round(obj.val).toString();
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Camera parallax + specular highlight
  useEffect(() => {
    const world = worldRef.current;
    const section = sectionRef.current;
    const spec = specRef.current;
    if (!world || !section || !spec) return;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      const rx = (0.5 - ny) * 4;
      const ry = (nx - 0.5) * 6;
      world.style.setProperty("--camX", `${rx}deg`);
      world.style.setProperty("--camY", `${ry}deg`);
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

      <div className="sticky top-0 flex min-h-screen items-center justify-center px-6 py-20">
        <div className="relative mx-auto w-full max-w-7xl">
          {/* Badge */}
          <div className="mb-8 flex justify-center" data-badge>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-zinc-300">Available for new projects</span>
            </div>
          </div>

          {/* 3D World (icon ring + specular) */}
          <div
            ref={worldRef}
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 md:h-[640px] md:w-[640px]"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(var(--camX,0deg)) rotateY(var(--camY,0deg))",
              transition: "transform 280ms ease-out",
            }}
          >
            <div
              ref={specRef}
              className="pointer-events-none absolute inset-0"
              style={{
                background: "radial-gradient(24% 12% at var(--x,50%) var(--y,50%), rgba(255,255,255,0.12), transparent 60%)",
                mixBlendMode: "overlay",
                transition: "background-position 100ms linear",
              }}
            />
            <IconRing />
          </div>

          {/* Headline (stroke-only, no fill) */}
          <div className="relative text-center">
            <div className="relative inline-block">
              <h1 className="sr-only">Hi, I'm Rahul Dev — Front‑End Developer</h1>

              <div
                data-title-outline
                className="headline select-none text-transparent"
                style={{
                  WebkitTextStroke: "1.8px rgba(255,255,255,0.95)",
                  // subtle glow for readability without fill
                  filter:
                    "drop-shadow(0 0 18px rgba(255,255,255,0.12)) drop-shadow(0 0 42px rgba(99,102,241,0.14))",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <span className="block">Hi, I&apos;m Rahul Dev</span>
                <span className="mt-2 block">Front‑End Developer</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p data-desc className="mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-zinc-400 sm:text-xl">
            I build interfaces that feel fast, look premium, and scale cleanly—using React, TypeScript, Tailwind, and GSAP.
            <span className="mt-2 block text-base text-zinc-500">
              Clean code, purposeful motion, and meticulous attention to detail.
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
              style={{ transform: "translate3d(var(--tx,0), var(--ty,0), 0) scale(var(--scale,1))" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0c] px-6 py-3.5 text-sm font-semibold text-white transition-colors group-hover:bg-transparent">
                Explore My Stack
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>

            <a
              data-cta
              href="#projects"
              onMouseMove={magnetMove}
              onMouseLeave={magnetLeave}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-xl transition-all"
              style={{ transform: "translate3d(var(--tx,0), var(--ty,0), 0) scale(var(--scale,1))" }}
            >
              <PlayIcon className="h-4 w-4 text-white/70" />
              See Projects
            </a>
          </div>

          {/* Trust indicators */}
          <div data-trust className="mt-14 flex flex-wrap items-center justify-center gap-8 opacity-80">
            <div className="text-center">
              <div className="text-2xl font-bold text-white"><span data-count-to="50" />+</div>
              <div className="text-xs text-zinc-500">Projects Delivered</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white"><span data-count-to="5" />+</div>
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

      {/* CSS (fill removed) */}
      <style>{`
        .headline {
          font-size: clamp(40px, 9vw, 120px);
          line-height: 0.9;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          will-change: transform;
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, Inter, sans-serif;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .headline { animation: none !important; }
        }
      `}</style>
    </section>
  );
} 

/* ============ Icon Orbit Ring ============ */
function IconRing() {
  const skills = [
    { n: "Next.js", u: "https://cdn.simpleicons.org/nextdotjs/ffffff" },
    { n: "React", u: "https://cdn.simpleicons.org/react/61DAFB" },
    { n: "TypeScript", u: "https://cdn.simpleicons.org/typescript/3178C6" },
    { n: "Tailwind", u: "https://cdn.simpleicons.org/tailwindcss/38BDF8" },
    { n: "GSAP", u: "https://cdn.simpleicons.org/greensock/88CE02" },
    { n: "Node.js", u: "https://cdn.simpleicons.org/nodedotjs/5FA04E" },
    { n: "Vite", u: "https://cdn.simpleicons.org/vite/646CFF" },
    { n: "GraphQL", u: "https://cdn.simpleicons.org/graphql/E10098" },
  ];
  const radius = 180;

  return (
    <div
      className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2"
      style={{ animation: "spin 40s linear infinite", animationPlayState: "var(--play, paused)" }}
    >
      {skills.map((s, i) => {
        const deg = (360 / skills.length) * i;
        return (
          <div
            key={s.n}
            className="ring-item absolute left-1/2 top-1/2"
            style={{ transform: `rotate(${deg}deg) translate(${radius}px) rotate(${-deg}deg)` }}
            title={s.n}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f1319] ring-1 ring-white/10 shadow-inner">
              <img src={s.u} alt={s.n} className="h-5 w-5 opacity-90" loading="lazy" decoding="async" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
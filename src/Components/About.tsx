"use client";

import { useEffect, useRef } from "react";
import type React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const r = sectionRef.current!;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Premium intro reveal
      const tl = gsap.timeline({
        scrollTrigger: { trigger: r, start: "top 70%", once: true },
      });

      tl.from(r.querySelector("[data-kicker]"), { y: 14, opacity: 0, duration: 0.45, ease: "power3.out" })
        .from(r.querySelector("[data-title]"), { y: 18, opacity: 0, duration: 0.55, ease: "power3.out" }, "-=0.15")
        .from(r.querySelectorAll("[data-body]"), {
          y: 14, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.06,
        }, "-=0.25")
        .from(r.querySelectorAll("[data-cta]"), {
          y: 12, opacity: 0, duration: 0.45, ease: "power3.out", stagger: 0.06,
        }, "-=0.2")
        .from(r.querySelector("[data-deck]"), {
          y: 22, opacity: 0, scale: 0.985, duration: 0.6, ease: "power3.out",
        }, "-=0.1")
        .from(r.querySelectorAll("[data-stat]"), {
          y: 16, opacity: 0, duration: 0.45, ease: "power3.out", stagger: 0.05,
        }, "-=0.25");

      // Count-up stats
      if (!prefersReduced) {
        const counters = gsap.utils.toArray<HTMLElement>("[data-count-to]");
        counters.forEach((el) => {
          const to = Number(el.dataset.countTo || 0);
          const obj = { val: 0 };
          gsap.to(obj, {
            val: to,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onUpdate: () => (el.textContent = Math.round(obj.val).toString()),
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0b0d10]">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Narrative */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between" data-kicker>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-300">
                About
              </span>
              <span className="hidden h-px flex-1 bg-white/10 lg:block" />
            </div>

            <h2 data-title className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              I craft premium, performance-first interfaces with motion that serves the product.
            </h2>

            <p data-body className="mt-4 text-zinc-400">
              Strong UI systems, crisp motion, and rigorous performance. I work in Next.js, TypeScript, Tailwind, and GSAP
              to ship experiences that feel physical and effortless—without visual noise.
            </p>
            <p data-body className="mt-3 text-zinc-400">
              My focus: maintainable component architectures, A11y-first interactions, and micro-interactions that
              guide users and elevate brand feel.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                data-cta
                href="mailto:you@example.com"
                className="group relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/10 transition will-change-transform"
                style={{ transform: "translate3d(var(--tx,0), var(--ty,0), 0) scale(var(--scale,1))" }}
                onMouseMove={(e) => magnetMove(e.currentTarget as HTMLElement, e)}
                onMouseLeave={(e) => magnetReset(e.currentTarget as HTMLElement)}
              >
                Contact
                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80" fill="currentColor">
                  <path d="M13 5l7 7-7 7v-4H4v-6h9V5z" />
                </svg>
              </a>
              <a
                data-cta
                href="/resume.pdf"
                target="_blank"
                className="group relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#0e1116] px-4 py-2 text-sm font-medium text-white ring-1 ring-white/10 transition will-change-transform"
                style={{ transform: "translate3d(var(--tx,0), var(--ty,0), 0) scale(var(--scale,1))" }}
                onMouseMove={(e) => magnetMove(e.currentTarget as HTMLElement, e)}
                onMouseLeave={(e) => magnetReset(e.currentTarget as HTMLElement)}
              >
                Resume
                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80" fill="currentColor">
                  <path d="M5 20h14v-2H5v2zm7-18l-5.5 9h11z" />
                </svg>
              </a>
            </div>

            {/* Stats band */}
            <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
              <StatChip label="Years" to={4} />
              <StatChip label="Projects" to={30} />
              <StatChip label="Clients" to={12} />
            </div>
          </div>

          {/* 3D Identity Deck */}
          <div className="lg:col-span-5">
            <IdentityDeck />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Identity Deck ============ */
function IdentityDeck() {
  const deckRef = useRef<HTMLDivElement>(null);

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = deckRef.current!;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 14}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
  };

  const onEnter = () => {
    const el = deckRef.current!;
    el.style.setProperty("--spread", "1");
  };

  const onLeave = () => {
    const el = deckRef.current!;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `50%`);
    el.style.setProperty("--spread", "0");
  };

  return (
    <div
      data-deck
      ref={deckRef}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative isolate h-[380px] w-full select-none"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* shadow catcher for the whole deck */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -bottom-10 -top-6 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 65%, rgba(0,0,0,0.6), rgba(0,0,0,0.28) 45%, transparent 70%)",
          filter: "blur(18px)",
        }}
      />

      {/* Top card: Profile ID */}
      <DeckCard
        index={0}
        content={
          <div className="flex items-center gap-4" style={{ transformStyle: "preserve-3d" }}>
            <img
              src="/avatar.jpg" // Replace with your image
              alt="Profile"
              className="h-16 w-16 rounded-xl object-cover"
              style={{ transform: "translateZ(20px)" }}
            />
            <div style={{ transform: "translateZ(14px)" }}>
              <div className="text-base font-semibold text-white">Your Name</div>
              <div className="text-sm text-zinc-400">Frontend Engineer • UI/UX • Motion</div>
              <div className="mt-1 text-xs text-zinc-500">Remote-friendly • Available</div>
            </div>
          </div>
        }
      />

      {/* Middle card: Principles */}
      <DeckCard
        index={1}
        content={
          <ul className="space-y-2">
            {[
              "Systems-first UI with reusable components",
              "Motion that guides, never distracts",
              "Performance budgets and A11y baked in",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-zinc-300">
                <svg width="18" height="18" viewBox="0 0 24 24" className="mt-[1px] text-emerald-400" fill="currentColor">
                  <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z" />
                </svg>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        }
      />

      {/* Bottom card: Tooling strip */}
      <DeckCard
        index={2}
        content={
          <div className="flex flex-wrap items-center gap-3 opacity-90">
            {[
              { n: "Next.js", u: "https://cdn.simpleicons.org/nextdotjs/ffffff" },
              { n: "React", u: "https://cdn.simpleicons.org/react/61DAFB" },
              { n: "TypeScript", u: "https://cdn.simpleicons.org/typescript/3178C6" },
              { n: "Tailwind", u: "https://cdn.simpleicons.org/tailwindcss/38BDF8" },
              { n: "GSAP", u: "https://cdn.simpleicons.org/greensock/88CE02" },
              { n: "Node.js", u: "https://cdn.simpleicons.org/nodedotjs/5FA04E" },
              { n: "Vite", u: "https://cdn.simpleicons.org/vite/646CFF" },
            ].map((l) => (
              <div key={l.n} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f1319] ring-1 ring-white/10">
                <img src={l.u} alt={l.n} className="h-4 w-4" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
}

function DeckCard({ index, content }: { index: 0 | 1 | 2; content: React.ReactNode }) {
  // layer transforms based on --spread (0 -> 1)
  const t = [
    // Top
    "translateZ(34px) translateX(calc(var(--spread,0)*0px)) translateY(calc(var(--spread,0)*0px)) rotateZ(calc(var(--spread,0)*0deg))",
    // Middle
    "translateZ(18px) translateX(calc(var(--spread,0)*-14px)) translateY(calc(var(--spread,0)*14px)) rotateZ(calc(var(--spread,0)*-3deg))",
    // Bottom
    "translateZ(2px) translateX(calc(var(--spread,0)*16px)) translateY(calc(var(--spread,0)*-16px)) rotateZ(calc(var(--spread,0)*3deg))",
  ][index];

  return (
    <article
      className="absolute inset-0 rounded-2xl border border-white/10 bg-[#0e1116] p-4 ring-1 ring-white/10"
      style={{
        transformStyle: "preserve-3d",
        transform: `
          rotateX(var(--rx,0)) rotateY(var(--ry,0))
          ${t}
        `,
        boxShadow: `
          0 42px 60px -28px rgba(0,0,0,0.65),
          0 16px 30px -16px rgba(0,0,0,0.55),
          0 2px 6px rgba(0,0,0,0.5),
          0 0 0 1px rgba(255,255,255,0.06)
        `,
        transition: "transform 180ms ease",
      }}
    >
      {/* inner bevel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.5), inset 0 10px 20px -18px rgba(255,255,255,0.12), inset 0 -16px 24px -24px rgba(0,0,0,0.8)",
        }}
      />
      {/* specular highlight follows cursor (deck-level vars) on top card only */}
      {index === 0 && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.08), transparent 60%)",
            mixBlendMode: "screen",
          }}
        />
      )}
      <div className="relative z-10">{content}</div>
    </article>
  );
}

/* ============ Stat Chip ============ */
function StatChip({ label, to }: { label: string; to: number }) {
  return (
    <div
      data-stat
      className="relative isolate rounded-2xl border border-white/10 bg-[#0e1116] p-3 text-center ring-1 ring-white/10"
      style={{
        boxShadow: `
          0 22px 30px -20px rgba(0,0,0,0.55),
          0 2px 6px rgba(0,0,0,0.5),
          0 0 0 1px rgba(255,255,255,0.06)
        `,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.5)" }}
      />
      <div className="text-2xl font-extrabold text-white">
        <span data-count-to={to} />
        <span className="ml-1 text-zinc-400">+</span>
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-zinc-400">{label}</div>
    </div>
  );
}

/* ============ Magnetic CTA helpers ============ */
function magnetMove(el: HTMLElement, e: React.MouseEvent) {
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  el.style.setProperty("--tx", `${x * 6}px`);
  el.style.setProperty("--ty", `${y * 6}px`);
  el.style.setProperty("--scale", "1.015");
}
function magnetReset(el: HTMLElement) {
  el.style.setProperty("--tx", `0px`);
  el.style.setProperty("--ty", `0px`);
  el.style.setProperty("--scale", "1");
}
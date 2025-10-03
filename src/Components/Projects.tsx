"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Project = {
  title: string;
  url: string;
  image?: string;      // optional: custom cover image
  preview?: string;    // optional: hover/tap video preview (mp4/webm)
  tags: string[];
  summary?: string;
  year?: number;
  repo?: string;
};

const projects: Project[] = [
  {
    title: "Plexjar",
    url: "https://plexjar.com/",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    summary: "Modern web experience with a focus on clarity and performance.",
    year: 2024,
  },
  {
    title: "Arkin PHI",
    url: "https://arkin-phi.vercel.app/",
    tags: ["Next.js", "GSAP", "UI/UX"],
    summary: "Interactive landing with premium feel and purposeful motion.",
    year: 2024,
  },
  {
    title: "Webspak",
    url: "https://webspak.vercel.app/",
    tags: ["React", "Tailwind", "Animation"],
    summary: "Product site with crisp design and smooth interactions.",
    year: 2024,
  },
  {
    title: "Akride",
    url: "https://akride.netlify.app/",
    tags: ["React", "CSS", "SPA"],
    summary: "Clean SPA showcasing content with speed and simplicity.",
    year: 2023,
  },
];

// Screenshot service fallback (swap to your own images for best quality)
const screenshot = (url: string, w = 1200) =>
  `https://image.thum.io/get/width/${w}/${encodeURIComponent(url)}`;

export function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const prefersReduced = useRef(false);
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const r = sectionRef.current!;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: r, start: "top 70%", once: true },
      });
      tl.from(r.querySelector("[data-kicker]"), { y: 14, opacity: 0, duration: 0.45, ease: "power3.out" })
        .from(r.querySelector("[data-title]"), { y: 18, opacity: 0, duration: 0.55, ease: "power3.out" }, "-=0.2")
        .from(r.querySelectorAll("[data-sub]"), { y: 12, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.06 }, "-=0.2")
        .from(".proj-item", { y: 26, opacity: 0, scale: 0.98, duration: 0.55, ease: "power3.out", stagger: 0.06 }, "-=0.1");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Center to card i with GSAP smooth scroll
  const centerTo = (i: number) => {
    const track = trackRef.current!;
    const el = itemRefs.current[i];
    if (!track || !el) return;
    const left = el.offsetLeft - (track.clientWidth - el.clientWidth) / 2;
    if (prefersReduced.current) {
      track.scrollTo({ left, behavior: "smooth" });
    } else {
      gsap.to(track, { scrollLeft: left, duration: 0.6, ease: "power3.out" });
    }
  };

  // Active index + Coverflow transform on scroll
  useEffect(() => {
    const track = trackRef.current!;
    const applyCoverflow = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let min = Infinity;
      itemRefs.current.forEach((el, i) => {
        const c = el.offsetLeft + el.clientWidth / 2;
        const d = c - center;
        const abs = Math.abs(d);
        if (abs < min) { min = abs; nearest = i; }
        const ratio = Math.min(1, abs / (track.clientWidth * 0.7)); // 0..1
        const scale = 1 - ratio * 0.08; // shrink edges
        const ry = (d / track.clientWidth) * 12; // rotateY
        el.style.setProperty("--cf-scale", String(scale));
        el.style.setProperty("--cf-ry", `${ry}deg`);
        el.style.setProperty("--cf-opacity", String(1 - ratio * 0.25));
      });
      setActive(nearest);
    };
    applyCoverflow();
    track.addEventListener("scroll", applyCoverflow, { passive: true });
    const ro = new ResizeObserver(applyCoverflow);
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", applyCoverflow);
      ro.disconnect();
    };
  }, []);

  // Drag to swipe + snap with momentum bias
  useEffect(() => {
    const track = trackRef.current!;
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDown = true;
      track.classList.add("dragging");
      track.setPointerCapture?.(e.pointerId);
      startX = e.clientX;
      startScroll = track.scrollLeft;
      lastX = e.clientX;
      lastT = performance.now();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const dx = e.clientX - startX;
      track.scrollLeft = startScroll - dx;
      const now = performance.now();
      const dt = now - lastT || 1;
      velocity = (e.clientX - lastX) / dt; // px per ms
      lastX = e.clientX;
      lastT = now;
    };
    const snap = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let min = Infinity;
      itemRefs.current.forEach((el, i) => {
        const c = el.offsetLeft + el.clientWidth / 2;
        const d = Math.abs(c - center);
        if (d < min) { min = d; nearest = i; }
      });
      if (Math.abs(velocity) > 0.5) {
        nearest = Math.max(0, Math.min(projects.length - 1, nearest + (velocity > 0 ? -1 : 1)));
      }
      centerTo(nearest);
    };
    const end = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove("dragging");
      track.releasePointerCapture?.(e.pointerId);
      snap();
    };

    track.addEventListener("pointerdown", onPointerDown, { passive: true });
    track.addEventListener("pointermove", onPointerMove, { passive: false });
    track.addEventListener("pointerup", end, { passive: true });
    track.addEventListener("pointercancel", () => isDown && snap(), { passive: true });
    track.addEventListener("pointerleave", () => isDown && snap(), { passive: true });

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", end);
    };
  }, []);

  const prev = () => centerTo(Math.max(0, active - 1));
  const next = () => centerTo(Math.min(projects.length - 1, active + 1));

  return (
    <section ref={sectionRef} className="relative bg-[#0b0d10]">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <span data-kicker className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-300">
              Projects
            </span>
            <h2 data-title className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Selected work
            </h2>
            <p data-sub className="mt-2 max-w-2xl text-zinc-400">
              Swipe through—smooth coverflow, live previews, and quick access.
            </p>
          </div>

          {/* Arrows (desktop) */}
          <div className="hidden items-center gap-2 lg:flex">
            <button
              aria-label="Previous"
              onClick={prev}
              className="rounded-lg border border-white/10 bg-[#0e1116]/90 p-2 text-zinc-300 ring-1 ring-white/10 transition hover:text-white"
            >
              ‹
            </button>
            <button
              aria-label="Next"
              onClick={next}
              className="rounded-lg border border-white/10 bg-[#0e1116]/90 p-2 text-zinc-300 ring-1 ring-white/10 transition hover:text-white"
            >
              ›
            </button>
          </div>
        </header>

        {/* Horizontal coverflow */}
        <div
          ref={trackRef}
          className="no-scrollbar relative -mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 pb-8 pt-2"
          style={{ touchAction: "pan-y" }}
        >
          {projects.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => { if (el) itemRefs.current[i] = el; }}
              className="proj-item group relative h-full w-[85vw] shrink-0 snap-center sm:w-[70vw] md:w-[60vw] lg:w-[48rem]"
              style={{
                transform: "perspective(1200px) rotateY(var(--cf-ry,0)) scale(var(--cf-scale,1))",
                opacity: "var(--cf-opacity, 1)",
                transition: "transform 400ms cubic-bezier(.2,.8,.2,1), opacity 300ms ease",
                willChange: "transform, opacity",
              }}
            >
              <ProjectCard project={p} onQuickPreview={() => setModal({ url: p.url, title: p.title })} />
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => centerTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full ring-1 ring-white/10 ${active === i ? "bg-white/70" : "bg-white/20"}`}
            />
          ))}
        </div>
      </div>

      {/* Quick Preview Modal (expanded live site) */}
      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0e1116] ring-1 ring-white/10">
            <div className="flex items-center justify-between border-b border-white/10 p-3">
              <div className="text-sm font-medium text-white">{modal.title}</div>
              <div className="flex items-center gap-2">
                <a
                  href={modal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white ring-1 ring-white/10"
                >
                  Open ↗
                </a>
                <button
                  onClick={() => setModal(null)}
                  className="rounded-lg border border-white/10 bg-[#11151b] p-2 text-zinc-300 ring-1 ring-white/10 hover:text-white"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="aspect-[16/9] w-full">
              <iframe
                src={modal.url}
                title={modal.title}
                className="h-full w-full"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .dragging { cursor: grabbing; }
      `}</style>
    </section>
  );
}

/* ============ Card ============ */
function ProjectCard({ project, onQuickPreview }: { project: Project; onQuickPreview: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const coverHi = project.image || screenshot(project.url, 1280);
  const coverLow = project.image || screenshot(project.url, 360);

  return (
    <article
      ref={cardRef}
      className="group relative isolate overflow-hidden rounded-2xl border border-white/10 bg-[#0e1116] ring-1 ring-white/10"
    >
      {/* Preview container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {/* Fallback Screenshot (blur-up) */}
        <img
          src={coverLow}
          alt=""
          className="h-full w-full object-cover blur-sm scale-105"
          aria-hidden
        />
        <img
          src={coverHi}
          alt={`${project.title} preview`}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: imgLoaded ? 1 : 0 }}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
          decoding="async"
        />

        {/* Live Preview (only loads when in view) */}
        {inView && (
          <iframe
            src={project.url}
            title={`${project.title} live preview`}
            className="absolute inset-0 h-full w-full rounded-b-none transition-opacity duration-500"
            style={{ opacity: iframeLoaded ? 1 : 0 }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"
            loading="lazy"
            onLoad={() => setIframeLoaded(true)}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">{project.title}</h3>
            {project.summary && <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{project.summary}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onQuickPreview}
              className="rounded-lg border border-white/10 bg-[#0f1319] px-2 py-1.5 text-xs text-zinc-300 ring-1 ring-white/10 transition hover:text-white"
            >
              Expand
            </button>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/10 transition"
            >
              Visit →
            </a>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {project.tags.map((t) => (
            <span key={t} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-zinc-300">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Project = {
  title: string;
  url: string;
  image?: string;
  preview?: string;
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
    // image: "/projects/plexjar.jpg",
    // preview: "/previews/plexjar.mp4",
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

const screenshot = (url: string, w = 1200) =>
  `https://image.thum.io/get/width/${w}/${encodeURIComponent(url)}`;

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const prefersReduced = useRef(false);
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    prefersReduced.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
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

  // center helper
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

  // coverflow transforms
  useEffect(() => {
    const track = trackRef.current!;
    if (!track) return;
    const apply = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let min = Infinity;
      itemRefs.current.forEach((el, i) => {
        const c = el.offsetLeft + el.clientWidth / 2;
        const d = c - center;
        const abs = Math.abs(d);
        if (abs < min) { min = abs; nearest = i; }
        const ratio = Math.min(1, abs / (track.clientWidth * 0.7));
        const scale = 1 - ratio * 0.08;
        const ry = (d / track.clientWidth) * 12;
        el.style.setProperty("--cf-scale", String(scale));
        el.style.setProperty("--cf-ry", `${ry}deg`);
        el.style.setProperty("--cf-opacity", String(1 - ratio * 0.25));
      });
      setActive(nearest);
    };
    apply();
    track.addEventListener("scroll", apply, { passive: true });
    const ro = new ResizeObserver(apply);
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", apply);
      ro.disconnect();
    };
  }, []);

  // drag swipe + snap
  useEffect(() => {
    const track = trackRef.current!;
    if (!track) return;
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
      velocity = (e.clientX - lastX) / dt;
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

  // keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") centerTo(Math.max(0, active - 1));
      if (e.key === "ArrowRight") centerTo(Math.min(projects.length - 1, active + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const prev = () => centerTo(Math.max(0, active - 1));
  const next = () => centerTo(Math.min(projects.length - 1, active + 1));

  return (
    <section ref={sectionRef} className="relative overflow-hidden" aria-labelledby="projects-title">
      {/* Animated background layer */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#06060a] via-[#0b0d12] to-[#0d0f14] animate-bg-shift opacity-80" />
        <div className="absolute -left-24 -top-20 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#6b21a8] to-[#ff7ab6] opacity-10 blur-3xl animate-slow-spin" />
        <div className="absolute right-10 bottom-10 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#1e3a8a] to-[#06b6d4] opacity-8 blur-2xl animate-slow-spin-rev" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24">
        <header className="mb-8 flex items-center justify-between gap-6">
          <div>
            <span data-kicker className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/3 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-sm">
              Projects
            </span>
            <h2 id="projects-title" data-title className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Selected work
            </h2>
            <p data-sub className="mt-2 max-w-2xl text-zinc-400">
              Immersive previews — live embeds, subtle motion, and elegant micro-interactions.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              aria-label="Previous"
              onClick={prev}
              className="group flex items-center justify-center h-10 w-10 rounded-lg border border-white/8 bg-[#0f1319]/80 p-2 text-zinc-300 ring-1 ring-white/6 transition-transform hover:scale-105"
            >
              ‹
            </button>
            <button
              aria-label="Next"
              onClick={next}
              className="group flex items-center justify-center h-10 w-10 rounded-lg border border-white/8 bg-[#0f1319]/80 p-2 text-zinc-300 ring-1 ring-white/6 transition-transform hover:scale-105"
            >
              ›
            </button>
          </div>
        </header>

        {/* Carousel */}
        <div
          ref={trackRef}
          className="no-scrollbar relative -mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 pb-8 pt-2"
          style={{ touchAction: "pan-y" }}
        >
          {projects.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => {
                if (el) itemRefs.current[i] = el;
              }}
              className="proj-item group relative h-full w-[85vw] shrink-0 snap-center sm:w-[70vw] md:w-[60vw] lg:w-[48rem]"
              style={{
                transform: "perspective(1200px) rotateY(var(--cf-ry,0)) scale(var(--cf-scale,1))",
                opacity: "var(--cf-opacity,1)",
                transition: "transform 400ms cubic-bezier(.2,.8,.2,1), opacity 300ms ease",
                willChange: "transform, opacity",
              }}
            >
              <ProjectCard
                project={p}
                onQuickPreview={() => setModal({ url: p.url, title: p.title })}
                accentIndex={i}
              />
            </div>
          ))}
        </div>

        {/* Dots / thumbnails */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="w-[260px] h-1 rounded-full bg-white/6 overflow-hidden">
            <div
              aria-hidden
              style={{ width: `${((active + 1) / projects.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-violet-400 to-pink-400 transition-all duration-400"
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-white/8 bg-[#0d1014] ring-1 ring-white/6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/8 p-3">
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-white">{modal.title}</div>
                <div className="text-xs text-zinc-400">{modal.url.replace(/^https?:\/\//, "")}</div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={modal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/8 bg-white/6 px-3 py-1.5 text-xs text-white ring-1 ring-white/6"
                >
                  Open ↗
                </a>
                <button
                  onClick={() => setModal(null)}
                  className="rounded-lg border border-white/8 bg-[#11151b] p-2 text-zinc-300 ring-1 ring-white/6 hover:text-white"
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

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .dragging { cursor: grabbing; }

        /* Animated background helpers */
        @keyframes bgShift {
          0% { transform: translateY(0px) scale(1); opacity: 0.8 }
          50% { transform: translateY(-30px) scale(1.02); opacity: 0.9 }
          100% { transform: translateY(0px) scale(1); opacity: 0.8 }
        }
        .animate-bg-shift { animation: bgShift 18s ease-in-out infinite; }

        @keyframes slowSpin {
          0% { transform: rotate(0deg) translateZ(0); }
          100% { transform: rotate(360deg) translateZ(0); }
        }
        .animate-slow-spin { animation: slowSpin 60s linear infinite; }
        .animate-slow-spin-rev { animation: slowSpin 80s linear infinite reverse; }
      `}</style>
    </section>
  );
}

/* ================= ProjectCard (enhanced UI) ================= */
function ProjectCard({
  project,
  onQuickPreview,
  accentIndex,
}: {
  project: Project;
  onQuickPreview: () => void;
  accentIndex?: number;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  // Removed unused 'tilt' state

  // lazy load iframe when visible
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // pointer tilt handler
  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * 8;
    const ry = (x - 0.5) * 12;
    // Removed setTilt, only update CSS variables
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
  };
  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    // Removed setTilt, only update CSS variables
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `50%`);
  };

  const coverHi = project.image || screenshot(project.url, 1280);
  const coverLow = project.image || screenshot(project.url, 360);

  // subtle accent color for glow based on index
  const accentGradient = [
    "from-violet-400 to-pink-400",
    "from-emerald-300 to-sky-400",
    "from-yellow-400 to-orange-400",
    "from-indigo-400 to-cyan-300",
  ][(accentIndex ?? 0) % 4];

  return (
    <article
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative isolate overflow-hidden rounded-2xl border border-white/6 bg-gradient-to-br from-[#0c0f12] to-[#0f1319] backdrop-blur-sm shadow-[0_8px_30px_rgba(2,6,23,0.6)]"
      style={{
        transformStyle: "preserve-3d",
        transform: "rotateX(var(--rx,0)) rotateY(var(--ry,0))",
        transition: "transform 180ms ease",
      }}
      aria-label={`${project.title} project card`}
    >
      {/* browser chrome mock */}
      <div className="flex items-center gap-2 px-3 py-2 bg-black/20 border-b border-white/4">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
        <div className="ml-3 text-xs text-zinc-400 truncate">{project.url.replace(/^https?:\/\//, "")}</div>
        <div className="ml-auto hidden sm:inline-flex items-center gap-2">
          {project.year && <div className="rounded-full bg-white/6 px-2 py-0.5 text-[11px] text-zinc-300">{project.year}</div>}
          <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${accentGradient} opacity-30`} />
        </div>
      </div>

      {/* preview area */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {/* LQIP */}
        <img src={coverLow} alt="" className="absolute inset-0 h-full w-full object-cover blur-sm scale-105" aria-hidden />
        {/* hi-res crossfade */}
        <img
          src={coverHi}
          alt={`${project.title} preview`}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: imgLoaded ? 1 : 0, transform: "translateZ(14px) scale(1.01)" }}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />

        {/* iframe (lazy load when in view) */}
        {inView && (
          <iframe
            src={project.url}
            title={`${project.title} live preview`}
            className="absolute inset-0 h-full w-full rounded-b-none transition-opacity duration-600"
            style={{ opacity: iframeLoaded ? 1 : 0, backdropFilter: "blur(0px)" }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"
            loading="lazy"
            onLoad={() => setIframeLoaded(true)}
          />
        )}

        {/* glare */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.06), transparent 60%)",
            mixBlendMode: "screen",
          }}
        />

        {/* live badge */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300 ring-1 ring-emerald-400/20">LIVE</span>
        </div>

        {/* subtle bottom vignette */}
        <div aria-hidden className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* content */}
      <div className="flex flex-col gap-3 p-4" style={{ transform: "translateZ(12px)" }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-white">{project.title}</h3>
            {project.summary && <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{project.summary}</p>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onQuickPreview}
              className="rounded-lg border border-white/8 bg-[#0e1116] px-2 py-1.5 text-xs text-zinc-300 ring-1 ring-white/6 transition-transform hover:scale-[1.03]"
            >
              Expand
            </button>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/8 bg-white/6 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/6 transition-transform hover:translate-x-0.5"
            >
              Visit →
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className={`rounded-full px-2 py-1 text-[11px] font-medium text-zinc-300 bg-white/3 ring-1 ring-white/4`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        article { will-change: transform; }
      `}</style>
    </article>
  );
}

export default ProjectsSection;

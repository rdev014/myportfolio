import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ============ About Section ============ */
export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const r = sectionRef.current!;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: r, start: "top 70%", once: true },
      });

      tl.from(r.querySelector("[data-kicker]"), { y: 14, opacity: 0, duration: 0.45, ease: "power3.out" })
        .from(r.querySelector("[data-title]"), { y: 18, opacity: 0, duration: 0.55, ease: "power3.out" }, "-=0.15")
        .from(r.querySelectorAll("[data-body]"), {
          y: 14,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.06,
        }, "-=0.25")
        .from(r.querySelectorAll("[data-cta]"), {
          y: 12,
          opacity: 0,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.06,
        }, "-=0.2")
        .from(r.querySelector("[data-deck]"), {
          y: 22,
          opacity: 0,
          scale: 0.985,
          duration: 0.6,
          ease: "power3.out",
        }, "-=0.1")
        .from(r.querySelectorAll("[data-stat]"), {
          y: 16,
          opacity: 0,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.05,
        }, "-=0.25")
        .from(r.querySelector("[data-contact]"), {
          y: 18,
          opacity: 0,
          duration: 0.55,
          ease: "power3.out",
        }, "-=0.1");

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
            onUpdate: () => {
              el.textContent = Math.round(obj.val).toString();
            },
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

            <p data-body className="mt-4 text-zinc-300">
              Strong UI systems, crisp motion, and rigorous performance. I work in Next.js, TypeScript, Tailwind, and GSAP
              to ship experiences that feel physical and effortless—without visual noise.
            </p>
            <p data-body className="mt-3 text-zinc-300">
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

            {/* Stats */}
            <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
              <StatChip label="Years" to={4} />
              <StatChip label="Projects" to={30} />
              <StatChip label="Clients" to={12} />
            </div>

            {/* Mail-like Contact Composer */}
            <ContactComposer data-contact />
          </div>

          {/* Right: Advanced 3D Identity Deck */}
          <div className="lg:col-span-5" data-deck>
            <IdentityDeck />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Identity Deck (inertial tilt, drag/click/keys reorder) ============ */
type CardId = "skills" | "rings" | "flow";

function IdentityDeck() {
  const deckRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<CardId[]>(["skills", "rings", "flow"]);
  const cardRefs = useRef<Record<CardId, HTMLElement | null>>({
    skills: null,
    rings: null,
    flow: null,
  });
  const dragging = useRef<{ id: CardId; startX: number; startY: number; dx: number; dy: number } | null>(null);

  // inertial tilt
  const target = useRef({ rx: 0, ry: 0, mx: 50, my: 50 });
  const current = useRef({ rx: 0, ry: 0, mx: 50, my: 50 });
  const rafId = useRef<number | null>(null);
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tick = () => {
    current.current.rx += (target.current.rx - current.current.rx) * 0.12;
    current.current.ry += (target.current.ry - current.current.ry) * 0.12;
    current.current.mx += (target.current.mx - current.current.mx) * 0.18;
    current.current.my += (target.current.my - current.current.my) * 0.18;
    const el = deckRef.current!;
    el.style.setProperty("--rx", `${current.current.rx}deg`);
    el.style.setProperty("--ry", `${current.current.ry}deg`);
    el.style.setProperty("--mx", `${current.current.mx}%`);
    el.style.setProperty("--my", `${current.current.my}%`);
    rafId.current = requestAnimationFrame(tick);
  };
  const startLoop = () => {
    if (prefersReduced) return;
    if (rafId.current == null) rafId.current = requestAnimationFrame(tick);
  };
  const stopLoop = () => {
    if (rafId.current != null) cancelAnimationFrame(rafId.current);
    rafId.current = null;
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const el = deckRef.current!;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    target.current.rx = (0.5 - y) * 10;
    target.current.ry = (x - 0.5) * 14;
    target.current.mx = x * 100;
    target.current.my = y * 100;
    startLoop();
  };
  const onPointerEnter = () => {
    const el = deckRef.current!;
    el.style.setProperty("--spread", "1");
    startLoop();
  };
  const onPointerLeave = () => {
    const el = deckRef.current!;
    target.current = { rx: 0, ry: 0, mx: 50, my: 50 };
    el.style.setProperty("--spread", "0");
    setTimeout(() => stopLoop(), 260);
  };

  // reorder
  const bringToFront = (id: CardId) => setOrder((prev) => [id, ...prev.filter((p) => p !== id)]);
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") setOrder(([a, b, c]) => [b, c, a]);
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") setOrder(([a, b, c]) => [c, a, b]);
  };

  const onPointerDown = (id: CardId) => (e: React.PointerEvent) => {
    const targetEl = cardRefs.current[id];
    if (!targetEl) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = { id, startX: e.clientX, startY: e.clientY, dx: 0, dy: 0 };
    targetEl.style.zIndex = "60";
    targetEl.style.transition = "none";
  };
  const onPointerMoveCard = (id: CardId) => (e: React.PointerEvent) => {
    if (!dragging.current || dragging.current.id !== id) return;
    const targetEl = cardRefs.current[id];
    if (!targetEl) return;
    const dx = e.clientX - dragging.current.startX;
    const dy = e.clientY - dragging.current.startY;
    dragging.current.dx = dx;
    dragging.current.dy = dy;
    targetEl.style.setProperty("--dx", `${dx}px`);
    targetEl.style.setProperty("--dy", `${dy}px`);
  };
  const onPointerUp = (id: CardId) => () => {
    if (!dragging.current || dragging.current.id !== id) return;
    const { dx } = dragging.current;
    const targetEl = cardRefs.current[id];
    dragging.current = null;
    if (!targetEl) return;

    targetEl.style.transition = "transform 220ms ease";
    const threshold = 70;
    if (Math.abs(dx) >= threshold) {
      setOrder((prev) => {
        const filtered = prev.filter((p) => p !== id);
        return dx > 0 ? [id, ...filtered] : [...filtered, id];
      });
    }
    gsap.to(targetEl, {
      duration: 0.25,
      ease: "power2.out",
      css: { "--dx": "0px", "--dy": "0px" } as any,
      onComplete: () => {
        targetEl.style.removeProperty("transition");
        targetEl.style.removeProperty("z-index");
      },
    });
  };

  const slotOf = (id: CardId) => order.indexOf(id) as 0 | 1 | 2;

  return (
    <div
      ref={deckRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="group relative isolate h-[460px] w-full select-none outline-none"
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      aria-label="Identity cards. Drag left/right, click, or use arrow keys to reorder."
    >
      {/* Deck shadow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -bottom-10 -top-6 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 65%, rgba(0,0,0,0.6), rgba(0,0,0,0.28) 45%, transparent 70%)",
          filter: "blur(18px)",
        }}
      />

      {/* Card 1: Skills */}
      <DeckCard
        id="skills"
        slot={slotOf("skills")}
        registerRef={(el) => (cardRefs.current.skills = el)}
        onPointerDown={onPointerDown("skills")}
        onPointerMove={onPointerMoveCard("skills")}
        onPointerUp={onPointerUp("skills")}
        onClick={() => bringToFront("skills")}
        content={
          <Centered>
            <NetworkCardPro
              core={{ name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/ffffff", color: "#60A5FA" }}
              nodes={[
                { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB", color: "#61DAFB" },
                { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6", color: "#3178C6" },
                { name: "Tailwind", icon: "https://cdn.simpleicons.org/tailwindcss/38BDF8", color: "#38BDF8" },
                { name: "GSAP", icon: "https://cdn.simpleicons.org/greensock/88CE02", color: "#88CE02" },
                { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E", color: "#5FA04E" },
                { name: "Vite", icon: "https://cdn.simpleicons.org/vite/646CFF", color: "#646CFF" },
              ]}
              pulseColor="#60A5FA"
              height={280}
              nodeSize={16}
              radius={42}
            />
          </Centered>
        }
      />

      {/* Card 2: Rings */}
      <DeckCard
        id="rings"
        slot={slotOf("rings")}
        registerRef={(el) => (cardRefs.current.rings = el)}
        onPointerDown={onPointerDown("rings")}
        onPointerMove={onPointerMoveCard("rings")}
        onPointerUp={onPointerUp("rings")}
        onClick={() => bringToFront("rings")}
        content={
          <Centered>
            <RingsCardPro
              title="Focus Areas"
              rings={[
                { label: "Frontend", color: "#60A5FA", pct: 92 },
                { label: "Motion", color: "#22D3EE", pct: 86 },
                { label: "Testing", color: "#34D399", pct: 74 },
              ]}
              height={280}
            />
          </Centered>
        }
      />

      {/* Card 3: Pipeline Flow */}
      <DeckCard
        id="flow"
        slot={slotOf("flow")}
        registerRef={(el) => (cardRefs.current.flow = el)}
        onPointerDown={onPointerDown("flow")}
        onPointerMove={onPointerMoveCard("flow")}
        onPointerUp={onPointerUp("flow")}
        onClick={() => bringToFront("flow")}
        content={
          <Centered>
            <PipelineFlow
              color="#60A5FA"
              height={280}
              stages={[
                { label: "Ideate" },
                { label: "Design" },
                { label: "Build" },
                { label: "Test" },
                { label: "Ship" },
              ]}
            />
          </Centered>
        }
      />
    </div>
  );
}

function DeckCard({
  id,
  slot,
  content,
  registerRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onClick,
}: {
  id: CardId;
  slot: 0 | 1 | 2;
  content: React.ReactNode;
  registerRef: (el: HTMLElement | null) => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onClick: () => void;
}) {
  const t = [
    "translateZ(34px) translateX(calc(var(--spread,0)*0px)) translateY(calc(var(--spread,0)*0px)) rotateZ(calc(var(--spread,0)*0deg))",
    "translateZ(18px) translateX(calc(var(--spread,0)*-14px)) translateY(calc(var(--spread,0)*14px)) rotateZ(calc(var(--spread,0)*-3deg))",
    "translateZ(2px) translateX(calc(var(--spread,0)*16px)) translateY(calc(var(--spread,0)*-16px)) rotateZ(calc(var(--spread,0)*3deg))",
  ][slot];

  const z = [30, 20, 10][slot];
  const filter =
    slot === 0
      ? "none"
      : slot === 1
      ? "blur(0.3px) saturate(0.98) brightness(0.99)"
      : "blur(0.8px) saturate(0.95) brightness(0.985)";

  return (
    <article
      role="group"
      aria-roledescription="Draggable card"
      aria-label={id}
      ref={registerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={onClick}
      className="absolute inset-0 touch-none cursor-grab rounded-2xl border border-white/10 bg-[#0e1116] p-4 ring-1 ring-white/10"
      style={{
        zIndex: z,
        transformStyle: "preserve-3d",
        transform: `
          rotateX(var(--rx,0)) rotateY(var(--ry,0))
          ${t}
          translate3d(var(--dx, 0px), var(--dy, 0px), 0)
        `,
        filter,
        boxShadow: `
          0 42px 60px -28px rgba(0,0,0,0.65),
          0 16px 30px -16px rgba(0,0,0,0.55),
          0 2px 6px rgba(0,0,0,0.5),
          0 0 0 1px rgba(255,255,255,0.06)
        `,
        transition: "transform 220ms cubic-bezier(.2,.8,.2,1), filter 240ms ease",
        userSelect: "none",
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
      {/* specular on top */}
      {slot === 0 && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.1), transparent 60%)",
            mixBlendMode: "screen",
          }}
        />
      )}
      <div className="relative z-10 h-full">{content}</div>
    </article>
  );
}

/* ============ Center helper ============ */
function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="w-full max-w-[560px]">{children}</div>
    </div>
  );
}

/* ============ Card 1: Advanced Skills Network ============ */
function NetworkCardPro({
  core,
  nodes,
  pulseColor = "#60A5FA",
  height = 280,
  nodeSize = 16,
  radius = 42,
}: {
  core: { name: string; icon: string; color: string };
  nodes: { name: string; icon: string; color: string }[];
  pulseColor?: string;
  height?: number;
  nodeSize?: number;
  radius?: number;
}) {
  return (
    <div className="relative w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background:
            "radial-gradient(520px 380px at var(--mx,50%) var(--my,50%), rgba(96,165,250,0.06), transparent 60%)",
        }}
      />
      <RadialNetworkPro
        core={core}
        nodes={nodes}
        pulseColor={pulseColor}
        height={height}
        nodeSize={nodeSize}
        radius={radius}
      />
    </div>
  );
}

function RadialNetworkPro({
  core,
  nodes,
  pulseColor,
  height,
  nodeSize,
  radius,
}: {
  core: { name: string; icon: string; color: string };
  nodes: { name: string; icon: string; color: string }[];
  pulseColor: string;
  height: number;
  nodeSize: number;
  radius: number;
}) {
  const R = radius;
  const cx = 50;
  const cy = 50;
  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const [hovered, setHovered] = useState<number | null>(null);

  const positions = nodes.map((n, i) => {
    const a = -Math.PI / 2 + (i * (2 * Math.PI / nodes.length));
    const x = cx + Math.cos(a) * R;
    const y = cy + Math.sin(a) * R;
    const len = Math.hypot(x - cx, y - cy);
    const seg = Math.max(6, len * 0.18);
    return { ...n, x, y, len, seg, delay: i * 0.2, a };
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className="block w-full"
      style={{ height }}
      aria-hidden
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
    >
      <defs>
        <radialGradient id="corePulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={pulseColor} stopOpacity="0.22" />
          <stop offset="60%" stopColor={pulseColor} stopOpacity="0.08" />
          <stop offset="100%" stopColor={pulseColor} stopOpacity="0" />
        </radialGradient>
        <filter id="blueGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.0" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="lineBase" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={pulseColor} stopOpacity="0.22" />
          <stop offset="100%" stopColor={pulseColor} stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="lineBright" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={pulseColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={pulseColor} stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* ring */}
      <circle cx={cx} cy={cy} r={R + 2} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.45" vectorEffect="non-scaling-stroke" />

      {/* core pulses */}
      {!prefersReduced && (
        <>
          <circle cx={cx} cy={cy} r="2" fill="url(#corePulse)">
            <animate attributeName="r" values="2;40;2" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r="2" fill="url(#corePulse)">
            <animate attributeName="r" values="2;36;2" dur="2.7s" repeatCount="indefinite" begin="0.45s" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="2.7s" repeatCount="indefinite" begin="0.45s" />
          </circle>
        </>
      )}

      {/* orbit group */}
      <g transform="rotate(0 50 50)">
        {!prefersReduced && (
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="22s" repeatCount="indefinite" />
        )}

        {/* center -> node lines */}
        {positions.map((p, idx) => {
          const angle = Math.atan2(p.y - cy, p.x - cx);
          const ux = Math.cos(angle);
          const uy = Math.sin(angle);
          const offset = nodeSize * 0.35;
          const x2 = p.x - ux * offset;
          const y2 = p.y - uy * offset;
          const baseW = hovered === idx ? 1.4 : 0.7;

          return (
            <g key={`line-${p.name}`} filter="url(#blueGlow)">
              <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="url(#lineBase)" strokeWidth={baseW} vectorEffect="non-scaling-stroke" />
              {!prefersReduced && (
                <line
                  x1={cx}
                  y1={cy}
                  x2={x2}
                  y2={y2}
                  stroke="url(#lineBright)"
                  strokeWidth={hovered === idx ? 1.7 : 1.1}
                  strokeDasharray={`${p.seg} ${p.len + 40}`}
                  strokeDashoffset="0"
                  vectorEffect="non-scaling-stroke"
                >
                  <animate attributeName="stroke-dashoffset" values={`0;-${p.len + 40}`} dur="1.9s" begin={`${p.delay}s`} repeatCount="indefinite" />
                </line>
              )}
            </g>
          );
        })}

        {/* core */}
        <g>
          <circle cx={cx} cy={cy} r={10.5} fill="#0f1319" stroke="rgba(255,255,255,0.1)" />
          <image href={core.icon} x={cx - 8} y={cy - 8} width="16" height="16" preserveAspectRatio="xMidYMid meet" style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.6))" }} />
        </g>

        {/* nodes */}
        {positions.map((p, idx) => (
          <g key={`node-${p.name}`} onMouseEnter={() => setHovered(idx)} onMouseLeave={() => setHovered(null)}>
            <circle cx={p.x} cy={p.y} r={hovered === idx ? 10 : 9} fill="#0f1319" stroke="rgba(255,255,255,0.1)" />
            <image href={p.icon} x={p.x - nodeSize / 2} y={p.y - nodeSize / 2} width={nodeSize} height={nodeSize} preserveAspectRatio="xMidYMid meet" style={{ filter: `drop-shadow(0 1px 2px rgba(0,0,0,0.6))` }} />
            <title>{p.name}</title>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ============ Card 2: Concentric Rings ============ */
function RingsCardPro({
  title,
  rings,
  height = 280,
}: {
  title: string;
  rings: { label: string; color: string; pct: number }[];
  height?: number;
}) {
  const [active, setActive] = useState(0);
  const radiusList = [36, 28, 20];
  const circ = (r: number) => 2 * Math.PI * r;

  return (
    <div className="w-full">
      <div className="mb-2 text-center text-sm font-semibold text-white">{title}</div>
      <svg viewBox="0 0 100 100" className="block w-full" style={{ height }} aria-hidden shapeRendering="geometricPrecision">
        <defs>
          {rings.map((r, i) => (
            <linearGradient id={`ring-grad-${i}`} x1="0" y1="0" x2="1" y2="0" key={i}>
              <stop offset="0%" stopColor={r.color} stopOpacity="0.95" />
              <stop offset="100%" stopColor={r.color} stopOpacity="0.55" />
            </linearGradient>
          ))}
        </defs>

        <circle cx="50" cy="50" r={radiusList[0] + 7} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />

        {rings.map((r, i) => {
          const radius = radiusList[i];
          const c = circ(radius);
          const dash = (r.pct / 100) * c;
          return (
            <g key={r.label} onMouseEnter={() => setActive(i)}>
              <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={`url(#ring-grad-${i})`}
                strokeWidth={active === i ? 4.8 : 4}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${c - dash}`}
                transform="rotate(-90 50 50)"
                vectorEffect="non-scaling-stroke"
              >
                <animate attributeName="stroke-dasharray" values={`0 ${c}; ${dash} ${c - dash}`} dur="0.9s" fill="freeze" />
              </circle>
              <circle cx="50" cy={50 - radius} r="1.6" fill={r.color} opacity={active === i ? 0.95 : 0.75} />
            </g>
          );
        })}

        {/* center label */}
        <g>
          <circle cx="50" cy="50" r="10" fill="#0f1319" stroke="rgba(255,255,255,0.1)" />
          <text x="50" y="49" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.95)" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" }}>
            {rings[active].pct}%
          </text>
          <text x="50" y="56" textAnchor="middle" fontSize="3.2" fill="rgba(255,255,255,0.7)" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" }}>
            {rings[active].label}
          </text>
        </g>
      </svg>

      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[10px] text-zinc-400">
        {rings.map((r, i) => (
          <div key={r.label} className={i === active ? "text-white" : undefined}>
            <span className="mr-1 inline-block h-2 w-2 rounded-full align-middle" style={{ background: r.color }} />
            {r.label} {r.pct}%
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ Card 3: Pipeline Flow ============ */
function PipelineFlow({
  stages = [
    { label: "Ideate" },
    { label: "Design" },
    { label: "Build" },
    { label: "Test" },
    { label: "Ship" },
  ],
  color = "#60A5FA",
  height = 280,
}: {
  stages?: { label: string }[];
  color?: string;
  height?: number;
}) {
  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const d = "M 8 60 C 25 40, 40 65, 52 50 C 64 35, 78 60, 92 45";

  const nodes = [
    { x: 14, y: 58, label: stages[0]?.label ?? "" },
    { x: 32, y: 44, label: stages[1]?.label ?? "" },
    { x: 50, y: 52, label: stages[2]?.label ?? "" },
    { x: 68, y: 38, label: stages[3]?.label ?? "" },
    { x: 86, y: 46, label: stages[4]?.label ?? "" },
  ];

  return (
    <div className="relative w-full">
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl"
           style={{ background: "radial-gradient(520px 380px at var(--mx,50%) var(--my,50%), rgba(96,165,250,0.06), transparent 60%)" }} />
      <svg viewBox="0 0 100 100" className="block w-full" style={{ height }} aria-hidden shapeRendering="geometricPrecision">
        <defs>
          <filter id="flow-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.0" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="flow-base" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="flow-bright" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="0.45" />
          </linearGradient>
        </defs>

        <ellipse cx={50} cy={50} rx={41} ry={28} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.45" vectorEffect="non-scaling-stroke" />

        <path d={d} fill="none" stroke="url(#flow-base)" strokeWidth="1.6" filter="url(#flow-glow)" vectorEffect="non-scaling-stroke" />

        {!prefersReduced && (
          <path d={d} fill="none" stroke="url(#flow-bright)" strokeWidth="2.3" strokeDasharray="28 420" strokeDashoffset="0" vectorEffect="non-scaling-stroke">
            <animate attributeName="stroke-dashoffset" values="0;-420" dur="2s" repeatCount="indefinite" />
          </path>
        )}

        {nodes.map((n, i) => (
          <g key={i}>
            <ellipse cx={n.x} cy={n.y + 2} rx="5.2" ry="2" fill="rgba(0,0,0,0.35)" style={{ filter: "blur(0.8px)" }} />
            <circle cx={n.x} cy={n.y} r="7.2" fill="#0f1319" stroke="rgba(255,255,255,0.1)" />
            <circle cx={n.x} cy={n.y} r="2.4" fill={color} opacity="0.95" />
            <text x={n.x} y={n.y + 11} textAnchor="middle" fontSize="3.4" fill="rgba(255,255,255,0.92)"
                  style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" }}>
              {n.label}
            </text>
            <title>{n.label}</title>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ============ Mail-like Contact Composer (To / From / Subject / Message) ============ */
function ContactComposer({ ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const YOUR_EMAIL = "you@example.com"; // set your real address
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);

  const validEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!validEmail(from)) {
      setStatus({ ok: false, msg: "Please enter a valid From email." });
      return;
    }
    if (!subject.trim() || !message.trim()) {
      setStatus({ ok: false, msg: "Subject and message are required." });
      return;
    }

    setSending(true);
    const mailtoHref = () => {
      const body = encodeURIComponent(`From: ${from}\n\n${message}`);
      return `mailto:${encodeURIComponent(YOUR_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${body}`;
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: YOUR_EMAIL, from, subject, message }),
      });
      if (res.ok) {
        setStatus({ ok: true, msg: "Sent! I’ll get back to you shortly." });
        setFrom("");
        setSubject("");
        setMessage("");
      } else {
        window.location.href = mailtoHref();
        setStatus({ ok: true, msg: "Opening your mail client…" });
      }
    } catch {
      window.location.href = mailtoHref();
      setStatus({ ok: true, msg: "Opening your mail client…" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div {...rest} className={`mt-10 ${rest.className ?? ""}`}>
      <form
        onSubmit={handleSend}
        className="relative rounded-2xl border border-white/10 bg-[#0e1116] ring-1 ring-white/10 p-5 sm:p-6"
        style={{
          boxShadow: "0 24px 48px -24px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
          backdropFilter: "saturate(120%) blur(6px)",
        }}
      >
        {/* window dots */}
        <div className="mb-4 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 text-xs uppercase tracking-wider text-zinc-400">Compose</span>
        </div>

        {/* To */}
        <div className="mb-3 grid grid-cols-[64px_1fr] items-center gap-3">
          <label className="text-xs uppercase tracking-wider text-zinc-400">To</label>
          <span className="inline-flex items-center rounded-md bg-white/10 px-2.5 py-1 text-xs text-zinc-200 ring-1 ring-white/10">
            {YOUR_EMAIL}
          </span>
        </div>

        {/* From */}
        <div className="mb-3 grid grid-cols-[64px_1fr] items-center gap-3">
          <label className="text-xs uppercase tracking-wider text-zinc-400">From</label>
          <input
            type="email"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="you@domain.com"
            className="w-full rounded-xl border border-white/10 bg-[#0f1319] px-3 py-2.5 text-sm text-white ring-1 ring-white/10 outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:ring-white/20"
          />
        </div>

        {/* Subject */}
        <div className="mb-3 grid grid-cols-[64px_1fr] items-center gap-3">
          <label className="text-xs uppercase tracking-wider text-zinc-400">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Let’s build something great"
            className="w-full rounded-xl border border-white/10 bg-[#0f1319] px-3 py-2.5 text-sm text-white ring-1 ring-white/10 outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:ring-white/20"
          />
        </div>

        {/* Message */}
        <div className="mb-4 grid grid-cols-[64px_1fr] items-start gap-3">
          <label className="pt-2 text-xs uppercase tracking-wider text-zinc-400">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            placeholder="Hi — I’d love to chat about…"
            className="w-full resize-y rounded-xl border border-white/10 bg-[#0f1319] px-3 py-2.5 text-sm text-white ring-1 ring-white/10 outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:ring-white/20"
          />
        </div>

        {/* Status */}
        <div aria-live="polite" className="min-h-[20px] text-xs">
          {status && <p className={status.ok ? "text-emerald-400" : "text-rose-400"}>{status.msg}</p>}
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-[11px] text-zinc-500">
            Or email me directly:{" "}
            <a href={`mailto:${YOUR_EMAIL}`} className="text-zinc-300 underline underline-offset-2">
              {YOUR_EMAIL}
            </a>
          </div>

          <button
            type="submit"
            disabled={sending}
            className="group relative inline-flex items-center gap-2 rounded-lg border border-white/10 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300 ring-1 ring-white/10 transition hover:bg-indigo-500/20 hover:text-white disabled:opacity-50"
            style={{ transform: "translate3d(var(--tx,0), var(--ty,0), 0) scale(var(--scale,1))" }}
            onMouseMove={(e) => magnetMove(e.currentTarget as HTMLElement, e)}
            onMouseLeave={(e) => magnetReset(e.currentTarget as HTMLElement)}
          >
            {sending ? (
              <>
                <Spinner /> Sending…
              </>
            ) : status?.ok ? (
              <>
                <CheckIcon /> Sent!
              </>
            ) : (
              <>
                Send <PaperPlaneIcon />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
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

/* ============ Small UI helpers ============ */
function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
      aria-hidden
    />
  );
}
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-emerald-400" fill="currentColor" aria-hidden>
      <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z" />
    </svg>
  );
}
function PaperPlaneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90" fill="currentColor" aria-hidden>
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}
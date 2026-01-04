import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ============ About Section ============ */
export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const r = sectionRef.current!;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: r, start: "top 70%", once: true },
      });

      tl.from(r.querySelector("[data-kicker]"), { y: 14, opacity: 0, duration: 0.45, ease: "power3.out" })
        .from(r.querySelector("[data-title]"), { y: 18, opacity: 0, duration: 0.55, ease: "power3.out" }, "-=0.15")
        .from(r.querySelectorAll("[data-body]"), { y: 14, opacity: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" }, "-=0.25")
        .from(r.querySelector("[data-deck]"), { x: 40, opacity: 0, duration: 0.8, ease: "power4.out" }, "-=0.4")
        .from(r.querySelectorAll("[data-stat]"), { scale: 0.9, opacity: 0, duration: 0.45, stagger: 0.05, ease: "power3.out" }, "-=0.3");

      const counters = gsap.utils.toArray<HTMLElement>("[data-count-to]");
      counters.forEach((el) => {
        const to = Number(el.dataset.countTo || 0);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: to,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => { el.textContent = Math.round(obj.val).toString(); },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#020406] overflow-hidden flex items-center" id="about">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 w-full flex-1">
        <div className="grid gap-12 sm:gap-16 lg:grid-cols-12 lg:gap-12 lg:items-center w-full">
          {/* Narrative */}
          <div className="lg:col-span-6 w-full">
            <div className="flex items-center gap-4" data-kicker>
              <span className="px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-blue-400 border border-blue-500/20 bg-blue-500/5 rounded-full">
                System.Profile
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
            </div>

            <h2 data-title className="mt-8 text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] w-full">
              Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">scalable architectures</span> with high-fidelity design.
            </h2>

            <div className="mt-8 space-y-6 text-base sm:text-lg text-zinc-400 leading-relaxed w-full">
              <p data-body>
                I specialize in bridging the gap between complex <span className="text-white font-medium">Design Systems</span> and 
                performant <span className="text-white font-medium">Full-stack integration</span>.
              </p>
              <p data-body>
                My philosophy centers on <span className="text-white font-medium">Maintainable Components</span> and 
                optimized <span className="text-white font-medium">Core Web Vitals</span>.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 w-full">
              <StatChip label="Years Exp" to={4} />
              <StatChip label="Deployments" to={30} />
              <StatChip label="Partners" to={12} />
            </div>
          </div>

          {/* Right: The Deck */}
          <div className="lg:col-span-6 relative flex justify-center w-full" data-deck>
            <IdentityDeck />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Identity Deck ============ */
type CardId = "skills" | "rings" | "flow";

function IdentityDeck() {
  const deckRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<CardId[]>(["skills", "rings", "flow"]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = deckRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const bringToFront = (id: CardId) => {
    setOrder((prev) => [id, ...prev.filter((p) => p !== id)]);
  };

  return (
    <div
      ref={deckRef}
      onPointerMove={onPointerMove}
      className="relative w-full max-w-[420px] h-[60vh] sm:h-[480px] perspective-[1200px] touch-none flex justify-center items-center"
    >
      {order.map((id, index) => (
        <CardWrapper
          key={id}
          id={id}
          index={index}
          mousePos={mousePos}
          onClick={() => bringToFront(id)}
        />
      ))}
    </div>
  );
}

function CardWrapper({ id, index, mousePos, onClick }: { id: CardId, index: number, mousePos: { x: number, y: number }, onClick: () => void }) {
  const isFront = index === 0;
  
  // Transform logic: staggered stack effect
  const translateZ = -index * 40;
  const translateY = index * 10;
  const opacity = 1 - index * 0.15;
  const rotateX = isFront ? (mousePos.y - 50) * -0.1 : 0;
  const rotateY = isFront ? (mousePos.x - 50) * 0.1 : 0;

  return (
    <div
      onClick={onClick}
      className="absolute inset-0 transition-all duration-700 ease-out cursor-pointer group"
      style={{
        transform: `translate3d(0, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        zIndex: 30 - index,
        opacity,
      }}
    >
      <div className="relative h-full w-full max-w-[420px] rounded-3xl border border-white/10 bg-[#0c0e12]/90 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black">
        {/* Dynamic Specular Highlight */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.08), transparent 50%)`
          }}
        />
        
        <div className="p-6 h-full flex flex-col items-center justify-center">
          {id === "skills" && <SkillsGraphic mousePos={mousePos} />}
          {id === "rings" && <RingsGraphic />}
          {id === "flow" && <FlowGraphic />}
        </div>
      </div>
    </div>
  );
}

/* ============ Refined Graphic Components ============ */

function SkillsGraphic({ mousePos }: { mousePos: { x: number, y: number } }) {
  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
      {/* Central Core */}
      <div className="relative z-10 w-20 h-20 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
        <span className="text-3xl font-black text-white">N</span>
        {/* Animated Rings */}
        <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-ping" />
      </div>

      {/* Orbiting Icons (Representative) - Increased gap by larger radius */}
      {[
        { icon: "⚛️", color: "#61DAFB" },
        { icon: "TS", color: "#3178C6" },
        { icon: "🚀", color: "#5FA04E" },
        { icon: "TW", color: "#38BDF8" },
        { icon: "G", color: "#88CE02" },
        { icon: "V", color: "#646CFF" },
      ].map(({ icon, color }, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 120; // Increased from 100 to 120 for larger gap
        const y = Math.sin(angle) * 120;
        return (
          <div 
            key={i}
            className="absolute w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center"
            style={{ transform: `translate(${x}px, ${y}px)` }}
          >
            <span className="text-lg font-bold" style={{ color }}>{icon}</span>
          </div>
        );
      })}
      
      {/* SVG Connection Lines - Adjusted radius */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
         <circle cx="50%" cy="50%" r="120" fill="none" stroke="white" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}

function RingsGraphic() {
  return (
    <div className="space-y-4 w-full px-4">
      <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest text-center">Efficiency_Metrics</div>
      <div className="flex flex-col gap-6">
        {[ {l: 'Speed', p: '98%', c: 'bg-blue-400'}, {l: 'SEO', p: '100%', c: 'bg-emerald-400'}, {l: 'A11y', p: '94%', c: 'bg-purple-400'} ].map((item, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-zinc-300">{item.l}</span><span className="text-white font-bold">{item.p}</span></div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <div className={`h-full ${item.c} rounded-full`} style={{ width: item.p }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowGraphic() {
  return (
    <div className="flex flex-col items-center gap-4">
       <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
         <ZapIcon />
       </div>
       <div className="text-center">
         <div className="text-white font-bold">High Velocity</div>
         <div className="text-zinc-500 text-xs mt-1 font-mono">deployment_pipeline.sh</div>
       </div>
    </div>
  );
}

function StatChip({ label, to }: { label: string; to: number }) {
  return (
    <div data-stat className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
      <div className="text-2xl font-bold text-white"><span data-count-to={to}>0</span>+</div>
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1">{label}</div>
    </div>
  );
}

const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
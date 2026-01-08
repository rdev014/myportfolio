import React, { useRef, useState, useEffect } from "react";
import { 
  CpuChipIcon, 
  CommandLineIcon, 
  PaintBrushIcon, 
  ServerIcon, 
  CubeTransparentIcon 
} from "@heroicons/react/24/outline";

// --- DATA ---
const STACK = {
  frontend: [
    { name: "React", logo: "https://cdn.simpleicons.org/react/61DAFB" },
    { name: "Next.js", logo: "https://cdn.simpleicons.org/nextdotjs/ffffff" },
    { name: "TypeScript", logo: "https://cdn.simpleicons.org/typescript/3178C6" },
    { name: "Vite", logo: "https://cdn.simpleicons.org/vite/646CFF" },
  ],
  backend: [
    { name: "Node.js", logo: "https://cdn.simpleicons.org/nodedotjs/5FA04E" },
    { name: "PostgreSQL", logo: "https://cdn.simpleicons.org/postgresql/4169E1" },
    { name: "Docker", logo: "https://cdn.simpleicons.org/docker/2496ED" },
    { name: "Git", logo: "https://cdn.simpleicons.org/git/F05032" },
  ],
  creative: [
    { name: "Tailwind", logo: "https://cdn.simpleicons.org/tailwindcss/38BDF8" },
    { name: "Three.js", logo: "https://cdn.simpleicons.org/threedotjs/ffffff" },
    { name: "Framer", logo: "https://cdn.simpleicons.org/framer/0055FF" },
  ]
};

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

export default function TechCommandCenter() {
  return (
    <section className="relative min-h-screen w-full bg-[#050505] py-24 px-4 overflow-hidden flex items-center justify-center">
      {/* 1. Ambient Background */}
      <div className="absolute inset-0 z-0">
         {/* Noise Texture */}
         <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
         
         {/* Gradient Orbs */}
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]" />
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
         
         {/* Meteor Effect Layer */}
         <Meteors number={10} />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-cyan-400 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Tech Nexus
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
            Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Center</span>
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            A curated arsenal of modern tools. Optimized for performance, scalability, and developer experience.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* 1. FRONTEND CORE (Large Card) */}
          <SpotlightCard className="md:col-span-8 bg-zinc-900/20">
             <div className="p-8 h-full flex flex-col justify-between relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute right-0 top-0 p-6 opacity-5">
                   <CpuChipIcon className="w-48 h-48 text-white rotate-12 transform translate-x-12 -translate-y-12" />
                </div>

                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                         <CommandLineIcon className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Frontend Architecture</h3>
                   </div>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {STACK.frontend.map((tech) => (
                         <TechItem key={tech.name} {...tech} />
                      ))}
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 font-mono">
                   <span>CORE_V.2.4.0</span>
                   <span className="text-green-400">SYSTEM_OPTIMAL</span>
                </div>
             </div>
          </SpotlightCard>

          {/* 2. CREATIVE (Tall Card) */}
          <SpotlightCard className="md:col-span-4 md:row-span-2 bg-zinc-900/20">
             <div className="p-8 h-full relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
                
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <PaintBrushIcon className="w-5 h-5 text-purple-400" />
                   </div>
                   <h3 className="text-xl font-semibold text-white">Creative Eng.</h3>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                   {STACK.creative.map((tech) => (
                      <TechRow key={tech.name} {...tech} color="text-purple-300" />
                   ))}
                </div>

                <div className="mt-auto pt-8">
                   <div className="h-32 w-full rounded-lg border border-white/5 bg-black/20 relative overflow-hidden group">
                      <div className="absolute inset-0 flex items-center justify-center">
                         <CubeTransparentIcon className="w-12 h-12 text-zinc-700 group-hover:text-purple-400 transition-colors duration-500 group-hover:animate-spin-slow" />
                      </div>
                      <div className="absolute bottom-2 right-2 text-[10px] text-zinc-600 font-mono">RENDER_CTX</div>
                   </div>
                </div>
             </div>
          </SpotlightCard>

          {/* 3. BACKEND (Wide Card) */}
          <SpotlightCard className="md:col-span-8 bg-zinc-900/20">
             <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0 flex items-center gap-3 self-start md:self-center">
                   <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <ServerIcon className="w-5 h-5 text-emerald-400" />
                   </div>
                   <h3 className="text-xl font-semibold text-white">Infrastructure</h3>
                </div>
                
                <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                   {STACK.backend.map((tech) => (
                      <TechItem key={tech.name} {...tech} />
                   ))}
                </div>
             </div>
          </SpotlightCard>

        </div>
      </div>
    </section>
  );
}

// --- SUB COMPONENTS ---

const TechItem = ({ name, logo }: { name: string; logo: string }) => (
  <div className="group relative flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300">
    <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-md">
       <img src={logo} alt={name} className="h-full w-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
    </div>
    <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">{name}</span>
  </div>
);

const TechRow = ({ name, logo, color }: { name: string; logo: string; color: string }) => (
  <div className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300 cursor-default">
     <div className="flex items-center gap-3">
        <img src={logo} alt={name} className="w-6 h-6 object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
        <span className="text-sm font-medium text-zinc-300">{name}</span>
     </div>
     <div className={`text-xs ${color} opacity-0 group-hover:opacity-100 transition-opacity`}>
        ●
     </div>
  </div>
);

// The "Spotlight" Component (Reused logic for consistency)
function SpotlightCard({ 
  children, 
  className = ""
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "relative rounded-3xl border border-zinc-800 bg-zinc-900/50 overflow-hidden",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      <div className="relative h-full z-20">{children}</div>
    </div>
  );
}

// Background Meteor Effect
const Meteors = ({ number = 20 }: { number?: number }) => {
  const [meteors, setMeteors] = useState<number[]>([]);
  useEffect(() => {
    setMeteors(new Array(number).fill(true).map(() => Math.random()));
  }, [number]);

  return (
    <>
      {meteors.map((idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent"
          )}
          style={{
            top: 0,
            left: Math.floor(Math.random() * (400 - -400) + -400) + "px",
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
            animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
          }}
        ></span>
      ))}
      <style>{`
        @keyframes meteor {
          0% { transform: rotate(215deg) translateX(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: rotate(215deg) translateX(-500px); opacity: 0; }
        }
        .animate-meteor-effect {
          animation: meteor 5s linear infinite;
        }
        .animate-spin-slow {
           animation: spin 8s linear infinite; 
        }
        @keyframes spin {
           to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
import{ useState, useEffect, useRef } from "react";

// --- TYPES ---
type TechItem = {
  name: string;
  category: "Frontend" | "Backend" | "DevOps" | "Design";
  logo: string;
  description: string;
  color: string; // Hex for glow color
};

// --- DATA ---
const STACK: TechItem[] = [
  { name: "React", category: "Frontend", logo: "https://cdn.simpleicons.org/react/61DAFB", description: "Component-based UI architecture.", color: "#61DAFB" },
  { name: "Next.js", category: "Frontend", logo: "https://cdn.simpleicons.org/nextdotjs/ffffff", description: "Server-side rendering & scale.", color: "#ffffff" },
  { name: "TypeScript", category: "Frontend", logo: "https://cdn.simpleicons.org/typescript/3178C6", description: "Type-safe development workflow.", color: "#3178C6" },
  { name: "Tailwind", category: "Design", logo: "https://cdn.simpleicons.org/tailwindcss/38BDF8", description: "Utility-first CSS framework.", color: "#38BDF8" },
  { name: "Node.js", category: "Backend", logo: "https://cdn.simpleicons.org/nodedotjs/5FA04E", description: "Event-driven JavaScript runtime.", color: "#5FA04E" },
  { name: "PostgreSQL", category: "Backend", logo: "https://cdn.simpleicons.org/postgresql/4169E1", description: "Advanced relational database.", color: "#4169E1" },
  { name: "Docker", category: "DevOps", logo: "https://cdn.simpleicons.org/docker/2496ED", description: "Containerization & deployment.", color: "#2496ED" },
  { name: "Three.js", category: "Design", logo: "https://cdn.simpleicons.org/threedotjs/ffffff", description: "3D graphics & WebGL rendering.", color: "#FF9900" },
];

export default function FlashlightTechVault() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState<string>("All");

  // Handle high-performance mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (container) container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const categories = ["All", ...Array.from(new Set(STACK.map((s) => s.category)))];
  const filteredStack = filter === "All" ? STACK : STACK.filter((s) => s.category === filter);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#080808] overflow-hidden flex flex-col items-center justify-center py-20"
    >
      {/* --- 1. AMBIENT BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Moving Hex Mesh */}
        <div 
          className="absolute inset-0 opacity-[0.08]" 
          style={{
             backgroundImage: `radial-gradient(#333 1px, transparent 1px)`,
             backgroundSize: '30px 30px',
             maskImage: 'radial-gradient(circle at center, white 40%, transparent 100%)'
          }} 
        />
        {/* Deep Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-900/20 rounded-full blur-[100px]" />
      </div>

      {/* --- 2. CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full max-w-6xl px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
           <div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-2">
                 TECH <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">VAULT</span>
              </h2>
              <p className="text-zinc-500 max-w-md">
                 Explore the arsenal. Hover to reveal specific technologies and their capabilities.
              </p>
           </div>

           {/* Filter Tabs */}
           <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                 <button 
                   key={cat}
                   onClick={() => setFilter(cat)}
                   className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-300 border ${
                      filter === cat 
                      ? "bg-white text-black border-white" 
                      : "bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300"
                   }`}
                 >
                    {cat}
                 </button>
              ))}
           </div>
        </div>

        {/* --- 3. FLASHLIGHT GRID --- */}
        <div 
           className="group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
           style={{
             // Pass mouse position to CSS variables for children to use
             ["--mouse-x" as any]: `${mousePos.x}px`,
             ["--mouse-y" as any]: `${mousePos.y}px`,
           }}
        >
          {filteredStack.map((tech) => (
            <TechCard key={tech.name} tech={tech} />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- CARD COMPONENT ---
const TechCard = ({ tech }: { tech: TechItem }) => {
  return (
    <div 
      className="relative h-64 rounded-2xl bg-zinc-900/40 border border-white/5 overflow-hidden transition-all duration-500 hover:scale-[1.02]"
    >
       {/* 1. Flashlight Glow Effect (The "Reveal") */}
       {/* This overlay creates the radial gradient following the mouse */}
       <div 
         className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
         style={{
           background: `radial-gradient(
             600px circle at var(--mouse-x) var(--mouse-y), 
             rgba(255, 255, 255, 0.06), 
             transparent 40%
           )`
         }}
       />
       
       {/* 2. Border Reveal (Subtle border highlight) */}
       <div 
         className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
         style={{
           background: `radial-gradient(
             400px circle at var(--mouse-x) var(--mouse-y), 
             ${tech.color}15, 
             transparent 40%
           )`
         }}
       />

       {/* 3. Card Content */}
       <div className="relative z-10 h-full p-6 flex flex-col justify-between">
          
          {/* Top: Icon */}
          <div className="flex justify-between items-start">
             <div className="relative w-12 h-12 flex items-center justify-center bg-zinc-900/80 rounded-xl border border-white/10 shadow-xl group-hover:border-white/20 transition-colors">
                <img 
                   src={tech.logo} 
                   alt={tech.name} 
                   className="w-7 h-7 object-contain opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
                   style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' }}
                />
             </div>
             <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 border border-zinc-800 px-2 py-1 rounded-full bg-zinc-950/50">
               {tech.category}
             </span>
          </div>

          {/* Middle: Decorative Circuit Lines */}
          <div className="flex-1 w-full relative opacity-20 group-hover:opacity-40 transition-opacity py-4">
             <div className="w-px h-full bg-gradient-to-b from-transparent via-zinc-500 to-transparent absolute left-2" />
             <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent absolute top-1/2" />
          </div>

          {/* Bottom: Info */}
          <div>
             <h3 className="text-xl font-bold text-zinc-300 group-hover:text-white transition-colors flex items-center gap-2">
                {tech.name}
                {/* Arrow Icon that appears on hover */}
                <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
             </h3>
             <p className="text-sm text-zinc-500 group-hover:text-zinc-400 mt-2 line-clamp-2 transition-colors">
                {tech.description}
             </p>
          </div>

          {/* Color Glow Bar at bottom */}
          <div 
             className="absolute bottom-0 left-0 h-1 transition-all duration-500 ease-out"
             style={{ 
               width: '0%', 
               backgroundColor: tech.color,
               boxShadow: `0 0 20px ${tech.color}`
             }}
          />
       </div>
       
       {/* CSS to animate the bottom bar on hover (using parent group hover) */}
       <style>{`
         .group:hover div:hover .absolute.bottom-0 {
           width: 100%;
         }
       `}</style>
    </div>
  );
};
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Tech = {
  name: string;
  logo: string;
  level: number;
};

const techs: Tech[] = [
  { name: "React", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg", level: 0.95 },
  { name: "Next.js", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg", level: 0.93 },
  { name: "TypeScript", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg", level: 0.92 },
  { name: "Tailwind", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg", level: 0.94 },
  { name: "GSAP", logo: "https://cdn.simpleicons.org/greensock/88CE02", level: 0.90 },
  { name: "Node.js", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg", level: 0.88 },
  { name: "Three.js", logo: "https://cdn.simpleicons.org/threedotjs/ffffff", level: 0.82 },
  { name: "Framer Motion", logo: "https://cdn.simpleicons.org/framer/0055FF", level: 0.87 },
  { name: "Docker", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg", level: 0.80 },
  { name: "PostgreSQL", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg", level: 0.85 },
  { name: "Git", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg", level: 0.88 },
  { name: "Vite", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/vite/vite-original.svg", level: 0.89 },
];

export default function TechStack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: titleRef.current, start: "top 80%" } }
      );

      const cards = gridRef.current?.children;
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: { each: 0.08, from: "start" },
            ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 75%" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#020406] overflow-hidden flex items-center justify-center px-6 py-32">
      {/* Subtle ambient glow matching hero */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/5 blur-[140px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {/* Title - Matches hero typography vibe */}
        <div className="text-center mb-20">
          <p className="text-cyan-500/80 font-mono text-xs tracking-[0.4em] uppercase mb-4">Core Stack</p>
          <h2 ref={titleRef} className="text-5xl md:text-7xl font-black text-white tracking-tight">
            Tools I <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Command</span>
          </h2>
        </div>

        {/* Clean, spaced grid - Dark cyberpunk minimalism */}
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 md:gap-16">
          {techs.map((tech) => (
            <div
              key={tech.name}
              className="group relative flex flex-col items-center gap-6 p-8 rounded-3xl transition-all duration-700 hover:bg-white/5"
            >
              {/* Icon container with subtle lift & glow */}
              <div className="relative">
                <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-700 group-hover:border-cyan-500/30 group-hover:bg-white/10">
                  <img
                    src={tech.logo}
                    alt={tech.name}
                    className="w-16 h-16 object-contain filter brightness-75 group-hover:brightness-100 transition-all duration-500"
                  />
                </div>

                {/* Minimal glow ring on hover */}
                <div
                  className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                  style={{ backgroundColor: "#06b6d4" }}
                />
              </div>

              {/* Name */}
              <p className="text-zinc-400 text-sm font-medium tracking-wide group-hover:text-white transition-colors duration-500">
                {tech.name}
              </p>

              {/* Clean thin bar */}
              <div className="w-full h-px bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${tech.level * 100}%`,
                    background: "linear-gradient(to right, #06b6d4, #a855f7)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
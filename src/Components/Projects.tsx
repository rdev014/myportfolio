import React, { useEffect, useRef } from "react";
import { Cpu, Zap, Shield, Activity, Share2, Terminal, Code, Database } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: "PLEXJAR", url: "https://plexjar.com/", color: "#00f2ff" },
  { title: "WEBMIX", url: "https://webmixstudio.com/", color: "#7000ff" },
  { title: "ARKIN", url: "https://arkin-phi.vercel.app/", color: "#ff0055" },
  { title: "WEBSPAK", url: "https://webspak.vercel.app/", color: "#31ff5d" },
];

const techIcons = [Cpu, Zap, Shield, Activity, Share2, Terminal, Code, Database];

export default function IsolatedTechChaos() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const dropAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2000",
          pin: true,
          scrub: false,
          once: true,
        },
      });

      // Optimization: Set will-change for performance
      gsap.set(iconRefs.current, { willChange: "transform, opacity" });
      gsap.set(cardRefs.current, { willChange: "transform, opacity" });
      gsap.set(coreRef.current, { willChange: "transform, opacity" });

      // 1. Initial State: Hide everything
      gsap.set(iconRefs.current, { y: -500, opacity: 0, rotation: gsap.utils.random(-360, 360), scale: 1.5 });
      gsap.set(cardRefs.current, { opacity: 0, scale: 0.8, y: 100 });
      gsap.set(coreRef.current, { scale: 0, opacity: 0 });

      // 2. The "Drop": Tech Icons fall in with improved stagger and easing
      tl.to(iconRefs.current, {
        y: (i) => gsap.utils.random(-150, 150), // Reduced random range for better clustering
        x: (i) => gsap.utils.random(-250, 250),
        opacity: 1,
        rotation: 0,
        scale: 1,
        duration: 1.2, // Slightly longer for smoothness
        stagger: 0.08, // Tighter stagger
        ease: "elastic.out(1, 0.5)", // Smoother bounce
        onStart: () => dropAudioRef.current?.play().catch(() => {}), // Play cute tick sound at start of drop
      });

      // 3. The "Suck": Icons fly into center with rotation
      tl.to(iconRefs.current, {
        x: 0,
        y: 0,
        scale: 0.2,
        rotation: (i) => gsap.utils.random(-180, 180),
        opacity: 0.5,
        duration: 0.8, // Smoother transition
        ease: "power3.in",
        stagger: 0.05,
      }, "-=0.2"); // Slight overlap for fluidity

      // Show core with pulse
      tl.to(coreRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      }, "-=0.3");

      // 4. THE EXPLOSION: With blur for dramatic effect
      tl.to(coreRef.current, {
        scale: 50,
        opacity: 0,
        filter: "blur(20px)",
        duration: 0.9, // Slightly longer for better visual
        ease: "power4.in",
        onStart: () => audioRef.current?.play().catch(() => {}),
      });

      // 5. THE REVEAL: Softer flash and cards snap in
      tl.to(sectionRef.current, { backgroundColor: "#fff", duration: 0.1 }, "-=0.2")
        .to(sectionRef.current, { backgroundColor: "#000", duration: 0.6, ease: "power2.out" });

      tl.to(cardRefs.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "elastic.out(1, 0.6)",
      }, "-=0.4");
      
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-black font-black">

      {/* PROJECT SECTION - THE ENGINE IS BOXED HERE */}
      <section 
        ref={sectionRef} 
        className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      >
        <audio ref={audioRef} src="explosion.mp3" preload="auto" />
        <audio ref={dropAudioRef} src="tick.mp3" preload="auto" /> {/* Assume tick.mp3 is a cute, simple sound */}

        {/* MESSY TECH ICONS CONTAINER */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          {[...Array(16)].map((_, i) => {
            const Icon = techIcons[i % techIcons.length];
            return (
              <div 
                key={i} 
                ref={(el) => { if (el) iconRefs.current[i] = el; }}
                className="absolute"
              >
                <Icon size={48} className="text-cyan-500" strokeWidth={1} />
              </div>
            );
          })}
        </div>

        {/* SINGULARITY CORE */}
        <div 
          ref={coreRef} 
          className="absolute z-50 w-32 h-32 bg-white rounded-full blur-[2px] shadow-[0_0_150px_#fff] pointer-events-none" 
        />

        {/* PROJECTS CONTENT */}
        <div className="relative z-10 w-full max-w-7xl px-6 py-20">
          <div className="mb-16 text-center">
             <h2 className="text-[12vw] leading-none italic tracking-tighter text-white uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                Works
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p, i) => (
              <div
                key={p.title}
                ref={(el) => { if (el) cardRefs.current[i] = el; }}
                className="group relative"
              >
                <a href={p.url} target="_blank" className="block relative aspect-video bg-zinc-900 border border-white/10 group-hover:border-white/50 transition-all duration-500 overflow-hidden">
                   <img
                    src={`https://image.thum.io/get/width/1000/crop/800/${p.url}`}
                    alt={p.title}
                    className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <h3 className="text-5xl font-black italic text-white tracking-tighter">{p.title}</h3>
                    <div className="flex gap-2">
                       <Zap size={16} className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Open_Link</span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
import { useEffect, useRef } from "react";
import { Cpu, Zap, Shield, Activity, Share2, Terminal, Code, Database } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: "PLEXJAR", url: "https://plexjar.com/" },
  { title: "WEBMIX", url: "https://webmixstudio.com/" },
  { title: "ARKIN", url: "https://arkin-phi.vercel.app/" },
  { title: "WEBSPAK", url: "https://webspak.vercel.app/" },
];

const techIcons = [Cpu, Zap, Shield, Activity, Share2, Terminal, Code, Database];

export default function ControlledTechChaos() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const dropAudioRef = useRef<HTMLAudioElement>(null);
  const hasUnlockedAudio = useRef(false);

  // 1. Audio Unlock Logic
  useEffect(() => {
    const unlockAudio = () => {
      hasUnlockedAudio.current = true;
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("scroll", unlockAudio);
    };
    window.addEventListener("click", unlockAudio);
    window.addEventListener("scroll", unlockAudio, { once: true });
    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3000", 
          pin: true,
          scrub: 1, 
          anticipatePin: 1,
        },
      });

      // GPU Setup
      gsap.set([coreRef.current, ...iconRefs.current, ...cardRefs.current], {
        willChange: "transform, opacity",
        force3D: true,
      });

      // Initial States
      gsap.set(iconRefs.current, { y: -800, opacity: 0, scale: 2 });
      gsap.set(cardRefs.current, { opacity: 0, scale: 0.9, y: 100 });
      gsap.set(coreRef.current, { scale: 0, opacity: 0 });

      // PHASE 1: THE DROP (Audio Plays Here)
      tl.to(iconRefs.current, {
        y: () => gsap.utils.random(-150, 150),
        x: () => gsap.utils.random(-300, 300),
        opacity: 1,
        rotation: () => gsap.utils.random(-45, 45),
        scale: 1,
        stagger: {
          each: 0.05,
          from: "random",
          onStart: function() {
            if (hasUnlockedAudio.current && dropAudioRef.current) {
              dropAudioRef.current.volume = 0.3;
              dropAudioRef.current.play().catch(() => {});
            }
          }
        },
        duration: 1,
        ease: "power2.out",
      })

      // PHASE 2: VIBRATION
      .to(iconRefs.current, {
        x: "+=5",
        repeat: 3,
        yoyo: true,
        duration: 0.1,
      })

      // PHASE 3: THE SUCK
      .to(iconRefs.current, {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "power4.in",
      })

      // PHASE 4: THE CORE APPEARS
      .to(coreRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
      })

      // PHASE 5: THE EXPLOSION (Audio trigger removed from here)
      .to(coreRef.current, {
        scale: 100,
        opacity: 0,
        duration: 1,
        ease: "expo.in",
      })

      // PHASE 6: REVEAL CARDS
      .to(sectionRef.current, { backgroundColor: "#fff", duration: 0.1 }, "-=0.2")
      .to(sectionRef.current, { backgroundColor: "#000", duration: 0.4 })
      .to(cardRefs.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.3");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-black">
      <section ref={sectionRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Only Drop Audio Kept */}
        <audio ref={dropAudioRef} src="stones-falling.mp3" preload="auto" />

        {/* TECH ICONS */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          {[...Array(20)].map((_, i) => {
            const Icon = techIcons[i % techIcons.length];
            return (
              <div 
                key={i} 
                ref={(el) => { if (el) iconRefs.current[i] = el; }}
                className="absolute"
              >
                <div className="relative">
                    <Icon size={50} className="text-cyan-500 absolute blur-lg opacity-50" />
                    <Icon size={50} className="text-white relative" strokeWidth={1} />
                </div>
              </div>
            );
          })}
        </div>

        {/* CORE */}
        <div ref={coreRef} className="absolute z-50 w-24 h-24 bg-white rounded-full shadow-[0_0_150px_#fff]" />

        {/* CARDS */}
        <div className="relative z-10 w-full max-w-6xl px-10">
          <h2 className="text-[10vw] font-black italic text-white uppercase mb-10 tracking-tighter">Works.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p, i) => (
              <div 
                key={i} 
                ref={(el) => { if (el) cardRefs.current[i] = el; }} 
                className="group relative z-20"
              >
                <a 
                  href={p.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block aspect-video bg-zinc-900 border border-white/10 overflow-hidden relative"
                >
                    <img 
                      src={`https://image.thum.io/get/width/1200/crop/900/${p.url}`} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-100" 
                      alt={p.title} 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute bottom-5 left-5 text-white z-30">
                       <p className="text-xs font-mono text-cyan-400">PROJECT_0{i+1}</p>
                       <h3 className="text-4xl font-black italic">{p.title}</h3>
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
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CpuChipIcon } from "@heroicons/react/24/outline";

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lightningRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isEngaged, setIsEngaged] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);

  // 1. ELITE LIGHTNING ENGINE (With Sub-Branches)
  const drawLightning = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = "rgba(129, 140, 248, 0.8)"; // Indigo tint
    ctx.lineWidth = 1;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ffffff";

    let x = Math.random() * width;
    let y = 0;
    ctx.moveTo(x, y);

    const segments = 15;
    for (let i = 0; i < segments; i++) {
      x += (Math.random() * 120 - 60);
      y += height / segments;
      ctx.lineTo(x, y);
      
      if (Math.random() > 0.9) { // Secondary branch
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 50, y + 30);
        ctx.moveTo(x, y);
      }
    }
    ctx.stroke();
  };

  const startExperience = () => {
    if (isEngaged || isComplete) return;
    const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audioRef.current!);
    const analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 256; 
    source.connect(analyserNode);
    analyserNode.connect(ctx.destination);
    setAnalyser(analyserNode);
    setDataArray(new Uint8Array(analyserNode.frequencyBinCount));
    
    audioRef.current!.loop = false;
    audioRef.current!.play();
    setIsEngaged(true);

    audioRef.current!.onended = () => {
      setIsComplete(true);
      gsap.to(".ui-transition", { opacity: 1, y: 0, duration: 1.5, stagger: 0.2, ease: "expo.out" });
    };
  };

  useEffect(() => {
    if (!analyser || !dataArray || isComplete) return;

    const rafLoop = () => {
      analyser.getByteFrequencyData(dataArray);
      const lowFreq = dataArray.slice(0, 12).reduce((a, b) => a + b, 0) / 12;
      const peak = lowFreq / 255;

      if (peak > 0.62) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx && canvas) drawLightning(ctx, canvas.width, canvas.height);

        // STROBE EFFECT (Next-level lightning)
        const tl = gsap.timeline();
        tl.to(lightningRef.current, { opacity: peak * 0.8, duration: 0.05 })
          .to(lightningRef.current, { opacity: 0, duration: 0.03 })
          .to(lightningRef.current, { opacity: peak * 0.4, duration: 0.03 })
          .set(".glitch-text", { 
            skewX: () => Math.random() * 40 - 20,
            x: () => Math.random() * 20 - 10,
            filter: "contrast(4) brightness(2) drop-shadow(0 0 10px white)"
          })
          .to([lightningRef.current, canvasRef.current], { opacity: 0, duration: 0.6, ease: "power2.out" })
          .set(".glitch-text", { skewX: 0, x: 0, filter: "none" });
      }
      requestAnimationFrame(rafLoop);
    };

    const frame = requestAnimationFrame(rafLoop);
    return () => cancelAnimationFrame(frame);
  }, [analyser, dataArray, isComplete]);

  return (
    <section 
      ref={sectionRef}
      onClick={startExperience}
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#050505] overflow-hidden cursor-none selection:bg-indigo-500/30"
    >
      <audio ref={audioRef} src="/horror.mp3" />

      {/* BACKGROUND FX LAYERS */}
      <canvas ref={canvasRef} width={2000} height={1200} className="pointer-events-none absolute inset-0 z-40 opacity-0 mix-blend-screen" />
      <div ref={lightningRef} className="pointer-events-none absolute inset-0 z-50 bg-white opacity-0 mix-blend-overlay" />
      
      {/* SCANLINE EFFECT */}
      <div className="pointer-events-none absolute inset-0 z-30 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      
      {/* VIGNETTE */}
      <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_200px_rgba(0,0,0,1)]" />

      {/* CORE INTERFACE */}
      <div className="z-10 grid w-full max-w-screen-2xl grid-cols-1 md:grid-cols-3 px-20 items-center gap-32 md:gap-0">
        
        {/* LEFT NAV */}
        <div className="ui-transition flex flex-col items-center md:items-start gap-20 order-2 md:order-1">
          <MenuLink index="01" label="ARCHIVES" sub="Selected Work" isComplete={isComplete} />
          <MenuLink index="02" label="ENGINE" sub="Technical Stack" isComplete={isComplete} />
        </div>

        {/* CENTER ANCHOR */}
        <div className="flex flex-col items-center text-center order-1 md:order-2">
          <div className={`mb-16 transition-all duration-[2s] ${isComplete ? 'scale-125' : 'animate-pulse scale-100'}`}>
             <TechLogo active={!isComplete} />
          </div>
          
          <div className="space-y-6">
            <h1 className="glitch-text text-[11px] font-bold tracking-[1.2em] text-zinc-600 uppercase pl-[1.2em]">
              {isComplete ? "Access Granted" : " Rahul Dev // Terminal"}
            </h1>
            <h2 className="glitch-text text-7xl md:text-6xl font-thin tracking-tighter text-white leading-none">
              FRONT END <br /> 
              <span className="font-black italic text-transparent text-7xl md:text-9xl stroke-text opacity-90">ENGINEER</span>
            </h2>
          </div>
          
          {/* PROGRESS BAR */}
          <div className="mt-20 h-px w-64 relative bg-zinc-900 overflow-hidden">
            <div className={`h-full bg-white transition-all duration-[20s] ease-linear ${isEngaged ? 'w-full' : 'w-0'}`} />
            {isComplete && <div className="absolute inset-0 bg-indigo-500 animate-pulse" />}
          </div>
        </div>

        {/* RIGHT NAV */}
        <div className="ui-transition flex flex-col items-center md:items-end gap-20 order-3">
          <MenuLink index="03" label="LOGIC" sub="About Core" isComplete={isComplete} />
          <MenuLink index="04" label="SIGNAL" sub="Get in Touch" isComplete={isComplete} />
        </div>
      </div>

      {/* INITIALIZATION OVERLAY */}
      {!isEngaged && !isComplete && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] backdrop-blur-3xl transition-opacity duration-1000">
          <div className="relative group cursor-pointer mb-10">
             <div className="absolute -inset-4 rounded-full bg-indigo-500/10 animate-ping group-hover:bg-indigo-500/20" />
             <CpuChipIcon className="h-16 w-16 text-white transition-all duration-500 group-hover:scale-110" />
          </div>
          <p className="text-[12px] font-black tracking-[0.8em] text-white uppercase animate-pulse">Initialize Interface</p>
          <p className="mt-4 text-[9px] text-zinc-600 uppercase tracking-widest font-mono">One-Time Audio Sync Required</p>
        </div>
      )}

      {/* FOOTER HUD */}
      <div className="absolute bottom-12 w-full flex justify-between px-16 text-[8px] font-mono tracking-[0.5em] text-zinc-800 uppercase">
        <div className="flex gap-8">
          <span>LATENCY: 14MS</span>
          <span className={isEngaged && !isComplete ? "text-red-900 animate-pulse" : ""}>
            {isComplete ? "SYS: STABLE" : "SYS: BOOTING"}
          </span>
        </div>
        <span>©2024_RAHUL_DEV_OS</span>
      </div>

      <style>{`
        .stroke-text { -webkit-text-stroke: 1px rgba(255,255,255,0.8); }
        .cursor-none { cursor: none; }
      `}</style>
    </section>
  );
}

function MenuLink({ index, label, sub, isComplete }: { index: string, label: string; sub: string, isComplete: boolean }) {
  return (
    <a href={`#${label.toLowerCase()}`} className="group flex flex-col items-center md:items-start relative">
      <div className="flex items-baseline gap-4">
        <span className="text-[10px] font-bold text-indigo-500/40 group-hover:text-indigo-400 transition-colors">{index}</span>
        <span className="text-5xl md:text-6xl font-extralight tracking-tighter text-white transition-all duration-700 group-hover:tracking-[0.1em] group-hover:italic group-hover:opacity-100 opacity-20">
          {label}
        </span>
      </div>
      <span className={`text-[9px] uppercase tracking-[0.3em] mt-2 transition-colors duration-1000 ${isComplete ? 'text-zinc-500' : 'text-zinc-800'} group-hover:text-zinc-200`}>
        // {sub}
      </span>
    </a>
  );
}

function TechLogo({ active }: { active: boolean }) {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" className={`transition-all duration-[2s] ${active ? 'opacity-100 rotate-0' : 'opacity-40 rotate-45'}`}>
      <rect x="20" y="20" width="60" height="60" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="10 5" />
      <path d="M50 0 L50 15 M50 85 L50 100 M0 50 L15 50 M85 50 L100 50" stroke="white" strokeWidth="1" />
      <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeWidth="0.2" strokeDasharray="2 2" />
      <circle cx="50" cy="50" r="5" fill="white" className={active ? 'animate-ping' : ''} />
    </svg>
  );
}
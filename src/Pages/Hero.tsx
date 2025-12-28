import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CpuChipIcon } from "@heroicons/react/24/outline";

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lightningRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isEngaged, setIsEngaged] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);

  // 1. Procedural Lightning Drawing Logic
  const drawLightning = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = "rgba(200, 220, 255, 1)";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#818cf8";

    // Start Top-Right
    let curX = width - Math.random() * 200;
    let curY = 0;
    ctx.moveTo(curX, curY);

    const segments = 10;
    for (let i = 0; i < segments; i++) {
      // Slant toward Bottom-Left
      curX -= (width / segments) + (Math.random() * 80 - 40);
      curY += (height / segments) + (Math.random() * 20 - 10);
      ctx.lineTo(curX, curY);
    }
    ctx.stroke();
  };

  // 2. Audio Context Initialization
  const startExperience = () => {
    if (isEngaged) return;
    const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audioRef.current!);
    const analyserNode = ctx.createAnalyser();
    
    analyserNode.fftSize = 256; 
    source.connect(analyserNode);
    analyserNode.connect(ctx.destination);

    setAnalyser(analyserNode);
    setDataArray(new Uint8Array(analyserNode.frequencyBinCount));
    
    audioRef.current!.play();
    setIsEngaged(true);
  };

  // 3. Audio-Reactive "Storm" Effect
  useEffect(() => {
    if (!analyser || !dataArray) return;

    const rafLoop = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate peaks (Thunder/Low & Crackle/High)
      const lowFreq = dataArray.slice(0, 15).reduce((a, b) => a + b, 0) / 15;
      const highFreq = dataArray.slice(40, 80).reduce((a, b) => a + b, 0) / 40;
      const combinedPeak = (lowFreq * 0.4 + highFreq * 0.6) / 255;

      if (combinedPeak > 0.48) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx && canvas) drawLightning(ctx, canvas.width, canvas.height);

        const tl = gsap.timeline();
        
        // Multi-layered flash and glitch
        tl.to(lightningRef.current, { opacity: combinedPeak * 1.2, duration: 0.03 })
          .to(canvasRef.current, { opacity: 1, duration: 0.02 })
          .set(".glitch-target", { 
            x: Math.random() * 20 - 10,
            filter: "invert(1) contrast(3)",
            textShadow: "4px 0 #0ff, -4px 0 #f0f" 
          })
          .to(sectionRef.current, { x: Math.random() * 10 - 5, duration: 0.05 })
          .to([lightningRef.current, canvasRef.current], { opacity: 0, duration: 0.5, ease: "power4.out" })
          .set(".glitch-target", { x: 0, filter: "none", textShadow: "none" })
          .set(sectionRef.current, { x: 0 });
      }
      requestAnimationFrame(rafLoop);
    };

    const frame = requestAnimationFrame(rafLoop);
    return () => cancelAnimationFrame(frame);
  }, [analyser, dataArray]);

  return (
    <section 
      ref={sectionRef}
      onClick={startExperience}
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#030304] overflow-hidden cursor-pointer"
    >
      <audio ref={audioRef} src="/horror.mp3" loop />

      {/* Procedural Lightning Canvas */}
      <canvas 
        ref={canvasRef} 
        width={1920} height={1080} 
        className="pointer-events-none absolute inset-0 z-40 h-full w-full opacity-0 mix-blend-screen"
      />

      {/* Primary Flash Layer */}
      <div ref={lightningRef} className="pointer-events-none absolute inset-0 z-50 bg-indigo-50 opacity-0 mix-blend-overlay" />

      {/* Atmospheric Vignette */}
      <div className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(circle,transparent_20%,#000_120%)]" />

      {/* Noise Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />

      <div className="z-10 grid w-full max-w-7xl grid-cols-1 md:grid-cols-3 px-10 items-center gap-20">
        
        <div className="flex flex-col items-center md:items-end gap-12 order-2 md:order-1">
          <MenuLink href="#work" label="Projects" sub="01 // Selection" />
          <MenuLink href="#stack" label="Stack" sub="02 // Engine" />
        </div>

        <div className="flex flex-col items-center text-center order-1 md:order-2">
          <div className="mb-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] animate-pulse">
             <TechLogo />
          </div>
          
          <h1 className="glitch-target text-[16px] tracking-[0.8em] text-zinc-500 uppercase mb-4">
            Rahul Dev
          </h1>
          <h2 className="glitch-target text-6xl md:text-6xl font-thin tracking-tighter text-white leading-none">
            FRONT END <br /> <span className="font-black md:text-8xl  italic opacity-80 stroke-text text-transparent">ENGINEER</span>
          </h2>
          
          <div className="mt-12 flex items-center gap-4">
            <span className="h-px w-8 bg-zinc-800" />
            <p className="text-[9px] uppercase tracking-[0.4em] text-zinc-600">Sync Active</p>
            <span className="h-px w-8 bg-zinc-800" />
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start gap-12 order-3">
          <MenuLink href="#about" label="Info" sub="03 // Logic" />
          <MenuLink href="#contact" label="Contact" sub="04 // Signal" />
        </div>
      </div>

      {!isEngaged && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl transition-opacity duration-1000">
          <CpuChipIcon className="h-12 w-12 text-indigo-500/50 mb-6 animate-pulse" />
          <p className="text-[10px] tracking-[0.6em] text-white uppercase animate-pulse">Initialize Neural Link</p>
          <p className="mt-4 text-[8px] text-zinc-600 uppercase tracking-[0.3em]">Audio Warning: High Intensity</p>
        </div>
      )}

      <style jsx>{`
        .stroke-text { -webkit-text-stroke: 1px rgba(255,255,255,0.4); }
      `}</style>
    </section>
  );
}

function MenuLink({ href, label, sub }: { href: string; label: string; sub: string }) {
  return (
    <a href={href} className="group flex flex-col items-center md:items-inherit">
      <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-600 group-hover:text-indigo-400 transition-colors">
        {sub}
      </span>
      <span className="text-4xl font-light tracking-tighter text-white/40 transition-all duration-500 group-hover:text-white group-hover:tracking-widest group-hover:italic">
        {label}
      </span>
    </a>
  );
}

function TechLogo() {
  return (
    <svg width="60" height="60" viewBox="0 0 100 100" className="opacity-80">
      <rect x="20" y="20" width="60" height="60" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
      <path d="M50 5 L50 25 M50 75 L50 95 M5 50 L25 50 M75 50 L95 50" stroke="white" strokeWidth="1" />
      <circle cx="50" cy="50" r="8" fill="white" />
    </svg>
  );
}
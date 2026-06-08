import React, { useState } from "react";
import { Navigation } from "./components/Navigation";
import { CombatVisual } from "./components/CombatVisual";
import { InteractiveLinkTree } from "./components/InteractiveLinkTree";
import { GlitchText } from "./components/GlitchText";
import { SPOILER_A_Logo } from "./components/SPOILER_A_Logo";
import { Flame, Heart, Cpu } from "lucide-react";

export default function App() {
  const [ecoMode, setEcoMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("eco_mode") === "true";
    }
    return false;
  });

  const handleEcoModeToggle = (enabled: boolean) => {
    setEcoMode(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("eco_mode", String(enabled));
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030303] hologram-grain overflow-hidden flex flex-col justify-between">
      
      {/* Background Holographic Glow Elements (Matching colors of Image 2) */}
      <div className="absolute top-[15%] left-[5%] w-80 h-80 rounded-full bg-fuchsia-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-60 h-60 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Main Top Navigation */}
      <Navigation 
        ecoMode={ecoMode}
        onEcoModeToggle={handleEcoModeToggle}
      />

      {/* Main Content Body */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto pt-24 pb-20 px-6 sm:px-10 md:px-16 lg:px-20 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column (60% width target) */}
        <section 
          id="about-section"
          className="col-span-1 md:col-span-7 space-y-12 md:pr-4 animate-fade-in-up"
        >
          {/* Header Area with Status Signifier */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[10px] text-zinc-400 tracking-wide select-none">
              <span className={`w-2 h-2 rounded-full bg-fuchsia-400 ${ecoMode ? "" : "animate-pulse"}`} />
              <span>tactical channel telemetry: operational</span>
            </div>

            {/* Massive Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-white tracking-tighter leading-tight">
              <GlitchText text="hi, i'm daliaxez." triggerOnHover={false} />
            </h1>
          </div>

          {/* Bio / Description Block */}
          <div className="space-y-4 text-zinc-400 font-sans tracking-wide leading-relaxed">
            <p className="text-base sm:text-lg">
              i make videos about heavy steel boxes getting blasted by dynamic explosives in war thunder.
            </p>
            
            <p className="text-sm font-mono text-zinc-500 leading-normal">
              if your HEAT shell randomly bounced off target or you find yourself constantly returning back to the hangar within 30 seconds of gameplay, you are in the right place.
            </p>

            {/* Diagnostic readout panel in place of corny badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-[10px] select-none">
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl hover:border-fuchsia-500/20 transition-colors duration-300">
                <div className="text-zinc-500 uppercase tracking-wider text-[8px] mb-1 font-semibold">redirection index</div>
                <div className="text-fuchsia-400 font-bold text-xs tracking-tight">99.2%</div>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl hover:border-fuchsia-500/20 transition-colors duration-300">
                <div className="text-zinc-500 uppercase tracking-wider text-[8px] mb-1 font-semibold">structural matrix</div>
                <div className="text-fuchsia-400 font-bold text-xs tracking-tight">560 RHA</div>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl hover:border-fuchsia-500/20 transition-colors duration-300">
                <div className="text-zinc-500 uppercase tracking-wider text-[8px] mb-1 font-semibold">spatial integrity</div>
                <div className="text-fuchsia-400 font-bold text-xs tracking-tight">optimum</div>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl hover:border-fuchsia-500/20 transition-colors duration-300">
                <div className="text-zinc-500 uppercase tracking-wider text-[8px] mb-1 font-semibold">targeting delay</div>
                <div className="text-fuchsia-400 font-bold text-xs tracking-tight">0.8 ms</div>
              </div>
            </div>
          </div>

          {/* Interactive Link tree Wrap Section */}
          <div id="links-section" className="pt-6 border-t border-white/5 space-y-4 scroll-mt-24">
            <InteractiveLinkTree />
          </div>

        </section>

        {/* Right Column (40% width target) */}
        <section className="col-span-1 md:col-span-5 flex items-center justify-center relative animate-fade-in h-full">
          {/* Subtle Ambient HUD framing background */}
          <div className="absolute inset-0 bg-radial from-white/5 to-transparent blur-xl opacity-40 pointer-events-none" />
          <CombatVisual ecoMode={ecoMode} />
        </section>

      </main>

      {/* Futuristic footer credentials */}
      <footer className="relative z-10 w-full border-t border-white/5 bg-zinc-950/40 backdrop-blur-sm py-6 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 select-none">
            <SPOILER_A_Logo size={18} />
            <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
              daliaxez tactical directory &copy; 2026
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[9px] text-zinc-500 select-none">
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3" /> HULL_THICKNESS: N/A
            </span>
            <span className="flex items-center gap-1">
              <Flame className="h-3 w-3" /> ENGINE_FIRE: IN_PROGRESS
            </span>
            <span className="flex items-center gap-1 text-fuchsia-400/80">
              <Heart className="h-2.5 w-2.5 fill-current" /> SECURE_LINK: ACTIVE
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

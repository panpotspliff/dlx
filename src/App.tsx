import React, { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { CombatVisual } from "./components/CombatVisual";
import { InteractiveLinkTree } from "./components/InteractiveLinkTree";
import { SPOILER_A_Logo } from "./components/SPOILER_A_Logo";
import { TerminalWavelength } from "./components/TerminalWavelength";
import { FuturisticCursor } from "./components/FuturisticCursor";
import { FuturisticLoadingOverlay } from "./components/FuturisticLoadingOverlay";
import { FuturisticEcoPulse } from "./components/FuturisticEcoPulse";
import { GlitchWord } from "./components/GlitchWord";
import { Flame, Heart, Cpu, ChevronDown } from "lucide-react";

export default function App() {
  const [ecoMode, setEcoMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("eco_mode") === "true";
    }
    return false;
  });
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(min-width: 1024px)").matches;
    }
    return true; // render as desktop by default (handled cleanly on client-side)
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    
    const listener = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };
    
    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const [hintVisible, setHintVisible] = useState(false);
  const [hintRendered, setHintRendered] = useState(false);
  const [dangerVisible, setDangerVisible] = useState(false);
  const [dangerRendered, setDangerRendered] = useState(false);

  useEffect(() => {
    // Hint 1: Pop out in the 5th second upon entrance (after 5000ms)
    const showTimer = setTimeout(() => {
      setHintRendered(true);
      setTimeout(() => setHintVisible(true), 50);
    }, 5000);

    // Fade out by the 15th second (starts fade-out at 14.1s to be totally gone by 15.0s)
    const fadeOutTimer = setTimeout(() => {
      setHintVisible(false);
    }, 14100);

    // Safely remove from render tree when fade is complete
    const cleanupTimer = setTimeout(() => {
      setHintRendered(false);
    }, 15000);

    // Hint 2: "Watch out for danger!" - Pop out at the 7th second (danger appears on the 7th second)
    const showDangerTimer = setTimeout(() => {
      setDangerRendered(true);
      setTimeout(() => setDangerVisible(true), 50);
    }, 7000);

    // Fade out danger by the 17th second (starts fade-out at 16.1s to be totally gone by 17.0s)
    const fadeOutDangerTimer = setTimeout(() => {
      setDangerVisible(false);
    }, 16100);

    // Safely remove danger from render tree when fade is complete (at 17.0s)
    const cleanupDangerTimer = setTimeout(() => {
      setDangerRendered(false);
    }, 17000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(cleanupTimer);
      clearTimeout(showDangerTimer);
      clearTimeout(fadeOutDangerTimer);
      clearTimeout(cleanupDangerTimer);
    };
  }, []);

  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkScrollable = () => {
      const isScrollable = document.documentElement.scrollHeight > window.innerHeight + 12;
      const isSmallerScreen = window.innerWidth < 1024;
      const hasNotScrolledFar = window.scrollY < 40;

      setShowScrollIndicator(isScrollable && isSmallerScreen && hasNotScrolledFar);
    };

    const timer = setTimeout(checkScrollable, 300);

    window.addEventListener("scroll", checkScrollable);
    window.addEventListener("resize", checkScrollable);

    let observer: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(checkScrollable);
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", checkScrollable);
      window.removeEventListener("resize", checkScrollable);
      if (observer) observer.disconnect();
    };
  }, []);

  const handleEcoModeToggle = (enabled: boolean) => {
    setEcoMode(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("eco_mode", String(enabled));
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030303] hologram-grain flex flex-col justify-between overflow-x-hidden">
      <FuturisticCursor ecoMode={ecoMode} />
      <FuturisticLoadingOverlay ecoMode={ecoMode} />
      <FuturisticEcoPulse ecoMode={ecoMode} />
      
      {/* Background Holographic Glow Elements (Matching colors of Image 2) */}
      <div className={`absolute top-[15%] left-[5%] w-80 h-80 rounded-full bg-fuchsia-500/10 blur-[130px] pointer-events-none ${ecoMode ? "" : "animate-glow-1"}`} />
      <div className={`absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none ${ecoMode ? "" : "animate-glow-2"}`} />
      <div className={`absolute top-[40%] right-[30%] w-60 h-60 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none ${ecoMode ? "" : "animate-glow-3"}`} />

      {/* Main Top Navigation */}
      <Navigation 
        ecoMode={ecoMode}
        onEcoModeToggle={handleEcoModeToggle}
      />

      {/* Main Content Body */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto pt-24 lg:pt-20 pb-16 lg:pb-6 px-6 sm:px-10 md:px-16 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-0">
        
        {/* Left Column (Main Profile & Directory Link Tree) */}
        <section 
          id="about-section"
          className="col-span-1 lg:col-span-7 space-y-8 lg:space-y-4 xl:space-y-5 lg:pr-2 animate-fade-in-up"
        >
          {/* Header Area with Status Signifier */}
          <div className="space-y-4 lg:space-y-3">
            <div className="block relative z-0 mb-1.5">
              <TerminalWavelength ecoMode={ecoMode} variant="bubble" />
            </div>

            {/* Massive Heading */}
            <h1 className="relative z-10 text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-display font-medium text-white tracking-tighter leading-tight select-none">
              hi, i'm <GlitchWord />.
            </h1>
          </div>

          {/* Bio / Description Block */}
          <div className="space-y-3 lg:space-y-2 text-zinc-400 font-sans tracking-wide leading-relaxed">
            <p className="text-base sm:text-lg">
              i make videos about heavy steel boxes getting blasted by dynamic explosives in war thunder.
            </p>
            
            <p className="text-sm font-mono text-zinc-500 leading-normal">
              if your HEAT shell randomly bounced off target or you find yourself constantly returning back to the hangar within 30 seconds of gameplay, you are in the right place.
            </p>
          </div>

          {/* Interactive Link tree Wrap Section */}
          <div id="links-section" className="border-t border-white/5 mt-6 lg:mt-5 scroll-mt-24">
            <InteractiveLinkTree ecoMode={ecoMode} />
          </div>

        </section>

        {/* Right Column (40% width target) - rendered only on desktop when active */}
        {isDesktop && (
          <section className="col-span-1 lg:col-span-5 flex items-center justify-center relative animate-fade-in h-full">
            {/* Subtle Ambient HUD framing background */}
            <div className="absolute inset-0 bg-radial from-white/5 to-transparent blur-xl opacity-40 pointer-events-none" />
            
            <div className="relative w-[412px]">
              {/* Stacked System Alerts / Prompts */}
              <div className="absolute z-30 bottom-full mb-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none w-max">
                {/* Hint 1: test out the simulator */}
                {hintRendered && (
                  <div 
                    className={`flex flex-col items-center justify-center transition-all duration-700 ease-out ${
                      hintVisible 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 translate-y-6"
                    }`}
                  >
                    <div className="bg-[#0b0c10]/95 border border-cyan-500/40 rounded-lg px-3.5 py-2 shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 whitespace-nowrap text-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                      <span className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider leading-none">SYSTEM:</span>
                      <span className="font-mono text-xs text-white tracking-widest font-semibold leading-none">test out the simulator</span>
                      <span className="text-cyan-400 font-bold text-[11px] select-none animate-pulse leading-none">_</span>
                    </div>
                  </div>
                )}

                {/* Hint 2: watch out for danger! */}
                {dangerRendered && (
                  <div 
                    className={`flex flex-col items-center justify-center transition-all duration-700 ease-out ${
                      dangerVisible 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 translate-y-6"
                    }`}
                  >
                    <div className="bg-[#0b0c10]/95 border border-cyan-500/40 rounded-lg px-3.5 py-2 shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 whitespace-nowrap text-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                      <span className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider leading-none">SYSTEM:</span>
                      <span className="font-mono text-xs text-white tracking-widest font-semibold leading-none">
                        watch out for <span className="text-red-500 font-black animate-pulse uppercase">danger!</span>
                      </span>
                      <span className="text-cyan-400 font-bold text-[11px] select-none animate-pulse leading-none">_</span>
                    </div>
                  </div>
                )}
              </div>

              <CombatVisual 
                ecoMode={ecoMode} 
              />
            </div>
          </section>
        )}

      </main>

      {/* Futuristic footer credentials */}
      <footer className="relative z-10 w-full border-t border-white/5 bg-zinc-950/40 backdrop-blur-sm py-4 lg:py-3 px-6 sm:px-12">
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

      {/* Futuristic Glowing Scroll Indicator (Desktop excluded, only for scrollable smaller viewports) */}
      <div 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 pointer-events-none select-none transition-all duration-500 ease-in-out ${
          showScrollIndicator ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <span className="font-mono text-[9px] text-cyan-400 tracking-[0.25em] font-extrabold drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
          SCROLL
        </span>
        <div className="w-8 h-8 rounded-full border border-cyan-500/30 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-bounce" style={{ animationDuration: "1.8s" }}>
          <ChevronDown className="h-4 w-4 text-cyan-405" style={{ color: "#22d3ee" }} />
        </div>
      </div>
    </div>
  );
}

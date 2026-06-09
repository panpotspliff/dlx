import React, { useEffect, useState } from "react";
import { SPOILER_A_Logo } from "./SPOILER_A_Logo";

interface FuturisticLoadingOverlayProps {
  ecoMode?: boolean;
}

export const FuturisticLoadingOverlay: React.FC<FuturisticLoadingOverlayProps> = ({
  ecoMode = false,
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [statusText, setStatusText] = useState("INITIALIZING DIRECTORY...");
  const [isRendered, setIsRendered] = useState(true);

  useEffect(() => {
    // Phase 1: Rapidly increment loading progress to reach 100% in 1 second
    const startTime = Date.now();
    const duration = 1000; // 1 second flat

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(calculatedProgress);

      // Status text updates at different completion milestones
      if (calculatedProgress < 25) {
        setStatusText("INITIALIZING TACTICAL SYTEMS...");
      } else if (calculatedProgress < 50) {
        setStatusText("LOADING BIOMETRIC VECTORS...");
      } else if (calculatedProgress < 75) {
        setStatusText("ESTABLISHING ENCRYPTED LINK...");
      } else if (calculatedProgress < 95) {
        setStatusText("CALIBRATING INTERACTION CORE...");
      } else {
        setStatusText("SECURE LINK READY");
      }

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        // Phase 2: Fade out sequence starts immediately after 1 second is complete
        setTimeout(() => {
          setIsVisible(false);
          // Wait for fadeout animation to complete before removing fromDOM
          setTimeout(() => {
            setIsRendered(false);
          }, 350); // duration of out-transition
        }, 120);
      }
    };

    const animId = requestAnimationFrame(updateProgress);

    // Disable body overflow during page load to prevent scrolling background
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(animId);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isRendered) return null;

  return (
    <div
      id="loading-overlay"
      className={`fixed inset-0 z-[999999] bg-[#030303] flex flex-col items-center justify-center transition-all duration-300 select-none ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {/* Absolute futuristic wire grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
      
      {/* Subtle Scanner Line Effect */}
      <div className={`absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent shadow-[0_0_12px_rgba(37,244,238,0.5)] pointer-events-none ${ecoMode ? "" : "animate-scanner"}`} />

      {/* Center Console Content Card */}
      <div className="relative z-10 max-w-sm w-full px-8 flex flex-col items-center space-y-6">
        
        {/* Animated Brand Pulse */}
        <div className={`relative ${ecoMode ? "" : "animate-[pulse_1.5s_infinite]"}`}>
          <SPOILER_A_Logo size={42} />
          {/* Neon secondary back-glow */}
          <div className="absolute inset-0 -z-10 rounded-full bg-fuchsia-500/25 blur-xl scale-125" />
        </div>

        {/* Diagnostic-themed progress panel */}
        <div className="w-full bg-white/[0.01] border border-white/5 rounded-2xl p-4 backdrop-blur-md relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
          {/* Top-left crosshair accent */}
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-fuchsia-500/40 rounded-tl-sm pointer-events-none" />
          {/* Top-right crosshair accent */}
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-fuchsia-500/40 rounded-tr-sm pointer-events-none" />
          {/* Bottom-left crosshair accent */}
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-fuchsia-500/40 rounded-bl-sm pointer-events-none" />
          {/* Bottom-right crosshair accent */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-fuchsia-500/40 rounded-br-sm pointer-events-none" />

          {/* Diagnostic Console Header Texts */}
          <div className="flex justify-between items-center mb-3.5 font-mono">
            <span className="text-[10px] text-fuchsia-400 font-bold tracking-widest uppercase">
              {statusText}
            </span>
            <span className="text-xs text-white font-bold tracking-tight">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Futuristic Segmented Grid Progress Bar */}
          <div className="relative h-2 bg-neutral-950 border border-white/10 rounded overflow-hidden p-[1px] flex gap-[2px]">
            {/* Direct CSS custom mask or individual segments representing current loading percentage */}
            <div 
              style={{ width: `${progress}%` }} 
              className={`h-full bg-gradient-to-r from-fuchsia-500 via-fuchsia-400 to-[#25F4EE] rounded-[1px] transition-[width] duration-75 shadow-[0_0_8px_rgba(217,70,239,0.6)] ${ecoMode ? "" : "animate-pulse"}`}
            />
          </div>

          {/* Footer diagnostic metadata info block inside the console */}
          <div className="flex justify-between items-center mt-3 font-mono text-[8px] text-zinc-500 uppercase tracking-widest select-none">
            <span>SYS_SYS: v4.28</span>
            <span>PORT_INGRESS: COMPLETED</span>
          </div>
        </div>

        {/* Cyberpunk subtext index */}
        <div className="font-mono text-[8.5px] text-zinc-600 tracking-wider text-center select-none uppercase">
          Authorization index: <span className="text-fuchsia-500/50">SECURE_LEVEL_A</span>
        </div>
      </div>

      <style>{`
        @keyframes scanner-sweep {
          0% {
            top: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .animate-scanner {
          animation: scanner-sweep 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

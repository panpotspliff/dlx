import React, { useEffect, useState, useRef } from "react";

interface FuturisticEcoPulseProps {
  ecoMode: boolean;
}

export const FuturisticEcoPulse: React.FC<FuturisticEcoPulseProps> = ({ ecoMode }) => {
  const [active, setActive] = useState(false);
  const [pulseType, setPulseType] = useState<"on" | "off">("on");
  const [triggerKey, setTriggerKey] = useState(0);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    // Set configuration based on mode
    setPulseType(ecoMode ? "on" : "off");
    setTriggerKey((prev) => prev + 1);
    setActive(true);

    // Turn off effect after animation sequence concludes - fully optimized
    const timer = setTimeout(() => {
      setActive(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [ecoMode]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden select-none">
      
      {/* 1. Full-Screen Screen-wide Flash Aberration */}
      <div 
        key={`flash-${triggerKey}`}
        className={`absolute inset-0 transition-opacity duration-700 ease-out ${
          pulseType === "on" 
            ? "bg-emerald-500/5 animate-[pulse-flash_0.8s_ease-out_forwards]" 
            : "bg-cyan-500/5 animate-[pulse-flash_0.8s_ease-out_forwards]"
        }`} 
      />

      <style>{`
        @keyframes pulse-flash {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

import React, { useEffect, useRef, useState } from "react";

interface TerminalWavelengthProps {
  ecoMode?: boolean;
  tall?: boolean;
  variant?: "default" | "bubble";
}

export const TerminalWavelength: React.FC<TerminalWavelengthProps> = ({
  ecoMode = false,
  tall = false,
  variant = "default",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Terminal status readouts
  const [frequency, setFrequency] = useState<number>(4.0);
  const [mouseDist, setMouseDist] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  useEffect(() => {
    // Check if device supports fine pointer (mouse / desktop controller)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsDesktop(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // HIGHLY OPTIMIZED PATHWAY FOR BUBBLE VARIANT
    if (variant === "bubble") {
      let animationFrameId: number;
      let phase = 0;

      const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      };

      resizeCanvas();

      const resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      setFrequency(4.0);

      const renderBubble = () => {
        const width = canvas.width / (window.devicePixelRatio || 1);
        const height = canvas.height / (window.devicePixelRatio || 1);

        ctx.clearRect(0, 0, width, height);

        // Draw a single beautiful, thin subtle animated green sine wave across the whole bubble
        ctx.beginPath();
        ctx.strokeStyle = "rgba(16, 185, 129, 0.45)";
        ctx.lineWidth = 1.5;

        for (let x = 0; x < width; x++) {
          const envelope = Math.sin((x / width) * Math.PI);
          // High frequency, low amplitude, centered sine wave
          const y = height / 2 + Math.sin(x * 0.08 + phase) * (height * 0.28) * envelope;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        phase -= ecoMode ? 0.02 : 0.05;
        animationFrameId = requestAnimationFrame(renderBubble);
      };

      renderBubble();

      return () => {
        cancelAnimationFrame(animationFrameId);
        resizeObserver.disconnect();
      };
    }

    let animationFrameId: number;
    let phase = 0;
    let currentFreq = 4.0;
    let targetFreq = 4.0;
    let lastX = 0;
    let lastY = 0;
    let hasMouse = false;

    // Handle high-DPI scaling
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    // Use ResizeObserver to adapt smoothly without layout breaking
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const handleMouseLeave = () => {
      hasMouse = false;
      setMouseDist(null);
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDesktop) return;
      const rect = canvas.getBoundingClientRect();
      // Calculate cursor distance to the container boundary
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Compute distance to block
      let dx = 0;
      if (e.clientX < rect.left) {
        dx = rect.left - e.clientX;
      } else if (e.clientX > rect.right) {
        dx = e.clientX - rect.right;
      }

      let dy = 0;
      if (e.clientY < rect.top) {
        dy = rect.top - e.clientY;
      } else if (e.clientY > rect.bottom) {
        dy = e.clientY - rect.bottom;
      }

      const distance = Math.sqrt(dx * dx + dy * dy);
      setMouseDist(Math.round(distance));
      
      // Map distance to target frequency (closer = higher frequency)
      // Max effect within 400px
      const maxDistance = 400;
      const clampedDistance = Math.max(0, Math.min(maxDistance, distance));
      const factor = 1 - clampedDistance / maxDistance; // 1 at center, 0 far away
      
      // targetFreq goes from base frequency (4Hz) to extreme peak frequency (32Hz)
      targetFreq = 4.0 + factor * factor * 28.0;
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      // Terminal styling grids
      ctx.strokeStyle = "rgba(16, 185, 129, 0.05)"; // green emerald glow grid
      ctx.lineWidth = 1;
      
      // Draw Grid
      const gridSize = 16;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw horizontal crosshair reference points
      ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Interpolate current frequency gracefully to prevent erratic jumps
      const lerpSpeed = ecoMode ? 0.05 : 0.12;
      currentFreq += (targetFreq - currentFreq) * lerpSpeed;
      setFrequency(Math.round(currentFreq * 10) / 10);

      // Render actual wavelength sequence
      ctx.beginPath();
      ctx.strokeStyle = ecoMode ? "rgba(16, 185, 129, 0.75)" : "rgba(16, 185, 129, 0.9)";
      ctx.lineWidth = 2;

      // Pulse glow shadow effect if eco mode is disabled
      if (!ecoMode) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#10b981";
      } else {
        ctx.shadowBlur = 0;
      }

      // Sine wave implementation with center attenuation
      for (let x = 0; x < width; x++) {
        // Center attenuation factor (0 at edges, 1 at center)
        const envelope = Math.sin((x / width) * Math.PI);
        const y = height / 2 + Math.sin(x * (currentFreq / 100) + phase) * (height * 0.35) * envelope;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow for grids / borders

      // Side calibration notches
      ctx.fillStyle = "rgba(16, 185, 129, 0.3)";
      ctx.fillRect(width - 5, height / 2 - 10, 2, 20);
      ctx.fillRect(3, height / 2 - 10, 2, 20);

      // Phase shift speed scales with frequency for interactive kinetic feedback
      phase -= ecoMode ? 0.03 : (0.04 + (currentFreq / 120));

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
    };
  }, [isDesktop, ecoMode, variant]);

  if (variant === "bubble") {
    return (
      <div
        ref={containerRef}
        className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#020503]/90 border border-emerald-500/25 rounded-full font-mono text-[9.5px] text-emerald-400 tracking-wide select-none relative overflow-hidden h-[30px] shrink-0"
      >
        {/* Iridescent background highlight */}
        <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
        
        {/* Background Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block opacity-60 pointer-events-none" />

        {/* Foreground Content */}
        <div className="relative z-10 flex items-center gap-1.5 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-emerald-500/85">TACTICAL TELEMETRY:</span>
          <span className="text-[#25f4ee] font-bold tracking-wider uppercase">
            {frequency.toFixed(1)} HZ
          </span>
          <span className="text-emerald-500/30 font-bold hidden sm:inline">|</span>
          <span className="text-emerald-400/80 hidden sm:inline uppercase">
            SYS_OPERATIONAL
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl border border-emerald-500/10 bg-[#020503]/85 p-3 sm:p-3.5 backdrop-blur-md overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Glow highlight */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[#0d2a13]/5 bg-[size:100%_4px] pointer-events-none opacity-25" />

      {/* Terminal Title Bar */}
      <div className="flex justify-between items-center border-b border-emerald-500/10 pb-1.5 mb-2 sm:mb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-mono text-[9px] sm:text-[10px] text-emerald-400 font-bold tracking-wider uppercase">
            [F-CORE_TACTICAL_WAVELENGTH.EXE]
          </span>
        </div>
        <div className="font-mono text-[8px] sm:text-[8.5px] text-emerald-500/60 uppercase flex items-center gap-1.5">
          <span className="text-[#25f4ee]/80 font-semibold">[AUTO_CALIB]</span>
          <span>DEV_LINK: ACTIVE</span>
        </div>
      </div>

      {/* Oscilloscope Canvas container */}
      <div className={`relative w-full ${tall ? "h-[110px] sm:h-[130px]" : "h-[55px] sm:h-[64px]"} bg-black/60 rounded border border-emerald-500/5 overflow-hidden`}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      </div>

      {/* Terminal telemetry parameters overlay */}
      <div className="flex justify-between items-center mt-2 sm:mt-2.5 font-mono text-[9px] sm:text-[9.5px] text-emerald-500/70 border-t border-emerald-500/10 pt-2 shrink-0 flex-wrap gap-y-1">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1">
            <span className="text-emerald-500/40">FREQ:</span>
            <span className="text-emerald-400 font-bold tabular-nums">{frequency.toFixed(1)} Hz</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-emerald-500/40">VECTOR:</span>
            <span className="text-emerald-400 font-bold uppercase">{isDesktop ? "D-POINT" : "S-AUTO"}</span>
          </div>
          {isDesktop && mouseDist !== null && (
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <span className="text-emerald-500/40">M_DIST:</span>
              <span className="text-emerald-400 font-bold tabular-nums">{mouseDist} px</span>
            </div>
          )}
        </div>
        <div className="text-[8px] sm:text-[8.5px] text-[#25f4ee]/50 uppercase tracking-widest font-semibold flex items-center gap-1 ml-auto">
          <span className="inline-block w-1 h-1 bg-[#25f4ee] rounded-full animate-ping mr-1" />
          STEEL_DUMP_STREAM
        </div>
      </div>
    </div>
  );
};

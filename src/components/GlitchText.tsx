import React, { useState, useEffect } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = "",
  triggerOnHover = false,
}) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (triggerOnHover) return;

    // Periodically trigger a subtle glitch animation
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 4000);

    return () => clearInterval(interval);
  }, [triggerOnHover]);

  const handleMouseEnter = () => {
    if (triggerOnHover) {
      setIsGlitching(true);
    }
  };

  const handleMouseLeave = () => {
    if (triggerOnHover) {
      setIsGlitching(false);
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className={`relative z-10 block font-bold transition-all duration-100 ${
          isGlitching
            ? "translate-x-[-1px] text-[#f472b6] [text-shadow:_0.05em_0_0_rgba(168,85,247,0.75),_0_0.05em_0_rgba(34,211,238,0.75)]"
            : ""
        }`}
      >
        {text}
      </span>
      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 -translate-x-[2px] -translate-y-[1px] select-none text-[#a855f7] opacity-70 mix-blend-screen"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 33%, 0 33%)",
            }}
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 translate-x-[2px] translate-y-[1px] select-none text-[#22d3ee] opacity-70 mix-blend-screen"
            style={{
              clipPath: "polygon(0 67%, 100% 67%, 100% 100%, 0 100%)",
            }}
          >
            {text}
          </span>
        </>
      )}
    </div>
  );
};

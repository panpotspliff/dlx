import React, { useEffect, useRef, useState } from "react";

interface FuturisticCursorProps {
  ecoMode?: boolean;
}

export const FuturisticCursor: React.FC<FuturisticCursorProps> = ({ ecoMode = false }) => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const isHovering = useRef(false);
  const isClicking = useRef(false);
  const isVisible = useRef(false);
  
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Graceful guard: check if device uses standard coarse pointer (touch screen indicator)
    const checkTouch = () => {
      const match = window.matchMedia("(pointer: coarse)").matches;
      setIsTouchDevice(match);
    };
    checkTouch();
    
    if (isTouchDevice) return;

    // Direct styling to hide browser mouse cursor
    const originalBodyCursor = document.body.style.cursor;
    document.body.style.cursor = "none";
    
    // Add custom helper styles to completely disable cursor style overrides on existing standard links and items
    const styleSheet = document.createElement("style");
    styleSheet.setAttribute("id", "custom-cursor-style");
    styleSheet.textContent = `
      *, a, button, [role="button"], select, input, textarea, .interactive, iframe {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleSheet);

    const onMouseMove = (e: MouseEvent) => {
      // 1:1 Direct position updates.
      // Delivers absolute zero-latency response matching the exact physical mouse coordinate.
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      if (!isVisible.current) {
        isVisible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }

      // Find if we are currently hovering a clickable interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactiveEl = target.closest('a, button, [role="button"], select, input, textarea, [data-cursor-target], .interactive');
        const hovering = !!interactiveEl;
        
        if (hovering !== isHovering.current) {
          isHovering.current = hovering;
          if (hovering) {
            ringRef.current?.classList.add("ring-interactive");
            dotRef.current?.classList.add("dot-interactive");
          } else {
            ringRef.current?.classList.remove("ring-interactive");
            dotRef.current?.classList.remove("dot-interactive");
          }
        }
      }
    };

    const onMouseDown = () => {
      isClicking.current = true;
      ringRef.current?.classList.add("ring-clicking");
    };

    const onMouseUp = () => {
      isClicking.current = false;
      ringRef.current?.classList.remove("ring-clicking");
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isVisible.current = true;
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      
      document.body.style.cursor = originalBodyCursor;
      const customStyleEl = document.getElementById("custom-cursor-style");
      if (customStyleEl) {
        customStyleEl.remove();
      }
    };
  }, [isTouchDevice]);

  if (isTouchDevice) {
    return null;
  }

  return (
    <>
      {/* Central Laser Point (Highly Responsive Center Core) */}
      <div
        ref={dotRef}
        style={{ opacity: 0 }}
        className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-fuchsia-500 rounded-full pointer-events-none z-[99999] transition-opacity duration-300 pointer-fine-shadow"
      />

      {/* Futuristic Target Reticle Ring (Tracks 1:1 instantly with standard mouse pointer) */}
      <div
        ref={ringRef}
        style={{ opacity: 0 }}
        className="fixed top-0 left-0 -ml-6 -mt-6 w-12 h-12 pointer-events-none z-[99998] transition-opacity duration-300"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#25F4EE] ring-svg"
        >
          {/* Outer high-tech coordinate circle - rotates on hover */}
          <circle
            cx="24"
            cy="24"
            r="16"
            className="outer-spinning-ring"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="4 6"
          />

          {/* Target Bracket corners that explode/expand slide on active item hover */}
          <path
            d="M 6 14 L 6 6 L 14 6"
            className="corner-bracket cb-tl"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 34 6 L 42 6 L 42 14"
            className="corner-bracket cb-tr"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 6 34 L 6 42 L 14 42"
            className="corner-bracket cb-bl"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 42 34 L 42 42 L 34 42"
            className="corner-bracket cb-br"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Core Target Reticle Center Locking Ring */}
          <circle
            cx="24"
            cy="24"
            r="7"
            className="center-reticle-circle"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="2.5 2"
          />

          {/* Fine tick crosshairs inside */}
          <line x1="24" y1="3" x2="24" y2="7" className="crosshair-tick tick-t" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <line x1="24" y1="41" x2="24" y2="45" className="crosshair-tick tick-b" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <line x1="3" y1="24" x2="7" y2="24" className="crosshair-tick tick-l" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <line x1="41" y1="24" x2="45" y2="24" className="crosshair-tick tick-r" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      <style>{`
        .pointer-fine-shadow {
          box-shadow: 0 0 10px 2px rgba(217, 70, 239, 0.95);
          transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease, opacity 0.3s ease;
        }

        .ring-svg {
          transform: scale(0.55);
          transform-origin: center;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease, opacity 0.3s ease;
        }

        .corner-bracket {
          opacity: 0.95;
          transform-origin: center;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }

        /* Specific corner positioning transforms for expansion */
        .cb-tl { transform-origin: 6px 6px; }
        .cb-tr { transform-origin: 42px 6px; }
        .cb-bl { transform-origin: 6px 42px; }
        .cb-br { transform-origin: 42px 42px; }

        .center-reticle-circle {
          opacity: 0.95;
          transition: r 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }

        .outer-spinning-ring {
          opacity: 0;
          transform-origin: 24px 24px;
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .crosshair-tick {
          opacity: 0;
          transform-origin: 24px 24px;
          transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Lock on / hover styling state modifications */
        .ring-interactive .ring-svg {
          color: #d946ef;
          opacity: 1;
          transform: scale(1.15) rotate(45deg);
        }

        .ring-interactive .cb-tl { transform: translate(-3.5px, -3.5px) scale(0.95); }
        .ring-interactive .cb-tr { transform: translate(3.5px, -3.5px) scale(0.95); }
        .ring-interactive .cb-bl { transform: translate(-3.5px, 3.5px) scale(0.95); }
        .ring-interactive .cb-br { transform: translate(3.5px, 3.5px) scale(0.95); }

        .ring-interactive .outer-spinning-ring {
          opacity: 0.85;
          animation: cursor-spin-clockwise 15s linear infinite;
        }

        .ring-interactive .center-reticle-circle {
          r: 5.5;
          opacity: 0.65;
        }

        .ring-interactive .crosshair-tick {
          opacity: 0.9;
        }
        
        .ring-interactive .tick-t { transform: translateY(-4px); }
        .ring-interactive .tick-b { transform: translateY(4px); }
        .ring-interactive .tick-l { transform: translateX(-4.5px); }
        .ring-interactive .tick-r { transform: translateX(4.5px); }

        .dot-interactive {
          background-color: #25F4EE !important;
          box-shadow: 0 0 12px 2.5px rgba(37, 244, 238, 0.95) !important;
          transform: scale(1.4);
        }

        /* Micro-feedback click snap locking animation */
        .ring-clicking .ring-svg {
          transform: scale(0.85) rotate(-45deg) !important;
          color: #ec4899 !important;
          transition: transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.25);
        }

        .ring-clicking .corner-bracket {
          transform: scale(0.7) !important;
          opacity: 1 !important;
        }

        @keyframes cursor-spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};


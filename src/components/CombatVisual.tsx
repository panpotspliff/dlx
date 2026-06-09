import React, { useState, useEffect, useRef, useCallback } from "react";
import { Shield, Radio, Compass, Target, Navigation as NavIcon, Zap, Eye, RotateCcw, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type VehicleType = "jet" | "tank";

const JET_METRIC_POOL = [
  "JET_ENG_1_TEMP: 742 C [NOMINAL]",
  "JET_ENG_2_TEMP: 745 C [NOMINAL]",
  "HUD_PITCH_LADDER: update_ref [OK]",
  "GPS_POS_DELTA: precision lock 0.003s",
  "AOA_LIMITER: status safe [4.2 deg]",
  "EJECT_SYS: hydro pressure 180bar [GREEN]",
  "RADAR_SWEEP: paint threat index 0.0",
  "HYD_RESERVOIR: mineral level 94% [OK]",
  "AVIONICS_BUS_A: sync freq 120.4Hz",
  "FUEL_FLOW: burning rate 230kg/min",
  "O2_CABIN: pressure check 101.2kpa",
  "APU_SPOOL: shaft rotor 42,000 RPM",
  "FLT_CTRL_LINK: bus response latency 2ms",
  "RWR_RECEIVER: noise floor calibration OK"
];

const TANK_METRIC_POOL = [
  "TANK_TRANS_TEMP: 86 C [NOMINAL]",
  "TANK_ENGINE_RPM: 2150 [STEADY]",
  "TURRET_HYD: pressure 2900 psi [NOMINAL]",
  "STABILIZER: gyro drift offset 0.02mrad",
  "LASER_RNG: distance triangulation locked",
  "TREADS_SLIP: dynamic friction x:0.04 y:0.01",
  "AUTOLOADER_TRAY: cycle index 0 [READY]",
  "CHASSIS_INCLINOMETER: pitch:1.2 roll:-0.4",
  "CROSSWIND_SENSE: direction x-mag: -2.3m/s",
  "FLIR_IMAGING: contrast balance 92% [STABLE]",
  "EXHAUST_COOLANT: pressure state 3.1bar [OK]",
  "RADIO_ENCRYPT: frequency hop synchronized",
  "NBC_OVERPRESSURE: air filtration level 100%"
];

const GENERAL_METRIC_POOL = [
  "CORE_CPU: utilization [########....] 64%",
  "COMMS_SEC: quantum key refresh authenticated",
  "POWER_BUS_DC: primary bus 28.14V [NOMINAL]",
  "VMM_HEAP: heap allocation 142MB [SAFE_ZONE]",
  "SATELLITE_LINK: telemetry wave ping 38ms",
  "CRYO_COOL: module index fluid state 100%",
  "AUTO_DIAG: hardware checksum CRC32 [PASS]"
];

// Hoisted combined pools to prevent runtime array creation and GC memory garbage
const JET_POOL_COMBINED = [...JET_METRIC_POOL, ...GENERAL_METRIC_POOL];
const TANK_POOL_COMBINED = [...TANK_METRIC_POOL, ...GENERAL_METRIC_POOL];

const glitchVariants = {
  initial: {
    opacity: 0,
    y: 8,
    scale: 0.98,
    skewX: 4,
  },
  animate: {
    opacity: [0, 0.95, 1],
    y: [8, -0.5, 0],
    scale: [0.98, 1.005, 1],
    skewX: [4, -2, 0],
    transition: {
      duration: 0.28,
      ease: "easeOut",
    }
  },
  exit: {
    opacity: 0,
    y: 4,
    scale: 0.99,
    skewX: -2,
    transition: {
      duration: 0.18,
      ease: "easeIn",
    }
  }
};

interface CombatVisualProps {
  ecoMode?: boolean;
}

export const CombatVisual: React.FC<CombatVisualProps> = ({ 
  ecoMode = false
}) => {
  const [vehicle, setVehicle] = useState<VehicleType>("jet");
  const [scanlines, setScanlines] = useState(true);
  
  // Jet states
  const [afterburner, setAfterburner] = useState(false);
  const [jetSpeed, setJetSpeed] = useState(720); // knots
  const [altitude, setAltitude] = useState(14500); // feet
  const [flaresRemaining, setFlaresRemaining] = useState(64);
  const [releasingFlares, setReleasingFlares] = useState(false);
  const [flares, setFlares] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
    type: "primary" | "spark" | "smoke";
  }>>([]);
  
  // Tank states
  const [turretAngle, setTurretAngle] = useState(0);
  const [recoiling, setRecoiling] = useState(false);
  const [shellType, setShellType] = useState<"APFSDS" | "HEAT-FS">("APFSDS");
  const [ammoCount, setAmmoCount] = useState(24);
  const [reloadProgress, setReloadProgress] = useState(100);
  const [laserArmed, setLaserArmed] = useState(true);
  const [tankTargetActive, setTankTargetActive] = useState(false);
  const [tankTargetSide, setTankTargetSide] = useState<"left" | "right" | null>(null);
  const [tankTargetAngle, setTankTargetAngle] = useState<number>(0);
  const [tankTargetTimeLeft, setTankTargetTimeLeft] = useState(0);
  const [muzzleParticles, setMuzzleParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
    type: "shell" | "ring" | "spark" | "smoke" | "flash";
  }>>([]);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "BOOT STATE: STANDBY",
    "DECRYPTION KEY PENDING...",
    "COCKPIT UNLOCK REQUEST SUBMITTED"
  ]);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((message: string) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setSystemLogs((prev) => [`[${time}] ${message}`, ...prev.slice(0, 3)]);
  }, []);

  // Boot-up dynamic setup states
  const [bootProgress, setBootProgress] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);
  const [bootStatusText, setBootStatusText] = useState("INITIALIZING");
  const [flashActive, setFlashActive] = useState(false);

  // Jet mouse tilt state for interactive, kinetic visual feedback
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Handle cursor relative calculations inside the canvas bounding box
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ecoMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized ranges [-1.0, 1.0] indicating cursor distance from center
    const normX = (x - rect.width / 2) / (rect.width / 2);
    const normY = (y - rect.height / 2) / (rect.height / 2);
    
    // Convert to maximum rotation deflection angles
    const rotateY = normX * 18;  // Bank the roll/yaw left/right
    const rotateX = -normY * 18; // Elevate or sink the nose (pitch)
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Reset the interactive tilt state instantly if user activates Eco Mode down-tuning
  useEffect(() => {
    if (ecoMode) {
      setTilt({ x: 0, y: 0 });
    }
  }, [ecoMode]);

  // Missile minigame state
  const [missileThreatActive, setMissileThreatActive] = useState(false);
  const [missileTimeLeft, setMissileTimeLeft] = useState(5.0);

  // Periodic scheduling effect for incoming missile warning threat alerts (disabled in Eco Mode to optimize performance)
  useEffect(() => {
    if (!bootComplete || vehicle !== "jet" || ecoMode) {
      setMissileThreatActive(false);
      return;
    }

    let threatTimeoutId: NodeJS.Timeout;

    const scheduleThreat = () => {
      // Trigger a new warning from time to time - random interval between 15 and 25 seconds
      const delay = 15000 + Math.random() * 10000;
      threatTimeoutId = setTimeout(() => {
        setMissileThreatActive(true);
        setMissileTimeLeft(5.0);
        addLog("RWR ALERT: INCOMING SAM MISSILE DETECTED!");
        triggerHaptic([60, 40, 60]);
      }, delay);
    };

    if (!missileThreatActive) {
      scheduleThreat();
    }

    return () => {
      clearTimeout(threatTimeoutId);
    };
  }, [bootComplete, vehicle, ecoMode, missileThreatActive, addLog]);

  // Countdown timer effect that counts down the time left to release flares
  useEffect(() => {
    if (!missileThreatActive || ecoMode || vehicle !== "jet" || !bootComplete) {
      return;
    }

    const timer = setInterval(() => {
      setMissileTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timer);
          setMissileThreatActive(false);

          // Direct missile impact! System damage & alarm trigger
          addLog("WARNING: DIRECT MISSILE IMPACT! COCKPIT COMPROMISED!");
          triggerHaptic([120, 100, 150, 100, 200]);

          // Spawn a dramatic storm of red/orange fire particles from the center to simulate impact
          setFlares((oldFlares) => {
            const hitParticles = [];
            for (let i = 0; i < 24; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 2.0 + Math.random() * 4.5;
              hitParticles.push({
                id: Math.random() + Date.now() + 200 + i,
                x: 50,
                y: 50,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 0.8,
                size: 2.5 + Math.random() * 3.5,
                alpha: 1.0,
                color: Math.random() > 0.45 ? "#ef4444" : "#f97316", // hot red & fierce orange
                type: "spark" as const,
              });
            }
            return [...oldFlares, ...hitParticles];
          });

          // Flash the screen red/fuchsia using current flashActive state
          setFlashActive(true);
          setTimeout(() => setFlashActive(false), 450);

          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [missileThreatActive, ecoMode, vehicle, bootComplete, addLog]);

  // Run boot sequence automatically on mount
  useEffect(() => {
    if (bootComplete) return;

    const startTime = performance.now();
    const duration = 2800; // 2.8 seconds total boot time
    let frameId: number;
    
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      
      setBootProgress(progress);
      
      setBootStatusText((currText) => {
        let nextText = currText;
        if (progress < 25) {
          nextText = "INITIALIZING VECTOR CORES...";
        } else if (progress < 50) {
          nextText = "LOCATING SATELLITE COMS...";
        } else if (progress < 75) {
          nextText = "CALIBRATING HUD SYNAPSE...";
        } else if (progress < 100) {
          nextText = "AWAITING SECURITY DECRYPTION...";
        } else {
          nextText = "SYSTEM SETUP: PASS";
        }
        return nextText;
      });

      if (progress < 100) {
        frameId = requestAnimationFrame(step);
      } else {
        // Complete boot sequence
        setFlashActive(true);
        setTimeout(() => {
          setFlashActive(false);
          setBootComplete(true);
          triggerHaptic([80, 50, 80]); // Retro double chirping haptic setup completed
          setSystemLogs([
            "SYSTEM CHECK: ONLINE",
            "INITIALIZING TACTICAL SYSTEMS...",
            "HUD CALIBRATION COMPLETE",
            "READY TO COLLIDE WITH STEEL"
          ]);
        }, 400);
      }
    };
    
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [bootComplete]);

  // Stream live entries (Holds off until bootComplete)
  useEffect(() => {
    if (!bootComplete) {
      setTelemetryLogs([
        "[SYSTEM] PRE-BOOT TELEMETRY ACCESS BLOCKED",
        "[SYSTEM] PILOT INTERFACES DISCONNECTED",
        "[SYSTEM] WAITING FOR SECURITY DECRYPTION GRID..."
      ]);
      return;
    }

    // Initialize with live entries only on initial boot transition, not vehicle change
    setTelemetryLogs((prev) => {
      if (prev.length > 0 && !prev[0].includes("PRE-BOOT")) {
        // Just append a system notice about vehicle swap
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
        return [...prev, `[${time} 0x0000] [SYSTEM] RE-ESTABLISHED TELEMETRY TO ${vehicle.toUpperCase()}`].slice(-50);
      }
      
      const initialLogs: string[] = [];
      const pool = vehicle === "jet" ? JET_POOL_COMBINED : TANK_POOL_COMBINED;
      for (let i = 0; i < 8; i++) {
         const idx = Math.floor(Math.random() * pool.length);
         const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
         const randomNoiseHex = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, "0");
         initialLogs.push(`[${time} 0x${randomNoiseHex}] ${pool[idx]}`);
      }
      return initialLogs;
    });

    const delay = ecoMode ? 3500 : 1200;
    let frameId: number;
    let lastTick = performance.now();

    const tick = (now: number) => {
      const elapsed = now - lastTick;
      if (elapsed >= delay) {
        lastTick = now - (elapsed % delay);
        const pool = vehicle === "jet" ? JET_POOL_COMBINED : TANK_POOL_COMBINED;
        const randomLine = pool[Math.floor(Math.random() * pool.length)];
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
        const randomNoiseHex = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, "0");
        const formattedLog = `[${time} 0x${randomNoiseHex}] ${randomLine}`;
        
        setTelemetryLogs((prev) => {
          const next = [...prev, formattedLog];
          if (next.length > 50) next.shift();
          return next;
        });
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [vehicle, ecoMode, bootComplete]);

  // Keep terminal scrolled to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [telemetryLogs]);

  // Dynamic Flare Simulation Engine (60fps updates)
  useEffect(() => {
    if (flares.length === 0) return;

    let frameId: number;

    const updateParticles = () => {
      setFlares((prevFlares) => {
        if (prevFlares.length === 0) return prevFlares;
        const nextFlares = prevFlares
          .map((f) => {
            const nextX = f.x + f.vx;
            const nextY = f.y + f.vy;

            let nextVx = f.vx * 0.94; // Air friction
            let nextVy = f.vy + 0.12; // Downward drift simulating gravity and speed air drag

            let nextAlpha = f.alpha - (f.type === "primary" ? 0.024 : f.type === "spark" ? 0.045 : 0.016);
            let nextSize = f.size;
            if (f.type === "smoke") {
              nextSize = f.size * 1.04; // Expanding smoke puff
            }

            return {
              ...f,
              x: nextX,
              y: nextY,
              vx: nextVx,
              vy: nextVy,
              alpha: nextAlpha,
              size: nextSize,
            };
          })
          .filter((f) => f.alpha > 0 && f.y < 160 && f.x >= -30 && f.x <= 130);

        // Spawn trailing sparks & smoke from active primary flares
        const extraParticles: typeof nextFlares = [];
        if (!ecoMode) {
          nextFlares.forEach((f) => {
            if (f.type === "primary") {
              if (Math.random() < 0.25) {
                extraParticles.push({
                  id: Math.random() + Date.now() + 10,
                  x: f.x,
                  y: f.y,
                  vx: (Math.random() - 0.5) * 1.5,
                  vy: (Math.random() - 0.2) * 1.0,
                  size: f.size * 0.45,
                  alpha: 0.9,
                  color: Math.random() > 0.35 ? "#fbbf24" : "#f87171", // Amber or red-hot spark
                  type: "spark",
                });
              }
              if (Math.random() < 0.3) {
                extraParticles.push({
                  id: Math.random() + Date.now() + 20,
                  x: f.x,
                  y: f.y,
                  vx: (Math.random() - 0.5) * 0.3,
                  vy: -0.1,
                  size: Math.random() * 2.8 + 1.6,
                  alpha: 0.4,
                  color: "#52525b", // Dark grey exhaust smoke
                  type: "smoke",
                });
              }
            }
          });
        }

        return [...nextFlares, ...extraParticles];
      });

      frameId = requestAnimationFrame(updateParticles);
    };

    frameId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(frameId);
  }, [flares.length, ecoMode]);

  // Dynamic Tank Muzzle Fire & Shell Ejection Simulation Engine (60fps updates)
  useEffect(() => {
    if (muzzleParticles.length === 0) return;

    let frameId: number;

    const updateMuzzle = () => {
      setMuzzleParticles((prev) => {
        if (prev.length === 0) return prev;
        return prev
          .map((p) => {
            const nextX = p.x + p.vx;
            const nextY = p.y + p.vy;

            let nextVx = p.vx;
            let nextVy = p.vy;

            // Apply friction depending on the type
            if (p.type === "spark") {
              nextVx *= 0.94;
              nextVy *= 0.94;
            } else if (p.type === "smoke") {
              nextVx *= 0.95; // softer air resistance for large plume
              nextVy *= 0.95;
            } else if (p.type === "ring") {
              nextVx = 0;
              nextVy *= 0.85;
            } else if (p.type === "flash") {
              nextVx *= 0.8;
              nextVy *= 0.8;
            }

            let nextSize = p.size;
            if (p.type === "ring") {
              nextSize = p.size + 1.2; // compact shock ring expansion
            } else if (p.type === "smoke") {
              nextSize = p.size * 1.03; // compact drifting smoke
            } else if (p.type === "flash") {
              nextSize = p.size * 1.04;
            }

            let decay = 0.025;
            if (p.type === "shell") {
              decay = 0.08; // disappears quickly when flying
            } else if (p.type === "ring") {
              decay = 0.14; // rapid fade of the localized shock ring
            } else if (p.type === "spark") {
              decay = 0.09 + Math.random() * 0.09; // rapid fizzling sparks
            } else if (p.type === "smoke") {
              decay = 0.035; // fast dissipating smoke puff
            } else if (p.type === "flash") {
              decay = 0.18; // instant snappy muzzle flash core
            }

            return {
              ...p,
              x: nextX,
              y: nextY,
              vx: nextVx,
              vy: nextVy,
              size: nextSize,
              alpha: Math.max(0, p.alpha - decay),
            };
          })
          .filter((p) => p.alpha > 0 && p.y >= -300 && p.y <= 200 && p.x >= -200 && p.x <= 300);
      });

      frameId = requestAnimationFrame(updateMuzzle);
    };

    frameId = requestAnimationFrame(updateMuzzle);
    return () => cancelAnimationFrame(frameId);
  }, [muzzleParticles.length]);



  // Jet Speed & Altitude simulation - Optimized via requestAnimationFrame
  useEffect(() => {
    if (vehicle !== "jet") return;

    let frameId: number;
    let lastTick = performance.now();
    const tickInterval = ecoMode ? 1000 : 100;

    const tick = (now: number) => {
      const elapsed = now - lastTick;
      if (elapsed >= tickInterval) {
        lastTick = now - (elapsed % tickInterval);

        if (ecoMode) {
          setJetSpeed((prev) => {
            const target = afterburner ? 1450 : 720;
            return prev === target ? prev : target;
          });
          setAltitude((prev) => {
            const target = afterburner ? 32000 : 14500;
            return prev === target ? prev : target;
          });
        } else {
          setJetSpeed((prev) => {
            const target = afterburner ? 1450 : 720;
            const diff = target - prev;
            if (Math.abs(diff) < 5) return target;
            return prev + Math.sign(diff) * (afterburner ? 25 : 15);
          });
          setAltitude((prev) => {
            const change = afterburner ? 45 : (Math.random() > 0.5 ? 5 : -5);
            return Math.max(1000, Math.min(50000, prev + change));
          });
        }
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [vehicle, afterburner, ecoMode]);

  // Reload progress simulation for tank - Optimized via requestAnimationFrame
  useEffect(() => {
    if (reloadProgress >= 100) return;

    let frameId: number;
    const startTime = performance.now();
    const duration = ecoMode ? 300 : 100;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed >= duration) {
        setReloadProgress((prev) => {
          const increment = ecoMode ? 15 : 5;
          const next = prev + increment;
          if (next >= 100) {
            addLog("AUTOLOADER CYCLED: READY");
            return 100;
          }
          return next;
        });
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [reloadProgress, ecoMode, addLog]);

  // Haptic Feedback Helper
  const triggerHaptic = (pattern: number[]) => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Safe catch for environment restrictions or unsupported states
      }
    }
  };

  // Decrypt/decay timer for Tank Target
  useEffect(() => {
    if (!tankTargetActive) return;
    
    const interval = setInterval(() => {
      setTankTargetTimeLeft((prev) => {
        if (prev <= 0.1) {
          setTankTargetActive(false);
          setTankTargetSide(null);
          addLog("TANK TARGET ESCAPED / SCANNER SIGNAL LOST");
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [tankTargetActive, addLog]);

  // Random spawner for Tank Target
  useEffect(() => {
    if (ecoMode || !bootComplete || vehicle !== "tank") {
      setTankTargetActive(false);
      setTankTargetSide(null);
      return;
    }
    
    const interval = setInterval(() => {
      if (!tankTargetActive) {
        if (Math.random() < 0.35) {
          const side = Math.random() < 0.5 ? "left" : "right";
          const possibleAngles = side === "left" 
            ? [-90, -75, -60, -45, -30, -15] 
            : [15, 30, 45, 60, 75, 90];
          const chosenAngle = possibleAngles[Math.floor(Math.random() * possibleAngles.length)];
          
          setTankTargetSide(side);
          setTankTargetAngle(chosenAngle);
          setTankTargetTimeLeft(6.0);
          setTankTargetActive(true);
          triggerHaptic([60, 30, 60]);
          addLog(`WARNING: HOSTILE DETECTED AT ${chosenAngle}° [${side === "left" ? "WEST SECTOR" : "EAST SECTOR"}]`);
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [ecoMode, bootComplete, vehicle, tankTargetActive, addLog]);

  const handleFireTank = useCallback(() => {
    if (reloadProgress < 100 || ammoCount <= 0) {
      triggerHaptic([60]);
      addLog("RELOAD IN PROGRESS / NO AMMUNITION");
      return;
    }

    triggerHaptic([120, 40, 90]); // Dense recoiling haptic kick
    setRecoiling(true);
    setAmmoCount((prev) => prev - 1);
    setReloadProgress(0);
    addLog(`FIRED ${shellType} - RECOIL ACTIVE`);

    // Minigame impact evaluation
    if (tankTargetActive) {
      if (turretAngle === tankTargetAngle) {
        setTankTargetActive(false);
        setTankTargetSide(null);
        addLog(`DIRECT IMPACT! HOSTILE AT ${tankTargetAngle}° NEUTRALIZED`);
        triggerHaptic([80, 40, 80, 40, 180]);
      } else {
        addLog(`FIRE EFFORT MISSED: TURRET AT ${turretAngle}° - TARGET LOCK REQ: ${tankTargetAngle}°`);
      }
    }

    // Spawning particles right at the muzzle (50, 18)
    const newParticles: typeof muzzleParticles = [];

    // 1. Solid tracer projectile (fast but fades out quickly inside the frame)
    newParticles.push({
      id: Math.random() + Date.now(),
      x: 50,
      y: 18,
      vx: 0,
      vy: -12, // high speed release
      size: 1.8,
      alpha: 1.0,
      color: shellType === "APFSDS" ? "#22d3ee" : "#f43f5e",
      type: "shell",
    });

    // 2. Punchy muzzle fire-flash core (compact explosion center)
    newParticles.push({
      id: Math.random() + Date.now() + 5,
      x: 50,
      y: 18,
      vx: 0,
      vy: -0.3,
      size: 4.5,
      alpha: 1.0,
      color: shellType === "APFSDS" ? "#22d3ee" : "#f59e0b",
      type: "flash",
    });

    // 3. Simple compact transient plasma shock ring (stays well within limits)
    newParticles.push(
      {
        id: Math.random() + Date.now() + 1,
        x: 50,
        y: 18,
        vx: 0,
        vy: -0.4,
        size: 1.5,
        alpha: 0.95,
        color: shellType === "APFSDS" ? "#06b6d4" : "#f97316",
        type: "ring",
      }
    );

    // 4. Multidirectional sparks from muzzle vents (tightly clustered spray)
    const finalSparkCount = ecoMode ? 4 : 10;
    for (let i = 0; i < finalSparkCount; i++) {
      const angle = (Math.random() - 0.5) * Math.PI * 0.85; // angled spray
      const speed = 1.2 + Math.random() * 2.2; // compact velocity
      newParticles.push({
        id: Math.random() + Date.now() + 10 + i,
        x: 50,
        y: 18,
        vx: Math.sin(angle) * speed,
        vy: -Math.cos(angle) * speed - 1.2,
        size: 1.0 + Math.random() * 1.2,
        alpha: 1.0,
        color: Math.random() > 0.4 ? "#f59e0b" : "#fcd34d", // bronze embers
        type: "spark",
      });
    }

    // 5. Stylized, tiny puff of grey exhaust smoke (no viewport filling)
    if (!ecoMode) {
      newParticles.push({
        id: Math.random() + Date.now() + 50,
        x: 50,
        y: 18,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.3,
        size: 1.5,
        alpha: 0.28,
        color: "#6b7280",
        type: "smoke",
      });
    }

    setMuzzleParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setRecoiling(false);
    }, 400);
  }, [reloadProgress, ammoCount, shellType, addLog, ecoMode, tankTargetActive, tankTargetSide, turretAngle, tankTargetAngle]);

  const handleToggleAfterburner = useCallback(() => {
    setAfterburner((prev) => {
      const newState = !prev;
      if (newState) {
        triggerHaptic([20, 10, 20, 10, 50]); // Spooling vibration
        addLog("AFTERBURNED IGNITED: MAX THRUST");
      } else {
        triggerHaptic([15]);
        addLog("AFTERBURNER DEACTIVATED");
      }
      return newState;
    });
  }, [addLog]);

  const handleReleaseFlares = useCallback(() => {
    if (flaresRemaining <= 0 || releasingFlares) return;
    setReleasingFlares(true);
    addLog("TACTICAL DEFENSIVE FLARES ACTIVATED");

    // If an incoming missile threat is active, divert it instantly using standard heat seeking flare decoys
    if (missileThreatActive) {
      setMissileThreatActive(false);
      addLog("SUCCESS: MISSILE DEVIATED BY THERMAL DECOYS!");
      triggerHaptic([40, 50, 40]);
    }

    let salvoIdx = 0;
    const maxSalvos = 4;
    const intervalTime = 125;

    const fireSalvo = () => {
      triggerHaptic([30, 20]);
      setFlaresRemaining((prev) => Math.max(0, prev - 2));

      setFlares((prev) => [
        ...prev,
        // Left Nozzle / wing flare
        {
          id: Math.random() + Date.now() + 1,
          x: 22,
          y: 60,
          vx: -3.8 - Math.random() * 2.2, // Leftward jet ejection
          vy: 1.2 + Math.random() * 1.8, // Drag drift
          size: Math.random() * 3.4 + 2.6,
          alpha: 1.0,
          color: "#f59e0b",
          type: "primary",
        },
        // Right Nozzle / wing flare
        {
          id: Math.random() + Date.now() + 2,
          x: 78,
          y: 60,
          vx: 3.8 + Math.random() * 2.2, // Rightward jet ejection
          vy: 1.2 + Math.random() * 1.8, // Drag drift
          size: Math.random() * 3.4 + 2.6,
          alpha: 1.0,
          color: "#f59e0b",
          type: "primary",
        },
      ]);

      salvoIdx++;
      if (salvoIdx < maxSalvos) {
        setTimeout(fireSalvo, intervalTime);
      } else {
        setTimeout(() => {
          setReleasingFlares(false);
          addLog("FLARE PATROL: SALVO RELEASES COMPLETE");
        }, 400);
      }
    };

    fireSalvo();
  }, [flaresRemaining, releasingFlares, addLog, missileThreatActive]);

  const handleResetAmmo = useCallback(() => {
    triggerHaptic([40]);
    setFlaresRemaining(64);
    setAmmoCount(24);
    setReloadProgress(100);
    addLog("ALL SQUADRON WEAPON RACKS REPLENISHED");
  }, [addLog]);

  return (
    <div className="flex flex-col gap-4 w-[412px] min-w-[412px] max-w-[412px] mx-auto p-1 select-none">
      
      {/* 1. Primary Vector HUD Simulation Card */}
      <div className="relative w-full h-[400px] rounded-[2.5rem] border border-white/10 bg-black/50 backdrop-blur-xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between overflow-hidden group">
        
        {/* CRT Flash overlay on setup complete */}
        {flashActive && (
          <div className="absolute inset-0 z-50 bg-fuchsia-400/45 animate-[flash_0.4s_ease-out_forwards] pointer-events-none rounded-[2.5rem]" />
        )}

        {/* Dynamic Booting setup overlay */}
        {!bootComplete && (
          <div className="absolute inset-0 z-40 bg-[#060608]/95 flex flex-col items-center justify-center p-6 text-center select-none rounded-[2.5rem]">
            {/* Ambient radar circle in loader */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-3">
              <div className="absolute inset-0 rounded-full border border-fuchsia-500/10 pointer-events-none" />
              <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/20 pointer-events-none animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border-2 border-fuchsia-500/10 border-t-fuchsia-500 pointer-events-none animate-[spin_1.5s_linear_infinite]" />
              <div className="absolute inset-6 rounded-full border border-dashed border-cyan-400/30 border-r-transparent pointer-events-none animate-[spin_3s_linear_infinite_reverse]" />
              
              <div className="flex flex-col items-center justify-center z-10">
                <span className="font-mono text-[8px] text-zinc-500 tracking-wider font-bold">LOAD CORE</span>
                <span className="font-mono text-xl font-bold text-fuchsia-400 tracking-tight animate-pulse">{bootProgress}%</span>
              </div>
            </div>

            {/* Booting Progress Indicator */}
            <div className="space-y-2 w-full flex flex-col items-center">
              <span className="font-mono text-[8.5px] text-cyan-400 font-bold tracking-widest uppercase animate-pulse">
                &gt;&gt; {bootStatusText} &lt;&lt;
              </span>
              
              {/* Glowing bar */}
              <div className="w-44 h-1 bg-zinc-950 border border-white/5 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 shadow-[0_0_8px_rgba(244,114,182,0.6)] transition-all duration-100 ease-out" 
                  style={{ width: `${bootProgress}%` }}
                />
              </div>

              {/* Step checklist */}
              <div className="font-mono text-[8px] space-y-1 text-zinc-500 text-left w-full max-w-[180px] border-t border-white/5 pt-2.5">
                <div className="flex items-center justify-between">
                  <span>VECTOR COGNITION:</span>
                  <span className={bootProgress >= 25 ? "text-fuchsia-400 font-bold" : "text-zinc-600 animate-pulse"}>
                    {bootProgress >= 25 ? "SUCCESS" : "INIT..."}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>SATELLITE SECTOR SYNC:</span>
                  <span className={bootProgress >= 50 ? "text-fuchsia-400 font-bold" : "text-zinc-600 animate-pulse"}>
                    {bootProgress >= 50 ? "LOCKED" : "WAIT..."}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>HUD SYNAPSE READY:</span>
                  <span className={bootProgress >= 75 ? "text-fuchsia-400 font-bold" : "text-zinc-600 animate-pulse"}>
                    {bootProgress >= 75 ? "ONLINE" : "PENDG..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Futuristic Scanlines overlay */}
        {scanlines && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.2)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.03),_rgba(0,255,0,0.01),_rgba(0,0,255,0.03))] bg-[size:100%_4px,3px_100%] pointer-events-none z-10" />
        )}

        {/* Oscillating Grid laser sweep */}
        {!ecoMode && (
          <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-20 select-none animate-[scan-sweep_5s_infinite_linear] pointer-events-none z-20" />
        )}

        {/* Corner HUD Reticle Elements */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-25 select-none">
          <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-fuchsia-400" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-fuchsia-400" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-fuchsia-400" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-fuchsia-400" />
          
          {/* Faint blueprint grid and geometric target alignment coordinates */}
          <div className="absolute inset-4 border border-zinc-800/10 rounded-2xl flex items-center justify-center pointer-events-none">
            <div className="absolute w-[80%] h-[1px] bg-cyan-500/5" />
            <div className="absolute h-[80%] w-[1px] bg-cyan-500/5" />
            <div className="absolute w-[180px] h-[180px] border border-cyan-500/5 rounded-lg rotate-45" />
            <div className="absolute w-[120px] h-[120px] border border-fuchsia-500/5 rounded-full" />
          </div>
        </div>

        {/* Section Telemetry Header */}
        <div className="relative z-10 flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-2xl px-3 py-2">
          <div className="flex items-center gap-2 text-fuchsia-400">
            <Radio className={`h-3.5 w-3.5 shrink-0 text-cyan-400 ${ecoMode ? "" : "animate-pulse"}`} />
            <span className="font-mono text-[9px] uppercase tracking-wider font-semibold">
              {vehicle === "jet" ? "AIR: RAPTOR INTERCEPT" : "ARMOR: TYPHOON MBT"}
            </span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                triggerHaptic([15]);
                setVehicle("jet");
                addLog("COGNITIVE ROUTE: FIGHTER JET ACTIVE");
              }}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold transition-all ${
                vehicle === "jet"
                  ? "bg-fuchsia-600 text-white shadow-[0_0_10px_rgba(240,79,240,0.4)]"
                  : "bg-white/5 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              JET
            </button>
            <button
              onClick={() => {
                triggerHaptic([15]);
                setVehicle("tank");
                addLog("COGNITIVE ROUTE: MODERN TANK ACTIVE");
              }}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold transition-all ${
                vehicle === "tank"
                  ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                  : "bg-white/5 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              TANK
            </button>
          </div>
        </div>

        {/* Central Dynamic Vectors Canvas Area - No parent mask to keep all HUD text and buttons crisp */}
        <div 
          className="relative flex-grow flex flex-col items-center justify-center select-none py-2 overflow-hidden w-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          
          {/* Interactive Core Hologram Backdrop Aura */}
          <div className={`absolute w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-fuchsia-500/5 to-cyan-400/5 blur-[40px] pointer-events-none ${ecoMode ? "" : "animate-pulse"}`} />

          {vehicle === "jet" ? (
            /* ------------------ FIGHTER JET VIEW ------------------ */
            <div className="w-full flex-grow flex flex-col items-center justify-between relative">
              
              {/* Dynamic Jet HUD readings */}
              <div className="absolute top-0 left-1 font-mono text-[8px] text-zinc-500 space-y-0.5 text-left select-none">
                <div>ALT: <span className="text-cyan-400 font-bold">{altitude.toLocaleString()} FT</span></div>
                <div>IAS: <span className="text-cyan-400 font-bold">{jetSpeed} KTS</span></div>
                <div>MACH: <span className="text-fuchsia-400 font-bold">{(jetSpeed/661.7).toFixed(2)}</span></div>
              </div>

              <div className="absolute top-0 right-1 font-mono text-[8px] text-zinc-500 text-right space-y-0.5 select-none">
                <div>THRUST: <span className={`${afterburner ? "text-fuchsia-400" : "text-zinc-400"}`}>{afterburner ? "WTR 110%" : "MIL 84%"}</span></div>
                <div>G-LOAD: <span className="text-zinc-300">{(1 + (jetSpeed/320)).toFixed(1)}G</span></div>
                <div>FLARES: <span className="text-emerald-400 font-bold">{flaresRemaining}</span></div>
              </div>

              {/* Dynamic Vector Fighter Jet SVG Container with adjusted scaling */}
              <div className="relative w-[180px] h-[180px] flex items-center justify-center mx-auto my-1.5 select-none">
                
                {/* Sonic expansion lines when boosting */}
                {afterburner && !ecoMode && (
                  <div className="absolute inset-x-2 inset-y-2 border border-fuchsia-400/20 rounded-full animate-ping pointer-events-none opacity-40" />
                )}

                {/* Main Fighter Jet SVG Construction */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-transparent overflow-visible drop-shadow-[0_0_12px_rgba(240,79,240,0.35)] transition-transform duration-300 ease-out"
                  style={{
                    transform: `${afterburner ? "scale(1.05)" : "scale(1)"} ${
                      !ecoMode ? `perspective(500px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : ""
                    }`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <defs>
                    <linearGradient id="jetMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff7bf0" />
                      <stop offset="60%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#00f2fe" />
                    </linearGradient>
                    <linearGradient id="afterburnerFlame" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ff7bf0" stopOpacity="0.95" />
                      <stop offset="30%" stopColor="#ef4444" stopOpacity="0.75" />
                      <stop offset="60%" stopColor="#a855f7" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Left Engine Afterburner Flame aligned precisely on left nozzle center x=39 */}
                  <polygon
                    points={`37.5,83 40.5,${afterburner ? 142 : 94} 43.5,83`}
                    fill="url(#afterburnerFlame)"
                    className={afterburner && !ecoMode ? "animate-pulse" : "opacity-30"}
                    style={{ filter: "blur(0.8px)" }}
                  />

                  {/* Right Engine Afterburner Flame aligned precisely on right nozzle center x=61 */}
                  <polygon
                    points={`56.5,83 59.5,${afterburner ? 142 : 94} 62.5,83`}
                    fill="url(#afterburnerFlame)"
                    className={afterburner && !ecoMode ? "animate-pulse" : "opacity-30"}
                    style={{ filter: "blur(0.8px)" }}
                  />
                  
                  {/* Weapon Reticle Lock Indicator */}
                  <path d="M45,13 L55,13" stroke="#ff7bf0" strokeWidth="0.6" />
                  <path d="M50,11 L50,15" stroke="#ff7bf0" strokeWidth="0.6" />
                  
                  {/* Aircraft wings trailing shockwave vector */}
                  <path d="M22,58 L12,42 M78,58 L88,42" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

                  {/* Sleek Delta/Swept Wings Aircraft Blueprint Silhouette with Solid Dark Fill */}
                  <path
                    fill="rgba(10, 10, 15, 0.95)"
                    stroke="url(#jetMetallic)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="
                      M50,15 
                      L47,24 
                      L43,26 
                      L43,32 
                      L20,62 
                      L18,65 
                      L38,62 
                      L44,54 
                      L44,72 
                      L35,78 
                      L36,83 
                      L50,81 
                      L64,83 
                      L65,78 
                      L56,72 
                      L56,54 
                      L62,62 
                      L82,65 
                      L80,62 
                      L57,32 
                      L57,26 
                      L53,24 
                      Z
                    "
                  />
                  
                  {/* Center Cockpit Canopy line */}
                  <ellipse cx="50" cy="38" rx="2.5" ry="8" fill="none" stroke="#ffffff" strokeWidth="1" className="opacity-80" />
                  
                  {/* Struct/Wing Details */}
                  <path d="M44,45 L32,54 M56,45 L68,54" stroke="url(#jetMetallic)" strokeWidth="0.7" className="opacity-60" />

                  {/* High fidelity tactical flare/decoy particles layer */}
                  {flares.map((f) => {
                    if (f.type === "smoke") {
                      return (
                        <circle
                          key={f.id}
                          cx={f.x}
                          cy={f.y}
                          r={f.size}
                          fill={f.color}
                          opacity={f.alpha}
                          style={{ filter: "blur(1.8px)", mixBlendMode: "screen" }}
                        />
                      );
                    } else if (f.type === "spark") {
                      return (
                        <circle
                          key={f.id}
                          cx={f.x}
                          cy={f.y}
                          r={f.size}
                          fill={f.color}
                          opacity={f.alpha}
                          style={{ filter: "blur(0.5px)" }}
                        />
                      );
                    } else {
                      return (
                        <g key={f.id} opacity={f.alpha}>
                          {/* Inner white-hot glowing center */}
                          <circle
                            cx={f.x}
                            cy={f.y}
                            r={f.size / 1.8}
                            fill="#ffffff"
                          />
                          {/* Main flare thermal signature */}
                          <circle
                            cx={f.x}
                            cy={f.y}
                            r={f.size}
                            fill={f.color}
                            opacity={0.8}
                            style={{ filter: "blur(0.6px)", mixBlendMode: "color-dodge" }}
                          />
                          {/* Radiant bloom */}
                          <circle
                            cx={f.x}
                            cy={f.y}
                            r={f.size * 2}
                            fill={f.color}
                            opacity={0.3}
                            style={{ filter: "blur(1.8px)" }}
                          />
                        </g>
                      );
                    }
                  })}
                </svg>

                {/* Leftover overlay if any (rendered empty to keep spacing but cleaned) */}
                {releasingFlares && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="absolute -left-1 opacity-20 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
                    <span className="absolute -right-1 opacity-20 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
                  </div>
                )}
              </div>

              {/* Timed, red, missile warning alert HUD pop-up (centered above the buttons, hidden in Eco Mode) */}
              <AnimatePresence>
                {missileThreatActive && !ecoMode && (
                  <motion.div
                    variants={glitchVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute bottom-[36px] left-[4%] right-[4%] w-[92%] bg-black/95 border border-red-500 rounded-xl p-2.5 z-30 select-none shadow-[0_0_15px_rgba(239,68,68,0.45)]"
                  >
                    <div className="flex items-center gap-2 text-red-400 font-mono text-[8.5px] font-bold">
                      <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-1 shrink-0">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-red-400 text-[9px] tracking-widest font-black leading-tight">!!! WARNING: SAM LOCKED ON !!!</div>
                        <div className="text-zinc-300 text-[7.5px] font-normal leading-normal mt-0.5">DISPENSE TACTICAL FLARES IMMEDIATELY</div>
                      </div>
                      <div className="bg-red-500 text-black px-1.5 py-1 rounded text-[9.5px] font-black tracking-normal leading-none font-mono tabular-nums">
                        {missileTimeLeft.toFixed(1)}s
                      </div>
                    </div>
                    {/* Miniature timed decay status line */}
                    <div className="w-full bg-red-950/60 h-[3px] mt-2 rounded-full overflow-hidden border border-red-900/40">
                      <div 
                        className="bg-red-500 h-full transition-all duration-100 ease-linear"
                        style={{ width: `${(missileTimeLeft / 5.0) * 100}%` }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Jet Interactive Control Panel inside visualization space */}
              <div className="w-full grid grid-cols-2 gap-2 mt-2 select-none">
                <button
                  onClick={handleToggleAfterburner}
                  className={`py-2 px-3 rounded-xl font-mono text-[9px] text-center border transition-all ${
                    afterburner 
                      ? "bg-fuchsia-950/60 border-fuchsia-700/60 text-fuchsia-300 font-bold tracking-widest shadow-[inset_0_0_8px_rgba(239,78,210,0.2)]" 
                      : "bg-white/[0.02] border-white/5 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {afterburner ? "» DEACTIVATE AB «" : "» IGNITE AFTERBURNER «"}
                </button>
                <button
                  onClick={handleReleaseFlares}
                  disabled={releasingFlares || flaresRemaining <= 0}
                  className={`py-2 px-3 rounded-xl font-mono text-[9px] text-center border transition-all ${
                    releasingFlares 
                      ? "bg-amber-950/40 border-amber-800/40 text-amber-300 font-semibold"
                      : flaresRemaining <= 0
                      ? "bg-red-950/20 border-red-900/20 text-red-400/40 cursor-not-allowed"
                      : missileThreatActive && !ecoMode
                      ? "bg-white/[0.02] border-emerald-500 text-zinc-300 shadow-[0_0_10px_rgba(16,185,129,0.35)] animate-pulse"
                      : "bg-white/[0.02] border-white/5 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {releasingFlares ? "DISPENSING..." : `DISPENSE FLARES (${flaresRemaining})`}
                </button>
              </div>

            </div>
          ) : (
            /* ------------------ MODERN TANK MBT VIEW ------------------ */
            <div className="w-full flex-grow flex flex-col items-center justify-between relative">

              {/* Tank Minigame Hostile Left Threat Tracker */}
              {tankTargetActive && tankTargetSide === "left" && (() => {
                const isLocked = turretAngle === tankTargetAngle;
                return (
                  <div className="absolute left-2.5 top-[38%] -translate-y-1/2 flex flex-col items-center gap-1 z-20 select-none bg-black/85 backdrop-blur-[2px] p-1.5 rounded-lg border border-white/10 shadow-xl w-[90px]">
                    <div className="relative flex items-center justify-center">
                      {/* Pulsing ring emission */}
                      {!ecoMode && (
                        <div className={`absolute w-8 h-8 rounded-full border ${
                          isLocked 
                            ? "border-emerald-500/60" 
                            : "border-red-500/60"
                        } animate-ping`} />
                      )}
                      <div className={`border rounded-lg p-1 shadow-sm transition-all ${
                        isLocked
                          ? "bg-emerald-950/95 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                          : "bg-red-950/95 border-red-500 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                      }`}>
                        <Target className={`h-5 w-5 shrink-0 ${isLocked ? "text-emerald-400" : "animate-pulse text-red-500"}`} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <div className={`font-mono text-[9px] font-black uppercase tracking-wider px-1 py-0.5 rounded transition-all leading-none w-full text-center ${
                        isLocked
                          ? "text-emerald-400 bg-emerald-950/80"
                          : "text-red-400 bg-red-950/80"
                      }`}>
                        {isLocked ? "LOCK-ON" : "ACQUIRED"}
                      </div>
                      <div className="font-mono text-[9.5px] font-bold text-zinc-300 mt-1 leading-none text-center">
                        HDG: <span className={isLocked ? "text-emerald-400 font-black text-[10.5px]" : "text-red-400 font-black text-[10.5px]"}>{tankTargetAngle}°</span>
                      </div>
                    </div>
                    <div className="font-mono text-[8px] text-zinc-400 font-bold bg-black/60 px-1 py-0.5 rounded border border-white/5 w-full text-center tabular-nums leading-none">
                      DECAY: {tankTargetTimeLeft.toFixed(1)}s
                    </div>
                  </div>
                );
              })()}

              {/* Tank Minigame Hostile Right Threat Tracker */}
              {tankTargetActive && tankTargetSide === "right" && (() => {
                const isLocked = turretAngle === tankTargetAngle;
                return (
                  <div className="absolute right-2.5 top-[38%] -translate-y-1/2 flex flex-col items-center gap-1 z-20 select-none bg-black/85 backdrop-blur-[2px] p-1.5 rounded-lg border border-white/10 shadow-xl w-[90px]">
                    <div className="relative flex items-center justify-center">
                      {/* Pulsing ring emission */}
                      {!ecoMode && (
                        <div className={`absolute w-8 h-8 rounded-full border ${
                          isLocked 
                            ? "border-emerald-500/60" 
                            : "border-red-500/60"
                        } animate-ping`} />
                      )}
                      <div className={`border rounded-lg p-1 shadow-sm transition-all ${
                        isLocked
                          ? "bg-emerald-950/95 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                          : "bg-red-950/95 border-red-500 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                      }`}>
                        <Target className={`h-5 w-5 shrink-0 ${isLocked ? "text-emerald-400" : "animate-pulse text-red-500"}`} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <div className={`font-mono text-[9px] font-black uppercase tracking-wider px-1 py-0.5 rounded transition-all leading-none w-full text-center ${
                        isLocked
                          ? "text-emerald-400 bg-emerald-950/80"
                          : "text-red-400 bg-red-950/80"
                      }`}>
                        {isLocked ? "LOCK-ON" : "ACQUIRED"}
                      </div>
                      <div className="font-mono text-[9.5px] font-bold text-zinc-300 mt-1 leading-none text-center">
                        HDG: <span className={isLocked ? "text-emerald-400 font-black text-[10.5px]" : "text-red-400 font-black text-[10.5px]"}>{tankTargetAngle}°</span>
                      </div>
                    </div>
                    <div className="font-mono text-[8px] text-zinc-400 font-bold bg-black/60 px-1 py-0.5 rounded border border-white/5 w-full text-center tabular-nums leading-none">
                      DECAY: {tankTargetTimeLeft.toFixed(1)}s
                    </div>
                  </div>
                );
              })()}
              
              {/* Dynamic Tank HUD statistics */}
              <div className="absolute top-0 left-1 font-mono text-[8px] text-zinc-500 space-y-0.5 text-left select-none">
                <div>TELEMETRY: <span className="text-cyan-400 font-bold">{laserArmed ? "AUTO-LOCK" : "STBY"}</span></div>
                <div>SHELL: <span className="text-fuchsia-400 font-bold">{shellType}</span></div>
              </div>

              <div className="absolute top-0 right-1 font-mono text-[8px] text-zinc-500 text-right space-y-0.5 select-none">
                <div>AMMO READY: <span className="text-emerald-400 font-bold">{ammoCount}/24</span></div>
                <div>AUTOLOADER: <span className={`${reloadProgress === 100 ? "text-emerald-400" : `text-amber-400 ${ecoMode ? "" : "animate-pulse"}`}`}>{reloadProgress}%</span></div>
                <div>HEAT COMP: <span className="text-zinc-300">ACTIVE</span></div>
              </div>

              {/* Dynamic Blueprint Tank SVG with adjusted scaling */}
              <div className="relative w-[180px] h-[180px] flex items-center justify-center mx-auto my-1.5 select-none">
                
                {/* Muzzle blast ring on recoil fire */}
                {recoiling && !ecoMode && (
                  <div 
                    className="absolute w-20 h-20 border-2 border-fuchsia-400 rounded-full animate-ping pointer-events-none z-10"
                    style={{
                      transform: `rotate(${turretAngle}deg) translateY(-29px)`,
                    }}
                  />
                )}

                {/* Main Dynamic Modern MBT tank SVG - overflow-visible allows particles to fly across canvas bounds */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-transparent overflow-visible transition-transform duration-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                >
                  <defs>
                    <linearGradient id="tankMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00f2fe" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#ff7bf0" />
                    </linearGradient>
                  </defs>

                  {/* High-tech vector target system (Replacing dotted circle) */}
                  <g opacity="0.3">
                    {/* Minimalist outer corner target corners */}
                    <path d="M 14 14 L 14 19 L 19 19" fill="none" stroke="#22d3ee" strokeWidth="0.55" />
                    <path d="M 86 14 L 86 19 L 81 19" fill="none" stroke="#22d3ee" strokeWidth="0.55" />
                    <path d="M 14 86 L 14 81 L 19 81" fill="none" stroke="#22d3ee" strokeWidth="0.55" />
                    <path d="M 86 86 L 86 81 L 81 81" fill="none" stroke="#22d3ee" strokeWidth="0.55" />

                    {/* Left/Right/Top/Bottom vector indicator ticks */}
                    <line x1="6" y1="50" x2="14" y2="50" stroke="#22d3ee" strokeWidth="0.45" />
                    <line x1="86" y1="50" x2="94" y2="50" stroke="#22d3ee" strokeWidth="0.45" />
                    <line x1="50" y1="6" x2="50" y2="14" stroke="#22d3ee" strokeWidth="0.45" />
                    <line x1="50" y1="86" x2="50" y2="94" stroke="#22d3ee" strokeWidth="0.45" />
                    
                    {/* Solid outer alignment scope borders */}
                    <circle cx="50" cy="50" r="39" fill="none" stroke="#22d3ee" strokeWidth="0.35" />
                    <circle cx="50" cy="50" r="43" fill="none" stroke="#22d3ee" strokeWidth="0.15" />
                  </g>

                  {/* TANK HULL BLUEPRINT (Stationary baseline bottom profile, centered perfectly) */}
                  <g id="tank-hull">
                    {/* Tracks and Wheels Details */}
                    <rect x="22" y="69" width="56" height="12" rx="3" fill="none" stroke="url(#tankMetallic)" strokeWidth="1" />
                    {/* Individual wheel circles inside tracks */}
                    <circle cx="28" cy="75" r="3.5" fill="none" stroke="url(#tankMetallic)" strokeWidth="0.8" />
                    <circle cx="37" cy="75" r="3.5" fill="none" stroke="url(#tankMetallic)" strokeWidth="0.8" />
                    <circle cx="46" cy="75" r="3.5" fill="none" stroke="url(#tankMetallic)" strokeWidth="0.8" />
                    <circle cx="55" cy="75" r="3.5" fill="none" stroke="url(#tankMetallic)" strokeWidth="0.8" />
                    <circle cx="64" cy="75" r="3.5" fill="none" stroke="url(#tankMetallic)" strokeWidth="0.8" />
                    <circle cx="72" cy="75" r="3.5" fill="none" stroke="url(#tankMetallic)" strokeWidth="0.8" />

                    {/* Tank chassis upper slope */}
                    <polygon
                      points="12,69 88,69 82,59 18,59"
                      fill="rgba(10, 10, 15, 0.95)"
                      stroke="url(#tankMetallic)"
                      strokeWidth="1.2"
                    />
                    {/* Front armor skirt rivets */}
                    <line x1="20" y1="63" x2="80" y2="63" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="0.8" strokeDasharray="3 3" />
                  </g>

                  {/* TANK TURRET & BARREL (Rotatable and dynamic) */}
                  <g 
                    id="tank-turret-assembly"
                    className="origin-[50px_53px] transition-transform duration-300"
                    style={{
                      transform: `rotate(${turretAngle}deg)`,
                    }}
                  >
                    {/* Recoiling gun barrel assembly */}
                    <g 
                      className="transition-transform duration-100 ease-out"
                      style={{
                        transform: recoiling ? "translateY(8px)" : "translateY(0)",
                      }}
                    >
                      {/* Detailed main tank barrel */}
                      <rect x="48.5" y="21" width="3" height="26" fill="none" stroke="url(#tankMetallic)" strokeWidth="0.9" />
                      {/* Muzzle Brake - metallic blue/cyan gradient */}
                      <rect x="47" y="18" width="6" height="3" fill="none" stroke="url(#tankMetallic)" strokeWidth="0.8" />
                      {/* Thermal Sleeve / Bore Evacuator */}
                      <rect x="47.5" y="31" width="5" height="7" fill="none" stroke="url(#tankMetallic)" strokeWidth="0.8" />
                    </g>

                    {/* Muzzle fire tracer sparks, smoke, and expanding shock rings layer */}
                    {muzzleParticles.map((p) => {
                      if (p.type === "ring") {
                        return (
                          <circle
                            key={p.id}
                            cx={p.x}
                            cy={p.y}
                            r={p.size}
                            fill="none"
                            stroke={p.color}
                            strokeWidth={0.6}
                            opacity={p.alpha}
                            style={{ filter: "blur(0.4px)", mixBlendMode: "screen" }}
                          />
                        );
                      } else if (p.type === "shell") {
                        return (
                          <line
                            key={p.id}
                            x1={p.x}
                            y1={p.y}
                            x2={p.x}
                            y2={p.y - p.vy * 1.5}
                            stroke={p.color}
                            strokeWidth={p.size}
                            strokeLinecap="round"
                            opacity={p.alpha}
                            style={{ filter: "blur(0.3px)", mixBlendMode: "screen" }}
                          />
                        );
                      } else if (p.type === "flash") {
                        return (
                          <g key={p.id} opacity={p.alpha}>
                            {/* Outer soft heat ripple */}
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={p.size * 1.6}
                              fill={p.color}
                              style={{ filter: "blur(2px)", mixBlendMode: "screen", opacity: 0.35 }}
                            />
                            {/* Medium fiery explosion core */}
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={p.size}
                              fill={p.color}
                              style={{ filter: "blur(0.8px)", mixBlendMode: "screen" }}
                            />
                            {/* White hot pressure center */}
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={p.size * 0.45}
                              fill="#ffffff"
                              style={{ filter: "blur(0.2px)", mixBlendMode: "screen" }}
                            />
                          </g>
                        );
                      } else if (p.type === "smoke") {
                        return (
                          <circle
                            key={p.id}
                            cx={p.x}
                            cy={p.y}
                            r={p.size}
                            fill={p.color}
                            opacity={p.alpha}
                            style={{ filter: "blur(1.4px)", mixBlendMode: "overlay" }}
                          />
                        );
                      } else {
                        return (
                          <circle
                            key={p.id}
                            cx={p.x}
                            cy={p.y}
                            r={p.size}
                            fill={p.color}
                            opacity={p.alpha}
                            style={{ filter: "blur(0.2px)" }}
                          />
                        );
                      }
                    })}

                    {/* Turret Mantlet Base */}
                    <rect x="42" y="45" width="16" height="4" fill="none" stroke="url(#tankMetallic)" strokeWidth="1" />

                    {/* Circle-designed Turret Base to prevent clipping under rotation */}
                    <circle
                      cx="50"
                      cy="53"
                      r="13"
                      fill="rgba(15, 15, 20, 0.98)"
                      stroke="url(#tankMetallic)"
                      strokeWidth="1.4"
                    />

                    {/* High-tech inner detail ring */}
                    <circle
                      cx="50"
                      cy="53"
                      r="9"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="0.8"
                      strokeDasharray="2 2"
                      className="opacity-80"
                    />

                    {/* Integrated hatches & optical sights within the rotatable circle */}
                    <circle cx="45" cy="51" r="2" fill="none" stroke="url(#tankMetallic)" strokeWidth="0.8" />
                    <circle cx="54" cy="54" r="2" fill="none" stroke="#22d3ee" strokeWidth="0.7" />
                    
                    {/* Comm antenna */}
                    <line x1="45" y1="51" x2="39" y2="38" stroke="rgba(6, 182, 212, 0.6)" strokeWidth="0.5" />
                  </g>
                </svg>
              </div>

              {/* Turret Rotation Angle Indicator below the Tank */}
              <div className="w-full flex justify-center py-1 select-none my-0.5">
                <div className="font-mono text-[9.5px] font-black tracking-widest text-cyan-400 bg-cyan-950/50 border border-cyan-500/40 px-3 py-1 rounded-md shadow-[0_0_10px_rgba(6,182,212,0.2)] flex items-center gap-1.5 min-w-[140px] justify-center text-center">
                  <Compass className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  BEARING: <span className="text-white font-black text-[11px] tabular-nums">{turretAngle}°</span>
                </div>
              </div>

              {/* Lowered Turret Stabilizer & Traverse Row below SVG */}
              <div className="w-full flex justify-between gap-1.5 mt-1 pb-1 select-none z-10">
                <button 
                  onClick={() => {
                    triggerHaptic([12]);
                    setTurretAngle((prev) => Math.max(-90, prev - 15));
                    addLog("TRAVERSE TURRET LEFT");
                  }}
                  className="flex-1 py-1.5 px-3 bg-white/[0.03] border border-white/5 text-zinc-400 rounded-xl font-mono text-[9px] hover:border-cyan-500 hover:text-white transition-all text-center"
                >
                  ◄ LEFT
                </button>
                <button 
                  onClick={() => {
                    triggerHaptic([12]);
                    setTurretAngle(0);
                    addLog("CENTER GUN STABILIZER");
                  }}
                  className="flex-1 py-1.5 px-2 bg-white/[0.03] border border-white/5 text-zinc-400 rounded-xl font-mono text-[9px] hover:text-white transition-all text-center"
                >
                  CENTER
                </button>
                <button 
                  onClick={() => {
                    triggerHaptic([12]);
                    setTurretAngle((prev) => Math.min(90, prev + 15));
                    addLog("TRAVERSE TURRET RIGHT");
                  }}
                  className="flex-1 py-1.5 px-3 bg-white/[0.03] border border-white/5 text-zinc-400 rounded-xl font-mono text-[9px] hover:border-cyan-500 hover:text-white transition-all text-center"
                >
                  RIGHT ►
                </button>
              </div>

              {/* Tank Interactive controls inside visualization space */}
              <div className="w-full grid grid-cols-2 gap-2 mt-2 select-none">
                <button
                  onClick={handleFireTank}
                  disabled={reloadProgress < 100 || ammoCount <= 0}
                  className={`py-2 px-3 rounded-xl font-mono text-[9px] text-center border transition-all ${
                    reloadProgress < 100
                      ? "bg-amber-950/20 border-amber-900/10 text-zinc-500 cursor-not-allowed"
                      : ammoCount <= 0
                      ? "bg-red-950/20 border-red-900/20 text-red-400/40 cursor-not-allowed"
                      : "bg-cyan-950/60 border-cyan-500/60 text-cyan-300 font-bold tracking-widest shadow-[inset_0_0_8px_rgba(6,182,212,0.2)] hover:bg-cyan-900/50 hover:border-cyan-400"
                  }`}
                >
                  {reloadProgress < 100 ? `RELOADING...` : `FIRE ${shellType}`}
                </button>
                <button
                  onClick={() => {
                    const newType = shellType === "APFSDS" ? "HEAT-FS" : "APFSDS";
                    setShellType(newType);
                    triggerHaptic([20]);
                    addLog(`AMMUNITION SWITCHED: ${newType}`);
                  }}
                  className="py-2 px-3 rounded-xl font-mono text-[9px] text-center border bg-white/[0.02] border-white/5 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                >
                  TOGGLE SHELL (AP/HEAT)
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* 2. Tactical Telemetry & System Controls Dashboard */}
      <div className="relative w-full rounded-3xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl p-4 shadow-xl space-y-3">
        
        <div className="flex justify-between items-center text-[8px] font-mono select-none">
          <span className="text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <Compass className="h-3 w-3 text-fuchsia-400" /> TACTICAL TELEMETRY STREAM
          </span>
          <button 
            disabled={!bootComplete}
            onClick={handleResetAmmo}
            className={`flex items-center gap-1 font-bold transition-all ${
              !bootComplete 
                ? "opacity-35 cursor-not-allowed pointer-events-none text-fuchsia-400" 
                : (flaresRemaining <= 0 || ammoCount <= 0)
                ? "text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]"
                : "text-fuchsia-400 hover:text-fuchsia-300"
            }`}
          >
            <RotateCcw className="h-2.5 w-2.5" /> REARM RACK
          </button>
        </div>

        {/* Micro Telemetry Console Logger */}
        <div className="bg-black/80 rounded-xl p-2.5 border border-white/5 space-y-1 font-mono text-[9px] text-left h-[74px] flex flex-col justify-center overflow-hidden">
          {systemLogs.map((log, index) => (
            <div 
              key={index}
              className={`truncate ${index === 0 && !ecoMode && bootComplete ? "text-cyan-400 font-medium animate-pulse" : index === 0 ? "text-cyan-400 font-medium" : "text-zinc-500/80"}`}
            >
              {log}
            </div>
          ))}
        </div>

        {/* Scrolling Terminal Live Metrics Stream */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <div className="flex justify-between items-center text-[7.5px] font-mono select-none text-zinc-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full bg-emerald-500 ${ecoMode || !bootComplete ? "" : "animate-pulse"}`} />
              LIVE SYSTEM PERFORMANCE FEED
            </span>
            <span className="font-semibold text-emerald-500/80 tracking-normal text-[7px]">CH:{vehicle.toUpperCase()}_HYPER_SENSE</span>
          </div>
          
          <div 
            ref={scrollRef}
            className="h-20 bg-black/90 rounded-xl p-2 border border-emerald-500/15 overflow-y-auto font-mono text-[8.5px] text-emerald-400 select-all space-y-0.5 scrollbar-thin scrollbar-thumb-emerald-950/40 scrollbar-track-transparent"
          >
            {telemetryLogs.map((log, index) => (
              <div 
                key={index} 
                className="opacity-90 hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis flex gap-1.5"
              >
                <span className="text-emerald-600/70 select-none shrink-0">&gt;&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes scan-sweep {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 0.25; }
          85% { opacity: 0.25; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes flash {
          0% { opacity: 0; }
          40% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

import React, { useState, useEffect, useRef } from "react";
import { Shield, Radio, Compass, Target, Navigation as NavIcon, Zap, Eye, RotateCcw } from "lucide-react";

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

interface CombatVisualProps {
  ecoMode?: boolean;
}

export const CombatVisual: React.FC<CombatVisualProps> = ({ ecoMode = false }) => {
  const [vehicle, setVehicle] = useState<VehicleType>("jet");
  const [scanlines, setScanlines] = useState(true);
  
  // Jet states
  const [afterburner, setAfterburner] = useState(false);
  const [jetSpeed, setJetSpeed] = useState(720); // knots
  const [altitude, setAltitude] = useState(14500); // feet
  const [flaresRemaining, setFlaresRemaining] = useState(64);
  const [releasingFlares, setReleasingFlares] = useState(false);
  
  // Tank states
  const [turretAngle, setTurretAngle] = useState(0);
  const [recoiling, setRecoiling] = useState(false);
  const [shellType, setShellType] = useState<"APFSDS" | "HEAT-FS">("APFSDS");
  const [ammoCount, setAmmoCount] = useState(24);
  const [reloadProgress, setReloadProgress] = useState(100);
  const [laserArmed, setLaserArmed] = useState(true);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "SYSTEM CHECK: ONLINE",
    "INITIALIZING TACTICAL SYSTEMS...",
    "HUD CALIBRATION COMPLETE",
    "READY TO COLLIDE WITH STEEL"
  ]);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  // Viewport monitor for desktop-only simulation constraint
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Auto-populate on vehicle switch
  useEffect(() => {
    const initialLogs: string[] = [];
    const pool = vehicle === "jet" ? [...JET_METRIC_POOL, ...GENERAL_METRIC_POOL] : [...TANK_METRIC_POOL, ...GENERAL_METRIC_POOL];
    for (let i = 0; i < 8; i++) {
       const idx = Math.floor(Math.random() * pool.length);
       const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
       const randomNoiseHex = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, "0");
       initialLogs.push(`[${time} 0x${randomNoiseHex}] ${pool[idx]}`);
    }
    setTelemetryLogs(initialLogs);
  }, [vehicle]);

  // Stream live entries
  useEffect(() => {
    const delay = ecoMode ? 3500 : 1200;
    const interval = setInterval(() => {
      const pool = vehicle === "jet" ? [...JET_METRIC_POOL, ...GENERAL_METRIC_POOL] : [...TANK_METRIC_POOL, ...GENERAL_METRIC_POOL];
      const randomLine = pool[Math.floor(Math.random() * pool.length)];
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
      const randomNoiseHex = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, "0");
      const formattedLog = `[${time} 0x${randomNoiseHex}] ${randomLine}`;
      
      setTelemetryLogs((prev) => {
        const next = [...prev, formattedLog];
        if (next.length > 50) next.shift();
        return next;
      });
    }, delay);

    return () => clearInterval(interval);
  }, [vehicle, ecoMode]);

  // Keep terminal scrolled to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [telemetryLogs]);

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setSystemLogs((prev) => [`[${time}] ${message}`, ...prev.slice(0, 3)]);
  };

  // Jet Speed & Altitude simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (vehicle === "jet") {
      const delay = ecoMode ? 300 : 100;
      interval = setInterval(() => {
        setJetSpeed((prev) => {
          const target = afterburner ? 1450 : 720;
          const diff = target - prev;
          if (Math.abs(diff) < 5) return target;
          const stepMultiplier = ecoMode ? 3 : 1;
          return prev + Math.sign(diff) * (afterburner ? 25 : 15) * stepMultiplier;
        });
        setAltitude((prev) => {
          const change = afterburner ? 45 : (Math.random() > 0.5 ? 5 : -5);
          const stepMultiplier = ecoMode ? 3 : 1;
          return Math.max(1000, Math.min(50000, prev + change * stepMultiplier));
        });
      }, delay);
    }
    return () => clearInterval(interval);
  }, [vehicle, afterburner, ecoMode]);

  // Reload progress simulation for tank
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (reloadProgress < 100) {
      const delay = ecoMode ? 300 : 100;
      interval = setInterval(() => {
        setReloadProgress((prev) => {
          if (prev >= 100) {
            addLog("AUTOLOADER CYCLED: READY");
            return 100;
          }
          const increment = ecoMode ? 15 : 5;
          return prev + increment;
        });
      }, delay);
    }
    return () => clearInterval(interval);
  }, [reloadProgress, ecoMode]);

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

  const handleFireTank = () => {
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

    setTimeout(() => {
      setRecoiling(false);
    }, 400);
  };

  const handleToggleAfterburner = () => {
    const newState = !afterburner;
    setAfterburner(newState);
    if (newState) {
      triggerHaptic([20, 10, 20, 10, 50]); // Spooling vibration
      addLog("AFTERBURNED IGNITED: MAX THRUST");
    } else {
      triggerHaptic([15]);
      addLog("AFTERBURNER DEACTIVATED");
    }
  };

  const handleReleaseFlares = () => {
    if (flaresRemaining <= 0 || releasingFlares) return;
    setReleasingFlares(true);
    triggerHaptic([30, 25, 30, 25, 35]); // Rapid double pop
    setFlaresRemaining((prev) => Math.max(0, prev - 2));
    addLog("DEFENSIVE FLARES DEPLOYED");

    setTimeout(() => {
      setReleasingFlares(false);
    }, 800);
  };

  const handleResetAmmo = () => {
    triggerHaptic([40]);
    if (vehicle === "jet") {
      setFlaresRemaining(64);
      addLog("FLARE COUNTER REPLENISHED [64/64]");
    } else {
      setAmmoCount(24);
      setReloadProgress(100);
      addLog("MAIN GUN RACKS REPLENISHED [24/24]");
    }
  };

  if (!isDesktop) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-[420px] mx-auto p-1 sm:p-2 select-none">
      
      {/* 1. Primary Vector HUD Simulation Card */}
      <div className="relative w-full aspect-square rounded-[2.5rem] border border-white/10 bg-black/50 backdrop-blur-xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between overflow-hidden group">
        
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
          
          {/* Faint blueprint circular scale */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] border border-white/[0.02] rounded-full flex items-center justify-center">
            <div className="w-[150px] h-[150px] border border-dashed border-cyan-400/10 rounded-full" />
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

        {/* Central Dynamic Vectors Canvas Area */}
        <div className="relative flex-grow flex flex-col items-center justify-center select-none py-2 overflow-hidden">
          
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
                  className={`w-full h-full text-transparent overflow-visible drop-shadow-[0_0_12px_rgba(240,79,240,0.35)] transition-transform duration-500 ${
                    afterburner ? "scale-105" : ""
                  }`}
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
                </svg>

                {/* Flare ejection burst graphics */}
                {releasingFlares && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`absolute -left-4 top-[55%] w-3 h-3 bg-amber-400 rounded-full opacity-70 ${ecoMode ? "" : "animate-ping"}`} />
                    <span className={`absolute -right-4 top-[55%] w-3 h-3 bg-amber-400 rounded-full opacity-70 ${ecoMode ? "" : "animate-ping"}`} />
                    <span className={`absolute -left-8 top-[68%] w-2 h-2 bg-yellow-300 rounded-full ${ecoMode ? "" : "animate-pulse"}`} />
                    <span className={`absolute -right-8 top-[68%] w-2 h-2 bg-yellow-300 rounded-full ${ecoMode ? "" : "animate-pulse"}`} />
                  </div>
                )}
              </div>

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
              
              {/* Dynamic Tank HUD statistics */}
              <div className="absolute top-0 left-1 font-mono text-[8px] text-zinc-500 space-y-0.5 text-left select-none">
                <div>ROTATION: <span className="text-cyan-400 font-bold">{turretAngle}° DEG</span></div>
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

                {/* Main Dynamic Modern MBT tank SVG */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-transparent transition-all duration-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                >
                  <defs>
                    <linearGradient id="tankMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00f2fe" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#ff7bf0" />
                    </linearGradient>
                  </defs>

                  {/* Faint laser ring crosshair background alignment */}
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#22d3ee" strokeWidth="0.4" strokeDasharray="1 9" />

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

                    {/* Turret Mantlet Base */}
                    <rect x="42" y="45" width="16" height="4" fill="none" stroke="url(#tankMetallic)" strokeWidth="1" />

                    {/* Turret main armored cap */}
                    <polygon
                      points="32,57 68,57 62,47 38,47"
                      fill="rgba(15, 15, 20, 0.98)"
                      stroke="url(#tankMetallic)"
                      strokeWidth="1.4"
                    />

                    {/* Hatch and details on turret roof */}
                    <rect x="36" y="45" width="4" height="2" fill="none" stroke="url(#tankMetallic)" strokeWidth="0.8" />
                    <circle cx="58" cy="46" r="2.5" fill="none" stroke="#22d3ee" strokeWidth="0.7" />
                    
                    {/* Comm antennas */}
                    <line x1="38" y1="45" x2="33" y2="33" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.5" />
                  </g>
                </svg>
              </div>

              {/* Lowered Turret Stabilizer & Traverse Row below SVG */}
              <div className="w-full flex justify-between gap-1.5 mt-1 pb-1 select-none z-10">
                <button 
                  onClick={() => {
                    triggerHaptic([12]);
                    setTurretAngle((prev) => Math.max(-180, prev - 15));
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
                    setTurretAngle((prev) => Math.min(180, prev + 15));
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
            onClick={handleResetAmmo}
            className="text-fuchsia-400 flex items-center gap-1 hover:text-fuchsia-300 font-bold"
          >
            <RotateCcw className="h-2.5 w-2.5" /> REARM RACK
          </button>
        </div>

        {/* Micro Telemetry Console Logger */}
        <div className="bg-black/80 rounded-xl p-2.5 border border-white/5 space-y-1 font-mono text-[9px] text-left h-[74px] flex flex-col justify-center overflow-hidden">
          {systemLogs.map((log, index) => (
            <div 
              key={index}
              className={`truncate ${index === 0 && !ecoMode ? "text-cyan-400 font-medium animate-pulse" : index === 0 ? "text-cyan-400 font-medium" : "text-zinc-500/80"}`}
            >
              {log}
            </div>
          ))}
        </div>

        {/* Scrolling Terminal Live Metrics Stream */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <div className="flex justify-between items-center text-[7.5px] font-mono select-none text-zinc-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full bg-emerald-500 ${ecoMode ? "" : "animate-pulse"}`} />
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
      `}</style>
    </div>
  );
};

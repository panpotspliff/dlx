import React, { useState } from "react";
import { Youtube, MessageSquare, Play, Flame, Cpu, Compass, Users, Sparkles, ArrowUpRight, Instagram } from "lucide-react";

interface InteractiveLinkTreeProps {
  ecoMode?: boolean;
}

export const InteractiveLinkTree: React.FC<InteractiveLinkTreeProps> = ({ ecoMode = false }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-4 lg:space-y-3">
      {/* Title block aligned precisely in the center of the 2 break lines */}
      <div className="flex items-center justify-between py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Compass className="h-3.5 w-3.5 text-fuchsia-400 animate-[spin_8s_infinite_linear]" />
          <span className="font-mono text-[11px] sm:text-xs text-zinc-200 tracking-wider font-semibold">CORE COMMUNICATIONS</span>
        </div>
        <span className="font-mono text-[10px] sm:text-[10.5px] text-zinc-400 uppercase tracking-wider">4 frequencies active</span>
      </div>

      {/* Premium Multi-dimensional Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-3">
        
        {/* 1. YouTube Panel */}
        <a
          href="https://www.youtube.com/@daliaxez"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredId("youtube")}
          onMouseLeave={() => setHoveredId(null)}
          className="group relative block rounded-xl border border-red-500/20 bg-[#140505]/40 p-4 lg:p-3.5 backdrop-blur-md transition-all duration-300 hover:border-red-500/80 hover:bg-[#200707]/60 hover:-translate-y-1 shadow-[0_4px_20px_rgba(239,68,68,0.02)] hover:shadow-[0_12px_30px_rgba(239,68,68,0.15)] flex flex-col justify-between h-[230px] sm:h-[220px] lg:h-[205px] overflow-hidden"
        >
          {/* Seamless Animated Cyber Grid backdrop */}
          <div className={`absolute inset-0 cyber-grid-red pointer-events-none opacity-65 group-hover:opacity-95 transition-opacity duration-300 ${ecoMode ? "" : "animate-flow-grid"}`} />

          {/* Sweeping Laser Line Overlay */}
          {!ecoMode && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/8 to-transparent pointer-events-none animate-laser-sweep" />
          )}

          {/* Iridescent Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-red-500/10 blur-xl group-hover:bg-red-500/25 group-hover:scale-150 transition-all duration-500 pointer-events-none" />
          
          {/* Scanline overlay for aesthetic */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20 group-hover:opacity-40" />

          {/* Top Panel telemetry */}
          <div className="flex justify-between items-start">
            <span className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
              <Youtube size={19} className="group-hover:rotate-6 transition-transform" />
            </span>
          </div>

          {/* Channel Info */}
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-1">
              <h4 className="font-display font-bold text-[17px] sm:text-lg text-white group-hover:text-red-300 transition-colors">
                youtube
              </h4>
              <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="font-mono text-[11px] sm:text-[12px] text-zinc-500 tracking-tight leading-relaxed">
              questionable armor penetration math & steel box commentary.
            </p>
          </div>

          {/* Interactive Stats Simulator */}
          <div className="pt-2 border-t border-white/5 space-y-1 z-10 font-mono text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>Hangar Dwellers:</span>
              <span className="text-white font-bold tracking-tight">30K+</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-rose-500 h-full w-[85%] group-hover:w-[92%] transition-all duration-1000" />
            </div>
          </div>
        </a>

        {/* 2. TikTok Panel */}
        <a
          href="https://www.tiktok.com/@dlxevl"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredId("tiktok")}
          onMouseLeave={() => setHoveredId(null)}
          className="group relative block rounded-xl border border-cyan-500/25 bg-[#051014]/40 p-4 lg:p-3.5 backdrop-blur-md transition-all duration-300 hover:border-[#25F4EE]/80 hover:bg-[#0a181c]/60 hover:-translate-y-1 shadow-[0_4px_20px_rgba(37,244,238,0.02)] hover:shadow-[0_12px_30px_rgba(37,244,238,0.15)] flex flex-col justify-between h-[230px] sm:h-[220px] lg:h-[205px] overflow-hidden"
        >
          {/* Seamless Animated Cyber Grid backdrop */}
          <div className={`absolute inset-0 cyber-grid-cyan pointer-events-none opacity-65 group-hover:opacity-95 transition-opacity duration-300 ${ecoMode ? "" : "animate-flow-grid"}`} />

          {/* Sweeping Laser Line Overlay */}
          {!ecoMode && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#25F4EE]/8 to-transparent pointer-events-none animate-laser-sweep" />
          )}

          {/* Iridescent Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-cyan-500/10 blur-xl group-hover:bg-[#25F4EE]/25 group-hover:scale-150 transition-all duration-500 pointer-events-none" />
          
          {/* Scanline overlay for aesthetic */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20 group-hover:opacity-40" />

          {/* Top Panel telemetry */}
          <div className="flex justify-between items-start">
            <span className="p-1.5 rounded-lg bg-[#25F4EE]/10 border border-[#25F4EE]/20 text-[#25F4EE] group-hover:bg-[#25F4EE] group-hover:text-black transition-all duration-300">
              {/* Custom refined modern TikTok SVG */}
              <svg width={19} height={19} viewBox="0 0 24 24" fill="none" className="fill-cyan-400 group-hover:fill-[#FE2C55] transition-colors duration-300">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.21-.42-.45-.61-.7-.04.85-.02 1.71-.03 2.56-.04 2.87-.27 5.86-1.92 8.24-1.57 2.37-4.29 3.82-7.16 3.96-2.58.17-5.26-.64-7.14-2.47C-.09 18.06-.55 14.80.49 11.97c.9-2.53 3.09-4.59 5.71-5.18.97-.24 1.98-.31 2.98-.25.02 1.45.01 2.89.02 4.34-1.02-.13-2.11-.02-3.04.45-1.09.52-1.89 1.61-2.07 2.82-.26 1.49.33 3.09 1.51 4.02 1.1.91 2.65 1.18 4.01.76 1.35-.38 2.45-1.54 2.75-2.91.17-.67.16-1.37.16-2.05V0l.02.02z" />
              </svg>
            </span>
          </div>

          {/* Channel Info */}
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-1">
              <h4 className="font-display font-bold text-[17px] sm:text-lg text-white group-hover:text-[#25F4EE] transition-colors">
                tiktok
              </h4>
              <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="font-mono text-[11px] sm:text-[12px] text-zinc-500 tracking-tight leading-relaxed">
              short files on armored vehicle failures & bad decisions.
            </p>
          </div>

          {/* Interactive Stats Simulator */}
          <div className="pt-2 border-t border-white/5 space-y-1 z-10 font-mono text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>Thoughts Transm. :</span>
              <span className="text-white font-bold tracking-tight">700k+</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
              <div className="bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] h-full w-[72%] group-hover:w-[85%] transition-all duration-1000" />
            </div>
          </div>
        </a>

        {/* 3. Instagram Panel */}
        <a
          href="https://www.instagram.com/dailyaxez"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredId("instagram")}
          onMouseLeave={() => setHoveredId(null)}
          className="group relative block rounded-xl border border-amber-500/20 bg-[#140b05]/40 p-4 lg:p-3.5 backdrop-blur-md transition-all duration-300 hover:border-amber-500/80 hover:bg-[#201107]/60 hover:-translate-y-1 shadow-[0_4px_20px_rgba(245,158,11,0.02)] hover:shadow-[0_12px_30px_rgba(245,158,11,0.15)] flex flex-col justify-between h-[230px] sm:h-[220px] lg:h-[205px] overflow-hidden"
        >
          {/* Seamless Animated Cyber Grid backdrop */}
          <div className={`absolute inset-0 cyber-grid-amber pointer-events-none opacity-65 group-hover:opacity-95 transition-opacity duration-300 ${ecoMode ? "" : "animate-flow-grid"}`} />

          {/* Sweeping Laser Line Overlay */}
          {!ecoMode && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/8 to-transparent pointer-events-none animate-laser-sweep" />
          )}

          {/* Iridescent Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/10 via-pink-500/10 to-purple-500/10 blur-xl group-hover:from-amber-500/20 group-hover:via-pink-500/20 group-hover:to-purple-500/20 group-hover:scale-150 transition-all duration-500 pointer-events-none" />
          
          {/* Scanline overlay for aesthetic */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20 group-hover:opacity-40" />

          {/* Top Panel telemetry */}
          <div className="flex justify-between items-start">
            <span className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/10 via-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-400 group-hover:from-amber-500 group-hover:via-pink-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300">
              <Instagram size={19} className="group-hover:rotate-6 transition-transform" />
            </span>
          </div>

          {/* Channel Info */}
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-1">
              <h4 className="font-display font-bold text-[17px] sm:text-lg text-white group-hover:text-pink-300 transition-colors">
                instagram
              </h4>
              <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="font-mono text-[11px] sm:text-[12px] text-zinc-500 tracking-tight leading-relaxed">
              tactical frame logs, cockpit views & battlefield snapshots.
            </p>
          </div>

          {/* Interactive Stats Simulator */}
          <div className="pt-2 border-t border-white/5 space-y-1 z-10 font-mono text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>Tactical Frames:</span>
              <span className="text-white font-bold tracking-tight">300+</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 h-full w-[65%] group-hover:w-[82%] transition-all duration-1000" />
            </div>
          </div>
        </a>

        {/* 4. Discord Panel (Now rendered below them, spanning all 3 columns with custom short horizontal styling) */}
        <a
          href="https://discord.gg/ADmqUYqWxW"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredId("discord")}
          onMouseLeave={() => setHoveredId(null)}
          className="group relative rounded-xl border border-indigo-500/20 bg-[#050614]/40 p-5 sm:p-4 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/80 hover:bg-[#070920]/60 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(99,102,241,0.02)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.15)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 w-full col-span-1 sm:col-span-3 overflow-hidden text-left"
        >
          {/* Seamless Animated Cyber Grid backdrop */}
          <div className={`absolute inset-0 cyber-grid-indigo pointer-events-none opacity-65 group-hover:opacity-95 transition-opacity duration-300 ${ecoMode ? "" : "animate-flow-grid"}`} />

          {/* Sweeping Laser Line Overlay */}
          {!ecoMode && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/8 to-transparent pointer-events-none animate-laser-sweep" />
          )}

          {/* Iridescent Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl group-hover:bg-indigo-500/25 group-hover:scale-150 transition-all duration-500 pointer-events-none" />
          
          {/* Scanline overlay for aesthetic */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20 group-hover:opacity-40" />

          {/* Left Details */}
          <div className="flex items-center gap-4 z-10 flex-1 min-w-0">
            <span className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 flex items-center justify-center shrink-0">
              {/* SVG Discord icon */}
              <svg width={19} height={19} viewBox="0 0 24 24" fill="none" className="fill-indigo-400 group-hover:fill-white transition-colors duration-300">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.46-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.075.075 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
              </svg>
            </span>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-indigo-300 transition-colors">
                  the community
                </h4>
                <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="font-mono text-[11px] sm:text-[12px] text-zinc-500 tracking-tight leading-relaxed">
                hangar group for talking about steel box shenanigans & share memes.
              </p>
            </div>
          </div>

          {/* Right Stats Info */}
          <div className="pt-2 sm:pt-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-white/5 z-10 font-mono text-[11px] text-zinc-400 flex flex-col justify-center gap-1 min-w-[140px] sm:min-w-[160px] shrink-0">
            <div className="flex justify-between">
              <span>Hangar occupants:</span>
              <span className="text-white font-bold tracking-tight">4,000+</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[60%] group-hover:w-[75%] transition-all duration-1000" />
            </div>
          </div>
        </a>

      </div>
    </div>
  );
};

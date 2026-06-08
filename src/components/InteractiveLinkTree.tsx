import React, { useState } from "react";
import { Youtube, MessageSquare, Play, Flame, Cpu, Compass, Users, Sparkles, ArrowUpRight } from "lucide-react";

export const InteractiveLinkTree: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-fuchsia-400 animate-[spin_8s_infinite_linear]" />
          <span className="font-mono text-[10px] text-zinc-400 tracking-wider">02 / CORE COMMUNICATIONS</span>
        </div>
        <span className="font-mono text-[9px] text-zinc-500 uppercase">3 frequencies active</span>
      </div>

      {/* Premium Multi-dimensional Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* 1. YouTube Panel */}
        <a
          href="https://www.youtube.com/@daliaxez"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredId("youtube")}
          onMouseLeave={() => setHoveredId(null)}
          className="group relative block rounded-2xl border border-red-500/20 bg-[#140505]/40 p-5 backdrop-blur-md transition-all duration-300 hover:border-red-500/80 hover:bg-[#200707]/60 hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(239,68,68,0.02)] hover:shadow-[0_12px_30px_rgba(239,68,68,0.15)] flex flex-col justify-between h-[230px] overflow-hidden"
        >
          {/* Iridescent Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-red-500/10 blur-xl group-hover:bg-red-500/25 group-hover:scale-150 transition-all duration-500 pointer-events-none" />
          
          {/* Scanline overlay for aesthetic */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20 group-hover:opacity-40" />

          {/* Top Panel telemetry */}
          <div className="flex justify-between items-start">
            <span className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
              <Youtube size={22} className="group-hover:rotate-6 transition-transform" />
            </span>
            <span className="font-mono text-[9px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              NEW VIDEO
            </span>
          </div>

          {/* Channel Info */}
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-1">
              <h4 className="font-display font-bold text-lg text-white group-hover:text-red-300 transition-colors">
                youtube
              </h4>
              <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="font-mono text-[10px] text-zinc-400 tracking-tight leading-snug">
              questionable armor penetration math & steel box commentary.
            </p>
          </div>

          {/* Interactive Stats Simulator */}
          <div className="pt-3 border-t border-white/5 space-y-1.5 z-10 font-mono text-[10px] text-zinc-500">
            <div className="flex justify-between">
              <span>Hangar Dwellers:</span>
              <span className="text-white font-bold tracking-tight">450K+</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-rose-500 h-full w-[85%] group-hover:w-[92%] transition-all duration-1000" />
            </div>
          </div>
        </a>

        {/* 2. TikTok Panel */}
        <a
          href="https://www.tiktok.com/@daliaxez"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredId("tiktok")}
          onMouseLeave={() => setHoveredId(null)}
          className="group relative block rounded-2xl border border-fuchsia-500/20 bg-[#120514]/40 p-5 backdrop-blur-md transition-all duration-300 hover:border-fuchsia-500/80 hover:bg-[#1a0720]/60 hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(240,79,240,0.02)] hover:shadow-[0_12px_30px_rgba(240,79,240,0.15)] flex flex-col justify-between h-[230px] overflow-hidden"
        >
          {/* Iridescent Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-fuchsia-500/10 blur-xl group-hover:bg-fuchsia-500/25 group-hover:scale-150 transition-all duration-500 pointer-events-none" />
          
          {/* Scanline overlay for aesthetic */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20 group-hover:opacity-40" />

          {/* Top Panel telemetry */}
          <div className="flex justify-between items-start">
            <span className="p-2 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 group-hover:bg-fuchsia-500 group-hover:text-white transition-all duration-300">
              {/* Custom refined modern TikTok SVG */}
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" className="fill-fuchsia-400 group-hover:fill-white transition-colors">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.21-.42-.45-.61-.7-.04.85-.02 1.71-.03 2.56-.04 2.87-.27 5.86-1.92 8.24-1.57 2.37-4.29 3.82-7.16 3.96-2.58.17-5.26-.64-7.14-2.47C-.09 18.06-.55 14.80.49 11.97c.9-2.53 3.09-4.59 5.71-5.18.97-.24 1.98-.31 2.98-.25.02 1.45.01 2.89.02 4.34-1.02-.13-2.11-.02-3.04.45-1.09.52-1.89 1.61-2.07 2.82-.26 1.49.33 3.09 1.51 4.02 1.1.91 2.65 1.18 4.01.76 1.35-.38 2.45-1.54 2.75-2.91.17-.67.16-1.37.16-2.05V0l.02.02z" />
              </svg>
            </span>
            <span className="font-mono text-[9px] text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded border border-fuchsia-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
              SIMULATED LOGS
            </span>
          </div>

          {/* Channel Info */}
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-1">
              <h4 className="font-display font-bold text-lg text-white group-hover:text-fuchsia-300 transition-colors">
                tiktok
              </h4>
              <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="font-mono text-[10px] text-zinc-400 tracking-tight leading-snug">
              short files on armored vehicle failures & bad decisions.
            </p>
          </div>

          {/* Interactive Stats Simulator */}
          <div className="pt-3 border-t border-white/5 space-y-1.5 z-10 font-mono text-[10px] text-zinc-500">
            <div className="flex justify-between">
              <span>Thoughts Transmitted:</span>
              <span className="text-white font-bold tracking-tight">12.4M</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
              <div className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 h-full w-[72%] group-hover:w-[85%] transition-all duration-1000" />
            </div>
          </div>
        </a>

        {/* 3. Discord Panel */}
        <a
          href="https://discord.gg/daliaxez"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredId("discord")}
          onMouseLeave={() => setHoveredId(null)}
          className="group relative block rounded-2xl border border-indigo-500/20 bg-[#050614]/40 p-5 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/80 hover:bg-[#070920]/60 hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(99,102,241,0.02)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.15)] flex flex-col justify-between h-[230px] overflow-hidden sm:col-span-2 lg:col-span-1"
        >
          {/* Iridescent Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl group-hover:bg-indigo-500/25 group-hover:scale-150 transition-all duration-500 pointer-events-none" />
          
          {/* Scanline overlay for aesthetic */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20 group-hover:opacity-40" />

          {/* Top Panel telemetry */}
          <div className="flex justify-between items-start">
            <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 flex items-center justify-center">
              {/* SVG Discord icon */}
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" className="fill-indigo-400 group-hover:fill-white transition-colors duration-300">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.46-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.075.075 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
              </svg>
            </span>
            <span className="font-mono text-[9px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>

          {/* Channel Info */}
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-1">
              <h4 className="font-display font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                community
              </h4>
              <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="font-mono text-[10px] text-zinc-400 tracking-tight leading-snug">
              hangar group for talking about steel box shenanigans & share memes.
            </p>
          </div>

          {/* Interactive Stats Simulator */}
          <div className="pt-3 border-t border-white/5 space-y-1.5 z-10 font-mono text-[10px] text-zinc-500">
            <div className="flex justify-between">
              <span>Hangar Occupants:</span>
              <span className="text-white font-bold tracking-tight">42,000+</span>
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

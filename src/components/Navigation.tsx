import React, { useState } from "react";
import { SPOILER_A_Logo } from "./SPOILER_A_Logo";
import { Mail, Sparkles, Send, CheckCircle, ShieldAlert, Zap } from "lucide-react";

interface NavigationProps {
  ecoMode: boolean;
  onEcoModeToggle: (enabled: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  ecoMode,
  onEcoModeToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", proposal: "" });

  const handleCollab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setForm({ name: "", email: "", proposal: "" });
    }, 2500);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-40 bg-zinc-950/20 backdrop-blur-md border-b border-white/5 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          
          {/* Left: Creator's Logo */}
          <div className="flex items-center gap-3 select-none">
            <SPOILER_A_Logo size={32} />
            <span className="font-display font-bold text-sm text-white tracking-widest uppercase">
              daliaxez
            </span>
          </div>

          {/* Center: Non-interactable directory label (realigned & perfectly centered) */}
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 transform font-mono text-xs text-zinc-500 font-medium tracking-widest select-none pointer-events-none">
            // directory
          </div>

          {/* Right: Pill CTA and Eco Mode Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onEcoModeToggle(!ecoMode)}
              title="Toggle low-latency Eco Mode (disables heavy animations)"
              className={`hidden lg:flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 border transition-all duration-300 font-mono text-[9px] sm:text-[10px] font-bold tracking-wider cursor-pointer uppercase select-none ${
                ecoMode
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400 font-bold shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                  : "bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Zap className={`h-3 w-3 ${ecoMode ? "fill-emerald-400 text-emerald-400 animate-pulse" : "text-zinc-400"}`} />
              <span className="hidden xs:inline">ECO {ecoMode ? "ON" : "OFF"}</span>
              <span className="xs:hidden">ECO</span>
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="relative group flex items-center gap-1.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-sans font-bold text-[11px] sm:text-xs rounded-full px-5 py-2.5 shadow-lg shadow-fuchsia-500/10 hover:shadow-fuchsia-500/25 transition-all duration-300 active:scale-95 cursor-pointer uppercase tracking-wider overflow-hidden"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Collab</span>
              <span className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>

        </div>
      </nav>

      {/* Collaboration Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 overflow-hidden shadow-2xl">
            {/* Hologram scanlines in dialog */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-20" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-fuchsia-400" />
                <h3 className="font-display font-bold text-white text-md uppercase tracking-wider">
                  collaboration frequency
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white font-mono text-xs hover:bg-white/5 px-2.5 py-1 rounded-md"
              >
                ESC
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-display font-medium text-white text-lg">Transmission broadcasted</h4>
                <p className="font-mono text-zinc-400 text-xs">
                  We have queued your stalinium dossier. Wait in hangar.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCollab} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-zinc-400 block uppercase">Brand Name / Agency</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Snail Entertainment"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-fuchsia-500 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-zinc-400 block uppercase">Signal Frequency (Email)</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. snail@warthunder.com"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-fuchsia-500 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-zinc-400 block uppercase">Proposal context (all lowercase preferred)</label>
                  <textarea
                    rows={3}
                    value={form.proposal}
                    onChange={(e) => setForm({ ...form, proposal: e.target.value })}
                    placeholder="e.g. we want to promote our new tank steering wheel with premium deadpan hashtags"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-fuchsia-500 font-sans resize-none"
                  />
                </div>

                <div className="p-3 bg-fuchsia-950/10 border border-fuchsia-500/20 rounded-xl flex gap-2 text-[10px] text-fuchsia-300 font-mono leading-relaxed">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-fuchsia-400" />
                  <span>
                    Warning: if submit text is too formal, tonk creator might return to garage immediately. keep it lowkey.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl py-3 text-sm flex items-center justify-center gap-2 shadow-lg transition-colors duration-200 active:scale-95 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Transmit Proposal Signal
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

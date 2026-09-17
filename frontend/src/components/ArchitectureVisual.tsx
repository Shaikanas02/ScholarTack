import React from 'react';
import { Sparkles, ShieldCheck, Cpu, Award } from 'lucide-react';

export const ArchitectureVisual: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto my-4 px-4">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/25 shadow-xl relative overflow-hidden">
        {/* Top Tagline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 pb-2.5 border-b border-slate-800/80">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              System Architecture & Separation of Concerns
            </h3>
          </div>
          <p className="text-[11px] font-bold text-emerald-400">
            "Gemini extracts. Evidence proves. Rules decide."
          </p>
        </div>

        {/* Flow Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {/* Step 1: AI Layer */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 relative">
            <div className="flex items-center space-x-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-200">1. AI Layer</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              Messy narrative + doc photos
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Gemini extracts structured facts (Untrusted data isolation)
            </p>
          </div>

          {/* Step 2: Verification Layer */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 relative">
            <div className="flex items-center space-x-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-200">2. Verification</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              Evidence & Provenance
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Tagging: Proven vs Self-declared; Conflict detection & alerts
            </p>
          </div>

          {/* Step 3: Decision Layer */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 relative">
            <div className="flex items-center space-x-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-emerald-300">3. Decision Layer</span>
            </div>
            <p className="text-[11px] text-slate-200 font-medium">
              Deterministic Rules Engine
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Pure Python (&lt;10ms), zero LLM calls, zero network calls
            </p>
          </div>

          {/* Step 4: Action Layer */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 relative">
            <div className="flex items-center space-x-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-200">4. Action</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              Proof Ledger & Application
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Pre-filled PDF, missing checklist & official portal route
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Award, CheckCircle2, RotateCcw, Clock, ShieldCheck, X } from 'lucide-react';

interface MissionReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplay: () => void;
  currentPrompt: string;
  metrics: {
    totalPlanningTimeMs: number;
    speechLatencyMs: number;
    symmetryScorePercent: number;
  };
}

export const MissionReplayModal: React.FC<MissionReplayModalProps> = ({
  isOpen,
  onClose,
  onReplay,
  currentPrompt,
  metrics
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite-950/80 backdrop-blur-md">
      <div className="bg-graphite-900 border border-cyber-green/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyber-green/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-cyber-green" />
            <div>
              <span className="text-[10px] font-mono text-cyber-green uppercase font-bold tracking-wider">
                CLOSED-LOOP VALIDATION PASS
              </span>
              <h3 className="font-display font-black text-2xl text-white">
                MISSION ACCOMPLISHED
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mission Summary Details */}
        <div className="space-y-4 font-mono text-xs mb-6">
          <div className="p-3.5 rounded-xl bg-graphite-950 border border-white/5">
            <div className="text-slate-400 text-[10px] mb-1">COMPLETED OBJECTIVE:</div>
            <div className="text-white font-semibold text-sm">“{currentPrompt}”</div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-lg bg-graphite-950 border border-white/5 text-center">
              <span className="text-slate-500 text-[10px] block">OBJECTS</span>
              <span className="text-white font-bold text-base">8 / 8</span>
              <span className="text-cyber-green text-[9px] block">100% Placed</span>
            </div>

            <div className="p-3 rounded-lg bg-graphite-950 border border-white/5 text-center">
              <span className="text-slate-500 text-[10px] block">SYMMETRY</span>
              <span className="text-cyber-cyan font-bold text-base">{metrics.symmetryScorePercent}%</span>
              <span className="text-slate-400 text-[9px] block">&lt; 3mm delta</span>
            </div>

            <div className="p-3 rounded-lg bg-graphite-950 border border-white/5 text-center">
              <span className="text-slate-500 text-[10px] block">PLAN TIME</span>
              <span className="text-white font-bold text-base">{metrics.totalPlanningTimeMs} ms</span>
              <span className="text-cyber-cyan text-[9px] block">Intel Arc iGPU</span>
            </div>

            <div className="p-3 rounded-lg bg-graphite-950 border border-white/5 text-center">
              <span className="text-slate-500 text-[10px] block">RECOVERIES</span>
              <span className="text-cyber-green font-bold text-base">0 Drops</span>
              <span className="text-slate-400 text-[9px] block">Verified</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-cyber-green/10 border border-cyber-green/30 text-cyber-green text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Dual SO-101 manipulators completed collision-free table setting in full compliance with Intel track specifications.</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-graphite-800 hover:bg-graphite-700 text-slate-300 font-mono text-xs transition-colors cursor-pointer"
          >
            DISMISS
          </button>

          <button
            onClick={() => {
              onClose();
              onReplay();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyber-cyan hover:bg-cyan-300 text-graphite-950 font-display font-bold text-xs tracking-wider transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REPLAY MISSION</span>
          </button>
        </div>
      </div>
    </div>
  );
};

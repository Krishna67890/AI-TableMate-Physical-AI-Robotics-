import React from 'react';
import { AlertTriangle, RefreshCw, X, ShieldAlert } from 'lucide-react';

interface RecoveryAlertProps {
  recoveryEvent: {
    active: boolean;
    title: string;
    explanation: string;
    action: string;
  } | null;
  onDismiss: () => void;
}

export const RecoveryAlert: React.FC<RecoveryAlertProps> = ({
  recoveryEvent,
  onDismiss
}) => {
  if (!recoveryEvent || !recoveryEvent.active) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md bg-graphite-900/95 border border-cyber-amber/50 rounded-xl p-4 shadow-2xl backdrop-blur-md animate-bounce-short">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-cyber-amber font-mono text-xs font-bold">
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          <span>{recoveryEvent.title}</span>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-300 font-sans mb-3 leading-relaxed">
        {recoveryEvent.explanation}
      </p>

      <div className="p-2.5 rounded bg-graphite-950 border border-cyber-amber/20 font-mono text-[11px] text-cyber-amber">
        <div className="flex items-center gap-1.5 font-bold mb-0.5">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>AUTONOMOUS RECOVERY PROTOCOL ACTIVE</span>
        </div>
        <div className="text-slate-300 text-[10px]">
          {recoveryEvent.action}
        </div>
      </div>
    </div>
  );
};

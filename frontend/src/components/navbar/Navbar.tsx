import React from 'react';
import { ShieldCheck, Cpu, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { ConnectionStatus } from '../../hooks/useRobotSimulation';

interface NavbarProps {
  connectionStatus: ConnectionStatus;
  backendEngine: string;
  onOpenJudgeMode: () => void;
  onLaunchDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  connectionStatus,
  backendEngine,
  onOpenJudgeMode,
  onLaunchDemo
}) => {
  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'CONNECTED':
        return (
          <div className="flex items-center gap-1.5 text-cyber-green">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            <span className="text-[11px] font-bold">CONNECTED // 60Hz</span>
          </div>
        );
      case 'CONNECTING':
        return (
          <div className="flex items-center gap-1.5 text-cyber-amber">
            <span className="w-2 h-2 rounded-full bg-cyber-amber animate-ping" />
            <span className="text-[11px]">CONNECTING...</span>
          </div>
        );
      case 'RECONNECTING':
        return (
          <div className="flex items-center gap-1.5 text-cyber-amber">
            <span className="w-2 h-2 rounded-full bg-cyber-amber animate-pulse" />
            <span className="text-[11px]">RECONNECTING</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-cyber-cyan">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan" />
            <span className="text-[11px]">OFFLINE / DEMO SIMULATION</span>
          </div>
        );
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-graphite-950/85 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Custom Logo / Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-graphite-800 to-graphite-900 border border-cyber-cyan/40 flex items-center justify-center glow-cyan shadow-sm">
            <svg viewBox="0 0 32 32" className="w-5 h-5 text-cyber-cyan">
              <path
                d="M4 22L12 14L16 18L24 10"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="24" cy="10" r="3" fill="#00FF88" />
              <path
                d="M28 22L20 14L16 18L8 10"
                stroke="#FFB800"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg tracking-wider text-white">
                AI TABLEMATE
              </span>
              <span className="telemetry-badge text-cyber-cyan border-cyber-cyan/30">
                INTEL VLA TRACK
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
              PHYSICAL AI ROBOTICS // MUJOCO // OPENVINO
            </p>
          </div>
        </div>

        {/* Live Hardware & WebSocket Status Indicators */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          {getStatusBadge()}

          <div className="h-3 w-px bg-white/10" />

          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="text-[11px]">OPENVINO: NPU READY</span>
          </div>
        </div>

        {/* Action Controls: Judge Mode & Quick Demo */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onLaunchDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan font-mono text-xs font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AUTO DEMO</span>
          </button>

          <button
            onClick={onOpenJudgeMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-graphite-800 hover:bg-graphite-700 border border-white/20 text-white font-mono text-xs font-medium transition-all hover:border-cyber-cyan/50 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyber-green" />
            <span>JUDGE INSPECTOR</span>
          </button>
        </div>

      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Sparkles, Terminal, ArrowUpRight, Play, CheckCircle2 } from 'lucide-react';
import { ExecutionStage } from '../../types/simulation';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';

interface CommandCenterProps {
  stage: ExecutionStage;
  currentPrompt: string;
  onExecutePrompt: (prompt: string) => void;
  onScrollToSimulation?: () => void;
  metrics: {
    speechLatencyMs: number;
    totalPlanningTimeMs: number;
    edgeInferenceLatencyMs: number;
  };
}

const EXAMPLE_COMMANDS = [
  "Set the table for two people with plates, cups, and cutlery.",
  "Move the cup next to the plate without colliding.",
  "Place the spoon on the right side of the plate.",
  "Occluded object recovery: find hidden mug and re-plan.",
  "Clear the table and stack plates in the center."
];

export const CommandCenter: React.FC<CommandCenterProps> = ({
  stage,
  currentPrompt,
  onExecutePrompt,
  onScrollToSimulation,
  metrics
}) => {
  const [inputValue, setInputValue] = useState(currentPrompt);

  useEffect(() => {
    setInputValue(currentPrompt);
  }, [currentPrompt]);

  const { isListening, audioLevel, startListening, stopListening } = useVoiceRecognition({
    onTranscriptReceived: (text) => {
      setInputValue(text);
      onExecutePrompt(text);
      onScrollToSimulation?.();
    }
  });

  const isExecuting = stage !== 'IDLE' && stage !== 'MISSION_COMPLETE';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onExecutePrompt(inputValue.trim());
      onScrollToSimulation?.();
    }
  };

  const getStageLabel = (currentStage: ExecutionStage) => {
    switch (currentStage) {
      case 'COMMAND_RECEIVED': return 'COMMAND RECEIVED // DECODING';
      case 'VISION_SCANNING': return 'SCENE ANALYSIS // OPENVINO SCANNING';
      case 'TASK_PLANNING': return 'TASK PLANNING // VLA DECOMPOSITION';
      case 'ARM_COORDINATION': return 'BIMANUAL COORDINATION // IK SOLVER';
      case 'MUJOCO_EXECUTION': return 'EXECUTION // MUJOCO PHYSICS ACTIVE';
      case 'VERIFICATION': return 'VERIFICATION // OPTICAL SANITY CHECK';
      case 'MISSION_COMPLETE': return 'MISSION COMPLETE // DINING READY';
      default: return 'SYSTEM STANDBY // READY FOR COMMAND';
    }
  };

  return (
    <div className="bg-graphite-900 border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative Technical Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyber-cyan">
          <Terminal className="w-4 h-4" />
          <span className="font-bold uppercase tracking-wider">NATURAL LANGUAGE & VOICE COMMAND CENTER</span>
        </div>

        {/* Latency Chips */}
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span>Speech Latency: <strong className="text-white">{metrics.speechLatencyMs}ms</strong></span>
          <span>VLA Plan: <strong className="text-white">{metrics.totalPlanningTimeMs}ms</strong></span>
          <span>OpenVINO Edge: <strong className="text-white">{metrics.edgeInferenceLatencyMs}ms</strong></span>
        </div>
      </div>

      {/* Real-Time Processing Stage Pill with Watch 3D CTA */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-graphite-950 border border-white/5 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${isExecuting ? 'bg-cyber-cyan animate-ping' : 'bg-cyber-green'}`} />
          <span className="text-slate-200 font-medium">{getStageLabel(stage)}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500 uppercase">
            STAGE: <strong className="text-slate-300">{stage}</strong>
          </span>

          {onScrollToSimulation && (
            <button
              type="button"
              onClick={onScrollToSimulation}
              className="flex items-center gap-1 text-[11px] text-cyber-cyan hover:underline cursor-pointer"
            >
              <span>WATCH IN 3D</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Command Input Form with Mic & Execute Button */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type any instruction: e.g. 'Set the table for two' or 'Move the cup next to the plate'..."
            className="w-full bg-graphite-950 border border-white/15 focus:border-cyber-cyan rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 font-sans focus:outline-none transition-colors shadow-inner"
          />

          {/* Audio Visualizer Waveform Bar if listening */}
          {isListening && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="text-[11px] font-mono text-cyber-green mr-1 font-bold">LISTENING...</span>
              <div
                className="w-1.5 bg-cyber-green rounded-full transition-all duration-75"
                style={{ height: `${Math.max(6, audioLevel * 32)}px` }}
              />
              <div
                className="w-1.5 bg-cyber-green rounded-full transition-all duration-75"
                style={{ height: `${Math.max(10, audioLevel * 48)}px` }}
              />
              <div
                className="w-1.5 bg-cyber-green rounded-full transition-all duration-75"
                style={{ height: `${Math.max(6, audioLevel * 24)}px` }}
              />
            </div>
          )}
        </div>

        {/* Microphone Toggle Button */}
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`p-3.5 rounded-xl border font-mono transition-all flex items-center justify-center cursor-pointer ${
            isListening
              ? 'bg-cyber-red/20 border-cyber-red text-cyber-red animate-pulse'
              : 'bg-graphite-800 border-white/10 hover:border-cyber-cyan text-slate-300 hover:text-cyber-cyan'
          }`}
          title={isListening ? 'Stop Listening' : 'Speak with Voice AI'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Send / Execute Button */}
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="px-6 py-3.5 rounded-xl bg-cyber-cyan hover:bg-cyan-300 text-graphite-950 font-display font-bold text-sm tracking-wider flex items-center gap-2 transition-all shadow-lg hover:shadow-cyber-cyan/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isExecuting ? (
            <>
              <span className="w-3 h-3 rounded-full bg-graphite-950 animate-ping" />
              <span>EXECUTING...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>EXECUTE</span>
            </>
          )}
        </button>
      </form>

      {/* Suggested Fast Prompt Buttons */}
      <div>
        <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyber-amber" />
          <span>BENCHMARK TASKS // ONE-CLICK EXECUTE:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_COMMANDS.map((cmd, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputValue(cmd);
                onExecutePrompt(cmd);
                onScrollToSimulation?.();
              }}
              className="text-left px-3 py-1.5 rounded-lg bg-graphite-950/90 hover:bg-graphite-800 border border-white/10 hover:border-cyber-cyan/40 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              “{cmd}”
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

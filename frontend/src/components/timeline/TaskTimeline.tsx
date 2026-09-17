import React from 'react';
import { CheckCircle2, Clock, PlayCircle, AlertCircle } from 'lucide-react';
import { ExecutionStage } from '../../types/simulation';
import { TaskSubgoal } from '../../types/ai';

interface TaskTimelineProps {
  stage: ExecutionStage;
  subgoals: TaskSubgoal[];
  currentStepIndex: number;
}

const STAGES_PIPELINE = [
  { id: 'COMMAND_RECEIVED', label: '01. COMMAND', desc: 'Natural Language / Voice Decoded' },
  { id: 'VISION_SCANNING', label: '02. PERCEPTION', desc: 'OpenVINO Object Pose & Bounding Boxes' },
  { id: 'TASK_PLANNING', label: '03. VLA PLAN', desc: 'Task Decomposition into Subgoals' },
  { id: 'ARM_COORDINATION', label: '04. COORDINATION', desc: 'Left/Right Arm Workspace Allocation' },
  { id: 'MUJOCO_EXECUTION', label: '05. MUJOCO SIM', desc: 'Physics Solver & Collision Dynamics' },
  { id: 'VERIFICATION', label: '06. VERIFY', desc: 'Optical Sanity Check & Symmetry Score' }
];

export const TaskTimeline: React.FC<TaskTimelineProps> = ({
  stage,
  subgoals,
  currentStepIndex
}) => {
  const getStageStatus = (stageId: string) => {
    const stageOrder = ['IDLE', 'COMMAND_RECEIVED', 'VISION_SCANNING', 'TASK_PLANNING', 'ARM_COORDINATION', 'MUJOCO_EXECUTION', 'VERIFICATION', 'MISSION_COMPLETE'];
    const currentIdx = stageOrder.indexOf(stage);
    const targetIdx = stageOrder.indexOf(stageId);

    if (currentIdx > targetIdx || stage === 'MISSION_COMPLETE') return 'completed';
    if (currentIdx === targetIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="bg-graphite-900 border border-white/10 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
        <h3 className="font-display font-bold text-sm tracking-wider text-white">
          AI EXECUTION TIMELINE // SEE → UNDERSTAND → PLAN → ACT → VERIFY
        </h3>
        <span className="telemetry-badge text-cyber-cyan border-cyber-cyan/30">
          STAGE: {stage}
        </span>
      </div>

      {/* Horizontal Milestone Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {STAGES_PIPELINE.map((p) => {
          const status = getStageStatus(p.id);

          return (
            <div
              key={p.id}
              className={`p-2.5 rounded-lg border text-xs font-mono transition-all ${
                status === 'active'
                  ? 'bg-cyber-cyan/15 border-cyber-cyan text-white shadow-md'
                  : status === 'completed'
                  ? 'bg-graphite-950 border-cyber-green/40 text-cyber-green'
                  : 'bg-graphite-950/60 border-white/5 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 font-bold">
                {status === 'completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyber-green" />
                ) : status === 'active' ? (
                  <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                )}
                <span>{p.label}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Subgoals List */}
      {subgoals.length > 0 && (
        <div className="space-y-2 border-t border-white/5 pt-4">
          <h4 className="text-xs font-mono font-semibold text-slate-300 mb-2">
            VLA SUBGOAL EXECUTION TREE:
          </h4>
          <div className="space-y-1.5">
            {subgoals.map((sub, idx) => {
              const isSubActive = idx === currentStepIndex && stage === 'MUJOCO_EXECUTION';
              const isSubDone = idx < currentStepIndex || stage === 'VERIFICATION' || stage === 'MISSION_COMPLETE';

              return (
                <div
                  key={sub.step}
                  className={`px-3 py-2 rounded-md border text-xs font-mono flex items-center justify-between transition-all ${
                    isSubActive
                      ? 'bg-cyber-cyan/10 border-cyber-cyan/60 text-white'
                      : isSubDone
                      ? 'bg-graphite-950/80 border-white/5 text-slate-400'
                      : 'bg-graphite-950/40 border-transparent text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                      isSubDone ? 'bg-cyber-green/20 text-cyber-green' : isSubActive ? 'bg-cyber-cyan text-graphite-950' : 'bg-graphite-800 text-slate-500'
                    }`}>
                      {sub.step}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-200 mr-2">{sub.title}:</span>
                      <span className="text-slate-400 text-[11px]">{sub.description}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="telemetry-badge text-slate-300">
                      {sub.assignedArm.toUpperCase()}
                    </span>
                    <span className={isSubDone ? 'text-cyber-green' : isSubActive ? 'text-cyber-cyan' : 'text-slate-600'}>
                      {isSubDone ? 'COMPLETE' : isSubActive ? 'EXECUTING' : 'QUEUED'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

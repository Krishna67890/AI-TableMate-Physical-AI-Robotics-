import React from 'react';
import { Bot, Gauge, Thermometer, Radio } from 'lucide-react';
import { JointAngles } from '../../types/robotics';

interface ArmTelemetryProps {
  leftJoints: JointAngles;
  rightJoints: JointAngles;
  leftAction: string;
  rightAction: string;
  leftProgress: number;
  rightProgress: number;
  isLeftGripping: boolean;
  isRightGripping: boolean;
}

export const ArmTelemetry: React.FC<ArmTelemetryProps> = ({
  leftJoints,
  rightJoints,
  leftAction,
  rightAction,
  leftProgress,
  rightProgress,
  isLeftGripping,
  isRightGripping
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* LEFT SO-101 ARM CARD */}
      <div className="bg-graphite-900 border border-cyber-cyan/30 rounded-xl p-4 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyber-cyan" />
            <span className="font-display font-bold text-sm tracking-wider text-white">
              SO-101 ARM (LEFT)
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyber-green">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            <span>ONLINE // 6-DOF</span>
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {/* Action & Progress */}
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span className="text-[11px] text-slate-400">CURRENT ACTION</span>
              <span className="font-bold text-cyber-cyan">{leftAction}</span>
            </div>
            <div className="w-full h-1.5 bg-graphite-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyber-cyan transition-all duration-300"
                style={{ width: `${leftProgress}%` }}
              />
            </div>
          </div>

          {/* Joint Telemetry Angles */}
          <div className="bg-graphite-950 p-2.5 rounded border border-white/5">
            <div className="text-[10px] text-slate-500 mb-1.5 flex justify-between">
              <span>JOINT ANGLES (RAD)</span>
              <span className={isLeftGripping ? 'text-cyber-green' : 'text-slate-400'}>
                GRIPPER: {isLeftGripping ? 'CLOSED (GRASPED)' : 'OPEN'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-300">
              <div>q1 (Yaw): <span className="text-white">{leftJoints.q1.toFixed(2)}</span></div>
              <div>q2 (Pitch): <span className="text-white">{leftJoints.q2.toFixed(2)}</span></div>
              <div>q3 (Elbow): <span className="text-white">{leftJoints.q3.toFixed(2)}</span></div>
              <div>q4 (Wrist): <span className="text-white">{leftJoints.q4.toFixed(2)}</span></div>
              <div>q5 (Roll): <span className="text-white">{leftJoints.q5.toFixed(2)}</span></div>
              <div>Grip (m): <span className="text-white">{leftJoints.gripper.toFixed(3)}</span></div>
            </div>
          </div>

          {/* Thermal & Motor Power */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-cyber-amber" />
              Temp: <strong className="text-slate-200">34.8°C</strong>
            </span>
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-cyber-cyan" />
              Bus: <strong className="text-slate-200">CAN 1.0 Mbps</strong>
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SO-101 ARM CARD */}
      <div className="bg-graphite-900 border border-cyber-amber/30 rounded-xl p-4 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyber-amber" />
            <span className="font-display font-bold text-sm tracking-wider text-white">
              SO-101 ARM (RIGHT)
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyber-green">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            <span>ONLINE // 6-DOF</span>
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {/* Action & Progress */}
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span className="text-[11px] text-slate-400">CURRENT ACTION</span>
              <span className="font-bold text-cyber-amber">{rightAction}</span>
            </div>
            <div className="w-full h-1.5 bg-graphite-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyber-amber transition-all duration-300"
                style={{ width: `${rightProgress}%` }}
              />
            </div>
          </div>

          {/* Joint Telemetry Angles */}
          <div className="bg-graphite-950 p-2.5 rounded border border-white/5">
            <div className="text-[10px] text-slate-500 mb-1.5 flex justify-between">
              <span>JOINT ANGLES (RAD)</span>
              <span className={isRightGripping ? 'text-cyber-green' : 'text-slate-400'}>
                GRIPPER: {isRightGripping ? 'CLOSED (GRASPED)' : 'OPEN'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-300">
              <div>q1 (Yaw): <span className="text-white">{rightJoints.q1.toFixed(2)}</span></div>
              <div>q2 (Pitch): <span className="text-white">{rightJoints.q2.toFixed(2)}</span></div>
              <div>q3 (Elbow): <span className="text-white">{rightJoints.q3.toFixed(2)}</span></div>
              <div>q4 (Wrist): <span className="text-white">{rightJoints.q4.toFixed(2)}</span></div>
              <div>q5 (Roll): <span className="text-white">{rightJoints.q5.toFixed(2)}</span></div>
              <div>Grip (m): <span className="text-white">{rightJoints.gripper.toFixed(3)}</span></div>
            </div>
          </div>

          {/* Thermal & Motor Power */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-cyber-amber" />
              Temp: <strong className="text-slate-200">35.2°C</strong>
            </span>
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-cyber-cyan" />
              Bus: <strong className="text-slate-200">CAN 1.0 Mbps</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

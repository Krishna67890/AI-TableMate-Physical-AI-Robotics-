import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Camera, CheckCircle2, Sliders, Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import { RobotWorld } from '../../three/RobotWorld';
import { CameraPreset, JointAngles } from '../../types/robotics';
import { TableObjectState, ExecutionStage, SimulationMetrics } from '../../types/simulation';

interface SimulationViewportProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  speedMultiplier: number;
  onChangeSpeed: (speed: number) => void;
  onReset: () => void;
  cameraPreset: CameraPreset;
  onChangeCameraPreset: (preset: CameraPreset) => void;
  showBoundingBoxes: boolean;
  onToggleBoundingBoxes: () => void;
  controlMode: 'AI_AUTONOMOUS' | 'MANUAL_JOG';
  onToggleControlMode: (mode: 'AI_AUTONOMOUS' | 'MANUAL_JOG') => void;
  leftJoints: JointAngles;
  setLeftJoints: React.Dispatch<React.SetStateAction<JointAngles>>;
  rightJoints: JointAngles;
  setRightJoints: React.Dispatch<React.SetStateAction<JointAngles>>;
  leftAction: string;
  rightAction: string;
  isLeftGripping: boolean;
  isRightGripping: boolean;
  objects: TableObjectState[];
  selectedObjectId: string | null;
  onSelectObject: (id: string) => void;
  stage: ExecutionStage;
  metrics: SimulationMetrics;
  isBackendConnected: boolean;
  backendEngineName: string;
}

const CAMERA_PRESETS: { id: CameraPreset; label: string }[] = [
  { id: 'OVERVIEW', label: 'OVERVIEW' },
  { id: 'LEFT_ARM', label: 'LEFT ARM' },
  { id: 'RIGHT_ARM', label: 'RIGHT ARM' },
  { id: 'OBJECT_INSPECTION', label: 'INSPECT' },
  { id: 'TOP_DOWN', label: 'TOP DOWN' },
  { id: 'AI_VISION', label: 'AI VISION' }
];

const SPEED_OPTIONS = [0.25, 0.5, 1.0, 2.0];

export const SimulationViewport: React.FC<SimulationViewportProps> = ({
  isPlaying,
  onTogglePlay,
  speedMultiplier,
  onChangeSpeed,
  onReset,
  cameraPreset,
  onChangeCameraPreset,
  showBoundingBoxes,
  onToggleBoundingBoxes,
  controlMode,
  onToggleControlMode,
  leftJoints,
  setLeftJoints,
  rightJoints,
  setRightJoints,
  leftAction,
  rightAction,
  isLeftGripping,
  isRightGripping,
  objects,
  selectedObjectId,
  onSelectObject,
  stage,
  metrics,
  isBackendConnected,
  backendEngineName
}) => {
  const [isJogPanelOpen, setIsJogPanelOpen] = useState(false);
  const [activeJogArm, setActiveJogArm] = useState<'left' | 'right'>('left');

  const currentArmJoints = activeJogArm === 'left' ? leftJoints : rightJoints;
  const setArmJoints = activeJogArm === 'left' ? setLeftJoints : setRightJoints;

  const handleJointChange = (jointName: keyof JointAngles, value: number) => {
    onToggleControlMode('MANUAL_JOG');
    setArmJoints((prev) => ({ ...prev, [jointName]: value }));
  };

  return (
    <div className="relative w-full h-[620px] lg:h-[680px] rounded-2xl border border-white/10 overflow-hidden bg-graphite-950 shadow-2xl flex flex-col">
      
      {/* Top Floating Control Bar: Camera Presets & Engine Mode Badge */}
      <div className="absolute top-3 right-3 left-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Engine Mode Badge */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-graphite-900/90 border border-white/10 backdrop-blur-md text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-cyber-green animate-pulse' : 'bg-cyber-cyan'}`} />
          <span className="text-white font-semibold">
            {isBackendConnected ? 'MUJOCO NATIVE ENGINE' : 'KINEMATICS SIMULATION MODE'}
          </span>
          <span className="text-slate-400 text-[10px]">60Hz</span>
        </div>

        {/* Camera Switcher Pills & Jog Panel Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setIsJogPanelOpen(!isJogPanelOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border backdrop-blur-md transition-colors cursor-pointer ${
              controlMode === 'MANUAL_JOG' || isJogPanelOpen
                ? 'bg-cyber-amber/20 border-cyber-amber text-cyber-amber font-bold'
                : 'bg-graphite-900/90 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>MANUAL JOG</span>
            {isJogPanelOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-graphite-900/90 border border-white/10 backdrop-blur-md">
            <Camera className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1" />
            {CAMERA_PRESETS.map((cam) => (
              <button
                key={cam.id}
                onClick={() => onChangeCameraPreset(cam.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  cameraPreset === cam.id
                    ? 'bg-cyber-cyan text-graphite-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cam.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Jogging Overlay Panel */}
      {isJogPanelOpen && (
        <div className="absolute top-16 right-3 z-30 w-80 p-4 rounded-xl bg-graphite-900/95 border border-cyber-amber/40 shadow-2xl backdrop-blur-md font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <span className="font-bold text-cyber-amber flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              6-DOF MANUAL JOG
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setActiveJogArm('left')}
                className={`px-2 py-0.5 rounded text-[10px] ${activeJogArm === 'left' ? 'bg-cyber-cyan text-graphite-950 font-bold' : 'bg-graphite-800 text-slate-400'}`}
              >
                LEFT ARM
              </button>
              <button
                onClick={() => setActiveJogArm('right')}
                className={`px-2 py-0.5 rounded text-[10px] ${activeJogArm === 'right' ? 'bg-cyber-amber text-graphite-950 font-bold' : 'bg-graphite-800 text-slate-400'}`}
              >
                RIGHT ARM
              </button>
            </div>
          </div>

          {/* Joint Sliders */}
          <div className="space-y-2.5 text-[11px]">
            <div>
              <div className="flex justify-between text-slate-300">
                <span>q1 (Base Yaw):</span>
                <span className="text-white">{currentArmJoints.q1.toFixed(2)} rad</span>
              </div>
              <input
                type="range"
                min="-2.8"
                max="2.8"
                step="0.05"
                value={currentArmJoints.q1}
                onChange={(e) => handleJointChange('q1', parseFloat(e.target.value))}
                className="w-full accent-cyber-cyan"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>q2 (Shoulder Pitch):</span>
                <span className="text-white">{currentArmJoints.q2.toFixed(2)} rad</span>
              </div>
              <input
                type="range"
                min="-1.8"
                max="1.8"
                step="0.05"
                value={currentArmJoints.q2}
                onChange={(e) => handleJointChange('q2', parseFloat(e.target.value))}
                className="w-full accent-cyber-cyan"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>q3 (Elbow Pitch):</span>
                <span className="text-white">{currentArmJoints.q3.toFixed(2)} rad</span>
              </div>
              <input
                type="range"
                min="-2.2"
                max="2.2"
                step="0.05"
                value={currentArmJoints.q3}
                onChange={(e) => handleJointChange('q3', parseFloat(e.target.value))}
                className="w-full accent-cyber-cyan"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>q4 (Wrist Pitch):</span>
                <span className="text-white">{currentArmJoints.q4.toFixed(2)} rad</span>
              </div>
              <input
                type="range"
                min="-2.0"
                max="2.0"
                step="0.05"
                value={currentArmJoints.q4}
                onChange={(e) => handleJointChange('q4', parseFloat(e.target.value))}
                className="w-full accent-cyber-cyan"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>q5 (Wrist Roll):</span>
                <span className="text-white">{currentArmJoints.q5.toFixed(2)} rad</span>
              </div>
              <input
                type="range"
                min="-3.14"
                max="3.14"
                step="0.05"
                value={currentArmJoints.q5}
                onChange={(e) => handleJointChange('q5', parseFloat(e.target.value))}
                className="w-full accent-cyber-cyan"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>Gripper Aperture:</span>
                <span className="text-white">{currentArmJoints.gripper.toFixed(3)} m</span>
              </div>
              <input
                type="range"
                min="0.005"
                max="0.025"
                step="0.001"
                value={currentArmJoints.gripper}
                onChange={(e) => handleJointChange('gripper', parseFloat(e.target.value))}
                className="w-full accent-cyber-green"
              />
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center">
            <button
              onClick={() => onToggleControlMode('AI_AUTONOMOUS')}
              className="text-[10px] text-cyber-cyan hover:underline cursor-pointer"
            >
              Resume AI Autonomous
            </button>
            <button
              onClick={onReset}
              className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
            >
              Reset Pose
            </button>
          </div>
        </div>
      )}

      {/* 3D Viewport Core */}
      <div className="flex-1 w-full h-full relative">
        <RobotWorld
          leftJoints={leftJoints}
          rightJoints={rightJoints}
          leftAction={leftAction}
          rightAction={rightAction}
          isLeftGripping={isLeftGripping}
          isRightGripping={isRightGripping}
          objects={objects}
          selectedObjectId={selectedObjectId}
          cameraPreset={cameraPreset}
          isScanning={stage === 'VISION_SCANNING'}
          showBoundingBoxes={showBoundingBoxes}
          onSelectObject={onSelectObject}
        />
      </div>

      {/* Bottom Floating Playback & Telemetry Controls */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-graphite-900/95 border border-white/10 backdrop-blur-md text-xs font-mono">
        
        {/* Playback Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyber-cyan hover:bg-cyan-300 text-graphite-950 font-bold font-mono transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-graphite-800 hover:bg-graphite-700 text-slate-300 border border-white/10 transition-colors cursor-pointer"
            title="Reset Simulation Poses"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>

          {/* Speed Selection */}
          <div className="flex items-center gap-1 bg-graphite-950 p-1 rounded border border-white/5">
            {SPEED_OPTIONS.map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                  speedMultiplier === spd
                    ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Physics Telemetry */}
        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
          <span>FPS: <strong className="text-cyber-green">{metrics.fps}</strong></span>
          <span>Contact: <strong className="text-white">{metrics.contactForcesN.toFixed(1)} N</strong></span>
          <span>Symmetry: <strong className="text-cyber-cyan">{metrics.symmetryScorePercent}%</strong></span>
          <span className="flex items-center gap-1 text-cyber-green">
            <CheckCircle2 className="w-3 h-3" />
            No Collisions
          </span>
        </div>
      </div>
    </div>
  );
};

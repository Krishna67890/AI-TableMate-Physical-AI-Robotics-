import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { TableScene } from './TableScene';
import { SO101Arm } from './SO101Arm';
import { TableObjects } from './TableObjects';
import { CameraRig } from './CameraRig';
import { JointAngles, CameraPreset } from '../types/robotics';
import { TableObjectState } from '../types/simulation';

interface RobotWorldProps {
  leftJoints: JointAngles;
  rightJoints: JointAngles;
  leftAction: string;
  rightAction: string;
  isLeftGripping: boolean;
  isRightGripping: boolean;
  objects: TableObjectState[];
  selectedObjectId?: string | null;
  cameraPreset: CameraPreset;
  isScanning?: boolean;
  showBoundingBoxes?: boolean;
  onSelectObject?: (id: string) => void;
}

export const RobotWorld: React.FC<RobotWorldProps> = ({
  leftJoints,
  rightJoints,
  leftAction,
  rightAction,
  isLeftGripping,
  isRightGripping,
  objects,
  selectedObjectId,
  cameraPreset,
  isScanning = false,
  showBoundingBoxes = true,
  onSelectObject
}) => {
  return (
    <div className="relative w-full h-full r3f-container bg-graphite-950 overflow-hidden select-none">
      <Canvas
        shadows
        camera={{ position: [0, 1.25, 1.5], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#070A0F']} />
        <fog attach="fog" args={['#070A0F', 3.0, 7.5]} />

        <Suspense fallback={null}>
          <CameraRig preset={cameraPreset} />
          
          <TableScene isScanning={isScanning} />

          {/* Left SO-101 6-DOF Robotic Arm */}
          <SO101Arm
            id="left_arm"
            basePosition={[-0.4, 0.4, -0.05]}
            joints={leftJoints}
            action={leftAction}
            isGripping={isLeftGripping}
            accentColor="#00F0FF"
          />

          {/* Right SO-101 6-DOF Robotic Arm */}
          <SO101Arm
            id="right_arm"
            basePosition={[0.4, 0.4, -0.05]}
            joints={rightJoints}
            action={rightAction}
            isGripping={isRightGripping}
            accentColor="#FFB800"
          />

          {/* Tabletop Manipulable Objects */}
          <TableObjects
            objects={objects}
            selectedObjectId={selectedObjectId}
            showBoundingBoxes={showBoundingBoxes}
            onSelectObject={onSelectObject}
          />
        </Suspense>
      </Canvas>

      {/* Top Left Watermark Badge */}
      <div className="absolute top-3 left-4 pointer-events-none z-10 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
        <span className="font-mono text-[11px] tracking-wider text-slate-300 uppercase">
          MUJOCO 3D WORKSPACE // SO-101 BIMANUAL
        </span>
      </div>
    </div>
  );
};

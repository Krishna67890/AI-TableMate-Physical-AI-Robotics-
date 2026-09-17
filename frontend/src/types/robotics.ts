export interface JointAngles {
  q1: number; // Base Yaw (-2.8 to 2.8 rad)
  q2: number; // Shoulder Pitch (-1.8 to 1.8 rad)
  q3: number; // Elbow Pitch (-2.2 to 2.2 rad)
  q4: number; // Wrist Pitch (-2.0 to 2.0 rad)
  q5: number; // Wrist Roll (-3.14 to 3.14 rad)
  gripper: number; // Gripper opening (-0.02 to 0.02 m)
}

export interface EndEffectorPose {
  x: number;
  y: number;
  z: number;
  roll: number;
  pitch: number;
  yaw: number;
}

export interface ArmTelemetryData {
  id: 'left_arm' | 'right_arm';
  name: string;
  connected: boolean;
  action: string;
  progress: number;
  joints: JointAngles;
  eePose: EndEffectorPose;
  temperatureC: number;
  targetPos: [number, number, number];
  isGripping: boolean;
  graspedObject: string | null;
}

export type CameraPreset = 
  | 'OVERVIEW'
  | 'LEFT_ARM'
  | 'RIGHT_ARM'
  | 'OBJECT_INSPECTION'
  | 'TOP_DOWN'
  | 'AI_VISION';

export interface TableObjectState {
  id: string;
  name: string;
  category: 'plate' | 'cup' | 'cutlery' | 'napkin' | 'obstacle';
  position: [number, number, number];
  targetPosition: [number, number, number];
  rotation: [number, number, number];
  confidence: number;
  reachableLeft: boolean;
  reachableRight: boolean;
  graspedBy: 'left_arm' | 'right_arm' | null;
  status: 'resting' | 'in_transit' | 'placed' | 'occluded';
}

export type ExecutionStage = 
  | 'IDLE'
  | 'COMMAND_RECEIVED'
  | 'VISION_SCANNING'
  | 'TASK_PLANNING'
  | 'ARM_COORDINATION'
  | 'MUJOCO_EXECUTION'
  | 'VERIFICATION'
  | 'MISSION_COMPLETE'
  | 'RECOVERY_ACTIVE';

export interface SimulationMetrics {
  fps: number;
  solverIterations: number;
  contactForcesN: number;
  activeCollisions: number;
  edgeInferenceLatencyMs: number;
  speechLatencyMs: number;
  totalPlanningTimeMs: number;
  symmetryScorePercent: number;
}

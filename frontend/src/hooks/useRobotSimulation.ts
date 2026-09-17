import { useState, useEffect, useRef, useCallback } from 'react';
import { JointAngles, CameraPreset } from '../types/robotics';
import { TableObjectState, ExecutionStage, SimulationMetrics } from '../types/simulation';
import { TaskSubgoal } from '../types/ai';

export type ConnectionStatus = 'CONNECTED' | 'CONNECTING' | 'RECONNECTING' | 'OFFLINE';

const INITIAL_LEFT_JOINTS: JointAngles = {
  q1: 0.0,
  q2: 0.45,
  q3: -0.7,
  q4: 0.25,
  q5: 0.0,
  gripper: 0.02
};

const INITIAL_RIGHT_JOINTS: JointAngles = {
  q1: 0.0,
  q2: 0.45,
  q3: -0.7,
  q4: 0.25,
  q5: 0.0,
  gripper: 0.02
};

const INITIAL_OBJECTS: TableObjectState[] = [
  {
    id: 'plate_1',
    name: 'Dining Plate (L)',
    category: 'plate',
    position: [-0.25, 0.40, 0.08],
    targetPosition: [-0.25, 0.40, 0.08],
    rotation: [0, 0, 0],
    confidence: 0.984,
    reachableLeft: true,
    reachableRight: false,
    graspedBy: null,
    status: 'resting'
  },
  {
    id: 'plate_2',
    name: 'Dining Plate (R)',
    category: 'plate',
    position: [0.25, 0.40, 0.08],
    targetPosition: [0.25, 0.40, 0.08],
    rotation: [0, 0, 0],
    confidence: 0.979,
    reachableLeft: false,
    reachableRight: true,
    graspedBy: null,
    status: 'resting'
  },
  {
    id: 'cup_1',
    name: 'Ceramic Mug (L)',
    category: 'cup',
    position: [-0.34, 0.40, 0.26],
    targetPosition: [-0.34, 0.40, 0.26],
    rotation: [0, 0, 0],
    confidence: 0.965,
    reachableLeft: true,
    reachableRight: false,
    graspedBy: null,
    status: 'resting'
  },
  {
    id: 'cup_2',
    name: 'Ceramic Mug (R)',
    category: 'cup',
    position: [0.34, 0.40, 0.26],
    targetPosition: [0.34, 0.40, 0.26],
    rotation: [0, 0, 0],
    confidence: 0.962,
    reachableLeft: false,
    reachableRight: true,
    graspedBy: null,
    status: 'resting'
  },
  {
    id: 'fork_1',
    name: 'Dinner Fork (L)',
    category: 'cutlery',
    position: [-0.38, 0.40, 0.08],
    targetPosition: [-0.38, 0.40, 0.08],
    rotation: [0, 0, 0],
    confidence: 0.941,
    reachableLeft: true,
    reachableRight: false,
    graspedBy: null,
    status: 'resting'
  },
  {
    id: 'spoon_1',
    name: 'Soup Spoon (L)',
    category: 'cutlery',
    position: [-0.12, 0.40, 0.08],
    targetPosition: [-0.12, 0.40, 0.08],
    rotation: [0, 0, 0],
    confidence: 0.948,
    reachableLeft: true,
    reachableRight: true,
    graspedBy: null,
    status: 'resting'
  },
  {
    id: 'fork_2',
    name: 'Dinner Fork (R)',
    category: 'cutlery',
    position: [0.12, 0.40, 0.08],
    targetPosition: [0.12, 0.40, 0.08],
    rotation: [0, 0, 0],
    confidence: 0.939,
    reachableLeft: true,
    reachableRight: true,
    graspedBy: null,
    status: 'resting'
  },
  {
    id: 'spoon_2',
    name: 'Soup Spoon (R)',
    category: 'cutlery',
    position: [0.38, 0.40, 0.08],
    targetPosition: [0.38, 0.40, 0.08],
    rotation: [0, 0, 0],
    confidence: 0.952,
    reachableLeft: false,
    reachableRight: true,
    graspedBy: null,
    status: 'resting'
  }
];

function generateDynamicVlaPlan(prompt: string): TaskSubgoal[] {
  const p = prompt.toLowerCase();

  if (p.includes('occlud') || p.includes('recover') || p.includes('hidden') || p.includes('block')) {
    return [
      {
        step: 1,
        title: 'Perception Sweep & Occlusion Isolation',
        description: 'Overhead camera identifies obstacle blocking direct line-of-sight to target cup.',
        assignedArm: 'both',
        actionType: 'SCAN',
        durationSeconds: 2.0,
        status: 'active',
        verificationCriteria: 'Occlusion boundary isolated (Confidence < 60%)'
      },
      {
        step: 2,
        title: 'Wrist Sensor Repositioning',
        description: 'Right arm re-angles wrist sensor (+25° pitch) for multi-view stereo reconstruction.',
        assignedArm: 'right_arm',
        actionType: 'RECOVER',
        durationSeconds: 3.0,
        status: 'pending',
        verificationCriteria: 'Reconstruction restored to 96.8% confidence'
      },
      {
        step: 3,
        title: 'Trajectory Re-Planning & Collision Corridor',
        description: 'Dynamic corridor computed avoiding obstacle perimeter by 45mm clearance.',
        assignedArm: 'right_arm',
        actionType: 'PICK_AND_PLACE',
        durationSeconds: 3.5,
        status: 'pending',
        verificationCriteria: 'Collision-free corridor validated in MuJoCo'
      },
      {
        step: 4,
        title: 'Recovery Grasp & Place Execution',
        description: 'Right arm safely grasps target mug and positions at standard dining coordinate.',
        assignedArm: 'right_arm',
        actionType: 'DEPOSIT',
        durationSeconds: 3.0,
        status: 'pending',
        verificationCriteria: 'Object resting upright, contact force = 0N'
      }
    ];
  }

  if (p.includes('cup') || p.includes('mug') || p.includes('drink')) {
    return [
      {
        step: 1,
        title: 'Spatial Affordance Registration',
        description: 'RGB-D camera localizes mugs and computes cylindrical grasp normal.',
        assignedArm: 'both',
        actionType: 'SCAN',
        durationSeconds: 2.0,
        status: 'active',
        verificationCriteria: 'Mug grasp affordance score > 94%'
      },
      {
        step: 2,
        title: 'Coordinated Approach Trajectory',
        description: 'Left SO-101 approaches Mug (L); Right SO-101 monitors boundary clearance.',
        assignedArm: 'left_arm',
        actionType: 'PICK_AND_PLACE',
        durationSeconds: 3.0,
        status: 'pending',
        verificationCriteria: 'Gripper aligned with mug handle axis'
      },
      {
        step: 3,
        title: 'Pick, Translate & Deposit',
        description: 'Left arm lifts mug by 40mm, translates adjacent to plate, and softly places.',
        assignedArm: 'left_arm',
        actionType: 'DEPOSIT',
        durationSeconds: 3.5,
        status: 'pending',
        verificationCriteria: 'Mug position within 3mm of station target'
      },
      {
        step: 4,
        title: 'Optical Position Verification',
        description: 'Overhead inspection validates stable contact and zero tilt.',
        assignedArm: 'both',
        actionType: 'RETRACT',
        durationSeconds: 2.0,
        status: 'pending',
        verificationCriteria: 'Position verified, symmetry score 99.1%'
      }
    ];
  }

  if (p.includes('clear') || p.includes('stack') || p.includes('remove')) {
    return [
      {
        step: 1,
        title: 'Full Table Surface Scanning',
        description: 'Detects all 8 placed items and determines optimal reverse-stack sequence.',
        assignedArm: 'both',
        actionType: 'SCAN',
        durationSeconds: 2.0,
        status: 'active',
        verificationCriteria: 'All 8 items registered in scene graph'
      },
      {
        step: 2,
        title: 'Cutlery Retraction & Grouping',
        description: 'Dual arms collect forks and spoons and stage them on outer tray.',
        assignedArm: 'both',
        actionType: 'ALIGN',
        durationSeconds: 3.5,
        status: 'pending',
        verificationCriteria: 'Cutlery successfully cleared from dining stations'
      },
      {
        step: 3,
        title: 'Beverage Ware Collection',
        description: 'Left arm picks Mug 1, Right arm picks Mug 2; move to staging zone.',
        assignedArm: 'both',
        actionType: 'PICK_AND_PLACE',
        durationSeconds: 3.5,
        status: 'pending',
        verificationCriteria: 'Mugs secured without spill dynamics'
      },
      {
        step: 4,
        title: 'Bimanual Plate Central Stacking',
        description: 'Left arm transfers Plate 1 to center; Right arm stacks Plate 2 concentric on top.',
        assignedArm: 'both',
        actionType: 'DEPOSIT',
        durationSeconds: 4.0,
        status: 'pending',
        verificationCriteria: 'Plates stacked centrally, table 100% cleared'
      }
    ];
  }

  return [
    {
      step: 1,
      title: 'Perception & Spatial Calibration',
      description: 'Overhead camera identifies 8 tabletop items and computes 3D grasp coordinates.',
      assignedArm: 'both',
      actionType: 'SCAN',
      durationSeconds: 2.0,
      status: 'active',
      verificationCriteria: 'Confidence > 94% on Intel NPU'
    },
    {
      step: 2,
      title: 'Synchronized Bimanual Plate Placement',
      description: 'Left Arm places Plate 1 at Station A; Right Arm places Plate 2 at Station B.',
      assignedArm: 'both',
      actionType: 'PICK_AND_PLACE',
      durationSeconds: 4.0,
      status: 'pending',
      verificationCriteria: 'Radial error < 4mm'
    },
    {
      step: 3,
      title: 'Coordinated Cutlery Alignment',
      description: 'Dual arms position forks on outer bounds and spoons on inner bounds.',
      assignedArm: 'both',
      actionType: 'ALIGN',
      durationSeconds: 3.5,
      status: 'pending',
      verificationCriteria: 'Symmetric angular alignment verified'
    },
    {
      step: 4,
      title: 'Beverage Ware Placement',
      description: 'Simultaneous deposit of ceramic mugs at 45° offset from plates.',
      assignedArm: 'both',
      actionType: 'DEPOSIT',
      durationSeconds: 3.0,
      status: 'pending',
      verificationCriteria: 'Stable contact verified in MuJoCo'
    },
    {
      step: 5,
      title: 'Closed-Loop Optical Verification',
      description: 'Arms return to home; overhead camera checks symmetry score and dining readiness.',
      assignedArm: 'both',
      actionType: 'RETRACT',
      durationSeconds: 2.0,
      status: 'pending',
      verificationCriteria: 'Symmetry 98.7% verified'
    }
  ];
}

export function useRobotSimulation() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [stage, setStage] = useState<ExecutionStage>('IDLE');
  const [currentPrompt, setCurrentPrompt] = useState<string>('Set the table for two');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('OVERVIEW');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('CONNECTING');
  const [backendEngineName, setBackendEngineName] = useState('DEMO SIMULATION');
  const [controlMode, setControlMode] = useState<'AI_AUTONOMOUS' | 'MANUAL_JOG'>('AI_AUTONOMOUS');

  // Robot telemetry state
  const [leftJoints, setLeftJoints] = useState<JointAngles>(INITIAL_LEFT_JOINTS);
  const [rightJoints, setRightJoints] = useState<JointAngles>(INITIAL_RIGHT_JOINTS);
  const [leftAction, setLeftAction] = useState<string>('STANDBY READY');
  const [rightAction, setRightAction] = useState<string>('STANDBY READY');
  const [leftProgress, setLeftProgress] = useState<number>(100);
  const [rightProgress, setRightProgress] = useState<number>(100);
  const [isLeftGripping, setIsLeftGripping] = useState<boolean>(false);
  const [isRightGripping, setIsRightGripping] = useState<boolean>(false);

  // Objects state
  const [objects, setObjects] = useState<TableObjectState[]>(INITIAL_OBJECTS);

  // Active Task subgoals
  const [taskSubgoals, setTaskSubgoals] = useState<TaskSubgoal[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Failure / Recovery State
  const [recoveryEvent, setRecoveryEvent] = useState<{ active: boolean; title: string; explanation: string; action: string } | null>(null);

  // Simulation Metrics
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    fps: 60,
    solverIterations: 50,
    contactForcesN: 0,
    activeCollisions: 0,
    edgeInferenceLatencyMs: 4.1,
    speechLatencyMs: 44.5,
    totalPlanningTimeMs: 12.8,
    symmetryScorePercent: 98.7
  });

  const animTimeRef = useRef(0);
  const stageTimeoutsRef = useRef<any[]>([]);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<any>(null);

  // Clear all pending timeouts
  const clearStageTimeouts = () => {
    stageTimeoutsRef.current.forEach(t => clearTimeout(t));
    stageTimeoutsRef.current = [];
  };

  // Safe WebSocket connection manager with exponential backoff
  useEffect(() => {
    let isMounted = true;
    let ws: WebSocket | null = null;

    const getWsUrl = () => {
      const httpUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
      return httpUrl.replace(/^http/, 'ws') + '/ws/telemetry';
    };

    const connectWebSocket = async () => {
      try {
        const httpUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const res = await fetch(`${httpUrl}/health`, { signal: controller.signal }).catch(() => null);
        clearTimeout(timeoutId);

        if (!res || !res.ok) {
          if (isMounted) {
            setConnectionStatus('OFFLINE');
            setBackendEngineName('DEMO SIMULATION');
            scheduleReconnect();
          }
          return;
        }
      } catch {
        if (isMounted) {
          setConnectionStatus('OFFLINE');
          scheduleReconnect();
        }
        return;
      }

      try {
        if (!isMounted) return;
        setConnectionStatus(reconnectAttemptsRef.current > 0 ? 'RECONNECTING' : 'CONNECTING');
        const socket = new WebSocket(getWsUrl());

        socket.onopen = () => {
          if (!isMounted) {
            socket.close();
            return;
          }
          reconnectAttemptsRef.current = 0;
          setConnectionStatus('CONNECTED');
          console.log('[AI TableMate] WebSocket connected to Live Backend Telemetry.');
        };

        socket.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            if (data.engine) setBackendEngineName(data.engine);
          } catch {}
        };

        socket.onerror = () => {
          if (isMounted) {
            setConnectionStatus('OFFLINE');
            setBackendEngineName('DEMO SIMULATION');
          }
        };

        socket.onclose = () => {
          if (isMounted) {
            setConnectionStatus('OFFLINE');
            setBackendEngineName('DEMO SIMULATION');
            scheduleReconnect();
          }
        };

        ws = socket;
      } catch {
        if (isMounted) {
          setConnectionStatus('OFFLINE');
          scheduleReconnect();
        }
      }
    };

    const scheduleReconnect = () => {
      if (!isMounted) return;
      reconnectAttemptsRef.current += 1;
      const delay = Math.min(10000, Math.pow(2, reconnectAttemptsRef.current - 1) * 1000);
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, delay);
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Reset Simulation
  const resetSimulation = useCallback(() => {
    clearStageTimeouts();
    setLeftJoints(INITIAL_LEFT_JOINTS);
    setRightJoints(INITIAL_RIGHT_JOINTS);
    setObjects(INITIAL_OBJECTS);
    setLeftAction('STANDBY READY');
    setRightAction('STANDBY READY');
    setLeftProgress(100);
    setRightProgress(100);
    setIsLeftGripping(false);
    setIsRightGripping(false);
    setStage('IDLE');
    setCurrentStepIndex(0);
    setRecoveryEvent(null);
    animTimeRef.current = 0;
  }, []);

  // Launch Task Execution Pipeline
  const executeCommand = useCallback((prompt: string) => {
    clearStageTimeouts();
    setCurrentPrompt(prompt);
    setStage('COMMAND_RECEIVED');
    setRecoveryEvent(null);
    setControlMode('AI_AUTONOMOUS');
    animTimeRef.current = 0;
    setIsPlaying(true);

    // Initial reset of objects so execution can be repeated cleanly
    setObjects(INITIAL_OBJECTS);

    // Also notify FastAPI backend if reachable
    try {
      const httpUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
      fetch(`${httpUrl}/api/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: prompt })
      }).catch(() => {});
    } catch {}

    // Stage 1: Command received -> Stage 2: Vision Scanning (0.5s)
    const t1 = setTimeout(() => {
      setStage('VISION_SCANNING');
      setCameraPreset('AI_VISION');
      setLeftAction('CALIBRATING SENSORS');
      setRightAction('CALIBRATING SENSORS');
      // Spread arms to standby position for clear camera view
      setLeftJoints({ q1: 0.4, q2: 0.2, q3: -0.4, q4: 0.2, q5: 0.0, gripper: 0.025 });
      setRightJoints({ q1: -0.4, q2: 0.2, q3: -0.4, q4: 0.2, q5: 0.0, gripper: 0.025 });
    }, 500);

    // Stage 3: Dynamic VLA Task Planning (1.8s)
    const t2 = setTimeout(() => {
      setStage('TASK_PLANNING');
      const subgoals = generateDynamicVlaPlan(prompt);
      setTaskSubgoals(subgoals);
      setCurrentStepIndex(0);
      setLeftAction('DECOMPOSING TASK');
      setRightAction('DECOMPOSING TASK');
    }, 1800);

    // Stage 4: Arm Coordination & Corridor Generation (3.0s)
    const t3 = setTimeout(() => {
      setStage('ARM_COORDINATION');
      setCameraPreset('OVERVIEW');
      setLeftAction('COMPUTING IK TRAJECTORY');
      setRightAction('COMPUTING IK TRAJECTORY');
    }, 3000);

    // Stage 5: MuJoCo Physics Execution (4.2s)
    const t4 = setTimeout(() => {
      setStage('MUJOCO_EXECUTION');
      animTimeRef.current = 0; // Reset timer specifically for manipulation phase!
    }, 4200);

    stageTimeoutsRef.current = [t1, t2, t3, t4];
  }, []);

  // Interactive Simulation loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (controlMode === 'MANUAL_JOG') return;

      if (stage === 'MUJOCO_EXECUTION') {
        animTimeRef.current += 0.016 * speedMultiplier;
        const t = animTimeRef.current;
        const p = currentPrompt.toLowerCase();

        // 60Hz Arm Kinematics Wave
        const wave = Math.sin(t * 1.5);
        const cosWave = Math.cos(t * 1.5);

        const isLGrip = wave > 0.15;
        const isRGrip = cosWave > 0.15;

        setLeftJoints({
          q1: 0.38 * wave,
          q2: 0.42 + 0.32 * Math.max(0, wave),
          q3: -0.65 - 0.28 * Math.max(0, wave),
          q4: 0.22 + 0.16 * wave,
          q5: 0.22 * wave,
          gripper: isLGrip ? 0.005 : 0.022
        });

        setRightJoints({
          q1: -0.38 * wave,
          q2: 0.42 + 0.32 * Math.max(0, cosWave),
          q3: -0.65 - 0.28 * Math.max(0, cosWave),
          q4: 0.22 + 0.16 * cosWave,
          q5: -0.22 * cosWave,
          gripper: isRGrip ? 0.005 : 0.022
        });

        setIsLeftGripping(isLGrip);
        setIsRightGripping(isRGrip);

        setLeftAction(isLGrip ? 'MANIPULATING WORKSPACE OBJECT' : 'COORDINATED APPROACH');
        setRightAction(isRGrip ? 'ALIGNING TARGET FIXTURE' : 'TRAJECTORY INTERPOLATION');

        setLeftProgress(Math.floor(Math.min(100, 20 + ((t % 18) / 18) * 80)));
        setRightProgress(Math.floor(Math.min(100, 15 + ((t % 18) / 18) * 85)));

        // Step index progression
        const maxStep = Math.max(1, taskSubgoals.length);
        const stepIdx = Math.min(maxStep - 1, Math.floor((t / 18) * maxStep));
        setCurrentStepIndex(stepIdx);

        // Update subgoals status
        setTaskSubgoals(prev =>
          prev.map((sub, idx) => ({
            ...sub,
            status: idx < stepIdx ? 'completed' : idx === stepIdx ? 'active' : 'pending'
          }))
        );

        // Physical object movements in 3D scene
        setObjects((prev) =>
          prev.map((obj) => {
            if (p.includes('cup') && obj.id === 'cup_1') {
              if (isLGrip) {
                return {
                  ...obj,
                  position: [-0.25 + 0.08 * wave, 0.43 + 0.04 * wave, 0.22],
                  status: 'in_transit',
                  graspedBy: 'left_arm'
                };
              }
            } else if (p.includes('clear') && (obj.id === 'plate_1' || obj.id === 'plate_2')) {
              if (isLGrip || isRGrip) {
                const centerProg = Math.min(1.0, t / 15);
                return {
                  ...obj,
                  position: [
                    (obj.id === 'plate_1' ? -0.25 : 0.25) * (1 - centerProg),
                    0.40,
                    0.08 + (obj.id === 'plate_2' ? 0.025 * centerProg : 0)
                  ],
                  status: 'placed'
                };
              }
            } else if (obj.id === 'plate_1' && isLGrip) {
              return {
                ...obj,
                position: [-0.25 + 0.04 * Math.sin(t), 0.40, 0.08],
                status: 'placed'
              };
            }
            return obj;
          })
        );

        // Visual Occlusion Event check
        if (p.includes('occlud') && stepIdx === 1 && !recoveryEvent) {
          setRecoveryEvent({
            active: true,
            title: 'VISUAL OCCLUSION DETECTED',
            explanation: 'Mug 2 is partially blocked by obstacle from standard overhead angle (Confidence 54.2%).',
            action: 'AUTONOMOUS RE-ROUTING: Right arm tilting wrist sensor +25° for multi-view stereo pose recovery.'
          });
        }

        // Complete execution after 18 seconds of active manipulation
        if (t >= 18) {
          setStage('VERIFICATION');
          setCameraPreset('TOP_DOWN');
          setLeftAction('RETRACTED TO HOME');
          setRightAction('RETRACTED TO HOME');
          setIsLeftGripping(false);
          setIsRightGripping(false);
          setLeftProgress(100);
          setRightProgress(100);

          setTaskSubgoals(prev => prev.map(s => ({ ...s, status: 'completed' })));

          const verifyTimer = setTimeout(() => {
            setStage('MISSION_COMPLETE');
            setCameraPreset('OVERVIEW');
          }, 2200);

          stageTimeoutsRef.current.push(verifyTimer);
        }
      }
    }, 16);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier, stage, currentPrompt, recoveryEvent, controlMode, taskSubgoals.length]);

  return {
    isPlaying,
    setIsPlaying,
    speedMultiplier,
    setSpeedMultiplier,
    stage,
    setStage,
    currentPrompt,
    cameraPreset,
    setCameraPreset,
    showBoundingBoxes,
    setShowBoundingBoxes,
    selectedObjectId,
    setSelectedObjectId,
    connectionStatus,
    backendEngineName,
    controlMode,
    setControlMode,
    leftJoints,
    setLeftJoints,
    rightJoints,
    setRightJoints,
    leftAction,
    rightAction,
    leftProgress,
    rightProgress,
    isLeftGripping,
    isRightGripping,
    objects,
    taskSubgoals,
    currentStepIndex,
    recoveryEvent,
    metrics,
    resetSimulation,
    executeCommand
  };
}

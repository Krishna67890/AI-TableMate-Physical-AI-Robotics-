import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraPreset } from '../types/robotics';

interface CameraRigProps {
  preset: CameraPreset;
  enableManualOrbit?: boolean;
}

const PRESET_CONFIGS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number]; fov: number }> = {
  OVERVIEW: {
    pos: [0, 1.25, 1.5],
    target: [0, 0.42, 0.1],
    fov: 45
  },
  LEFT_ARM: {
    pos: [-0.75, 0.85, 0.55],
    target: [-0.3, 0.45, 0.1],
    fov: 40
  },
  RIGHT_ARM: {
    pos: [0.75, 0.85, 0.55],
    target: [0.3, 0.45, 0.1],
    fov: 40
  },
  OBJECT_INSPECTION: {
    pos: [0, 0.68, 0.52],
    target: [0, 0.42, 0.15],
    fov: 35
  },
  TOP_DOWN: {
    pos: [0, 2.1, 0.12],
    target: [0, 0.38, 0.1],
    fov: 40
  },
  AI_VISION: {
    pos: [0, 1.45, 0.85],
    target: [0, 0.4, 0.15],
    fov: 50
  }
};

export const CameraRig: React.FC<CameraRigProps> = ({
  preset,
  enableManualOrbit = true
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const targetPos = useRef(new THREE.Vector3(...PRESET_CONFIGS.OVERVIEW.pos));
  const targetLookAt = useRef(new THREE.Vector3(...PRESET_CONFIGS.OVERVIEW.target));

  useEffect(() => {
    const cfg = PRESET_CONFIGS[preset] || PRESET_CONFIGS.OVERVIEW;
    targetPos.current.set(...cfg.pos);
    targetLookAt.current.set(...cfg.target);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = cfg.fov;
      camera.updateProjectionMatrix();
    }
  }, [preset, camera]);

  useFrame((_, delta) => {
    const lerpRate = Math.min(delta * 4.5, 1.0);
    camera.position.lerp(targetPos.current, lerpRate);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, lerpRate);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enableManualOrbit}
      enableDamping
      dampingFactor={0.08}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minDistance={0.4}
      maxDistance={4.0}
    />
  );
};

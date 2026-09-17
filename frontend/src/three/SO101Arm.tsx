import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { JointAngles } from '../types/robotics';
import { GripperGlowShader } from './Shaders';

interface SO101ArmProps {
  id: 'left_arm' | 'right_arm';
  basePosition: [number, number, number];
  joints: JointAngles;
  action: string;
  isGripping: boolean;
  accentColor?: string;
}

export const SO101Arm: React.FC<SO101ArmProps> = ({
  id,
  basePosition,
  joints,
  action,
  isGripping,
  accentColor = id === 'left_arm' ? '#00F0FF' : '#FFB800'
}) => {
  // References for kinematic chain
  const baseYawRef = useRef<THREE.Group>(null);
  const shoulderRef = useRef<THREE.Group>(null);
  const elbowRef = useRef<THREE.Group>(null);
  const wristPitchRef = useRef<THREE.Group>(null);
  const wristRollRef = useRef<THREE.Group>(null);
  const leftFingerRef = useRef<THREE.Mesh>(null);
  const rightFingerRef = useRef<THREE.Mesh>(null);
  const glowMatRef = useRef<THREE.ShaderMaterial>(null);

  // Smooth joint angle interpolation
  useFrame((_, delta) => {
    const lerpFactor = Math.min(delta * 12.0, 1.0);

    if (baseYawRef.current) {
      baseYawRef.current.rotation.y = THREE.MathUtils.lerp(baseYawRef.current.rotation.y, joints.q1, lerpFactor);
    }
    if (shoulderRef.current) {
      shoulderRef.current.rotation.x = THREE.MathUtils.lerp(shoulderRef.current.rotation.x, joints.q2, lerpFactor);
    }
    if (elbowRef.current) {
      elbowRef.current.rotation.x = THREE.MathUtils.lerp(elbowRef.current.rotation.x, joints.q3, lerpFactor);
    }
    if (wristPitchRef.current) {
      wristPitchRef.current.rotation.x = THREE.MathUtils.lerp(wristPitchRef.current.rotation.x, joints.q4, lerpFactor);
    }
    if (wristRollRef.current) {
      wristRollRef.current.rotation.z = THREE.MathUtils.lerp(wristRollRef.current.rotation.z, joints.q5, lerpFactor);
    }

    // Finger separation
    const gripGap = isGripping ? 0.006 : 0.022;
    if (leftFingerRef.current && rightFingerRef.current) {
      leftFingerRef.current.position.x = THREE.MathUtils.lerp(leftFingerRef.current.position.x, -gripGap, lerpFactor);
      rightFingerRef.current.position.x = THREE.MathUtils.lerp(rightFingerRef.current.position.x, gripGap, lerpFactor);
    }

    if (glowMatRef.current) {
      glowMatRef.current.uniforms.uTime.value += delta;
      glowMatRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(
        glowMatRef.current.uniforms.uIntensity.value,
        isGripping ? 1.5 : 0.2,
        lerpFactor
      );
    }
  });

  return (
    <group position={basePosition}>
      {/* Heavy Base Mounting Plate */}
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.03, 32]} />
        <meshStandardMaterial color="#111620" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Arm Mounting Collar with Status Ring */}
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.015, 32]} />
        <meshStandardMaterial
          color="#06090E"
          emissive={accentColor}
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* JOINT 1: Base Yaw */}
      <group ref={baseYawRef} position={[0, 0.045, 0]}>
        {/* Turntable cylinder */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.055, 0.06, 24]} />
          <meshStandardMaterial color="#1E2638" metalness={0.7} roughness={0.35} />
        </mesh>

        {/* JOINT 2: Shoulder Pitch */}
        <group ref={shoulderRef} position={[0, 0.06, 0]}>
          {/* Shoulder Motor Hub */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.08, 24]} />
            <meshStandardMaterial color="#0A0E17" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Upper Arm Link (L1 = 0.14m) */}
          <group position={[0, 0.07, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.04, 0.14, 0.035]} />
              <meshStandardMaterial color="#253046" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Carbon fiber accent strip */}
            <mesh position={[0, 0, 0.019]}>
              <planeGeometry args={[0.025, 0.11]} />
              <meshStandardMaterial color="#0D1117" roughness={0.7} metalness={0.2} />
            </mesh>
          </group>

          {/* JOINT 3: Elbow Pitch */}
          <group ref={elbowRef} position={[0, 0.14, 0]}>
            {/* Elbow Hub */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.07, 24]} />
              <meshStandardMaterial color="#0A0E17" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Forearm Link (L2 = 0.13m) */}
            <group position={[0, 0.065, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.032, 0.13, 0.03]} />
                <meshStandardMaterial color="#1E2638" metalness={0.6} roughness={0.4} />
              </mesh>
            </group>

            {/* JOINT 4: Wrist Pitch */}
            <group ref={wristPitchRef} position={[0, 0.13, 0]}>
              <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.022, 0.022, 0.05, 20]} />
                <meshStandardMaterial color="#0A0E17" metalness={0.8} />
              </mesh>

              {/* Wrist Joint Body */}
              <mesh position={[0, 0.02, 0]} castShadow>
                <boxGeometry args={[0.028, 0.04, 0.028]} />
                <meshStandardMaterial color="#253046" metalness={0.7} />
              </mesh>

              {/* JOINT 5: Wrist Roll */}
              <group ref={wristRollRef} position={[0, 0.04, 0]}>
                {/* Gripper Palm */}
                <mesh position={[0, 0.015, 0]} castShadow>
                  <boxGeometry args={[0.05, 0.018, 0.025]} />
                  <meshStandardMaterial
                    color="#141B28"
                    emissive={accentColor}
                    emissiveIntensity={isGripping ? 0.7 : 0.2}
                    metalness={0.8}
                    roughness={0.2}
                  />
                </mesh>

                {/* Left Gripper Jaw */}
                <mesh ref={leftFingerRef} position={[-0.018, 0.04, 0]} castShadow>
                  <boxGeometry args={[0.007, 0.035, 0.016]} />
                  <meshStandardMaterial color="#C5D1E8" metalness={0.9} roughness={0.15} />
                </mesh>

                {/* Right Gripper Jaw */}
                <mesh ref={rightFingerRef} position={[0.018, 0.04, 0]} castShadow>
                  <boxGeometry args={[0.007, 0.035, 0.016]} />
                  <meshStandardMaterial color="#C5D1E8" metalness={0.9} roughness={0.15} />
                </mesh>

                {/* Gripper Optical Glow Aura */}
                <mesh position={[0, 0.045, 0]}>
                  <sphereGeometry args={[0.03, 16, 16]} />
                  <shaderMaterial
                    ref={glowMatRef}
                    {...GripperGlowShader}
                    transparent
                    depthWrite={false}
                  />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

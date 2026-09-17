import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ScanPlaneShader, TechGridShader } from './Shaders';

interface TableSceneProps {
  isScanning?: boolean;
}

export const TableScene: React.FC<TableSceneProps> = ({ isScanning = false }) => {
  const scanMatRef = useRef<THREE.ShaderMaterial>(null);
  const scanGroupRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (scanMatRef.current) {
      scanMatRef.current.uniforms.uTime.value += delta;
      if (isScanning) {
        // Move scanline smoothly back and forth across table Y/Z axis
        const t = scanMatRef.current.uniforms.uTime.value;
        scanMatRef.current.uniforms.uScanY.value = Math.sin(t * 1.8) * 0.4;
        scanMatRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
          scanMatRef.current.uniforms.uOpacity.value,
          0.8,
          delta * 4.0
        );
      } else {
        scanMatRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
          scanMatRef.current.uniforms.uOpacity.value,
          0.0,
          delta * 4.0
        );
      }
    }
  });

  return (
    <group>
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[2, 4, 3]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#00F0FF" />
      <pointLight position={[0, 1.8, 0.2]} intensity={0.8} color="#E6F4FE" />

      {/* Main Table Workstation */}
      <group position={[0, 0.38, 0.1]}>
        {/* Table Surface Slab */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.04, 0.9]} />
          <meshStandardMaterial
            color="#121824"
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>

        {/* Table Border Chamfer / Bevel Accent */}
        <mesh position={[0, 0.021, 0]}>
          <planeGeometry args={[1.26, 0.86]} />
          <meshStandardMaterial
            color="#0B0F17"
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>

        {/* Dual Calibration Alignment Target Marks */}
        {/* Station 1 (Left User) */}
        <mesh position={[-0.25, 0.022, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.083, 32]} />
          <meshBasicMaterial color="#00F0FF" opacity={0.25} transparent />
        </mesh>
        {/* Station 2 (Right User) */}
        <mesh position={[0.25, 0.022, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.083, 32]} />
          <meshBasicMaterial color="#00F0FF" opacity={0.25} transparent />
        </mesh>

        {/* Dynamic Optical Perception Scanning Plane */}
        <mesh
          ref={scanGroupRef}
          position={[0, 0.023, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.28, 0.88]} />
          <shaderMaterial
            ref={scanMatRef}
            {...ScanPlaneShader}
            transparent
            depthWrite={false}
          />
        </mesh>

        {/* Four Sturdy Industrial Table Legs */}
        <mesh position={[0.6, -0.2, 0.4]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.4, 16]} />
          <meshStandardMaterial color="#0D111A" metalness={0.8} />
        </mesh>
        <mesh position={[-0.6, -0.2, 0.4]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.4, 16]} />
          <meshStandardMaterial color="#0D111A" metalness={0.8} />
        </mesh>
        <mesh position={[0.6, -0.2, -0.4]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.4, 16]} />
          <meshStandardMaterial color="#0D111A" metalness={0.8} />
        </mesh>
        <mesh position={[-0.6, -0.2, -0.4]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.4, 16]} />
          <meshStandardMaterial color="#0D111A" metalness={0.8} />
        </mesh>
      </group>

      {/* Infinite Floor with Distance Depth Shader */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <shaderMaterial {...TechGridShader} transparent />
      </mesh>
    </group>
  );
};

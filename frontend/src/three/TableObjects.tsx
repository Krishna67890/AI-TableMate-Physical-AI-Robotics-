import React from 'react';
import { Html } from '@react-three/drei';
import { TableObjectState } from '../types/simulation';

interface TableObjectsProps {
  objects: TableObjectState[];
  selectedObjectId?: string | null;
  showBoundingBoxes?: boolean;
  onSelectObject?: (id: string) => void;
}

export const TableObjects: React.FC<TableObjectsProps> = ({
  objects,
  selectedObjectId,
  showBoundingBoxes = true,
  onSelectObject
}) => {
  return (
    <group>
      {objects.map((obj) => {
        const isSelected = selectedObjectId === obj.id;
        const isGrasped = obj.graspedBy !== null;

        return (
          <group
            key={obj.id}
            position={obj.position}
            rotation={obj.rotation}
            onClick={(e) => {
              e.stopPropagation();
              onSelectObject?.(obj.id);
            }}
          >
            {/* Object Geometry based on Category */}
            {obj.category === 'plate' && (
              <group>
                {/* Plate base */}
                <mesh castShadow receiveShadow>
                  <cylinderGeometry args={[0.09, 0.08, 0.012, 32]} />
                  <meshStandardMaterial
                    color={isSelected ? '#00F0FF' : '#E6ECF5'}
                    roughness={0.2}
                    metalness={0.1}
                  />
                </mesh>
                {/* Plate rim */}
                <mesh position={[0, 0.007, 0]} castShadow>
                  <torusGeometry args={[0.085, 0.005, 16, 32]} />
                  <meshStandardMaterial color="#D0D9E8" roughness={0.2} />
                </mesh>
              </group>
            )}

            {obj.category === 'cup' && (
              <group>
                {/* Mug Body */}
                <mesh position={[0, 0.035, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.032, 0.03, 0.07, 24]} />
                  <meshStandardMaterial
                    color={isSelected ? '#00F0FF' : '#00A3FF'}
                    roughness={0.3}
                    metalness={0.2}
                  />
                </mesh>
                {/* Mug Handle */}
                <mesh position={[0.038, 0.035, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                  <torusGeometry args={[0.02, 0.005, 12, 20, Math.PI]} />
                  <meshStandardMaterial color="#00A3FF" roughness={0.3} />
                </mesh>
              </group>
            )}

            {obj.category === 'cutlery' && (
              <group>
                {/* Fork or Spoon handle & head */}
                <mesh castShadow position={[0, 0.003, 0]}>
                  <boxGeometry args={[0.014, 0.004, 0.12]} />
                  <meshStandardMaterial
                    color={isSelected ? '#00F0FF' : '#CAD5E2'}
                    metalness={0.9}
                    roughness={0.1}
                  />
                </mesh>
                {/* Prongs / Head */}
                <mesh position={[0, 0.004, -0.05]} castShadow>
                  <boxGeometry args={[0.022, 0.004, 0.03]} />
                  <meshStandardMaterial
                    color={isSelected ? '#00F0FF' : '#DDE5ED'}
                    metalness={0.95}
                    roughness={0.1}
                  />
                </mesh>
              </group>
            )}

            {/* Holographic 3D Bounding Box */}
            {showBoundingBoxes && (
              <group position={[0, 0.02, 0]}>
                <mesh>
                  <boxGeometry
                    args={[
                      obj.category === 'plate' ? 0.2 : obj.category === 'cup' ? 0.1 : 0.06,
                      obj.category === 'plate' ? 0.04 : obj.category === 'cup' ? 0.1 : 0.03,
                      obj.category === 'plate' ? 0.2 : obj.category === 'cup' ? 0.1 : 0.15
                    ]}
                  />
                  <meshBasicMaterial
                    color={isSelected ? '#00FF88' : isGrasped ? '#FFB800' : '#00F0FF'}
                    wireframe
                    transparent
                    opacity={isSelected ? 0.9 : 0.35}
                  />
                </mesh>

                {/* Floating Telemetry Label */}
                {(isSelected || showBoundingBoxes) && (
                  <Html position={[0, 0.08, 0]} center distanceFactor={4}>
                    <div className="pointer-events-none select-none bg-graphite-900/90 border border-cyber-cyan/40 px-2 py-0.5 rounded text-[10px] font-mono shadow-lg whitespace-nowrap backdrop-blur-sm">
                      <div className="flex items-center gap-1.5 text-cyber-cyan font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping" />
                        {obj.name}
                      </div>
                      <div className="text-slate-300 text-[9px] flex gap-2">
                        <span>{(obj.confidence * 100).toFixed(1)}%</span>
                        <span className={obj.reachableLeft && obj.reachableRight ? 'text-cyber-green' : 'text-cyber-amber'}>
                          {obj.reachableLeft && obj.reachableRight ? 'BOTH REACHABLE' : obj.reachableLeft ? 'L-ARM REACH' : 'R-ARM REACH'}
                        </span>
                      </div>
                    </div>
                  </Html>
                )}
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
};

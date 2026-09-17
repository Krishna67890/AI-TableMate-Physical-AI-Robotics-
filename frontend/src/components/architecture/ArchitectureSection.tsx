import React, { useState } from 'react';
import { Layers, Network, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

interface ArchitectureNode {
  id: string;
  title: string;
  category: string;
  description: string;
  techStack: string;
  input: string;
  output: string;
}

const NODES: ArchitectureNode[] = [
  {
    id: 'voice_text',
    title: 'Voice & Text Ingestion',
    category: 'INPUT INTERFACE',
    description: 'Captures raw audio streams or natural text instructions. Features Speechmatics streaming transcription with low latency.',
    techStack: 'Speechmatics REST/WS + Web Speech API',
    input: 'Spoken command / User text',
    output: 'Normalized JSON string'
  },
  {
    id: 'vision_openvino',
    title: 'Perception & Pose Estimation',
    category: 'VISION SYSTEM',
    description: 'Overhead RGB-D camera feeds processed by OpenVINO quantized INT8 object detection model, extracting 3D oriented bounding boxes.',
    techStack: 'OpenVINO 2024 + YOLO-World INT8 on Intel NPU',
    input: '1280x720 RGB-D depth frames',
    output: '3D object poses [x, y, z, roll, pitch, yaw]'
  },
  {
    id: 'vla_reasoning',
    title: 'VLA Task Planner',
    category: 'REASONING CORE',
    description: 'Maps natural language goals onto spatial scene graphs. Decomposes high-level instructions into executable bimanual subgoals.',
    techStack: 'Vision-Language-Action Policy on Intel Arc iGPU',
    input: 'Instruction + Scene Graph',
    output: 'Directed Acyclic Graph (DAG) of subtasks'
  },
  {
    id: 'bimanual_coord',
    title: 'Bimanual Coordination & IK',
    category: 'ROBOTICS KINEMATICS',
    description: 'Allocates left vs right arm manipulation zones, executes collision avoidance corridors, and generates smooth joint trajectory waypoints.',
    techStack: 'Damped Least-Squares IK + Collision Corridors',
    input: 'Subgoals + Obstacle bounds',
    output: 'Synchronized joint angles q(t) [rad]'
  },
  {
    id: 'mujoco_physics',
    title: 'MuJoCo Simulation Engine',
    category: 'PHYSICS SIMULATOR',
    description: 'Simulates contact dynamics, frictional grasping, tendon/motor limits, and multi-body constraints with high fidelity.',
    techStack: 'MuJoCo 3.1 C-Bindings / Kinematic Fallback (60Hz)',
    input: 'Actuator torques / Joint target positions',
    output: 'Physics telemetry & contact forces [N]'
  },
  {
    id: 'verification_loop',
    title: 'Optical Verification & Recovery',
    category: 'CLOSED-LOOP FEEDBACK',
    description: 'Overhead vision inspects tabletop symmetry, object positions, and checks criteria before declaring task completion or triggering recovery.',
    techStack: 'Visual sanity check + Autonomous recovery loops',
    input: 'Final table state vs Target configuration',
    output: 'Verification Score (%) & Mission Report'
  }
];

export const ArchitectureSection: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode>(NODES[2]);

  return (
    <section className="bg-graphite-900 border border-white/10 rounded-2xl p-6 lg:p-8 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-2">
            <Network className="w-3.5 h-3.5" />
            <span>SYSTEM TOPOLOGY</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            End-to-End Physical AI Architecture
          </h2>
        </div>
        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          CLICK ANY NODE TO INSPECT SUBSYSTEM
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Pipeline Column */}
        <div className="lg:col-span-2 space-y-2.5">
          {NODES.map((node, idx) => {
            const isSelected = selectedNode.id === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between font-mono ${
                  isSelected
                    ? 'bg-cyber-cyan/10 border-cyber-cyan text-white shadow-lg'
                    : 'bg-graphite-950 border-white/5 hover:border-white/20 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-cyber-cyan text-graphite-950' : 'bg-graphite-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-[10px] text-cyber-cyan uppercase font-bold">{node.category}</div>
                    <div className="text-sm font-bold text-white">{node.title}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="hidden sm:inline-block text-[11px] bg-graphite-900 px-2 py-0.5 rounded border border-white/5">
                    {node.techStack.split('+')[0]}
                  </span>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-cyber-cyan' : 'text-slate-600'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Node Detail Inspector Panel */}
        <div className="bg-graphite-950 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-cyber-cyan font-bold mb-1">
              SUBSYSTEM SPECIFICATION // NODE {NODES.findIndex((n) => n.id === selectedNode.id) + 1}
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              {selectedNode.title}
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
              {selectedNode.description}
            </p>

            <div className="space-y-3 font-mono text-xs border-t border-white/5 pt-4">
              <div>
                <span className="text-slate-500 block text-[10px]">IMPLEMENTATION STACK:</span>
                <span className="text-cyber-cyan font-semibold">{selectedNode.techStack}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">SUBSYSTEM INPUT:</span>
                <span className="text-slate-200">{selectedNode.input}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">SUBSYSTEM OUTPUT:</span>
                <span className="text-cyber-green font-semibold">{selectedNode.output}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-cyber-green">
            <CheckCircle2 className="w-4 h-4" />
            <span>INTEGRATED IN COMPETITION RUNTIME</span>
          </div>
        </div>
      </div>
    </section>
  );
};

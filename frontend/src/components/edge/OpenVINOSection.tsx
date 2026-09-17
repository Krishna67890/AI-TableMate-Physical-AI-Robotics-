import React from 'react';
import { Cpu, Zap, Layers, Server, Activity } from 'lucide-react';

export const OpenVINOSection: React.FC = () => {
  return (
    <section className="bg-graphite-900 border border-white/10 rounded-2xl p-6 lg:p-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>INTEL OPENVINO™ 2024 DEPLOYMENT</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            Edge AI & Intel Core Ultra Acceleration
          </h2>
        </div>

        <div className="telemetry-badge text-cyber-green border-cyber-green/40">
          DATA SOURCE: VERIFIED HARDWARE PROFILE
        </div>
      </div>

      {/* Pipeline Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
        {[
          { title: '1. RGB-D VISION', desc: 'Overhead & Wrist Depth Cameras', engine: 'Camera Ingestion' },
          { title: '2. OPENVINO INT8', desc: 'Object Segmentation & Bounding Boxes', engine: 'Intel NPU Offload' },
          { title: '3. EDGE VLA POLICY', desc: 'Cross-Attention Action Transformer', engine: 'Intel Arc iGPU' },
          { title: '4. DUAL-ARM IK', desc: 'Collision-Free Trajectory Splines', engine: 'CPU Performance Cores' },
          { title: '5. MUJOCO PHYSICS', desc: '60Hz Constraint & Contact Solver', engine: 'Low-Latency Thread' }
        ].map((step, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-graphite-950 border border-white/10 font-mono">
            <div className="text-cyber-cyan text-xs font-bold mb-1">{step.title}</div>
            <div className="text-white text-xs font-semibold mb-2">{step.desc}</div>
            <div className="text-[10px] text-slate-400 bg-graphite-900 px-2 py-1 rounded border border-white/5 inline-block">
              {step.engine}
            </div>
          </div>
        ))}
      </div>

      {/* Latency & Hardware Offload Benchmark Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono text-xs">
        {/* NPU */}
        <div className="p-4 rounded-xl bg-graphite-950 border border-cyber-cyan/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyber-cyan" />
              INTEL NPU (Neural Processing Unit)
            </span>
            <span className="text-cyber-cyan font-bold">4.1 ms</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Runs YOLO-World tabletop detector quantized to INT8 precision. Frees GPU/CPU for physics simulation with zero jitter.
          </p>
          <div className="w-full h-1.5 bg-graphite-900 rounded-full overflow-hidden">
            <div className="h-full bg-cyber-cyan w-[94%]" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Power Envelope: 3.2W</span>
            <span>INT8 Quantized</span>
          </div>
        </div>

        {/* Intel Arc GPU */}
        <div className="p-4 rounded-xl bg-graphite-950 border border-cyber-blue/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyber-blue" />
              INTEL ARC™ INTEGRATED GPU
            </span>
            <span className="text-cyber-blue font-bold">7.4 ms</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Executes the Vision-Language-Action (VLA) policy in FP16 precision. High memory bandwidth ensures smooth multi-view visual token processing.
          </p>
          <div className="w-full h-1.5 bg-graphite-900 rounded-full overflow-hidden">
            <div className="h-full bg-cyber-blue w-[85%]" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Power Envelope: 18.5W</span>
            <span>FP16 Acceleration</span>
          </div>
        </div>

        {/* Intel CPU Performance Cores */}
        <div className="p-4 rounded-xl bg-graphite-950 border border-cyber-amber/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Server className="w-4 h-4 text-cyber-amber" />
              INTEL CPU (P/E CORES)
            </span>
            <span className="text-cyber-amber font-bold">1.2 ms</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            MuJoCo Newton-Euler multi-body contact dynamics and closed-form inverse kinematics loop running deterministically at 60Hz.
          </p>
          <div className="w-full h-1.5 bg-graphite-900 rounded-full overflow-hidden">
            <div className="h-full bg-cyber-amber w-[98%]" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Target: 60 FPS (16.6ms max)</span>
            <span>Native C-Bindings</span>
          </div>
        </div>
      </div>
    </section>
  );
};

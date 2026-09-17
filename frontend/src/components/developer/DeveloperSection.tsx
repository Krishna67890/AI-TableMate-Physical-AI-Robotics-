import React from 'react';
import { Code2, Cpu, Bot, Sparkles, CheckCircle2, Gamepad2, Smartphone, Terminal, Award, Users } from 'lucide-react';

export const DeveloperSection: React.FC = () => {
  return (
    <section className="bg-graphite-900 border border-white/10 rounded-2xl p-6 lg:p-8 shadow-xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyber-green/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>AI INFRA SUMMIT HACKATHON TEAM</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            Engineering & Research Team
          </h2>
        </div>

        <div className="telemetry-badge text-cyber-green border-cyber-green/40">
          INTEL BIMANUAL VLA ROBOTICS TRACK
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Member 1: Krishna Patil Rajput */}
        <div className="p-6 rounded-xl bg-graphite-950 border border-cyber-cyan/30 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyber-cyan/15 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-5">
              {/* Profile Image */}
              <div className="relative group shrink-0">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan z-20" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan z-20" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan z-20" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan z-20" />

                <div className="w-36 h-44 rounded-lg overflow-hidden border border-white/20 bg-graphite-900 shadow-md">
                  <img
                    src="/developer.jpg"
                    alt="Krishna Patil Rajput"
                    className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('devloper.jpg')) {
                        target.src = '/devloper.jpg';
                      }
                    }}
                  />
                </div>
              </div>

              {/* Title & Bio */}
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-[10px] font-mono">
                  <Sparkles className="w-3 h-3" />
                  LEAD CREATOR & ARCHITECT
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  Krishna Patil Rajput
                </h3>
                <p className="text-xs text-cyber-green font-mono">
                  Physical AI & Full-Stack Robotics Lead
                </p>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Architected the end-to-end cognitive loop unifying Speechmatics voice parsing, Intel OpenVINO VLA acceleration, 6-DOF dual SO-101 kinematics, and real-time 60Hz telemetry.
                </p>
              </div>
            </div>

            {/* Competency Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px] pt-2">
              <div className="p-2 rounded bg-graphite-900 border border-white/5 text-center">
                <Code2 className="w-3.5 h-3.5 text-cyber-cyan mx-auto mb-1" />
                <span className="text-white font-semibold block">Full-Stack</span>
              </div>
              <div className="p-2 rounded bg-graphite-900 border border-white/5 text-center">
                <Bot className="w-3.5 h-3.5 text-cyber-green mx-auto mb-1" />
                <span className="text-white font-semibold block">AI / Robotics</span>
              </div>
              <div className="p-2 rounded bg-graphite-900 border border-white/5 text-center">
                <Smartphone className="w-3.5 h-3.5 text-cyber-amber mx-auto mb-1" />
                <span className="text-white font-semibold block">Android Dev</span>
              </div>
              <div className="p-2 rounded bg-graphite-900 border border-white/5 text-center">
                <Gamepad2 className="w-3.5 h-3.5 text-cyber-blue mx-auto mb-1" />
                <span className="text-white font-semibold block">Game Dev</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5 text-cyber-green">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Core Architecture & Backend
            </span>
            <span className="text-slate-500">System Integration</span>
          </div>
        </div>

        {/* Member 2: Yash Marathe */}
        <div className="p-6 rounded-xl bg-graphite-950 border border-cyber-amber/30 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyber-amber/15 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-5">
              {/* Profile Image */}
              <div className="relative group shrink-0">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyber-amber z-20" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyber-amber z-20" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyber-amber z-20" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyber-amber z-20" />

                <div className="w-36 h-44 rounded-lg overflow-hidden border border-white/20 bg-graphite-900 shadow-md">
                  <img
                    src="/yash_marathe_boy.png"
                    alt="Yash Marathe"
                    className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('boy.png')) {
                        target.src = '/boy.png';
                      }
                    }}
                  />
                </div>
              </div>

              {/* Title & Bio */}
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyber-amber/10 border border-cyber-amber/30 text-cyber-amber text-[10px] font-mono">
                  <Cpu className="w-3 h-3" />
                  ROBOTICS SIMULATION & AI
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  Yash Marathe
                </h3>
                <p className="text-xs text-cyber-amber font-mono">
                  Simulation & Physical AI Researcher
                </p>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Spearheaded the physical modeling in MuJoCo, tabletop collision dynamics, mesh collision geometries, and bimanual cooperative task allocation benchmarks.
                </p>
              </div>
            </div>

            {/* Competency Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px] pt-2">
              <div className="p-2 rounded bg-graphite-900 border border-white/5 text-center">
                <Cpu className="w-3.5 h-3.5 text-cyber-amber mx-auto mb-1" />
                <span className="text-white font-semibold block">MuJoCo XML</span>
              </div>
              <div className="p-2 rounded bg-graphite-900 border border-white/5 text-center">
                <Bot className="w-3.5 h-3.5 text-cyber-green mx-auto mb-1" />
                <span className="text-white font-semibold block">Simulation</span>
              </div>
              <div className="p-2 rounded bg-graphite-900 border border-white/5 text-center">
                <Terminal className="w-3.5 h-3.5 text-cyber-cyan mx-auto mb-1" />
                <span className="text-white font-semibold block">Trajectory</span>
              </div>
              <div className="p-2 rounded bg-graphite-900 border border-white/5 text-center">
                <Award className="w-3.5 h-3.5 text-cyber-purple mx-auto mb-1" />
                <span className="text-white font-semibold block">Verification</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5 text-cyber-green">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Physics Modeling & Affordance
            </span>
            <span className="text-slate-500">Tabletop Simulation</span>
          </div>
        </div>

      </div>

      {/* Hackathon Readiness Badge */}
      <div className="mt-6 p-3 rounded-lg bg-graphite-950 border border-cyber-cyan/30 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-slate-300">
        <span className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyber-cyan" />
          AI Infra Summit Hackathon — Physical AI & Bimanual Robotics Platform
        </span>
        <span className="text-cyber-green font-bold text-[11px]">
          100% OPERATIONAL & BENCHMARKED
        </span>
      </div>
    </section>
  );
};

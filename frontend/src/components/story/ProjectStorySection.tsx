import React from 'react';
import { ArrowDown, Bot, Sparkles, XCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export const ProjectStorySection: React.FC = () => {
  return (
    <section className="bg-graphite-900 border border-white/10 rounded-2xl p-6 lg:p-10 shadow-xl">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PARADIGM SHIFT IN ROBOTICS</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-3">
          From Rigid Scripts to Physical AI
        </h2>
        <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
          Traditional robotics depends on hard-coded waypoints and brittle button clicks. AI TableMate introduces an end-to-end cognitive manipulation loop.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Traditional Interface Card */}
        <div className="p-6 rounded-xl bg-graphite-950 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <span className="font-mono text-xs text-cyber-red font-bold flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                TRADITIONAL ROBOT INTERFACE
              </span>
              <span className="telemetry-badge text-slate-500">LEGACY SYSTEM</span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 rounded bg-graphite-900 border border-white/5 text-slate-300">
                <strong>1. Human Operator</strong> clicks pre-programmed button.
              </div>
              <div className="flex justify-center text-slate-600">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div className="p-3 rounded bg-graphite-900 border border-white/5 text-slate-400">
                <strong>2. Hardcoded Script</strong> executes rigid trajectory blindly.
              </div>
              <div className="flex justify-center text-slate-600">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div className="p-3 rounded bg-graphite-900 border border-white/5 text-cyber-red">
                <strong>3. Collision or Failure</strong> if tabletop objects shifted even 5mm. Zero recovery.
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-slate-500">
            Limitation: Incapable of understanding language, unstructured environments, or autonomous recovery.
          </div>
        </div>

        {/* AI TableMate Physical AI Pipeline Card */}
        <div className="p-6 rounded-xl bg-graphite-950 border border-cyber-cyan/40 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyber-cyan/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <span className="font-mono text-xs text-cyber-cyan font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyber-green" />
                AI TABLEMATE PHYSICAL AI
              </span>
              <span className="telemetry-badge text-cyber-cyan border-cyber-cyan/30">VLA COGNITIVE LOOP</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {[
                { title: 'Human Language', desc: 'Spoken voice or natural text instructions' },
                { title: 'AI Understanding', desc: 'Intent decoding and semantic grounding' },
                { title: 'Vision', desc: 'RGB-D detection and 3D pose estimation' },
                { title: 'Task Planning', desc: 'Decomposes goals into coordinated subtasks' },
                { title: 'Bimanual Coordination', desc: 'Dynamic workspace allocation & IK solver' },
                { title: 'Robot Execution', desc: 'MuJoCo physics with contact dynamics' },
                { title: 'Verification', desc: 'Optical closed-loop check & symmetry validation' }
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded bg-graphite-900/80 border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-cyber-cyan/20 text-cyber-cyan text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-white font-semibold">{step.title}</span>
                  <span className="text-slate-500 text-[10px] ml-auto hidden sm:inline">{step.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-cyber-green flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Robust, adaptive, and fully autonomous in dynamic table arrangements.</span>
          </div>
        </div>

      </div>
    </section>
  );
};

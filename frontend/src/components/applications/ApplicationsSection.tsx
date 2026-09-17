import React from 'react';
import { Briefcase, Utensils, HeartHandshake, Microscope, Factory, GraduationCap, Users } from 'lucide-react';

const APPLICATIONS = [
  {
    title: 'Automated Table Preparation',
    icon: Utensils,
    desc: 'Autonomous fine dining and banquet setting with millimeter-accurate plate, cutlery, and glassware placement.',
    feasibility: 'Near-Term Commercial'
  },
  {
    title: 'Assisted Dining Environments',
    icon: HeartHandshake,
    desc: 'Adaptive table arrangement and robotic meal assistance for care facilities, elderly living, and rehabilitation centers.',
    feasibility: 'High Societal Impact'
  },
  {
    title: 'Smart Hospitality & Catering',
    icon: Briefcase,
    desc: 'Rapid table turnaround, hygienic place resetting, and synchronized meal preparation in high-volume hospitality venues.',
    feasibility: 'Commercial Pilot Ready'
  },
  {
    title: 'Research Robotics & VLA Benchmarks',
    icon: Microscope,
    desc: 'Standardized bimanual manipulation testbed for training vision-language-action policies, reinforcement learning, and sim-to-real transfer.',
    feasibility: 'Academic & Industry Labs'
  },
  {
    title: 'Flexible Industrial Manipulation',
    icon: Factory,
    desc: 'Dual-arm kitting, packaging, and precision light-assembly without needing custom hard fixtures or rigid jigs.',
    feasibility: 'Manufacturing Edge'
  },
  {
    title: 'Education & HRI Research',
    icon: GraduationCap,
    desc: 'Open-hardware SO-101 platform for teaching physical AI, kinematics solvers, contact dynamics, and human-robot interaction.',
    feasibility: 'Curriculum & University'
  }
];

export const ApplicationsSection: React.FC = () => {
  return (
    <section className="bg-graphite-900 border border-white/10 rounded-2xl p-6 lg:p-10 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>COMMERCIAL & RESEARCH HORIZONS</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            Potential Real-World Applications
          </h2>
        </div>

        <div className="telemetry-badge text-slate-400">
          CLEARLY LABELED POTENTIAL APPLICATIONS
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {APPLICATIONS.map((app, idx) => {
          const Icon = app.icon;

          return (
            <div
              key={idx}
              className="p-5 rounded-xl bg-graphite-950 border border-white/5 hover:border-cyber-cyan/30 transition-all font-mono group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-500 bg-graphite-900 px-2 py-0.5 rounded border border-white/5">
                  {app.feasibility}
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-white mb-2">
                {app.title}
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {app.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Play, ArrowDown, Activity, Eye, Brain, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onLaunchSimulation: () => void;
  onScrollToDetails: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunchSimulation,
  onScrollToDetails
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineWordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-brand-tag',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.1 }
      )
      .fromTo(
        '.hero-title',
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.9 },
        '-=0.4'
      )
      .fromTo(
        headlineWordsRef.current,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.15 },
        '-=0.5'
      )
      .fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.3'
      )
      .fromTo(
        '.hero-indicators',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4'
      )
      .fromTo(
        '.hero-ctas',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.3'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addWordRef = (el: HTMLSpanElement | null) => {
    if (el && !headlineWordsRef.current.includes(el)) {
      headlineWordsRef.current.push(el);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-4 pt-28 pb-16 overflow-hidden bg-radial-glow"
    >
      {/* Background Decorative Tech Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-35 pointer-events-none" />

      {/* Target Track Identification */}
      <div className="hero-brand-tag inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-graphite-800/90 border border-cyber-cyan/30 text-xs font-mono text-cyber-cyan mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
        <span>INTEL ONLINE BIMANUAL VLA MANIPULATION TRACK // AI INFRA SUMMIT</span>
      </div>

      {/* Product Title */}
      <h1 className="hero-title font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tight text-white mb-3">
        AI TABLEMATE
      </h1>

      {/* Subtitle requested: FROM LANGUAGE TO COORDINATED ACTION */}
      <h2 className="hero-subtitle font-display font-bold text-xl sm:text-2xl md:text-3xl text-cyber-cyan tracking-wider uppercase mb-6">
        FROM LANGUAGE TO COORDINATED ACTION
      </h2>

      {/* Narrative Sequence: SEE. REASON. ACT. VERIFY. */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono font-bold text-xl sm:text-3xl md:text-4xl text-slate-100 mb-6">
        <span ref={addWordRef} className="text-cyber-cyan">SEE.</span>
        <span ref={addWordRef} className="text-cyber-blue">REASON.</span>
        <span ref={addWordRef} className="text-cyber-amber">ACT.</span>
        <span ref={addWordRef} className="text-cyber-green">VERIFY.</span>
      </div>

      {/* Supporting Statement */}
      <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 font-normal leading-relaxed mb-8">
        An intelligent bimanual Physical AI system that perceives tabletop environments, reasons over natural speech, generates coordinated collision-free trajectories, and executes inside high-fidelity MuJoCo physics.
      </p>

      {/* Live System Indicators: AI ONLINE, VISION READY, VLA READY, DUAL ARM READY */}
      <div className="hero-indicators flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-10 max-w-4xl font-mono text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-graphite-900 border border-white/10 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-cyber-green" />
          <span>AI ONLINE</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-graphite-900 border border-white/10 text-slate-300">
          <Eye className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>VISION READY</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-graphite-900 border border-white/10 text-slate-300">
          <Brain className="w-3.5 h-3.5 text-cyber-amber" />
          <span>VLA READY</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-graphite-900 border border-white/10 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyber-green" />
          <span>DUAL ARM READY</span>
        </div>
      </div>

      {/* Primary and Secondary CTA Buttons */}
      <div className="hero-ctas flex flex-wrap items-center justify-center gap-4 z-10">
        <button
          onClick={onLaunchSimulation}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-cyber-cyan text-graphite-950 font-display font-bold text-sm tracking-wider hover:bg-cyan-300 transition-all shadow-lg hover:shadow-cyber-cyan/30 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>LAUNCH SIMULATION</span>
        </button>

        <button
          onClick={onScrollToDetails}
          className="flex items-center gap-2 px-6 py-3.5 rounded-lg bg-graphite-900 hover:bg-graphite-800 text-white border border-white/20 font-display font-semibold text-sm tracking-wide transition-all cursor-pointer"
        >
          <ArrowDown className="w-4 h-4" />
          <span>EXPLORE THE SYSTEM</span>
        </button>
      </div>
    </section>
  );
};

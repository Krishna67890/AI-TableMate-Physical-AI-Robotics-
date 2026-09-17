import React, { useState, useRef } from 'react';
import { Navbar } from './components/navbar/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { ProjectStorySection } from './components/story/ProjectStorySection';
import { CommandCenter } from './components/command/CommandCenter';
import { VisionOverlay } from './components/vision/VisionOverlay';
import { ArmTelemetry } from './components/telemetry/ArmTelemetry';
import { TaskTimeline } from './components/timeline/TaskTimeline';
import { SimulationViewport } from './components/simulation/SimulationViewport';
import { OpenVINOSection } from './components/edge/OpenVINOSection';
import { ArchitectureSection } from './components/architecture/ArchitectureSection';
import { ApplicationsSection } from './components/applications/ApplicationsSection';
import { DeveloperSection } from './components/developer/DeveloperSection';
import { RecoveryAlert } from './components/failure/RecoveryAlert';
import { MissionReplayModal } from './components/replay/MissionReplayModal';
import { JudgeModeModal } from './components/judge/JudgeModeModal';
import { useRobotSimulation } from './hooks/useRobotSimulation';
import { Bot, Sparkles } from 'lucide-react';

export function App() {
  const [isJudgeModeOpen, setIsJudgeModeOpen] = useState(false);
  const [isReplayModalOpen, setIsReplayModalOpen] = useState(false);

  const simulationRef = useRef<HTMLDivElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);

  const sim = useRobotSimulation();

  // Trigger Replay modal upon mission completion
  React.useEffect(() => {
    if (sim.stage === 'MISSION_COMPLETE') {
      setIsReplayModalOpen(true);
    }
  }, [sim.stage]);

  const scrollToSimulation = () => {
    simulationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCommand = () => {
    commandRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLaunchJudgeDemo = () => {
    setIsJudgeModeOpen(false);
    sim.executeCommand('Set the table for two people with plates, cups, and cutlery.');
    scrollToSimulation();
  };

  return (
    <div className="min-h-screen bg-graphite-950 text-slate-100 flex flex-col selection:bg-cyber-cyan/30 selection:text-cyber-cyan">
      {/* 1. Global Navigation Bar */}
      <Navbar
        connectionStatus={sim.connectionStatus}
        backendEngine={sim.backendEngineName}
        onOpenJudgeMode={() => setIsJudgeModeOpen(true)}
        onLaunchDemo={handleLaunchJudgeDemo}
      />

      {/* 2. Cinematic Hero Section */}
      <HeroSection
        onLaunchSimulation={scrollToSimulation}
        onScrollToDetails={scrollToCommand}
      />

      {/* Main Interactive Control & Simulation Hub */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-12 w-full">
        
        {/* SECTION 3: Live MuJoCo / Kinematics Simulation Viewport */}
        <section ref={simulationRef} className="scroll-mt-20">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyber-cyan" />
              <span className="font-bold text-white uppercase tracking-wider text-sm">
                PHYSICAL AI WORKSPACE // DUAL SO-101 BIMANUAL SIMULATION
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              <span className="telemetry-badge text-cyber-green border-cyber-green/30">
                {sim.controlMode === 'AI_AUTONOMOUS' ? 'MODE: AI AUTONOMOUS' : 'MODE: MANUAL JOG'}
              </span>
              <span>DRAG TO ORBIT // SCROLL TO ZOOM</span>
            </div>
          </div>

          <SimulationViewport
            isPlaying={sim.isPlaying}
            onTogglePlay={() => sim.setIsPlaying(!sim.isPlaying)}
            speedMultiplier={sim.speedMultiplier}
            onChangeSpeed={sim.setSpeedMultiplier}
            onReset={sim.resetSimulation}
            cameraPreset={sim.cameraPreset}
            onChangeCameraPreset={sim.setCameraPreset}
            showBoundingBoxes={sim.showBoundingBoxes}
            onToggleBoundingBoxes={() => sim.setShowBoundingBoxes(!sim.showBoundingBoxes)}
            controlMode={sim.controlMode}
            onToggleControlMode={sim.setControlMode}
            leftJoints={sim.leftJoints}
            setLeftJoints={sim.setLeftJoints}
            rightJoints={sim.rightJoints}
            setRightJoints={sim.setRightJoints}
            leftAction={sim.leftAction}
            rightAction={sim.rightAction}
            isLeftGripping={sim.isLeftGripping}
            isRightGripping={sim.isRightGripping}
            objects={sim.objects}
            selectedObjectId={sim.selectedObjectId}
            onSelectObject={sim.setSelectedObjectId}
            stage={sim.stage}
            metrics={sim.metrics}
            isBackendConnected={sim.connectionStatus === 'CONNECTED'}
            backendEngineName={sim.backendEngineName}
          />
        </section>

        {/* SECTION 4: Natural Language & Voice Command Center */}
        <section ref={commandRef} className="scroll-mt-20">
          <CommandCenter
            stage={sim.stage}
            currentPrompt={sim.currentPrompt}
            onExecutePrompt={sim.executeCommand}
            metrics={sim.metrics}
          />
        </section>

        {/* SECTION 5: Project Story (Traditional vs AI TableMate Cognitive Pipeline) */}
        <section>
          <ProjectStorySection />
        </section>

        {/* SECTION 6 & 7: Perception Overlay + Dual Arm Telemetry */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <VisionOverlay
              objects={sim.objects}
              selectedObjectId={sim.selectedObjectId}
              onSelectObject={sim.setSelectedObjectId}
              showBoundingBoxes={sim.showBoundingBoxes}
              onToggleBoundingBoxes={() => sim.setShowBoundingBoxes(!sim.showBoundingBoxes)}
            />
          </div>

          <div className="lg:col-span-2 flex flex-col justify-between">
            <ArmTelemetry
              leftJoints={sim.leftJoints}
              rightJoints={sim.rightJoints}
              leftAction={sim.leftAction}
              rightAction={sim.rightAction}
              leftProgress={sim.leftProgress}
              rightProgress={sim.rightProgress}
              isLeftGripping={sim.isLeftGripping}
              isRightGripping={sim.isRightGripping}
            />

            <div className="mt-4 p-3.5 rounded-xl bg-graphite-900 border border-white/10 font-mono text-xs flex items-center justify-between">
              <span className="text-slate-400">
                Inverse Kinematics: <strong className="text-white">Damped Least Squares (DLS)</strong> with joint acceleration limits
              </span>
              <span className="text-cyber-cyan font-bold">
                6-DOF PER ARM
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 8: AI Execution Timeline & Subgoal Tree */}
        <section>
          <TaskTimeline
            stage={sim.stage}
            subgoals={sim.taskSubgoals}
            currentStepIndex={sim.currentStepIndex}
          />
        </section>

        {/* SECTION 9: Edge AI / Intel OpenVINO Performance Profiling */}
        <section>
          <OpenVINOSection />
        </section>

        {/* SECTION 10: End-to-End System Architecture Diagram */}
        <section>
          <ArchitectureSection />
        </section>

        {/* SECTION 11: Potential Real-World Business Applications */}
        <section>
          <ApplicationsSection />
        </section>

        {/* SECTION 12: Developer Showcase (BUILT BY KRISHNA PATIL RAJPUT) */}
        <section>
          <DeveloperSection />
        </section>

      </main>

      {/* Floating Recovery Alert if visual occlusion occurs */}
      <RecoveryAlert
        recoveryEvent={sim.recoveryEvent}
        onDismiss={() => {}}
      />

      {/* Mission Complete & Replay Modal */}
      <MissionReplayModal
        isOpen={isReplayModalOpen}
        onClose={() => setIsReplayModalOpen(false)}
        onReplay={() => {
          sim.resetSimulation();
          setTimeout(() => {
            sim.executeCommand(sim.currentPrompt);
            scrollToSimulation();
          }, 300);
        }}
        currentPrompt={sim.currentPrompt}
        metrics={sim.metrics}
      />

      {/* Judge Mode Inspector Modal */}
      <JudgeModeModal
        isOpen={isJudgeModeOpen}
        onClose={() => setIsJudgeModeOpen(false)}
        onRunJudgeDemo={handleLaunchJudgeDemo}
      />

      {/* Technical Footer */}
      <footer className="mt-auto border-t border-white/10 bg-graphite-950 py-8 px-4 font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyber-green" />
            <span className="text-slate-300 font-semibold">AI TABLEMATE</span>
            <span>// INTEL ONLINE BIMANUAL VLA MANIPULATION TRACK</span>
          </div>
          <div>
            FastAPI · MuJoCo · OpenVINO · React Three Fiber · GSAP · Speechmatics
          </div>
        </div>
      </footer>
    </div>
  );
}

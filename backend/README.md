# AI TableMate — Physical AI Backend

High-performance Python/FastAPI backend powering the **AI TableMate** bimanual manipulation platform for the **AI Infra Summit Hackathon (Intel Online Track)**.

## Architecture

```text
HUMAN
  ↓ (Voice / Text)
SPEECHMATICS & COMMAND PARSER (`app/ai/command_parser.py`, `app/voice/`)
  ↓ (Semantic Tokens & Constraints)
VISION ENGINE (`app/vision/vision_engine.py`)
  ↓ (3D Spatial Poses & Occlusion Checks)
TASK PLANNER (`app/ai/task_planner.py`, `app/ai/scene_reasoner.py`)
  ↓ (Hierarchical Subgoals & Arm Allocation)
BIMANUAL COORDINATION & TRAJECTORY (`app/robotics/`)
  ↓ (Minimum-Jerk Splines & Collision Envelopes)
MUJOCO & KINEMATICS ENGINE (`app/simulation/`)
  ↓ (60Hz Physics Step & Joint FK/IK)
VERIFICATION & TELEMETRY STREAM (`app/api/telemetry.py`)
```

## Subsystems

| Module | Location | Description |
|---|---|---|
| **API Endpoints** | `app/api/` | REST (`/api/command`, `/api/simulation/*`, `/health`) + WebSockets (`/ws/telemetry`, `/ws/mission`) |
| **Command Parser** | `app/ai/command_parser.py` | Extracts intent, target dining entities, spatial constraints |
| **Task Planner** | `app/ai/task_planner.py` | Hierarchical VLA task decomposition and subgoal tree |
| **Scene Reasoner** | `app/ai/scene_reasoner.py` | 3D workspace zones, bilateral symmetry, reachability |
| **Dual Arm Controller** | `app/robotics/arm_controller.py` | 6-DOF SO-101 manipulator FK/IK control with DLS solver |
| **Trajectory Generator** | `app/robotics/trajectory.py` | Quintic polynomial minimum-jerk trajectory interpolation |
| **Bimanual Coordination** | `app/robotics/coordination.py` | Mutual collision clearance envelope & dual-arm sync |
| **Vision Engine** | `app/vision/vision_engine.py` | Simulated RGB-D tabletop perception & occlusion detection |
| **Simulation Adapters** | `app/simulation/` | Native MuJoCo XML loader with fallback to 60Hz Demo Adapter |
| **OpenVINO Adapter** | `app/inference/` | Intel OpenVINO runtime benchmarking (NPU / Arc iGPU / CPU) |
| **Speechmatics Adapter** | `app/voice/` | Real-time voice transcription with hackathon demo fallback |
| **Mission Manager** | `app/services/mission_manager.py` | Finite state machine tracking manipulation lifecycle |
| **Telemetry Manager** | `app/services/telemetry_manager.py` | Multi-client WebSocket broadcaster |

## Quick Start

### 1. Requirements
- Python 3.10+
- Dependencies installed via `pip install -r requirements.txt`

### 2. Run Server
```bash
# Using start.bat (Windows)
start.bat

# Or directly using uvicorn
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. API & Telemetry Endpoints
- **API Root**: `http://localhost:8000`
- **Swagger Documentation**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`
- **System Telemetry**: `http://localhost:8000/api/system/status`
- **Command Dispatch**: `POST http://localhost:8000/api/command`
- **60Hz Telemetry Stream**: `ws://localhost:8000/ws/telemetry`
- **Mission Lifecycle Stream**: `ws://localhost:8000/ws/mission`

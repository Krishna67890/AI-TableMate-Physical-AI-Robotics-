from fastapi import APIRouter
from ..simulation.mujoco_adapter import simulation_engine
from ..services.mission_manager import mission_manager

simulation_router = APIRouter(prefix="/api/simulation", tags=["Simulation Control"])

@simulation_router.post("/start")
def start_simulation():
    simulation_engine.resume()
    mission_manager.set_stage("EXECUTING", "Simulation resumed")
    return {
        "status": "SIMULATION_STARTED",
        "engine": simulation_engine.mode,
        "telemetry": simulation_engine.step()
    }

@simulation_router.post("/pause")
def pause_simulation():
    simulation_engine.pause()
    mission_manager.set_stage("PAUSED", "Simulation paused by operator")
    return {
        "status": "SIMULATION_PAUSED",
        "engine": simulation_engine.mode
    }

@simulation_router.post("/reset")
def reset_simulation():
    telemetry = simulation_engine.reset()
    mission_manager.set_stage("IDLE", "Simulation reset to initial table state")
    return {
        "status": "SIMULATION_RESET",
        "engine": simulation_engine.mode,
        "telemetry": telemetry
    }

@simulation_router.post("/step")
def step_simulation():
    return simulation_engine.step()

@simulation_router.post("/replay")
def replay_simulation():
    simulation_engine.reset()
    simulation_engine.resume()
    mission_manager.set_stage("EXECUTING", "Replaying completed mission trajectory")
    return {
        "status": "SIMULATION_REPLAY_STARTED",
        "engine": simulation_engine.mode
    }

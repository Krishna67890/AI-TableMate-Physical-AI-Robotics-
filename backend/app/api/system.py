from fastapi import APIRouter
from ..core.config import settings
from ..core.capabilities import system_capabilities
from ..simulation.mujoco_adapter import simulation_engine
from ..inference.openvino_adapter import openvino_adapter
from ..voice.speechmatics_adapter import speechmatics_adapter

system_router = APIRouter(tags=["System & Health"])

@system_router.get("/")
def read_root():
    return {
        "status": "AI_TABLEMATE_BACKEND_ONLINE",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "mode": simulation_engine.mode,
        "docs": "/docs",
        "health": "/health",
        "telemetry_ws": "/ws/telemetry"
    }

@system_router.get("/health")
def health_check():
    """Health endpoint used by frontend to verify live backend status."""
    return {
        "status": "ok",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "engine": simulation_engine.mode
    }

@system_router.get("/api/system/status")
def system_status():
    """Returns comprehensive system telemetry for frontend and judges."""
    return {
        "status": "ONLINE",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "simulation": simulation_engine.get_status(),
        "openvino": openvino_adapter.get_info(),
        "speechmatics": speechmatics_adapter.get_status(),
        "hardware": settings.TARGET_HARDWARE,
        "kinematics_solver": settings.KINEMATICS_SOLVER,
        "robot_dof": settings.ROBOT_DOF
    }

@system_router.get("/api/capabilities")
def get_capabilities():
    """Returns hardware acceleration and software features report."""
    return system_capabilities.get_capabilities()

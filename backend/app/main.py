from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.commands import commands_router
from .api.simulation import simulation_router
from .api.telemetry import telemetry_router
from .api.system import system_router
from .simulation.mujoco_adapter import simulation_engine
from .inference.openvino_adapter import openvino_adapter

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Professional startup banner for judges & developers
    banner = f"""
========================================================================
       AI TABLEMATE — PHYSICAL AI & BIMANUAL ROBOTICS PLATFORM          
========================================================================
API Server:          http://localhost:{settings.PORT}
Swagger Docs:        http://localhost:{settings.PORT}/docs
WebSocket Telemetry: ws://localhost:{settings.PORT}/ws/telemetry
Simulation Engine:   {simulation_engine.mode}
Target Hardware:     {settings.TARGET_HARDWARE}
OpenVINO Status:     {openvino_adapter.status}
Kinematics:          {settings.KINEMATICS_SOLVER} (6-DOF per arm)
========================================================================
"""
    print(banner.strip())
    yield
    print("[AI TableMate Backend] Shutting down cleanly.")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Physical AI & Bimanual VLA Manipulation Backend for Intel Hackathon Track",
    lifespan=lifespan
)

# Enable CORS for Vite frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount modular routers
app.include_router(system_router)
app.include_router(commands_router)
app.include_router(simulation_router)
app.include_router(telemetry_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)

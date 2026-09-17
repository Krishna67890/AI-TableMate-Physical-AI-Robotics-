import os
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "AI TableMate Physical AI Platform"
    VERSION: str = "1.2.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    SPEECHMATICS_API_KEY: str = os.getenv("SPEECHMATICS_API_KEY", "")
    SIMULATION_FPS: int = 60
    TARGET_HARDWARE: str = os.getenv("TARGET_HARDWARE", "Intel Core Ultra (NPU / Arc iGPU / CPU)")
    OPENVINO_DEVICE: str = os.getenv("OPENVINO_DEVICE", "AUTO")
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    CONTROL_FREQUENCY_HZ: float = 60.0
    KINEMATICS_SOLVER: str = "Damped Least Squares (DLS)"
    ROBOT_DOF: int = 6
    DUAL_ARM_MODEL: str = "SO-101 Open Source 6-DOF Manipulator"

settings = Settings()

import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "AI TableMate Backend"
    VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    SPEECHMATICS_API_KEY: str = os.getenv("SPEECHMATICS_API_KEY", "")
    SIMULATION_FPS: int = 60
    TARGET_HARDWARE: str = os.getenv("TARGET_HARDWARE", "Intel Core Ultra (NPU/iGPU/CPU)")
    OPENVINO_DEVICE: str = os.getenv("OPENVINO_DEVICE", "AUTO")

settings = Settings()

import sys
from typing import Dict, Any

class OpenVINOAdapter:
    """Detects and wraps Intel OpenVINO runtime without crashing if uninstalled."""
    def __init__(self):
        self.is_available = False
        self.device = "NOT CONNECTED"
        self.devices_available = []
        self.model = "YOLO-World-Tabletop-INT8"
        self.status = "NOT CONNECTED"

        try:
            import openvino as ov
            core = ov.Core()
            self.devices_available = core.available_devices
            self.device = self.devices_available[0] if self.devices_available else "CPU"
            self.is_available = True
            self.status = f"ONLINE ({self.device})"
        except Exception:
            self.status = "NOT CONNECTED"

    def get_info(self) -> Dict[str, Any]:
        return {
            "available": self.is_available,
            "device": self.device,
            "available_devices": self.devices_available,
            "model": self.model if self.is_available else "None",
            "inference_status": self.status,
            "target_hardware": "Intel Core Ultra (NPU / Arc iGPU / CPU)"
        }

openvino_adapter = OpenVINOAdapter()

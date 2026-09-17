import os
import sys
from typing import Dict, Any
from .demo_adapter import DemoSimulationAdapter, demo_simulation_adapter

class MuJoCoAdapter:
    """
    MuJoCo Physics Simulation Adapter:
    Attempts to load native MuJoCo physics engine and bimanual table XML.
    Provides graceful zero-downtime fallback to DemoSimulationAdapter if MuJoCo native wheels are absent.
    """
    def __init__(self, xml_path: str = None):
        self.is_mujoco_available = False
        self.adapter = None
        self.mode = "DEMO_SIMULATION_ADAPTER"
        self.xml_path = xml_path

        try:
            import mujoco
            if xml_path and os.path.exists(xml_path):
                self.model = mujoco.MjModel.from_xml_path(xml_path)
                self.data = mujoco.MjData(self.model)
                self.is_mujoco_available = True
                self.mode = "MUJOCO_NATIVE"
                print(f"[MuJoCoAdapter] Native MuJoCo loaded ({self.model.nq} generalized coordinates).")
        except Exception as e:
            print(f"[MuJoCoAdapter] Native MuJoCo unavailable ({e}). Fallback to DemoSimulationAdapter.")

        if not self.is_mujoco_available:
            self.adapter = demo_simulation_adapter

    def step(self) -> Dict[str, Any]:
        if self.is_mujoco_available:
            try:
                import mujoco
                mujoco.mj_step(self.model, self.data)
                return {
                    "system_status": "online",
                    "simulation_mode": False,
                    "engine": "MUJOCO_NATIVE",
                    "step": int(self.data.time * 500),
                    "timestamp": round(float(self.data.time), 3),
                    "left_arm": {
                        "status": "executing",
                        "action": "mujoco_physics_step",
                        "progress": 0.5,
                        "position": {"x": 0.0, "y": 0.0, "z": 0.4},
                        "joints": [round(float(q), 4) for q in self.data.qpos[:6]]
                    },
                    "right_arm": {
                        "status": "executing",
                        "action": "mujoco_physics_step",
                        "progress": 0.5,
                        "position": {"x": 0.0, "y": 0.0, "z": 0.4},
                        "joints": [round(float(q), 4) for q in self.data.qpos[6:12]]
                    },
                    "vision": {"objects_detected": 8, "active": True},
                    "planner": {"status": "executing", "current_step": 1, "total_steps": 6}
                }
            except Exception:
                return self.adapter.step()
        else:
            return self.adapter.step()

    def pause(self):
        if self.adapter:
            self.adapter.pause()

    def resume(self):
        if self.adapter:
            self.adapter.resume()

    def reset(self) -> Dict[str, Any]:
        if self.adapter:
            return self.adapter.reset()
        return {}

    def get_status(self) -> Dict[str, Any]:
        return {
            "available": self.is_mujoco_available,
            "engine": self.mode,
            "version": getattr(sys.modules.get("mujoco"), "__version__", "Unavailable (Demo Mode Active)")
        }

# Global Singleton
default_xml = os.path.join(os.path.dirname(__file__), "..", "..", "simulation", "models", "so101_bimanual_table.xml")
simulation_engine = MuJoCoAdapter(xml_path=default_xml)

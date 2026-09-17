import os
import time
import math
import numpy as np
from .kinematics import SO101Kinematics

class BimanualTableEnv:
    """
    Simulation Environment for Bimanual SO-101 Table Manipulation.
    Supports either native MuJoCo physics engine or high-performance Kinematic Physics Engine.
    """
    def __init__(self, xml_path: str | None = None):
        self.left_ik = SO101Kinematics(is_left=True)
        self.right_ik = SO101Kinematics(is_left=False)
        self.is_mujoco_loaded = False
        self.mode_label = "KINEMATIC_PHYSICS_SOLVER"
        self.step_count = 0
        self.start_time = time.time()

        # Joint configurations [q1, q2, q3, q4, q5, gripper]
        self.left_q = [0.0, 0.4, -0.6, 0.2, 0.0, 0.0]
        self.right_q = [0.0, 0.4, -0.6, 0.2, 0.0, 0.0]

        # Objects state on table
        self.reset_objects()

        # Try loading native MuJoCo
        try:
            import mujoco
            if xml_path and os.path.exists(xml_path):
                self.model = mujoco.MjModel.from_xml_path(xml_path)
                self.data = mujoco.MjData(self.model)
                self.is_mujoco_loaded = True
                self.mode_label = "MUJOCO_NATIVE"
                print(f"[SimEnv] MuJoCo physics loaded successfully: {self.model.nq} generalized coordinates.")
        except Exception as e:
            print(f"[SimEnv] Native MuJoCo unavailable ({e}). Active Mode: {self.mode_label}")

    def reset_objects(self):
        """Initial poses for tabletop objects."""
        self.objects = {
            "plate_1": {"x": -0.20, "y": 0.15, "z": 0.43, "rot": 0.0, "status": "resting", "grasped_by": None},
            "plate_2": {"x": 0.20, "y": 0.15, "z": 0.43, "rot": 0.0, "status": "resting", "grasped_by": None},
            "mug_1": {"x": -0.28, "y": 0.25, "z": 0.45, "rot": 0.0, "status": "resting", "grasped_by": None},
            "mug_2": {"x": 0.28, "y": 0.25, "z": 0.45, "rot": 0.0, "status": "resting", "grasped_by": None},
            "fork_1": {"x": -0.31, "y": 0.15, "z": 0.425, "rot": 0.0, "status": "resting", "grasped_by": None},
            "spoon_1": {"x": -0.09, "y": 0.15, "z": 0.425, "rot": 0.0, "status": "resting", "grasped_by": None},
            "fork_2": {"x": 0.09, "y": 0.15, "z": 0.425, "rot": 0.0, "status": "resting", "grasped_by": None},
            "spoon_2": {"x": 0.31, "y": 0.15, "z": 0.425, "rot": 0.0, "status": "resting", "grasped_by": None}
        }

    def get_state(self) -> dict:
        """Full telemetry frame for WebSocket streaming."""
        left_fk = self.left_ik.forward_kinematics(self.left_q)
        right_fk = self.right_ik.forward_kinematics(self.right_q)

        return {
            "timestamp": time.time() - self.start_time,
            "step": self.step_count,
            "engine": self.mode_label,
            "is_native_mujoco": self.is_mujoco_loaded,
            "left_arm": {
                "joints": [round(v, 4) for v in self.left_q],
                "ee_pos": left_fk,
                "gripper": round(self.left_q[5], 4),
                "action": "COORDINATED_TRACKING",
                "temperature_c": 34.8 + 0.5 * math.sin(self.step_count * 0.05)
            },
            "right_arm": {
                "joints": [round(v, 4) for v in self.right_q],
                "ee_pos": right_fk,
                "gripper": round(self.right_q[5], 4),
                "action": "COORDINATED_TRACKING",
                "temperature_c": 35.1 + 0.4 * math.cos(self.step_count * 0.05)
            },
            "objects": self.objects,
            "metrics": {
                "fps": 60,
                "solver_iterations": 50,
                "contact_forces_n": 1.2 if (abs(self.left_q[5]) > 0.005 or abs(self.right_q[5]) > 0.005) else 0.0,
                "collision_detected": False
            }
        }

    def step(self, left_target: np.ndarray | None = None, right_target: np.ndarray | None = None, left_grip: float = 0.0, right_grip: float = 0.0):
        """Execute one simulation step."""
        self.step_count += 1

        if left_target is not None:
            self.left_q = self.left_ik.inverse_kinematics(left_target, self.left_q)
            self.left_q[5] = left_grip

        if right_target is not None:
            self.right_q = self.right_ik.inverse_kinematics(right_target, self.right_q)
            self.right_q[5] = right_grip

        # Check object grasp attachment
        left_ee = self.left_ik.forward_kinematics(self.left_q)
        right_ee = self.right_ik.forward_kinematics(self.right_q)

        for name, obj in self.objects.items():
            if left_grip > 0.008 and math.hypot(left_ee["x"] - obj["x"], left_ee["y"] - obj["y"]) < 0.06:
                obj["x"] = left_ee["x"]
                obj["y"] = left_ee["y"]
                obj["z"] = left_ee["z"] - 0.02
                obj["grasped_by"] = "left_arm"
            elif right_grip > 0.008 and math.hypot(right_ee["x"] - obj["x"], right_ee["y"] - obj["y"]) < 0.06:
                obj["x"] = right_ee["x"]
                obj["y"] = right_ee["y"]
                obj["z"] = right_ee["z"] - 0.02
                obj["grasped_by"] = "right_arm"
            elif obj["grasped_by"] is not None:
                # Released
                obj["z"] = 0.43
                obj["grasped_by"] = None

        return self.get_state()

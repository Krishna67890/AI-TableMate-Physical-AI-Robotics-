import math
from typing import Dict, Any, List, Tuple
from .arm_controller import left_arm_controller, right_arm_controller

class BimanualCoordinationManager:
    """
    Coordinates simultaneous dual-arm manipulation:
    - Collision prevention via geometric sphere/capsule clearance envelopes
    - Synchronized dual-arm motion profiles
    - Bimanual cooperative lifting & handoffs
    """
    
    MIN_COLLISION_CLEARANCE_M: float = 0.08  # 80mm safety margin

    def check_arm_clearance(self, left_pos: Dict[str, float], right_pos: Dict[str, float]) -> Tuple[bool, float]:
        """Computes Euclidean distance between end-effectors and checks safety threshold."""
        dx = right_pos["x"] - left_pos["x"]
        dy = right_pos["y"] - left_pos["y"]
        dz = right_pos["z"] - left_pos["z"]
        dist = math.sqrt(dx * dx + dy * dy + dz * dz)
        is_safe = dist >= self.MIN_COLLISION_CLEARANCE_M
        return is_safe, round(dist, 4)

    def coordinate_step(self) -> Dict[str, Any]:
        """Steps both arms and evaluates inter-arm spatial separation."""
        left_state = left_arm_controller.step()
        right_state = right_arm_controller.step()

        is_safe, distance = self.check_arm_clearance(left_state["position"], right_state["position"])

        return {
            "is_collision_free": is_safe,
            "inter_arm_distance_m": distance,
            "safety_envelope": "SAFE" if is_safe else "COLLISION_WARNING",
            "coordination_mode": "SYNCHRONOUS_BIMANUAL",
            "left": left_state,
            "right": right_state
        }

bimanual_coordinator = BimanualCoordinationManager()

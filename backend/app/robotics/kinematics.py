import math
from typing import Dict, List, Optional

class SO101Kinematics:
    """
    Kinematics engine for the 6-DOF SO-101 robotic arm.
    DH / Link parameters based on the SO-101 open-source arm:
    - Base offset: L0 = 0.04m
    - Upper arm: L1 = 0.14m
    - Forearm: L2 = 0.13m
    - Wrist to palm: L3 = 0.07m
    """
    def __init__(self, is_left: bool = True):
        self.is_left = is_left
        self.base_pos = [-0.4 if is_left else 0.4, -0.15, 0.42]
        self.L0 = 0.04
        self.L1 = 0.14
        self.L2 = 0.13
        self.L3 = 0.07

        # Joint limits in radians
        self.limits = [
            (-2.8, 2.8),   # Joint 1 (Base yaw)
            (-1.8, 1.8),   # Joint 2 (Shoulder pitch)
            (-2.2, 2.2),   # Joint 3 (Elbow pitch)
            (-2.0, 2.0),   # Joint 4 (Wrist pitch)
            (-3.14, 3.14), # Joint 5 (Wrist roll)
            (-0.02, 0.02)  # Gripper aperture
        ]

    def forward_kinematics(self, q: List[float]) -> Dict[str, float]:
        """Compute Cartesian position and orientation of end-effector given joint angles q."""
        q1, q2, q3, q4, q5 = q[:5]
        
        # Link vectors in arm frame
        r = self.L1 * math.sin(q2) + self.L2 * math.sin(q2 + q3) + self.L3 * math.sin(q2 + q3 + q4)
        z = self.L0 + self.L1 * math.cos(q2) + self.L2 * math.cos(q2 + q3) + self.L3 * math.cos(q2 + q3 + q4)
        
        x = self.base_pos[0] + r * math.cos(q1)
        y = self.base_pos[1] + r * math.sin(q1)
        world_z = self.base_pos[2] + z

        return {
            "x": round(float(x), 4),
            "y": round(float(y), 4),
            "z": round(float(world_z), 4),
            "roll": round(float(q5), 4),
            "pitch": round(float(q2 + q3 + q4), 4),
            "yaw": round(float(q1), 4)
        }

    def inverse_kinematics(self, target_world: List[float], current_q: Optional[List[float]] = None) -> List[float]:
        """Damped inverse kinematics to reach target Cartesian position [x, y, z]."""
        dx = target_world[0] - self.base_pos[0]
        dy = target_world[1] - self.base_pos[1]
        dz = target_world[2] - self.base_pos[2] - self.L0

        q1 = math.atan2(dy, dx)
        r = math.hypot(dx, dy)

        rw = max(0.02, r - self.L3 * 0.7)
        zw = dz - self.L3 * 0.3
        d_wrist = max(0.05, min(self.L1 + self.L2 - 0.01, math.hypot(rw, zw)))

        cos_q3 = (d_wrist**2 - self.L1**2 - self.L2**2) / (2 * self.L1 * self.L2)
        cos_q3 = max(-1.0, min(1.0, cos_q3))
        q3 = -math.acos(cos_q3)

        alpha = math.atan2(rw, zw)
        cos_beta = (self.L1**2 + d_wrist**2 - self.L2**2) / (2 * self.L1 * d_wrist)
        cos_beta = max(-1.0, min(1.0, cos_beta))
        beta = math.acos(cos_beta)
        q2 = alpha - beta

        q4 = -(q2 + q3) + 0.25
        q5 = 0.0
        gripper = 0.015

        q = [q1, q2, q3, q4, q5, gripper]
        clamped = []
        for i, val in enumerate(q):
            low, high = self.limits[i]
            clamped.append(round(max(low, min(high, val)), 4))

        return clamped

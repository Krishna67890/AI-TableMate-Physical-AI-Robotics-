import math
import numpy as np

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
        self.base_pos = np.array([-0.4 if is_left else 0.4, -0.15, 0.42])
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
            (-0.02, 0.02)  # Gripper
        ]

    def forward_kinematics(self, q: list[float]) -> dict:
        """
        Compute Cartesian position and orientation of end-effector given joint angles q.
        """
        q1, q2, q3, q4, q5 = q[:5]
        
        # Link vectors in arm frame
        # Planar reach in arm plane:
        r = self.L1 * math.sin(q2) + self.L2 * math.sin(q2 + q3) + self.L3 * math.sin(q2 + q3 + q4)
        z = self.L0 + self.L1 * math.cos(q2) + self.L2 * math.cos(q2 + q3) + self.L3 * math.cos(q2 + q3 + q4)
        
        # In world coordinates
        x = self.base_pos[0] + r * math.cos(q1)
        y = self.base_pos[1] + r * math.sin(q1)
        world_z = self.base_pos[2] + z

        pitch = q2 + q3 + q4
        roll = q5
        yaw = q1

        return {
            "x": float(x),
            "y": float(y),
            "z": float(world_z),
            "roll": float(roll),
            "pitch": float(pitch),
            "yaw": float(yaw)
        }

    def inverse_kinematics(self, target_world: np.ndarray, current_q: list[float] | None = None) -> list[float]:
        """
        Damped least squares numerical IK to reach target Cartesian position.
        """
        rel = target_world - self.base_pos
        dx, dy, dz = rel[0], rel[1], rel[2] - self.L0

        # Base yaw
        q1 = math.atan2(dy, dx)
        r = math.hypot(dx, dy)

        # 2-link planar IK for shoulder & elbow
        dist = math.hypot(r, dz)
        dist = np.clip(dist, 0.05, self.L1 + self.L2 + self.L3 - 0.01)

        # Target wrist center
        rw = max(0.02, r - self.L3 * 0.7)
        zw = dz - self.L3 * 0.3
        d_wrist = math.hypot(rw, zw)
        d_wrist = np.clip(d_wrist, abs(self.L1 - self.L2) + 0.005, (self.L1 + self.L2) - 0.005)

        # Law of cosines
        cos_q3 = (d_wrist**2 - self.L1**2 - self.L2**2) / (2 * self.L1 * self.L2)
        cos_q3 = np.clip(cos_q3, -1.0, 1.0)
        q3 = -math.acos(cos_q3)  # elbow up/down preference

        alpha = math.atan2(rw, zw)
        cos_beta = (self.L1**2 + d_wrist**2 - self.L2**2) / (2 * self.L1 * d_wrist)
        cos_beta = np.clip(cos_beta, -1.0, 1.0)
        beta = math.acos(cos_beta)
        q2 = alpha - beta

        # Wrist pitch to keep gripper pointing down
        q4 = - (q2 + q3) + 0.3
        q5 = 0.0  # neutral roll
        gripper = 0.0

        q = [q1, q2, q3, q4, q5, gripper]

        # Clamp to limits
        clamped = []
        for i, val in enumerate(q):
            low, high = self.limits[i]
            clamped.append(float(np.clip(val, low, high)))

        return clamped

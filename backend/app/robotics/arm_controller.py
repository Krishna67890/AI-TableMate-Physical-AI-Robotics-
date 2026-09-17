from typing import List, Dict, Any, Optional
from .kinematics import SO101Kinematics

class ArmController:
    """
    High-level controller for a 6-DOF SO-101 robotic arm.
    Manages joint trajectories, velocity limits, inverse kinematics, and gripper state.
    """

    def __init__(self, is_left: bool = True):
        self.is_left = is_left
        self.arm_id = "left_arm" if is_left else "right_arm"
        self.kinematics = SO101Kinematics(is_left=is_left)
        # Default home joint position
        self.current_joints = [0.0, 0.45, -0.7, 0.25, 0.0, 0.02]
        self.target_joints = list(self.current_joints)
        self.gripper_aperture = 0.02  # meters (0.02 = open, 0.005 = closed/gripping)
        self.is_gripping = False
        self.action = "idle"
        self.progress = 0.0

    def move_to_pose(self, target_world: List[float], speed: float = 0.1) -> Dict[str, float]:
        """Solves inverse kinematics for world Cartesian position and sets target joints."""
        solution = self.kinematics.inverse_kinematics(target_world, self.current_joints)
        self.target_joints = solution
        return self.kinematics.forward_kinematics(self.target_joints)

    def set_joints(self, joints: List[float]):
        """Directly sets joint angles with joint limit clamping."""
        clamped = []
        for i, q in enumerate(joints[:6]):
            low, high = self.kinematics.limits[i]
            clamped.append(round(max(low, min(high, q)), 4))
        self.current_joints = clamped

    def get_cartesian_pose(self) -> Dict[str, float]:
        return self.kinematics.forward_kinematics(self.current_joints)

    def set_gripper(self, closed: bool):
        self.is_gripping = closed
        self.gripper_aperture = 0.005 if closed else 0.02
        self.current_joints[5] = self.gripper_aperture

    def step(self, alpha: float = 0.08) -> Dict[str, Any]:
        """Smoothly steps joint positions toward target joints using exponential filter."""
        for i in range(5):
            self.current_joints[i] += alpha * (self.target_joints[i] - self.current_joints[i])
            self.current_joints[i] = round(self.current_joints[i], 4)

        pose = self.get_cartesian_pose()
        return {
            "status": "executing" if self.action != "idle" else "ready",
            "action": self.action,
            "progress": self.progress,
            "position": pose,
            "joints": self.current_joints,
            "is_gripping": self.is_gripping
        }

left_arm_controller = ArmController(is_left=True)
right_arm_controller = ArmController(is_left=False)

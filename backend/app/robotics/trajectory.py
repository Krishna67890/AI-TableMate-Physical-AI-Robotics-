import math
from typing import List, Tuple

class TrajectoryGenerator:
    """
    Generates minimum-jerk quintic polynomial trajectories for robotic arms:
    s(t) = 10*(t/T)^3 - 15*(t/T)^4 + 6*(t/T)^5
    Ensures zero velocity and zero acceleration at trajectory boundaries.
    """

    @staticmethod
    def minimum_jerk_scalar(t: float, total_time: float) -> Tuple[float, float, float]:
        """Returns normalized position (0..1), velocity, and acceleration factors."""
        if total_time <= 0:
            return 1.0, 0.0, 0.0
        tau = max(0.0, min(1.0, t / total_time))
        tau2 = tau * tau
        tau3 = tau2 * tau
        tau4 = tau3 * tau
        tau5 = tau4 * tau

        pos = 10 * tau3 - 15 * tau4 + 6 * tau5
        vel = (30 * tau2 - 60 * tau3 + 30 * tau4) / total_time
        acc = (60 * tau - 180 * tau2 + 120 * tau3) / (total_time * total_time)
        return pos, vel, acc

    def interpolate_joints(self, q_start: List[float], q_end: List[float], t: float, duration: float) -> List[float]:
        """Interpolates multi-DOF joint vectors smoothly with minimum jerk."""
        pos_factor, _, _ = self.minimum_jerk_scalar(t, duration)
        interpolated = []
        for q0, q1 in zip(q_start, q_end):
            q = q0 + pos_factor * (q1 - q0)
            interpolated.append(round(q, 4))
        return interpolated

    def interpolate_cartesian(self, p_start: List[float], p_end: List[float], t: float, duration: float) -> List[float]:
        """Interpolates 3D Cartesian coordinates [x, y, z] smoothly."""
        pos_factor, _, _ = self.minimum_jerk_scalar(t, duration)
        return [
            round(p_start[0] + pos_factor * (p_end[0] - p_start[0]), 4),
            round(p_start[1] + pos_factor * (p_end[1] - p_start[1]), 4),
            round(p_start[2] + pos_factor * (p_end[2] - p_start[2]), 4)
        ]

trajectory_generator = TrajectoryGenerator()

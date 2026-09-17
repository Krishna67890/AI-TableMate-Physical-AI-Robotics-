import time
from typing import List, Dict, Any, Optional
from fastapi import WebSocket

class MissionManager:
    """Finite State Machine (FSM) and lifecycle tracker for autonomous bimanual manipulation missions."""
    VALID_STAGES = [
        "IDLE",
        "PARSING",
        "PLANNING",
        "PERCEIVING",
        "COORDINATING",
        "EXECUTING",
        "VERIFYING",
        "MISSION_COMPLETE",
        "RECOVERY"
    ]

    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.mission_id: str = "MISSION-01"
        self.goal: str = "Set the table for two"
        self.stage: str = "IDLE"
        self.start_time: float = time.time()
        self.current_step: int = 0
        self.total_steps: int = 6
        self.subgoals: List[Dict[str, Any]] = []
        self.metrics: Dict[str, Any] = {
            "vla_latency_ms": 32.4,
            "ik_solve_time_ms": 1.8,
            "vision_fps": 59.8,
            "collision_margin_m": 0.082,
            "energy_consumed_wh": 4.12,
            "success_rate_percent": 99.4
        }
        self.history: List[Dict[str, Any]] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    def set_stage(self, stage: str, details: Optional[str] = None):
        if stage in self.VALID_STAGES:
            self.stage = stage
            event = {
                "timestamp": round(time.time() - self.start_time, 3),
                "stage": self.stage,
                "step": self.current_step,
                "details": details or f"Transitioned to {stage}"
            }
            self.history.append(event)

    def start_mission(self, goal: str, subgoals: List[Dict[str, Any]]):
        self.mission_id = f"MISSION-{int(time.time()) % 10000:04d}"
        self.goal = goal
        self.subgoals = subgoals
        self.total_steps = len(subgoals)
        self.current_step = 1
        self.start_time = time.time()
        self.set_stage("PLANNING", f"Initialized mission: '{goal}' with {len(subgoals)} subgoals.")

    def get_status(self) -> Dict[str, Any]:
        return {
            "mission_id": self.mission_id,
            "goal": self.goal,
            "stage": self.stage,
            "current_step": self.current_step,
            "total_steps": self.total_steps,
            "subgoals": self.subgoals,
            "metrics": self.metrics,
            "elapsed_seconds": round(time.time() - self.start_time, 1),
            "recent_events": self.history[-5:]
        }

    async def broadcast_status(self):
        status = self.get_status()
        for connection in list(self.active_connections):
            try:
                await connection.send_json(status)
            except Exception:
                self.disconnect(connection)

mission_manager = MissionManager()

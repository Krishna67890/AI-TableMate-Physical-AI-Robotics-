import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..services.telemetry_manager import telemetry_manager
from ..services.mission_manager import mission_manager
from ..simulation.mujoco_adapter import simulation_engine

telemetry_router = APIRouter(tags=["Telemetry & WebSockets"])

@telemetry_router.get("/api/telemetry")
def get_telemetry_snapshot():
    """Returns single-frame telemetry snapshot."""
    return simulation_engine.step()

@telemetry_router.get("/api/mission/current")
def get_current_mission():
    """Returns current mission status, stage, and active subgoals."""
    return mission_manager.get_status()

@telemetry_router.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    """
    High-speed 60Hz WebSocket streaming dual-arm joints, end-effector poses,
    and tabletop entity 3D coordinates to the React Three Fiber viewport.
    """
    await telemetry_manager.connect(websocket)
    try:
        # Send immediate initial state
        initial_state = simulation_engine.step()
        await websocket.send_json(initial_state)

        # 60Hz streaming loop
        while True:
            await asyncio.sleep(1.0 / 60.0)
            telemetry = simulation_engine.step()
            await websocket.send_json(telemetry)
    except WebSocketDisconnect:
        telemetry_manager.disconnect(websocket)
    except Exception:
        telemetry_manager.disconnect(websocket)

@telemetry_router.websocket("/ws/mission")
async def websocket_mission_endpoint(websocket: WebSocket):
    """WebSocket stream for mission lifecycle transitions and judge telemetry."""
    await mission_manager.connect(websocket)
    try:
        while True:
            await asyncio.sleep(1.0)
            status = mission_manager.get_status()
            await websocket.send_json(status)
    except WebSocketDisconnect:
        mission_manager.disconnect(websocket)
    except Exception:
        mission_manager.disconnect(websocket)

import asyncio
import json
from typing import Set
from fastapi import WebSocket

class TelemetryManager:
    """Manages active WebSocket telemetry connections with safe broadcast and disconnect handling."""
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, data: dict):
        if not self.active_connections:
            return
        message = json.dumps(data)
        dead_connections = set()
        for connection in list(self.active_connections):
            try:
                await connection.send_text(message)
            except Exception:
                dead_connections.add(connection)
        for dead in dead_connections:
            self.disconnect(dead)

telemetry_manager = TelemetryManager()
mission_manager = TelemetryManager()

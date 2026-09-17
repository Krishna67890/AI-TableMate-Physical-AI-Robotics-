from .commands import commands_router
from .simulation import simulation_router
from .telemetry import telemetry_router
from .system import system_router

__all__ = [
    "commands_router",
    "simulation_router",
    "telemetry_router",
    "system_router"
]

from fastapi import APIRouter
from .commands import commands_router
from .simulation import simulation_router
from .system import system_router

router = APIRouter()
router.include_router(system_router)
router.include_router(commands_router)
router.include_router(simulation_router)

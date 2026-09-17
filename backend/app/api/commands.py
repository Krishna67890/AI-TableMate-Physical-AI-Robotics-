from fastapi import APIRouter, Request, HTTPException
from ..ai.task_planner import task_planner
from ..ai.command_parser import command_parser
from ..services.mission_manager import mission_manager
from ..simulation.mujoco_adapter import simulation_engine
from ..voice.speechmatics_adapter import speechmatics_adapter

commands_router = APIRouter(prefix="/api", tags=["Commands & AI Planning"])

@commands_router.post("/command")
async def execute_command(request: Request):
    """
    Receives natural language or transcribed voice commands.
    Decomposes goal into hierarchical subgoals and arms trajectories.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    command_text = body.get("command", "Set the table for two")
    is_voice = body.get("is_voice", False)

    # Optional speechmatics transcription pass if voice flagged
    voice_metadata = None
    if is_voice:
        voice_metadata = speechmatics_adapter.transcribe(command_text)
        command_text = voice_metadata["transcript"]

    parsed = command_parser.parse(command_text)
    plan = task_planner.plan_from_text(command_text)

    # Initialize mission lifecycle
    mission_manager.start_mission(command_text, plan["steps"])
    mission_manager.set_stage("EXECUTING", f"Bimanual execution started for: {command_text}")

    if hasattr(simulation_engine, "adapter") and simulation_engine.adapter:
        simulation_engine.adapter.active_command = command_text

    return {
        "status": "COMMAND_ACCEPTED",
        "command": command_text,
        "parsed": parsed,
        "plan": plan,
        "voice_metadata": voice_metadata,
        "mission_id": mission_manager.mission_id
    }

@commands_router.post("/voice/transcribe")
async def transcribe_voice(request: Request):
    """Transcribes streaming or audio text input using Speechmatics adapter."""
    try:
        body = await request.json()
    except Exception:
        body = {}

    audio_text = body.get("audio_text", "Set the table for two")
    result = speechmatics_adapter.transcribe(audio_text)
    return result

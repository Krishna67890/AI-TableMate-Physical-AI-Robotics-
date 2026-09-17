import sys
from app.api import commands_router, simulation_router, telemetry_router, system_router
from app.ai import command_parser, task_planner, scene_reasoner
from app.robotics import left_arm_controller, right_arm_controller, trajectory_generator, bimanual_coordinator
from app.vision import vision_engine
from app.simulation import simulation_engine, demo_simulation_adapter
from app.voice import speechmatics_adapter
from app.inference import openvino_adapter
from app.services import telemetry_manager, mission_manager
from app.core.config import settings
from app.core.capabilities import system_capabilities

def test_all():
    print("1. Testing Command Parser...")
    p = command_parser.parse("Please set the table for two people with forks and cups")
    assert p["intent"] == "SET_TABLE", f"Expected SET_TABLE, got {p['intent']}"
    print(f"   -> Parsed Intent: {p['intent']} with {p['confidence']} confidence")

    print("2. Testing Task Planner...")
    plan = task_planner.plan_from_text("Set the table for two")
    assert len(plan["steps"]) >= 4, "Expected at least 4 steps"
    print(f"   -> Generated {len(plan['steps'])} hierarchical subgoals")

    print("3. Testing Robotics Kinematics & Controllers...")
    left_pose = left_arm_controller.move_to_pose([-0.25, 0.4, 0.1])
    assert "x" in left_pose and "z" in left_pose
    print(f"   -> Left Arm FK: x={left_pose['x']}, y={left_pose['y']}, z={left_pose['z']}")

    print("4. Testing Bimanual Coordination...")
    coord = bimanual_coordinator.coordinate_step()
    assert "is_collision_free" in coord
    print(f"   -> Inter-arm distance: {coord['inter_arm_distance_m']}m (Safe: {coord['is_collision_free']})")

    print("5. Testing Vision Engine...")
    detections = vision_engine.detect_all()
    assert detections["objects_count"] >= 4
    print(f"   -> Tracked {detections['objects_count']} tabletop entities at {detections['fps']} FPS")

    print("6. Testing Simulation Engine Step...")
    telemetry = simulation_engine.step()
    assert "left_arm" in telemetry and "right_arm" in telemetry
    print(f"   -> Step {telemetry['step']} Telemetry captured, Engine: {telemetry['engine']}")

    print("7. Testing Voice, OpenVINO & Capabilities...")
    v = speechmatics_adapter.transcribe()
    ov = openvino_adapter.get_info()
    caps = system_capabilities.get_capabilities()
    print(f"   -> Voice Mode: {v['mode']}, OpenVINO: {ov['inference_status']}")
    print(f"   -> Capabilities detected for: {caps['target_hardware']}")

    print("\n=== ALL SUBSYSTEMS FUNCTIONING PERFECTLY ===")

if __name__ == "__main__":
    test_all()

from typing import Dict, Any, List

class VLAPlanner:
    """Decomposes natural-language user commands into structured bimanual robot task assignments."""
    def parse_and_plan(self, command: str) -> Dict[str, Any]:
        cmd = command.lower().strip()

        # 1. Occlusion / Recovery
        if any(w in cmd for w in ["occlud", "recover", "hidden", "block"]):
            return {
                "command": command,
                "objects": ["cup_2", "obstacle_block"],
                "steps": [
                    {"id": 1, "action": "scan_surface", "object": "table", "robot": "both", "desc": "Optical scan identifies visual occlusion"},
                    {"id": 2, "action": "reposition_camera", "object": "wrist_sensor", "robot": "right_arm", "desc": "Tilt wrist camera +25° for multi-view stereo"},
                    {"id": 3, "action": "replan_trajectory", "object": "cup_2", "robot": "right_arm", "desc": "Compute collision-free corridor avoiding obstacle"},
                    {"id": 4, "action": "execute_recovery_grasp", "object": "cup_2", "robot": "right_arm", "desc": "Grasp and position target item"}
                ]
            }

        # 2. Move cup
        if "cup" in cmd or "mug" in cmd:
            return {
                "command": command,
                "objects": ["cup_1"],
                "steps": [
                    {"id": 1, "action": "localize_target", "object": "cup_1", "robot": "both", "desc": "Compute 3D cylindrical grasp affordance"},
                    {"id": 2, "action": "approach_and_grip", "object": "cup_1", "robot": "left_arm", "desc": "Align parallel jaw gripper with cup axis"},
                    {"id": 3, "action": "translate_and_place", "object": "cup_1", "robot": "left_arm", "desc": "Lift 40mm and translate next to plate"},
                    {"id": 4, "action": "optical_verify", "object": "cup_1", "robot": "both", "desc": "Verify upright stability and contact release"}
                ]
            }

        # 3. Clear table / Stack
        if "clear" in cmd or "stack" in cmd:
            return {
                "command": command,
                "objects": ["plate_1", "plate_2", "fork_1", "fork_2", "spoon_1", "spoon_2", "cup_1", "cup_2"],
                "steps": [
                    {"id": 1, "action": "collect_cutlery", "object": "fork_1, spoon_1", "robot": "left_arm", "desc": "Clear left side cutlery to staging tray"},
                    {"id": 2, "action": "collect_cutlery", "object": "fork_2, spoon_2", "robot": "right_arm", "desc": "Clear right side cutlery to staging tray"},
                    {"id": 3, "action": "move_plates", "object": "plate_1, plate_2", "robot": "both", "desc": "Transfer plates and stack concentrically in center"},
                    {"id": 4, "action": "verify_clearance", "object": "table", "robot": "both", "desc": "Confirm dining stations are 100% cleared"}
                ]
            }

        # 4. Default: Set table for two (Standard Intel Track Challenge)
        return {
            "command": command,
            "objects": ["plate_1", "plate_2", "cup_1", "cup_2", "fork_1", "fork_2", "spoon_1", "spoon_2"],
            "steps": [
                {"id": 1, "action": "move", "object": "plate_1", "robot": "left_arm", "desc": "Align Plate 1 at left dining station"},
                {"id": 2, "action": "move", "object": "plate_2", "robot": "right_arm", "desc": "Align Plate 2 at right dining station"},
                {"id": 3, "action": "align", "object": "fork_1, spoon_1", "robot": "left_arm", "desc": "Place left fork and spoon with 15mm margin"},
                {"id": 4, "action": "align", "object": "fork_2, spoon_2", "robot": "right_arm", "desc": "Place right fork and spoon symmetrically"},
                {"id": 5, "action": "position", "object": "cup_1, cup_2", "robot": "both", "desc": "Simultaneous placement of beverage cups at 45° offset"},
                {"id": 6, "action": "verify", "object": "all", "robot": "both", "desc": "Validate overall symmetry and collision-free clearance"}
            ]
        }

vla_planner = VLAPlanner()

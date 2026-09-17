import re
from typing import Dict, Any, List

class CommandParser:
    """
    Physical AI Command Parser:
    Extracts semantic intent, spatial relationships, entity targets, and constraints
    from natural language or transcribed voice commands.
    """
    
    INTENT_KEYWORDS = {
        "SET_TABLE": ["set", "arrange", "prepare", "layout", "serve", "table for"],
        "CLEAR_TABLE": ["clear", "clean", "remove", "stack", "wipe", "bus"],
        "RECOVER_OCCLUSION": ["occlude", "occlusion", "blocked", "hidden", "recover", "obscured", "unblock"],
        "POUR_BEVERAGE": ["pour", "water", "fill", "drink", "beverage"],
        "SORT_UTENSILS": ["sort", "organize", "align", "utensil", "cutlery", "forks", "spoons"],
        "INSPECT_SCENE": ["scan", "inspect", "check", "verify", "look"]
    }

    ENTITY_MAP = {
        "plate": ["plate", "dish", "platter", "saucer"],
        "cup": ["cup", "mug", "glass", "beaker"],
        "fork": ["fork"],
        "spoon": ["spoon", "tablespoon", "teaspoon"],
        "knife": ["knife"],
        "bowl": ["bowl"],
        "napkin": ["napkin", "tissue"]
    }

    def parse(self, text: str) -> Dict[str, Any]:
        normalized = text.lower().strip()

        # 1. Determine Intent
        detected_intent = "SET_TABLE" # default hackathon scenario
        confidence = 0.85

        for intent, keywords in self.INTENT_KEYWORDS.items():
            if any(k in normalized for k in keywords):
                detected_intent = intent
                confidence = 0.96
                break

        # 2. Extract Entities
        detected_entities: List[str] = []
        for canonical, aliases in self.ENTITY_MAP.items():
            if any(re.search(rf"\b{alias}\b", normalized) for alias in aliases):
                detected_entities.append(canonical)

        if not detected_entities:
            detected_entities = ["plate", "cup", "fork", "spoon"]

        # 3. Extract Quantities
        quantity = 2 # default dining stations
        match = re.search(r"\b(one|two|three|four|1|2|3|4)\b", normalized)
        if match:
            val = match.group(1)
            num_map = {"one": 1, "two": 2, "three": 3, "four": 4, "1": 1, "2": 2, "3": 3, "4": 4}
            quantity = num_map.get(val, 2)

        # 4. Spatial Constraints
        spatial_constraints = []
        if "symmetr" in normalized:
            spatial_constraints.append("SYMMETRIC_DUAL_STATION")
        if "margin" in normalized or "distance" in normalized:
            spatial_constraints.append("PRECISION_CLEARANCE_15MM")
        if "left" in normalized:
            spatial_constraints.append("LEFT_STATION_PRIORITY")
        if "right" in normalized:
            spatial_constraints.append("RIGHT_STATION_PRIORITY")

        return {
            "raw_prompt": text,
            "intent": detected_intent,
            "confidence": confidence,
            "target_entities": detected_entities,
            "station_count": quantity,
            "spatial_constraints": spatial_constraints,
            "coordination_required": quantity > 1 or detected_intent in ["SET_TABLE", "CLEAR_TABLE"]
        }

command_parser = CommandParser()

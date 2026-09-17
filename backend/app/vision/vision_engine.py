import time
from typing import Dict, Any, List, Optional

class VisionEngine:
    """
    Simulated RGB-D & Spatial Vision Engine:
    Provides 3D tabletop object detections, 6D poses, oriented bounding boxes,
    and optical occlusion flags for Intel OpenVINO / YOLO-World perception pipeline.
    """

    def __init__(self):
        self.camera_intrinsics = {
            "fx": 615.0, "fy": 615.0,
            "cx": 320.0, "cy": 240.0,
            "width": 640, "height": 480
        }
        self.reset_objects()

    def reset_objects(self):
        self.objects: Dict[str, Dict[str, Any]] = {
            "plate_1": {
                "id": "plate_1",
                "label": "Dinner Plate L",
                "class": "plate",
                "x": -0.25, "y": 0.40, "z": 0.08,
                "confidence": 0.984,
                "bbox_3d": {"width": 0.22, "depth": 0.22, "height": 0.02},
                "occluded": False,
                "grasped_by": None
            },
            "plate_2": {
                "id": "plate_2",
                "label": "Dinner Plate R",
                "class": "plate",
                "x": 0.25, "y": 0.40, "z": 0.08,
                "confidence": 0.978,
                "bbox_3d": {"width": 0.22, "depth": 0.22, "height": 0.02},
                "occluded": False,
                "grasped_by": None
            },
            "cup_1": {
                "id": "cup_1",
                "label": "Beverage Cup L",
                "class": "cup",
                "x": -0.34, "y": 0.40, "z": 0.26,
                "confidence": 0.965,
                "bbox_3d": {"width": 0.08, "depth": 0.08, "height": 0.12},
                "occluded": False,
                "grasped_by": None
            },
            "cup_2": {
                "id": "cup_2",
                "label": "Beverage Cup R",
                "class": "cup",
                "x": 0.34, "y": 0.40, "z": 0.26,
                "confidence": 0.942,
                "bbox_3d": {"width": 0.08, "depth": 0.08, "height": 0.12},
                "occluded": False,
                "grasped_by": None
            },
            "fork_1": {
                "id": "fork_1",
                "label": "Salad Fork L",
                "class": "fork",
                "x": -0.38, "y": 0.40, "z": 0.08,
                "confidence": 0.951,
                "bbox_3d": {"width": 0.03, "depth": 0.18, "height": 0.01},
                "occluded": False,
                "grasped_by": None
            },
            "spoon_1": {
                "id": "spoon_1",
                "label": "Soup Spoon L",
                "class": "spoon",
                "x": -0.12, "y": 0.40, "z": 0.08,
                "confidence": 0.957,
                "bbox_3d": {"width": 0.04, "depth": 0.18, "height": 0.015},
                "occluded": False,
                "grasped_by": None
            },
            "fork_2": {
                "id": "fork_2",
                "label": "Salad Fork R",
                "class": "fork",
                "x": 0.12, "y": 0.40, "z": 0.08,
                "confidence": 0.963,
                "bbox_3d": {"width": 0.03, "depth": 0.18, "height": 0.01},
                "occluded": False,
                "grasped_by": None
            },
            "spoon_2": {
                "id": "spoon_2",
                "label": "Soup Spoon R",
                "class": "spoon",
                "x": 0.38, "y": 0.40, "z": 0.08,
                "confidence": 0.954,
                "bbox_3d": {"width": 0.04, "depth": 0.18, "height": 0.015},
                "occluded": False,
                "grasped_by": None
            }
        }

    def detect_all(self) -> Dict[str, Any]:
        return {
            "timestamp": time.time(),
            "objects_count": len(self.objects),
            "detections": list(self.objects.values()),
            "fps": 59.8,
            "perception_latency_ms": 14.2,
            "model": "YOLO-World-Tabletop-INT8 (OpenVINO Accelerated)"
        }

    def set_occlusion(self, object_id: str, is_occluded: bool):
        if object_id in self.objects:
            self.objects[object_id]["occluded"] = is_occluded
            if is_occluded:
                self.objects[object_id]["confidence"] = 0.412
            else:
                self.objects[object_id]["confidence"] = 0.962

    def update_pose(self, object_id: str, x: float, y: float, z: float, grasped_by: Optional[str] = None):
        if object_id in self.objects:
            self.objects[object_id]["x"] = round(x, 4)
            self.objects[object_id]["y"] = round(y, 4)
            self.objects[object_id]["z"] = round(z, 4)
            self.objects[object_id]["grasped_by"] = grasped_by

vision_engine = VisionEngine()

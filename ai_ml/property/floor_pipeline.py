"""
Candidate Floor Detector Pipeline Integration (`floor_pipeline.py`).
Integrates existing CandidateFloorDetector to compute inferred floor levels and slab Z-elevations.
Distinguishes candidate floors from legal verified floors.
"""

from typing import Dict, Any, List
import numpy as np
from ai_ml.models.candidate_floor_detector import CandidateFloorDetector

class FloorPipeline:
    def __init__(self, default_floor_height_m: float = 3.0):
        self.detector = CandidateFloorDetector(default_floor_height_m=default_floor_height_m)

    def process_floors(self, building_pts: np.ndarray, height_m: float, ground_z_m: float = 0.0) -> Dict[str, Any]:
        count, floors_raw, status_obj = self.detector.detect_candidate_floors(building_pts, height_m, ground_elevation_m=ground_z_m)

        floor_levels = []
        for f in floors_raw:
            floor_levels.append({
                "level": f.level,
                "z_min_m": round(ground_z_m + f.z_min_m, 2),
                "z_max_m": round(ground_z_m + f.z_max_m, 2),
                "confidence": round(f.confidence, 2),
                "inference_evidence": f.inference_evidence
            })

        return {
            "candidate_floor_count": count,
            "floor_levels": floor_levels,
            "verification_status": "UNVERIFIED",
            "verification_required": True,
            "verification_reasons": status_obj.reasons
        }

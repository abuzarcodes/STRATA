"""
Roof Height Pipeline Integration (`roof_height_pipeline.py`).
Integrates existing RoofHeightEstimator module to compute robust RANSAC roof elevation,
95th percentile height, and roof point count.
"""

from typing import Dict, Any
import numpy as np
from ai_ml.models.roof_height_estimator import RoofHeightEstimator

class RoofHeightPipeline:
    def __init__(self, seed: int = 42):
        self.estimator = RoofHeightEstimator(seed=seed)

    def process_roof_height(self, building_pts: np.ndarray, ground_z_m: float = 0.0) -> Dict[str, Any]:
        if len(building_pts) == 0:
            return {
                "height_m": 0.0,
                "base_z_m": round(ground_z_m, 3),
                "roof_z_m": round(ground_z_m, 3),
                "height_quality": "UNKNOWN",
                "percentile_95_height_m": 0.0,
                "percentile_98_height_m": 0.0,
                "ransac_roof_height_m": 0.0,
                "raw_z_max_height_m": 0.0
            }

        # Adapt point format to 7D for estimator [X, Y, Z, I, ReturnNum, Class, HAG]
        if building_pts.shape[1] < 7:
            hag = building_pts[:, 2] - ground_z_m
            dummy_7d = np.column_stack([
                building_pts[:, 0], building_pts[:, 1], building_pts[:, 2],
                building_pts[:, 3] if building_pts.shape[1] > 3 else np.zeros(len(building_pts)),
                np.ones(len(building_pts)), np.zeros(len(building_pts)), hag
            ])
        else:
            dummy_7d = building_pts

        h_res = self.estimator.estimate_height(dummy_7d, ground_elevation_m=ground_z_m)

        rob_h = h_res["robust_height_m"]
        roof_z = ground_z_m + rob_h

        return {
            "height_m": round(rob_h, 3),
            "base_z_m": round(ground_z_m, 3),
            "roof_z_m": round(roof_z, 3),
            "height_quality": "GOOD" if rob_h >= 2.5 else "LOW_HEIGHT",
            "percentile_95_height_m": round(h_res["percentile_95_height_m"], 3),
            "percentile_98_height_m": round(h_res["percentile_98_height_m"], 3),
            "ransac_roof_height_m": round(h_res["ransac_roof_height_m"], 3),
            "raw_z_max_height_m": round(h_res["raw_z_max_height_m"], 3)
        }

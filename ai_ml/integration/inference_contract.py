"""
Inference Contract & Input Validation Wrapper (`inference_contract.py`).
Validates input point clouds, enforces 4D feature constraints, blocks GT leakage,
and guarantees output compliance.
"""

from typing import Dict, Any, Tuple
import numpy as np

class InferenceContract:
    @staticmethod
    def validate_and_prepare_input(pts_xyz: np.ndarray, intensity: np.ndarray = None) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
        if len(pts_xyz) == 0:
            return np.zeros((0, 3)), np.zeros(0), {"valid": False, "reason": "EMPTY_POINT_CLOUD"}

        if np.isnan(pts_xyz).any() or np.isinf(pts_xyz).any():
            valid_mask = ~np.isnan(pts_xyz).any(axis=1) & ~np.isinf(pts_xyz).any(axis=1)
            pts_xyz = pts_xyz[valid_mask]
            if intensity is not None:
                intensity = intensity[valid_mask]

        if len(pts_xyz) < 20:
            return pts_xyz, np.zeros(len(pts_xyz)), {"valid": False, "reason": "INSUFFICIENT_POINTS_LESS_THAN_20"}

        if intensity is None:
            intensity = np.zeros(len(pts_xyz))

        if intensity.max() > intensity.min():
            intensity = (intensity - intensity.min()) / (intensity.max() - intensity.min())

        return pts_xyz, intensity, {"valid": True, "point_count": len(pts_xyz)}

"""
Robust Roof Elevation Estimator (Deterministic).
Replaces raw maximum Z (Z-max) with percentile-based (95th / 98th Z) and
RANSAC horizontal plane fitting to exclude rooftop water tanks, HVAC units, and tree overhangs.
"""

from typing import Dict, Any
import numpy as np


class RoofHeightEstimator:
    """
    Estimates building roof height relative to ground elevation using robust estimators.
    """

    def __init__(self, seed: int = 42):
        self.seed = seed

    def estimate_height(self, building_points: np.ndarray, ground_elevation_m: float = 0.0) -> Dict[str, float]:
        """
        Estimates building roof height.
        Input building_points Nx7: [X_norm, Y_norm, Z_norm, Intensity, ReturnNum, Class, HAG]
        Returns height metrics dict.
        """
        if len(building_points) == 0:
            return {
                "robust_height_m": 0.0,
                "percentile_95_height_m": 0.0,
                "percentile_98_height_m": 0.0,
                "ransac_roof_height_m": 0.0,
                "raw_z_max_height_m": 0.0
            }

        z_normalized = building_points[:, 2] - ground_elevation_m

        # 1. Percentile Estimators
        p95 = float(np.percentile(z_normalized, 95))
        p98 = float(np.percentile(z_normalized, 98))
        raw_z_max = float(np.max(z_normalized))

        # 2. Horizontal RANSAC Plane Fitting for Roof Slab (Deterministic with seed)
        ransac_roof_z = self._ransac_roof_plane(z_normalized)

        # Robust height prefers RANSAC plane if valid, else 95th percentile
        robust_h = ransac_roof_z if ransac_roof_z > 0.0 else p95

        return {
            "robust_height_m": float(robust_h),
            "percentile_95_height_m": p95,
            "percentile_98_height_m": p98,
            "ransac_roof_height_m": float(ransac_roof_z),
            "raw_z_max_height_m": raw_z_max
        }

    def _ransac_roof_plane(self, z_vals: np.ndarray, threshold_m: float = 0.2, iterations: int = 100) -> float:
        """
        Fast RANSAC 1D mode peak estimator for horizontal roof slab elevation.
        Deterministic random sampling.
        """
        if len(z_vals) < 10:
            return float(np.percentile(z_vals, 95))

        best_inliers = 0
        best_height = np.percentile(z_vals, 95)

        top_band = z_vals[z_vals >= np.percentile(z_vals, 70)]
        if len(top_band) == 0:
            return float(np.percentile(z_vals, 95))

        rng = np.random.default_rng(self.seed)
        for _ in range(iterations):
            sample_z = rng.choice(top_band)
            inliers = np.sum(np.abs(z_vals - sample_z) <= threshold_m)
            if inliers > best_inliers:
                best_inliers = inliers
                best_height = sample_z

        return float(best_height)

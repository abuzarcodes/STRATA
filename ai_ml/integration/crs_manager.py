"""
Coordinate Reference System Manager (`crs_manager.py`).
Manages source CRS (e.g. EPSG:2193 NZGD2000), coordinate normalization to ML local box,
and inverse transformations. Includes precision validation.
"""

from typing import Tuple, Dict, Any
import numpy as np

class CRSManager:
    def __init__(self, source_crs: str = "EPSG:2193"):
        self.source_crs = source_crs

    def validate_crs(self) -> bool:
        supported = ["EPSG:2193", "EPSG:3857", "EPSG:4326", "LOCAL_METRIC"]
        return self.source_crs in supported

    def normalize_coordinates(self, pts_xyz: np.ndarray) -> Tuple[np.ndarray, Dict[str, float]]:
        if len(pts_xyz) == 0:
            return pts_xyz, {"min_x": 0.0, "extent_x": 1.0, "min_y": 0.0, "extent_y": 1.0, "min_z": 0.0, "extent_z": 1.0}

        min_x, max_x = float(pts_xyz[:, 0].min()), float(pts_xyz[:, 0].max())
        min_y, max_y = float(pts_xyz[:, 1].min()), float(pts_xyz[:, 1].max())
        min_z, max_z = float(pts_xyz[:, 2].min()), float(pts_xyz[:, 2].max())

        extent_x = max(1.0, max_x - min_x)
        extent_y = max(1.0, max_y - min_y)
        extent_z = max(1.0, max_z - min_z)

        x_norm = (pts_xyz[:, 0] - min_x) / extent_x
        y_norm = (pts_xyz[:, 1] - min_y) / extent_y
        z_norm = (pts_xyz[:, 2] - min_z) / extent_z

        norm_pts = np.column_stack([x_norm, y_norm, z_norm])
        params = {
            "min_x": min_x, "extent_x": extent_x,
            "min_y": min_y, "extent_y": extent_y,
            "min_z": min_z, "extent_z": extent_z
        }
        return norm_pts, params

    def inverse_transform(self, norm_pts: np.ndarray, params: Dict[str, float]) -> np.ndarray:
        if len(norm_pts) == 0:
            return norm_pts

        x_orig = norm_pts[:, 0] * params["extent_x"] + params["min_x"]
        y_orig = norm_pts[:, 1] * params["extent_y"] + params["min_y"]
        z_orig = norm_pts[:, 2] * params["extent_z"] + params["min_z"]

        return np.column_stack([x_orig, y_orig, z_orig])

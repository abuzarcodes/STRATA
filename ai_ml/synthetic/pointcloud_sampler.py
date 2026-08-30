"""
Modular Synthetic Point Cloud Sampler.
Samples 3D spatial points from parametric building geometry & ground planes.
Outputs point cloud matrices [X, Y, Z, Intensity, ReturnNumber, Classification].
Classifications follow ASPRS standard: 1=Unclassified, 2=Ground, 6=Building.
"""

from typing import Tuple, List, Optional
import numpy as np
from ai_ml.schemas.ground_truth_schema import GroundTruthScene, BuildingGT


class PointCloudSampler:
    """
    Synthesizes 3D point cloud measurements from exact ground truth scene geometry.
    """

    def __init__(self, target_density_pts_per_sqm: float = 25.0, seed: int = 42):
        self.target_density = target_density_pts_per_sqm
        self.rng = np.random.default_rng(seed)

    def sample_scene(self, scene: GroundTruthScene) -> np.ndarray:
        """
        Samples points for ground plane + all buildings in scene.
        Returns Nx6 array: [X, Y, Z, Intensity, ReturnNum, Classification]
        """
        all_points: List[np.ndarray] = []

        # 1. Ground Plane Sampling (Parcel footprint)
        parcel_poly = np.array(scene.parcel.parcel_polygon)
        x_min, y_min = parcel_poly.min(axis=0)
        x_max, y_max = parcel_poly.max(axis=0)

        ground_area = (x_max - x_min) * (y_max - y_min)
        num_ground = int(ground_area * self.target_density)
        
        gx = self.rng.uniform(x_min, x_max, num_ground)
        gy = self.rng.uniform(y_min, y_max, num_ground)
        gz = np.zeros(num_ground)  # Z = 0 for ground
        g_intensity = self.rng.normal(50, 10, num_ground).clip(10, 255)
        g_returns = np.ones(num_ground, dtype=int)
        g_class = np.full(num_ground, 2)  # 2 = Ground

        ground_pts = np.column_stack([gx, gy, gz, g_intensity, g_returns, g_class])
        all_points.append(ground_pts)

        # 2. Building Points Sampling (Roofs, Facades, Floors)
        for building in scene.buildings:
            b_pts = self._sample_building(building)
            all_points.append(b_pts)

        return np.vstack(all_points)

    def _sample_building(self, building: BuildingGT) -> np.ndarray:
        poly = np.array(building.footprint_polygon)
        x_min, y_min = poly.min(axis=0)
        x_max, y_max = poly.max(axis=0)
        width = x_max - x_min
        length = y_max - y_min

        pts: List[np.ndarray] = []

        # A. Roof Surface Points
        roof_z = building.ground_elevation_m + building.total_height_m
        roof_area = width * length
        num_roof = int(roof_area * self.target_density)

        rx = self.rng.uniform(x_min, x_max, num_roof)
        ry = self.rng.uniform(y_min, y_max, num_roof)
        rz = np.full(num_roof, roof_z) + self.rng.normal(0, 0.02, num_roof)  # slight measurement noise
        r_intensity = self.rng.normal(180, 15, num_roof).clip(100, 255)
        r_returns = np.ones(num_roof, dtype=int)
        r_class = np.full(num_roof, 6)  # 6 = Building

        roof_pts = np.column_stack([rx, ry, rz, r_intensity, r_returns, r_class])
        pts.append(roof_pts)

        # B. Facade Wall Points
        facade_area = 2 * (width + length) * building.total_height_m
        num_facade = int(facade_area * self.target_density * 0.4)  # lower density on vertical facades

        fz = self.rng.uniform(0, building.total_height_m, num_facade)
        # Randomly distribute along perimeter
        perimeter_len = 2 * (width + length)
        perim_pos = self.rng.uniform(0, perimeter_len, num_facade)

        fx, fy = np.zeros(num_facade), np.zeros(num_facade)
        for i, pos in enumerate(perim_pos):
            if pos < width:
                fx[i] = x_min + pos
                fy[i] = y_min
            elif pos < width + length:
                fx[i] = x_max
                fy[i] = y_min + (pos - width)
            elif pos < 2 * width + length:
                fx[i] = x_max - (pos - (width + length))
                fy[i] = y_max
            else:
                fx[i] = x_min
                fy[i] = y_max - (pos - (2 * width + length))

        f_intensity = self.rng.normal(120, 20, num_facade).clip(50, 255)
        f_returns = np.ones(num_facade, dtype=int)
        f_class = np.full(num_facade, 6)

        facade_pts = np.column_stack([fx, fy, fz, f_intensity, f_returns, f_class])
        pts.append(facade_pts)

        # C. Floor Slab Concentration Points (Dense horizontal rings at slab levels for Z-histogram peaks)
        for floor in building.floors:
            slab_z = floor.z_max_m
            num_slab = int(roof_area * self.target_density * 0.3)
            sx = self.rng.uniform(x_min, x_max, num_slab)
            sy = self.rng.uniform(y_min, y_max, num_slab)
            sz = np.full(num_slab, slab_z) + self.rng.normal(0, 0.03, num_slab)
            s_intensity = self.rng.normal(150, 15, num_slab).clip(80, 255)
            s_returns = np.ones(num_slab, dtype=int)
            s_class = np.full(num_slab, 6)
            pts.append(np.column_stack([sx, sy, sz, s_intensity, s_returns, s_class]))

        return np.vstack(pts)

    def export_xyz(self, points: np.ndarray, file_path: str):
        """Exports points to ASCII XYZ format."""
        fmt = "%.3f %.3f %.3f %d %d %d"
        header = "X Y Z Intensity ReturnNumber Classification"
        np.savetxt(file_path, points, fmt=fmt, header=header, comments="")

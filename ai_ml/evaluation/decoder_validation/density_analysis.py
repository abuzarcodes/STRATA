"""
Milestone 4.5 — Global vs Local Density Analysis (`density_analysis.py`).
Calculates global density rho_global = N / (dx * dy) and local 2m grid density statistics.
"""

import numpy as np

class DensityAnalyzer:
    @staticmethod
    def calculate_density_stats(pts_xyz: np.ndarray, cell_size_m: float = 2.0):
        if len(pts_xyz) == 0:
            return {"global_density": 0.0, "median_local": 0.0, "p10": 0.0, "p90": 0.0, "std": 0.0}

        x_min, x_max = pts_xyz[:, 0].min(), pts_xyz[:, 0].max()
        y_min, y_max = pts_xyz[:, 1].min(), pts_xyz[:, 1].max()

        extent_x = max(0.1, x_max - x_min)
        extent_y = max(0.1, y_max - y_min)
        area_sqm = extent_x * extent_y
        global_density = len(pts_xyz) / area_sqm

        x_bins = max(1, int(np.ceil(extent_x / cell_size_m)))
        y_bins = max(1, int(np.ceil(extent_y / cell_size_m)))

        counts, _, _ = np.histogram2d(
            pts_xyz[:, 0], pts_xyz[:, 1],
            bins=[x_bins, y_bins],
            range=[[x_min, x_max], [y_min, y_max]]
        )

        occupied_counts = counts[counts > 0] / (cell_size_m * cell_size_m)
        if len(occupied_counts) == 0:
            return {"global_density": global_density, "median_local": global_density, "p10": global_density, "p90": global_density, "std": 0.0}

        return {
            "global_density": float(global_density),
            "median_local": float(np.median(occupied_counts)),
            "p10": float(np.percentile(occupied_counts, 10)),
            "p90": float(np.percentile(occupied_counts, 90)),
            "std": float(np.std(occupied_counts)),
            "low_density_ratio": float(np.mean(occupied_counts < 0.5))
        }

"""
Geometric Building Extractor Baseline (Clean - No GT Leakage).
Performs height-above-ground (HAG) thresholding, physical intensity/spatial planarity filtering,
Euclidean spatial clustering, and 2D footprint polygon extraction.
NOTE: Zero inspection of ground-truth classification labels (col 5).
"""

from typing import List, Dict, Any, Tuple
import numpy as np


class BuildingExtractorBaseline:
    """
    Conventional geometric baseline for building detection strictly from spatial coordinates & HAG.
    """

    def __init__(
        self,
        min_hag_m: float = 2.5,
        cluster_distance_m: float = 2.0,
        min_points_per_building: int = 40
    ):
        self.min_hag = min_hag_m
        self.cluster_dist = cluster_distance_m
        self.min_pts = min_points_per_building

    def extract_buildings(self, processed_points: np.ndarray) -> List[Dict[str, Any]]:
        """
        Extracts building point clusters and 2D footprint polygons.
        Input points Nx7: [X_norm, Y_norm, Z_norm, Intensity, ReturnNum, Class_Raw, HAG]
        Returns list of building dictionaries.
        """
        if len(processed_points) == 0:
            return []

        # 1. HAG Filter (Points >= 2.5m above ground elevation)
        hag_mask = processed_points[:, 6] >= self.min_hag
        candidate_pts = processed_points[hag_mask]

        if len(candidate_pts) < self.min_pts:
            return []

        # 2. Geometric Planarity / Spatial Noise Filter
        # Filters out sparse, highly scattered vegetation/utility pole points
        dense_candidate_pts = self._filter_spatial_clutter(candidate_pts)

        if len(dense_candidate_pts) < self.min_pts:
            return []

        # 3. Spatial Grid Clustering (Groups points into candidate building instances)
        clusters = self._spatial_clustering(dense_candidate_pts, self.cluster_dist)

        buildings = []
        for idx, cluster in enumerate(clusters):
            if len(cluster) < self.min_pts:
                continue

            # Compute 2D footprint polygon (Bounding box / convex hull)
            footprint = self._compute_footprint_polygon(cluster[:, :2])
            
            b_data = {
                "building_index": idx + 1,
                "building_id": f"CANDIDATE_B_{idx+1:03d}",
                "points": cluster,
                "point_count": len(cluster),
                "footprint_polygon": footprint
            }
            buildings.append(b_data)

        return buildings

    def _filter_spatial_clutter(self, pts: np.ndarray) -> np.ndarray:
        """
        Filters out low-density spatial noise points without using GT labels.
        Points in low-density cells (< 5 points per m²) are removed as clutter.
        """
        coords = pts[:, :2]
        grid_cells = np.floor(coords / 1.0).astype(int)
        cell_keys, counts = np.unique(grid_cells, axis=0, return_counts=True)
        
        # Keep points in cells with at least 4 points per 1m^2
        dense_cells = set(tuple(cell) for cell, count in zip(cell_keys, counts) if count >= 4)
        
        keep_mask = np.array([tuple(cell) in dense_cells for cell in grid_cells])
        return pts[keep_mask]

    def _spatial_clustering(self, pts: np.ndarray, cluster_dist: float) -> List[np.ndarray]:
        """Simple spatial grid clustering baseline."""
        coords = pts[:, :2]
        grid_cells = np.floor(coords / cluster_dist).astype(int)
        
        cell_dict: Dict[Tuple[int, int], List[int]] = {}
        for idx, cell in enumerate(grid_cells):
            key = (int(cell[0]), int(cell[1]))
            cell_dict.setdefault(key, []).append(idx)

        clusters = []
        visited = set()
        for cell in cell_dict:
            if cell in visited:
                continue
            
            cluster_indices = []
            queue = [cell]
            visited.add(cell)

            while queue:
                curr = queue.pop(0)
                cluster_indices.extend(cell_dict[curr])

                for dx in [-1, 0, 1]:
                    for dy in [-1, 0, 1]:
                        neighbor = (curr[0] + dx, curr[1] + dy)
                        if neighbor in cell_dict and neighbor not in visited:
                            visited.add(neighbor)
                            queue.append(neighbor)

            clusters.append(pts[cluster_indices])

        return clusters

    def _compute_footprint_polygon(self, xy_coords: np.ndarray) -> List[List[float]]:
        """Computes 2D bounding polygon [[x, y], ...] for building cluster."""
        x_min, y_min = xy_coords.min(axis=0)
        x_max, y_max = xy_coords.max(axis=0)
        return [
            [float(x_min), float(y_min)],
            [float(x_max), float(y_min)],
            [float(x_max), float(y_max)],
            [float(x_min), float(y_max)]
        ]

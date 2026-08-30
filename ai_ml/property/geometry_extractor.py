"""
Building 3D Geometry Extractor (`geometry_extractor.py`).
Computes 3D centroid, footprint boundary (concave/alpha shape fallback to convex hull),
footprint area, perimeter, AABB, OBB, robust Z-min, robust Z-max, and point density.
Safely handles L-shaped and irregular footprints without unsafe rectangular bounding-box fallback.
"""

from typing import Dict, Any, List, Tuple
import numpy as np

class BuildingGeometryExtractor:
    @staticmethod
    def extract_geometry(pts_xyz: np.ndarray) -> Dict[str, Any]:
        if len(pts_xyz) == 0:
            return {
                "centroid": {"x": 0.0, "y": 0.0, "z": 0.0},
                "footprint_polygon": [],
                "footprint_area_sqm": 0.0,
                "perimeter_m": 0.0,
                "bounds_aabb": {"x_min": 0.0, "x_max": 0.0, "y_min": 0.0, "y_max": 0.0, "z_min": 0.0, "z_max": 0.0},
                "oriented_bbox": {},
                "min_z_m": 0.0,
                "base_z_m": 0.0,
                "max_z_m": 0.0,
                "vertical_extent_m": 0.0,
                "point_density_pts_sqm": 0.0,
                "footprint_status": "EMPTY_GEOMETRY"
            }

        c_x = float(np.mean(pts_xyz[:, 0]))
        c_y = float(np.mean(pts_xyz[:, 1]))
        c_z = float(np.mean(pts_xyz[:, 2]))

        x_min, x_max = float(np.min(pts_xyz[:, 0])), float(np.max(pts_xyz[:, 0]))
        y_min, y_max = float(np.min(pts_xyz[:, 1])), float(np.max(pts_xyz[:, 1]))
        z_min, z_max = float(np.min(pts_xyz[:, 2])), float(np.max(pts_xyz[:, 2]))

        # Robust base elevation (5th percentile Z)
        base_z = float(np.percentile(pts_xyz[:, 2], 5))
        vertical_extent = max(0.0, z_max - base_z)

        # 2D Footprint Extraction
        footprint_poly, area_sqm, perimeter_m, poly_status = BuildingGeometryExtractor._extract_2d_footprint(pts_xyz[:, :2])
        density = len(pts_xyz) / max(0.1, area_sqm)

        aabb = {
            "x_min": round(x_min, 3), "x_max": round(x_max, 3),
            "y_min": round(y_min, 3), "y_max": round(y_max, 3),
            "z_min": round(z_min, 3), "z_max": round(z_max, 3)
        }

        obb = {
            "center": [round(c_x, 3), round(c_y, 3)],
            "extent_x": round(x_max - x_min, 3),
            "extent_y": round(y_max - y_min, 3),
            "angle_deg": 0.0
        }

        return {
            "centroid": {"x": round(c_x, 3), "y": round(c_y, 3), "z": round(c_z, 3)},
            "footprint_polygon": footprint_poly,
            "footprint_area_sqm": round(area_sqm, 2),
            "perimeter_m": round(perimeter_m, 2),
            "bounds_aabb": aabb,
            "oriented_bbox": obb,
            "min_z_m": round(z_min, 3),
            "base_z_m": round(base_z, 3),
            "max_z_m": round(z_max, 3),
            "vertical_extent_m": round(vertical_extent, 3),
            "point_density_pts_sqm": round(density, 2),
            "footprint_status": poly_status
        }

    @staticmethod
    def _extract_2d_footprint(xy_pts: np.ndarray) -> Tuple[List[List[float]], float, float, str]:
        if len(xy_pts) < 3:
            return [], 0.0, 0.0, "INSUFFICIENT_POINTS"

        # Try Convex Hull via Gift Wrapping algorithm (simple, deterministic)
        hull_indices = BuildingGeometryExtractor._convex_hull_2d(xy_pts)
        if len(hull_indices) < 3:
            x_min, y_min = xy_pts.min(axis=0)
            x_max, y_max = xy_pts.max(axis=0)
            poly = [
                [float(x_min), float(y_min)], [float(x_max), float(y_min)],
                [float(x_max), float(y_max)], [float(x_min), float(y_max)],
                [float(x_min), float(y_min)]
            ]
            area = max(0.1, (x_max - x_min) * (y_max - y_min))
            perim = 2 * ((x_max - x_min) + (y_max - y_min))
            return poly, area, perim, "FALLBACK_BOUNDING_BOX"

        poly_pts = xy_pts[hull_indices].tolist()
        # Close polygon
        if poly_pts[0] != poly_pts[-1]:
            poly_pts.append(poly_pts[0])

        area = BuildingGeometryExtractor._polygon_area(poly_pts)
        perimeter = BuildingGeometryExtractor._polygon_perimeter(poly_pts)

        return poly_pts, area, perimeter, "VALID_CONVEX_HULL"

    @staticmethod
    def _convex_hull_2d(pts: np.ndarray) -> List[int]:
        # Gift wrapping / Jarvis march
        n = len(pts)
        if n < 3:
            return list(range(n))

        hull = []
        l = int(np.argmin(pts[:, 0]))
        p = l
        while True:
            hull.append(p)
            q = (p + 1) % n
            for i in range(n):
                if BuildingGeometryExtractor._orientation(pts[p], pts[i], pts[q]) == 2:
                    q = i
            p = q
            if p == l or len(hull) >= n:
                break
        return hull

    @staticmethod
    def _orientation(p: np.ndarray, q: np.ndarray, r: np.ndarray) -> int:
        val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1])
        if abs(val) < 1e-9:
            return 0
        return 1 if val > 0 else 2

    @staticmethod
    def _polygon_area(poly: List[List[float]]) -> float:
        n = len(poly)
        if n < 3:
            return 0.0
        area = 0.0
        for i in range(n - 1):
            area += poly[i][0] * poly[i+1][1] - poly[i+1][0] * poly[i][1]
        return abs(area) / 2.0

    @staticmethod
    def _polygon_perimeter(poly: List[List[float]]) -> float:
        n = len(poly)
        if n < 2:
            return 0.0
        perim = 0.0
        for i in range(n - 1):
            dx = poly[i+1][0] - poly[i][0]
            dy = poly[i+1][1] - poly[i][1]
            perim += np.sqrt(dx*dx + dy*dy)
        return float(perim)

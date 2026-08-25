"""
extrusion_engine.py - 2D-to-3D Volumetric Extrusion and Mesh Construction Engine.
Transforms planar cadastral polygons into watertight 3D polyhedrons (ISO 19152 LADM / CityGML LoD2/LoD3).
Computes exact volume, carpet area, bounding boxes, and performs mesh validation.
"""

from typing import List, Tuple, Dict, Any
import numpy as np
from shapely.geometry import Polygon
import trimesh
from coordinates import default_converter


class ExtrusionEngine:
    def __init__(self, geodetic_converter=default_converter):
        self.converter = geodetic_converter

    def extrude_polygon_to_mesh(
        self,
        poly_2d: List[Tuple[float, float]],
        z_min: float,
        z_max: float
    ) -> Dict[str, Any]:
        """
        Extrudes a 2D closed polygon [(x, y), ...] between z_min and z_max.
        Returns vertices, faces, volume, carpet area, and watertight status.
        """
        # Ensure clean coordinates without duplicate consecutive points
        clean_pts = []
        for i, pt in enumerate(poly_2d):
            if i == 0 or (pt[0] != poly_2d[i-1][0] or pt[1] != poly_2d[i-1][1]):
                clean_pts.append(pt)
        # Remove closing point if equal to start
        if len(clean_pts) > 1 and clean_pts[0] == clean_pts[-1]:
            clean_pts.pop()
        
        n_pts = len(clean_pts)
        if n_pts < 3:
            raise ValueError(f"Polygon must have at least 3 unique vertices, got {n_pts}")

        # Compute 2D carpet area
        shapely_poly = Polygon(clean_pts)
        if not shapely_poly.is_valid:
            shapely_poly = shapely_poly.buffer(0)
        carpet_area_m2 = round(shapely_poly.area, 2)

        # Build 3D vertices:
        # 0 .. n_pts-1 = bottom vertices (z_min)
        # n_pts .. 2*n_pts-1 = top vertices (z_max)
        vertices = []
        for pt in clean_pts:
            vertices.append([pt[0], pt[1], z_min])
        for pt in clean_pts:
            vertices.append([pt[0], pt[1], z_max])
        
        vertices = np.array(vertices, dtype=np.float64)

        # Triangulate top and bottom caps using mapbox_earcut or trimesh
        try:
            import mapbox_earcut
            coords_flat = np.array(clean_pts, dtype=np.float64).reshape(-1, 2)
            rings = np.array([len(clean_pts)], dtype=np.uint32)
            triangles_idx = mapbox_earcut.triangulate_float64(coords_flat, rings)
            triangles_2d = triangles_idx.reshape(-1, 3)
        except Exception:
            triangles_2d = trimesh.creation.triangulate_polygon(shapely_poly, engine="earcut")[0]
        
        faces = []
        # Bottom cap (reversed normal for outward orientation)
        for tri in triangles_2d:
            faces.append([int(tri[0]), int(tri[2]), int(tri[1])])
        
        # Top cap
        for tri in triangles_2d:
            faces.append([int(tri[0]) + n_pts, int(tri[1]) + n_pts, int(tri[2]) + n_pts])

        # Side walls (connect bottom ring to top ring)
        for i in range(n_pts):
            next_i = (i + 1) % n_pts
            b0 = i
            b1 = next_i
            t0 = i + n_pts
            t1 = next_i + n_pts
            # Quad (b0, b1, t1, t0) split into 2 triangles
            faces.append([b0, b1, t1])
            faces.append([b0, t1, t0])

        faces = np.array(faces, dtype=np.int64)

        # Create Trimesh object for geometry checks & repair
        mesh = trimesh.Trimesh(vertices=vertices, faces=faces, process=True)
        
        # Ensure correct normal orientation
        trimesh.repair.fix_normals(mesh)
        trimesh.repair.fix_inversion(mesh)
        
        is_watertight = bool(mesh.is_watertight)
        volume_m3 = round(abs(mesh.volume), 2)
        
        # Centroid and Bounding Box in local metric coordinates
        centroid = (round(mesh.centroid[0], 3), round(mesh.centroid[1], 3), round(mesh.centroid[2], 3))
        bounds = mesh.bounds  # [[min_x, min_y, min_z], [max_x, max_y, max_z]]
        bbox = (
            round(bounds[0][0], 2), round(bounds[0][1], 2), round(bounds[0][2], 2),
            round(bounds[1][0], 2), round(bounds[1][1], 2), round(bounds[1][2], 2)
        )

        # Convert vertices to WGS84 Geodetic for GIS streaming
        wgs84_vertices = []
        for v in vertices:
            lon, lat, alt = self.converter.local_meters_to_wgs84(v[0], v[1], v[2])
            wgs84_vertices.append([lon, lat, alt])

        center_lon, center_lat, center_alt = self.converter.local_meters_to_wgs84(centroid[0], centroid[1], centroid[2])

        return {
            "carpet_area_m2": carpet_area_m2,
            "volume_m3": volume_m3,
            "is_watertight": is_watertight,
            "centroid_local": centroid,
            "bbox_local": bbox,
            "centroid_wgs84": (center_lon, center_lat, center_alt),
            "vertices_local": vertices.tolist(),
            "vertices_wgs84": wgs84_vertices,
            "faces": faces.tolist(),
            "mesh_object": mesh
        }


# Singleton engine
extrusion_engine = ExtrusionEngine()

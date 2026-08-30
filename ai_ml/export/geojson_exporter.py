"""
GeoJSON FeatureCollection Exporter (`geojson_exporter.py`).
Exports 2D building footprints with 3D height/floor attributes and legal disclaimers.
"""

import json
from pathlib import Path
from typing import Dict, Any, List

class GeoJSONExporter:
    @staticmethod
    def export_geojson(hierarchy_data: Dict[str, Any], output_path: Path) -> str:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        features = []

        bldgs = hierarchy_data.get("building_candidates", [])
        for b in bldgs:
            geom_info = b.get("geometry", {})
            poly = geom_info.get("footprint_polygon", [])
            if len(poly) >= 3:
                props = {
                    "candidate_instance_id": b.get("candidate_instance_id"),
                    "status": b.get("status"),
                    "height_m": b.get("height", {}).get("height_m"),
                    "base_z_m": b.get("height", {}).get("base_z_m"),
                    "roof_z_m": b.get("height", {}).get("roof_z_m"),
                    "candidate_floor_count": b.get("floors", {}).get("candidate_floor_count"),
                    "point_count": b.get("point_count"),
                    "footprint_area_sqm": geom_info.get("footprint_area_sqm"),
                    "is_legal_boundary": False,
                    "requires_surveyor_validation": True,
                    "legal_disclaimer": "AI PREDICTION ONLY. Candidate evidence for surveyor review."
                }
                feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [poly]
                    },
                    "properties": props
                }
                features.append(feature)

        geojson_obj = {
            "type": "FeatureCollection",
            "crs": {
                "type": "name",
                "properties": {"name": hierarchy_data.get("spatial_reference", {}).get("crs", "EPSG:2193")}
            },
            "features": features
        }

        output_path.write_text(json.dumps(geojson_obj, indent=2), encoding="utf-8")
        return str(output_path)

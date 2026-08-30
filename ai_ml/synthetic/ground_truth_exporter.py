"""
Modular Ground Truth Exporter.
Exports GroundTruthScene objects to standardized JSON & GeoJSON files.
Ensures ground truth remains completely isolated from model predictions.
"""

import json
from pathlib import Path
from typing import Dict, Any
from ai_ml.schemas.ground_truth_schema import GroundTruthScene


class GroundTruthExporter:
    """
    Handles serialization of GroundTruthScene to JSON & GeoJSON formats.
    """

    @staticmethod
    def export_json(scene: GroundTruthScene, output_path: str):
        """Exports ground truth scene to JSON file."""
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(scene.model_dump_json(indent=2))

    @staticmethod
    def export_geojson(scene: GroundTruthScene, output_path: str):
        """Exports building footprint polygons to GeoJSON format."""
        features = []
        for b in scene.buildings:
            feat = {
                "type": "Feature",
                "properties": {
                    "building_id": b.building_id,
                    "archetype": b.archetype,
                    "total_height_m": b.total_height_m,
                    "floor_count": b.floor_count,
                    "ground_elevation_m": b.ground_elevation_m
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [b.footprint_polygon]
                }
            }
            features.append(feat)

        geojson_doc = {
            "type": "FeatureCollection",
            "name": f"GroundTruth_{scene.scene_id}",
            "features": features
        }

        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(geojson_doc, f, indent=2)

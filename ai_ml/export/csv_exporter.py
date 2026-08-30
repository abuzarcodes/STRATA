"""
Tabular Building Candidate CSV Exporter (`csv_exporter.py`).
"""

import csv
from pathlib import Path
from typing import Dict, Any

class CSVExporter:
    @staticmethod
    def export_csv(hierarchy_data: Dict[str, Any], output_path: Path) -> str:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        headers = [
            "candidate_instance_id", "status", "point_count", "centroid_x", "centroid_y", "centroid_z",
            "footprint_area_sqm", "height_m", "base_z_m", "roof_z_m", "candidate_floor_count",
            "is_legal_boundary", "requires_surveyor_validation"
        ]

        rows = []
        bldgs = hierarchy_data.get("building_candidates", [])
        for b in bldgs:
            geom = b.get("geometry", {})
            cent = geom.get("centroid", {})
            h = b.get("height", {})
            fl = b.get("floors", {})
            rows.append([
                b.get("candidate_instance_id"),
                b.get("status"),
                b.get("point_count"),
                cent.get("x"), cent.get("y"), cent.get("z"),
                geom.get("footprint_area_sqm"),
                h.get("height_m"), h.get("base_z_m"), h.get("roof_z_m"),
                fl.get("candidate_floor_count"),
                False, True
            ])

        with open(output_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            writer.writerows(rows)

        return str(output_path)

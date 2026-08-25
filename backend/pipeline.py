"""
pipeline.py - Master Orchestration Pipeline for AuraCadastre 3D.
Executes ingestion, 3D volumetric extrusion, 3D ULPIN generation, topology validation,
and JSON / GeoJSON export for GIS and WebGIS streaming.
"""

import json
import os
from coordinates import default_converter
from generate_delhi_society_data import generate_cadastral_society_dataset
from extrusion_engine import extrusion_engine
from ulpin_generator import ULPINGenerator
from topology_validator import TopologyValidator


def run_pipeline():
    print("=" * 70)
    print("  AURACADASTRE 3D: Automated 3D ULPIN Cadastral Framework Pipeline")
    print("=" * 70)

    # 1. Ingest / Generate Society Ground Truth
    print("[1/5] Ingesting Cadastral Society Dataset (Dwarka Sector 10, New Delhi)...")
    dataset = generate_cadastral_society_dataset()
    base_ulpin = dataset["base_ulpin"]
    ulpin_gen = ULPINGenerator(base_ulpin=base_ulpin)
    
    # 2. 3D Volumetric Extrusion & Mesh Generation
    print("[2/5] Extruding 2D cadastral polygons into watertight 3D polyhedrons...")
    processed_units = []
    
    for u in dataset["units"]:
        mesh_data = extrusion_engine.extrude_polygon_to_mesh(
            poly_2d=u["poly_2d"],
            z_min=u["z_min"],
            z_max=u["z_max"]
        )
        
        # 3. Generate Standardized 3D-ULPIN
        ulpin_record = ulpin_gen.generate_3d_ulpin(
            domain_flag=u["domain"],
            floor_index=u["level"],
            unit_code=u["unit_id"],
            centroid=mesh_data["centroid_local"],
            bbox=mesh_data["bbox_local"]
        )
        
        merged_unit = {
            **u,
            **mesh_data,
            **ulpin_record
        }
        # Drop raw trimesh object for clean JSON serialization
        del merged_unit["mesh_object"]
        processed_units.append(merged_unit)

    print(f"      Processed {len(processed_units)} 3D polyhedral units.")

    # 4. Topology and Encroachment Auditing
    print("[3/5] Running 3D Topology Audit & Encroachment Detection...")
    validator = TopologyValidator(dataset["parcel_boundary_local"])
    audit_report = validator.run_full_cadastral_audit(processed_units)
    
    print(f"      Status: {audit_report['overall_cadastral_status']}")
    print(f"      Compliant Units: {audit_report['compliant_units']}/{audit_report['total_units_audited']}")
    print(f"      Violations Flagged: {audit_report['violation_count']}")
    if audit_report["air_rights_violations"]:
        for v in audit_report["air_rights_violations"]:
            print(f"      [!] AIR-RIGHTS VIOLATION: {v['name']} ({v['ulpin_3d']}) -> {v['violation']['description']}")
    if audit_report["subsurface_violations"]:
        for v in audit_report["subsurface_violations"]:
            print(f"      [!] SUBSURFACE VIOLATION: {v['name']} ({v['ulpin_3d']}) -> {v['violation']['description']}")

    # 5. Build Master Cadastre 3D Registry Package
    print("[4/5] Building Master 3D Cadastre Registry...")
    registry_package = {
        "metadata": {
            "system": "AuraCadastre 3D Land Administration Platform",
            "standard_compliance": ["ISO 19152 LADM Part 2", "OGC CityGML 3.0", "Bhu-Aadhaar 3D Specification"],
            "society_name": dataset["society_name"],
            "locality": dataset["locality"],
            "state": dataset["state_code"],
            "district": dataset["district"],
            "sub_registrar_office": dataset["sub_registrar_office"],
            "base_ulpin": base_ulpin,
            "anchor_wgs84": {
                "latitude": default_converter.origin_lat,
                "longitude": default_converter.origin_lon,
                "elevation_msl": default_converter.origin_alt
            },
            "total_registered_units": len(processed_units),
            "total_carpet_area_m2": round(sum(u["carpet_area_m2"] for u in processed_units), 2),
            "total_volume_m3": round(sum(u["volume_m3"] for u in processed_units), 2),
        },
        "audit_summary": audit_report,
        "parcel_boundary": {
            "local_coordinates": dataset["parcel_boundary_local"],
            "wgs84_coordinates": default_converter.transform_polygon_to_wgs84(dataset["parcel_boundary_local"], 0.0)
        },
        "context_layers": {
            "north_road_wgs84": default_converter.transform_polygon_to_wgs84(dataset["context_layers"]["north_road"], 0.0),
            "east_road_wgs84": default_converter.transform_polygon_to_wgs84(dataset["context_layers"]["east_road"], 0.0),
            "neighbor_west_wgs84": default_converter.transform_polygon_to_wgs84(dataset["context_layers"]["neighbor_west"], 0.0),
            "neighbor_south_wgs84": default_converter.transform_polygon_to_wgs84(dataset["context_layers"]["neighbor_south"], 0.0),
            "north_road_local": dataset["context_layers"]["north_road"],
            "east_road_local": dataset["context_layers"]["east_road"],
            "neighbor_west_local": dataset["context_layers"]["neighbor_west"],
            "neighbor_south_local": dataset["context_layers"]["neighbor_south"]
        },
        "units": processed_units
    }

    # 6. Save JSON and GeoJSON outputs
    print("[5/5] Exporting Data Assets...")
    backend_data_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(backend_data_dir, exist_ok=True)
    
    registry_file = os.path.join(backend_data_dir, "cadastre_3d_registry.json")
    with open(registry_file, "w", encoding="utf-8") as f:
        json.dump(registry_package, f, indent=2)
    print(f"      Saved: {registry_file}")

    # Build 3D GeoJSON FeatureCollection
    features = []
    
    # Add Parcel Surface boundary
    features.append({
        "type": "Feature",
        "properties": {
            "feature_type": "SURFACE_PARCEL",
            "base_ulpin": base_ulpin,
            "ulpin_3d": f"{base_ulpin}-S00-0000",
            "name": "Surface Land Parcel Boundary"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [default_converter.transform_polygon_to_wgs84(dataset["parcel_boundary_local"], 0.0)]
        }
    })

    # Add each 3D unit as a 3D MultiPolygon
    for u in processed_units:
        # Construct top and bottom rings
        ring_bottom = default_converter.transform_polygon_to_wgs84(u["poly_2d"], u["z_min"])
        ring_top = default_converter.transform_polygon_to_wgs84(u["poly_2d"], u["z_max"])
        
        features.append({
            "type": "Feature",
            "properties": {
                "feature_type": "3D_SPATIAL_UNIT",
                "ulpin_3d": u["ulpin_3d"],
                "base_ulpin": u["base_ulpin"],
                "unit_id": u["unit_id"],
                "name": u["name"],
                "level": u["level"],
                "domain": u["domain"],
                "type": u["type"],
                "owner": u["owner"],
                "carpet_area_m2": u["carpet_area_m2"],
                "volume_m3": u["volume_m3"],
                "z_min_msl": round(default_converter.origin_alt + u["z_min"], 2),
                "z_max_msl": round(default_converter.origin_alt + u["z_max"], 2),
                "is_watertight": u["is_watertight"],
                "has_violation": u["unit_id"] in [v["unit_id"] for v in audit_report["air_rights_violations"] + audit_report["subsurface_violations"]]
            },
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": [[ring_bottom], [ring_top]]
            }
        })

    geojson_package = {
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}
        },
        "features": features
    }

    geojson_file = os.path.join(backend_data_dir, "delhi_society_3d.geojson")
    with open(geojson_file, "w", encoding="utf-8") as f:
        json.dump(geojson_package, f, indent=2)
    print(f"      Saved: {geojson_file}")

    # Also prepare frontend direct copy if frontend exists or create frontend data directory
    frontend_data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "data"))
    os.makedirs(frontend_data_dir, exist_ok=True)
    frontend_target_file = os.path.join(frontend_data_dir, "societyData.json")
    with open(frontend_target_file, "w", encoding="utf-8") as f:
        json.dump(registry_package, f, indent=2)
    print(f"      Synced to Frontend: {frontend_target_file}")

    print("\n  [SUCCESS] 3D Cadastral Pipeline Completed Successfully!")
    print("=" * 70)
    return registry_package


if __name__ == "__main__":
    run_pipeline()

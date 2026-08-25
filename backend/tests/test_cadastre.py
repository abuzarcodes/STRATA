"""
test_cadastre.py - Automated tests for 3D ULPIN geometry, watertightness, spatial hashing, and collision detection.
"""

import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from coordinates import GeodeticConverter
from ulpin_generator import ULPINGenerator
from extrusion_engine import ExtrusionEngine
from generate_delhi_society_data import generate_cadastral_society_dataset
from topology_validator import TopologyValidator


def test_geodetic_coordinate_roundtrip():
    conv = GeodeticConverter(origin_lat=28.5823, origin_lon=77.0602, origin_alt=215.0)
    orig_x, orig_y, orig_z = 15.5, -8.2, 9.0
    lon, lat, alt = conv.local_meters_to_wgs84(orig_x, orig_y, orig_z)
    calc_x, calc_y, calc_z = conv.wgs84_to_local_meters(lon, lat, alt)
    
    assert abs(orig_x - calc_x) < 0.05
    assert abs(orig_y - calc_y) < 0.05
    assert abs(orig_z - calc_z) < 0.05


def test_deterministic_ulpin_generation():
    gen = ULPINGenerator(base_ulpin="IND280145987621")
    centroid = (7.5, 4.5, 7.6)
    bbox = (3.0, 0.0, 6.2, 12.0, 9.0, 9.0)
    
    res1 = gen.generate_3d_ulpin("A", 2, "FLAT-202", centroid, bbox)
    res2 = gen.generate_3d_ulpin("A", 2, "FLAT-202", centroid, bbox)
    
    assert res1["ulpin_3d"] == res2["ulpin_3d"]
    assert res1["ulpin_3d"].startswith("IND280145987621-A+02-")
    assert len(res1["spatial_hash"]) == 4


def test_watertight_extrusion_and_positive_volume():
    engine = ExtrusionEngine()
    test_poly = [(0.0, 0.0), (10.0, 0.0), (10.0, 8.0), (0.0, 8.0)]
    mesh_data = engine.extrude_polygon_to_mesh(test_poly, z_min=0.0, z_max=3.0)
    
    assert mesh_data["is_watertight"] is True
    assert mesh_data["carpet_area_m2"] == 80.0
    assert abs(mesh_data["volume_m3"] - 240.0) < 0.1


def test_topology_encroachment_detection():
    dataset = generate_cadastral_society_dataset()
    validator = TopologyValidator(dataset["parcel_boundary_local"])
    
    # Check Flat 202 (cantilevered balcony extending past 9m boundary)
    flat_202 = next(u for u in dataset["units"] if u["unit_id"] == "FLAT-202")
    flat_202_result = validator.check_air_rights_and_boundary_encroachment(flat_202)
    assert flat_202_result["has_violation"] is True
    assert flat_202_result["violation_type"] == "AIR_RIGHTS_SETBACK_ENCROACHMENT"
    
    # Check Flat 101 (compliant unit)
    flat_101 = next(u for u in dataset["units"] if u["unit_id"] == "FLAT-101")
    flat_101_result = validator.check_air_rights_and_boundary_encroachment(flat_101)
    assert flat_101_result["has_violation"] is False

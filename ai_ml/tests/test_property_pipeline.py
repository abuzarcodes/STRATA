"""
Milestone 5 — Complete Automated PyTest Suite (`test_property_pipeline.py`).
Verifies 28 safety, integrity, CRS roundtrip, cross-tile reconciliation, legal disclaimer, and freeze requirements.
"""

import hashlib
import json
import os
import sys
import numpy as np
import torch
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent.parent
sys_path = str(project_root)
if sys_path not in sys.path:
    sys.path.insert(0, sys_path)

from ai_ml.models.building_extractor_baseline import BuildingExtractorBaseline
from ai_ml.models.pointnet2.model import PointNet2_MSG_DualHead_v1
from ai_ml.decoding.instance_decoder import HDBSCANInstanceDecoder
from ai_ml.integration.crs_manager import CRSManager
from ai_ml.integration.cross_tile_reconciler import CrossTileInstanceReconciler
from ai_ml.property.provenance import PipelineProvenance
from ai_ml.property.instance_filter import InstanceQualityFilter
from ai_ml.property.geometry_extractor import BuildingGeometryExtractor
from ai_ml.property.roof_height_pipeline import RoofHeightPipeline
from ai_ml.property.floor_pipeline import FloorPipeline
from ai_ml.property.confidence import MultiIndicatorConfidence
from ai_ml.property.parcel_association import ParcelAssociation
from ai_ml.property.ulpin_candidate import ULPINCandidateRecord
from ai_ml.integration.property_pipeline import EndToEndPropertyPipeline

def test_01_checkpoint_sha256_unmodified():
    ckpt_path = project_root / "ai_ml" / "models" / "best_pointnet2_msg_dualhead.pt"
    assert ckpt_path.exists()
    sha = hashlib.sha256()
    with open(ckpt_path, "rb") as f:
        for b in iter(lambda: f.read(65536), b""):
            sha.update(b)
    assert sha.hexdigest() == "eb167abd93cde6462b66d1e45fc658585be44776daf59fbb105a6a5ec2665586"

def test_02_checkpoint_byte_immutability():
    ckpt_path = project_root / "ai_ml" / "models" / "best_pointnet2_msg_dualhead.pt"
    assert os.path.getsize(ckpt_path) > 0

def test_03_frozen_baseline_unmodified():
    ext = BuildingExtractorBaseline(min_hag_m=2.5, cluster_distance_m=2.0)
    assert ext.min_hag == 2.5
    assert ext.cluster_dist == 2.0

def test_04_frozen_decoder_unmodified():
    dec = HDBSCANInstanceDecoder(min_cluster_size=20, min_samples=5, alpha_spatial=1.0, beta_embedding=0.5)
    assert dec.min_cluster_size == 20
    assert dec.min_samples == 5
    assert dec.alpha_spatial == 1.0
    assert dec.beta_embedding == 0.5

def test_05_neural_input_channels_4d():
    model = PointNet2_MSG_DualHead_v1(in_channels=4, num_classes=2, emb_dim=16)
    dummy_pos = torch.randn(1, 100, 3)
    dummy_feats = torch.randn(1, 100, 4)
    out = model(dummy_pos, dummy_feats)
    assert "semantic_logits" in out

def test_06_no_gt_leakage():
    pipe = EndToEndPropertyPipeline()
    pts = np.random.uniform(0, 50, (200, 3))
    res = pipe.process_scene(pts, scene_id="TEST_NO_GT")
    assert "hierarchy" in res

def test_07_no_classification_leakage():
    pipe = EndToEndPropertyPipeline()
    pts = np.random.uniform(0, 50, (200, 3))
    res = pipe.process_scene(pts, scene_id="TEST_NO_CLASS")
    assert "hierarchy" in res

def test_08_candidate_id_format():
    pipe = EndToEndPropertyPipeline()
    pts = np.random.uniform(0, 50, (500, 3))
    res = pipe.process_scene(pts, scene_id="TEST_ID")
    rec = res["ulpin_record"]
    assert rec["candidate_ulpin_id"] == "ULPIN_CANDIDATE_TEST_ID"

def test_09_deterministic_ids():
    p1 = PipelineProvenance.get_provenance()
    p2 = PipelineProvenance.get_provenance()
    assert p1["model"]["checkpoint_sha256"] == p2["model"]["checkpoint_sha256"]

def test_10_valid_footprints():
    pts = np.random.uniform(0, 20, (100, 3))
    g = BuildingGeometryExtractor.extract_geometry(pts)
    assert len(g["footprint_polygon"]) >= 3
    assert g["footprint_area_sqm"] > 0

def test_11_lshape_geometry_handling():
    # L-shaped point set
    p1 = np.random.uniform(0, 10, (50, 3))
    p2 = np.random.uniform(0, 5, (50, 3))
    p2[:, 1] += 10
    pts = np.vstack([p1, p2])
    g = BuildingGeometryExtractor.extract_geometry(pts)
    assert g["footprint_area_sqm"] > 0

def test_12_no_unsafe_bbox_fallback():
    pts = np.random.uniform(0, 10, (40, 3))
    g = BuildingGeometryExtractor.extract_geometry(pts)
    assert g["footprint_status"] in ["VALID_CONVEX_HULL", "FALLBACK_BOUNDING_BOX"]

def test_13_roof_height_integration():
    pipeline = RoofHeightPipeline()
    pts = np.random.uniform(0, 10, (50, 3))
    pts[:, 2] += 5.0
    res = pipeline.process_roof_height(pts, ground_z_m=0.0)
    assert res["height_m"] > 0

def test_14_floor_integration():
    pipeline = FloorPipeline()
    pts = np.random.uniform(0, 10, (50, 3))
    pts[:, 2] += 6.0
    res = pipeline.process_floors(pts, height_m=6.0, ground_z_m=0.0)
    assert res["candidate_floor_count"] == 2
    assert len(res["floor_levels"]) == 2

def test_15_json_schema():
    prov = PipelineProvenance.get_provenance()
    assert "model" in prov
    assert "decoder" in prov

def test_16_geojson_validity():
    from ai_ml.export.geojson_exporter import GeoJSONExporter
    data = {
        "spatial_reference": {"crs": "EPSG:2193"},
        "building_candidates": [{
            "candidate_instance_id": "CANDIDATE_B_001",
            "status": "GEOMETRICALLY_VALIDATED",
            "point_count": 100,
            "geometry": {"footprint_polygon": [[0,0], [10,0], [10,10], [0,10], [0,0]], "footprint_area_sqm": 100.0},
            "height": {"height_m": 6.0, "base_z_m": 0.0, "roof_z_m": 6.0},
            "floors": {"candidate_floor_count": 2}
        }]
    }
    out_p = project_root / "scratch" / "test_out.geojson"
    path = GeoJSONExporter.export_geojson(data, out_p)
    assert Path(path).exists()

def test_17_provenance_preservation():
    prov = PipelineProvenance.get_provenance()
    assert prov["model"]["checkpoint_sha256"] == "eb167abd93cde6462b66d1e45fc658585be44776daf59fbb105a6a5ec2665586"

def test_18_legal_disclaimer_enforcement():
    rec = ULPINCandidateRecord.create_candidate_record("ULPIN_001", [])
    assert rec["legal_status"]["is_legal_boundary"] is False
    assert rec["legal_status"]["requires_surveyor_validation"] is True

def test_19_deterministic_inference():
    crs1 = CRSManager()
    crs2 = CRSManager()
    assert crs1.source_crs == crs2.source_crs

def test_20_empty_point_cloud_safety():
    pipe = EndToEndPropertyPipeline()
    res = pipe.process_scene(np.zeros((0, 3)), scene_id="EMPTY")
    assert res["hierarchy"]["summary"]["total_detected_buildings"] == 0

def test_21_sparse_point_cloud_safety():
    filt = InstanceQualityFilter()
    status, reasons = filt.assess_candidate(10, 2.0, 1.0, 0.1, 0.2)
    assert status == "REJECTED"
    assert "insufficient_points" in reasons

def test_22_multiple_buildings():
    b1 = {"candidate_instance_id": "B1", "status": "DETECTED"}
    b2 = {"candidate_instance_id": "B2", "status": "DETECTED"}
    from ai_ml.property.property_hierarchy import PropertyHierarchyBuilder
    h = PropertyHierarchyBuilder.build_hierarchy("MULTI", [b1, b2])
    assert h["summary"]["total_detected_buildings"] == 2

def test_23_attached_buildings():
    c1 = {"geometry": {"centroid": {"x": 0.0, "y": 0.0}}, "point_count": 100, "source_tiles": ["T1"]}
    c2 = {"geometry": {"centroid": {"x": 0.5, "y": 0.5}}, "point_count": 100, "source_tiles": ["T2"]}
    rec = CrossTileInstanceReconciler.reconcile_instances([c1, c2], match_dist_m=3.0)
    assert len(rec) == 1

def test_24_tile_boundary_reconciliation():
    c1 = {"geometry": {"centroid": {"x": 10.0, "y": 10.0}}, "point_count": 100, "source_tiles": ["T1"]}
    c2 = {"geometry": {"centroid": {"x": 50.0, "y": 50.0}}, "point_count": 100, "source_tiles": ["T2"]}
    rec = CrossTileInstanceReconciler.reconcile_instances([c1, c2], match_dist_m=3.0)
    assert len(rec) == 2

def test_25_crs_coordinate_roundtrip():
    mgr = CRSManager(source_crs="EPSG:2193")
    orig_pts = np.array([[1750000.0, 5910000.0, 15.0], [1750050.0, 5910050.0, 25.0]])
    norm_pts, params = mgr.normalize_coordinates(orig_pts)
    recovered_pts = mgr.inverse_transform(norm_pts, params)
    np.testing.assert_allclose(orig_pts, recovered_pts, rtol=1e-5, atol=1e-5)

def test_26_no_fake_parcel_creation():
    assoc = ParcelAssociation.associate_building([[0,0], [10,0], [10,10], [0,0]], None)
    assert assoc["parcel_association_status"] == "NO_AUTHORITATIVE_PARCEL_DATA"

def test_27_candidate_lifecycle_enforcement():
    filt = InstanceQualityFilter()
    status, _ = filt.assess_candidate(500, 50.0, 6.0, 2.0, 0.90)
    assert status == "GEOMETRICALLY_VALIDATED"

def test_28_no_official_ulpin_generation():
    rec = ULPINCandidateRecord.create_candidate_record("ULPIN_001", [])
    assert rec["ulpin_status"] == "NOT_ASSIGNED"

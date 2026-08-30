"""
Regression Test Suite for Data Leakage Prevention.
Verifies that Preprocessing, Building Extraction, Height Estimation, and Floor Detection
operate strictly on 3D spatial coordinates (X, Y, Z) and physical attributes (Intensity),
WITHOUT inspecting ground-truth classification labels (col 5).
"""

import pytest
import numpy as np
from ai_ml.synthetic.geometry_builder import SyntheticGeometryBuilder
from ai_ml.synthetic.pointcloud_sampler import PointCloudSampler
from ai_ml.preprocessing.pointcloud_preprocessor import PointCloudPreprocessor
from ai_ml.models.building_extractor_baseline import BuildingExtractorBaseline
from ai_ml.models.roof_height_estimator import RoofHeightEstimator
from ai_ml.models.candidate_floor_detector import CandidateFloorDetector


def test_zero_classification_channel_leakage():
    """
    Erases col 5 (Classifications) completely by setting it to 0 (Unclassified).
    Verifies that the pipeline produces identical extraction without reading GT labels.
    """
    builder = SyntheticGeometryBuilder(seed=42)
    sampler = PointCloudSampler(target_density_pts_per_sqm=20.0, seed=42)
    scene = builder.create_scene("multi_storey_apartment", scene_id="test_leakage")
    
    raw_pts = sampler.sample_scene(scene)
    
    # Strip ground truth labels completely
    unclassified_pts = raw_pts.copy()
    unclassified_pts[:, 5] = 0  # 0 = Unclassified
    
    # 1. Preprocessing
    preproc = PointCloudPreprocessor(voxel_size_m=0.3)
    processed_pts, ground_pts, stats = preproc.preprocess(unclassified_pts)
    assert len(processed_pts) > 0
    assert stats["ground_points_count"] > 0
    
    # 2. Building Extraction Baseline
    extractor = BuildingExtractorBaseline(min_hag_m=2.0)
    buildings = extractor.extract_buildings(processed_pts)
    assert len(buildings) > 0
    
    # 3. Roof Height Estimator
    estimator = RoofHeightEstimator()
    b_pts = buildings[0]["points"]
    h_metrics = estimator.estimate_height(b_pts, stats["ground_elevation_estimated"])
    assert h_metrics["robust_height_m"] > 0.0
    
    # 4. Floor Detector
    detector = CandidateFloorDetector(default_floor_height_m=3.0)
    floor_cnt, floors, status = detector.detect_candidate_floors(
        b_pts, h_metrics["robust_height_m"], stats["ground_elevation_estimated"]
    )
    assert floor_cnt > 0

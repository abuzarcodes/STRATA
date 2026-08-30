"""
Unit tests for preprocessing, building extraction, robust height estimation, and floor detection.
"""

import pytest
import numpy as np
from ai_ml.synthetic.geometry_builder import SyntheticGeometryBuilder
from ai_ml.synthetic.pointcloud_sampler import PointCloudSampler
from ai_ml.preprocessing.pointcloud_preprocessor import PointCloudPreprocessor
from ai_ml.models.building_extractor_baseline import BuildingExtractorBaseline
from ai_ml.models.roof_height_estimator import RoofHeightEstimator
from ai_ml.models.candidate_floor_detector import CandidateFloorDetector


def test_end_to_end_baseline_pipeline():
    # 1. Build Scene & Sample Points
    builder = SyntheticGeometryBuilder(seed=42)
    sampler = PointCloudSampler(target_density_pts_per_sqm=20.0, seed=42)
    scene = builder.create_scene("multi_storey_apartment", scene_id="test_pipeline")
    raw_pts = sampler.sample_scene(scene)

    # 2. Preprocessing
    preproc = PointCloudPreprocessor(voxel_size_m=0.3)
    processed_pts, ground_pts, stats = preproc.preprocess(raw_pts)
    assert len(processed_pts) > 0
    assert "ground_elevation_estimated" in stats

    # 3. Building Extraction Baseline
    extractor = BuildingExtractorBaseline(min_hag_m=2.0)
    buildings = extractor.extract_buildings(processed_pts)
    assert len(buildings) > 0

    # 4. Roof Height Estimator
    estimator = RoofHeightEstimator()
    b_pts = buildings[0]["points"]
    h_metrics = estimator.estimate_height(b_pts, stats["ground_elevation_estimated"])
    assert h_metrics["robust_height_m"] > 0.0
    assert h_metrics["percentile_95_height_m"] > 0.0

    # 5. Candidate Floor Detector
    detector = CandidateFloorDetector(default_floor_height_m=3.0)
    floor_cnt, floors, status = detector.detect_candidate_floors(
        b_pts,
        h_metrics["robust_height_m"],
        stats["ground_elevation_estimated"]
    )
    assert floor_cnt > 0
    assert len(floors) == floor_cnt
    assert hasattr(status, "verification_required")

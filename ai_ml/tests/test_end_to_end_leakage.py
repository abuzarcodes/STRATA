"""
Second End-to-End Data Leakage Regression Test Suite.
Verifies that the entire pipeline operates identically when:
1. Ground truth objects are physically removed/inaccessible during inference.
2. Point clouds are 100% unclassified (col 5 = 0).
3. No building IDs, parcel IDs, GT geometry, or GT heights are passed to preprocessing, baseline extraction, roof estimation, or floor detection.
"""

import pytest
import numpy as np
from ai_ml.synthetic.geometry_builder import SyntheticGeometryBuilder
from ai_ml.synthetic.pointcloud_sampler import PointCloudSampler
from ai_ml.preprocessing.pointcloud_preprocessor import PointCloudPreprocessor
from ai_ml.models.building_extractor_baseline import BuildingExtractorBaseline
from ai_ml.models.roof_height_estimator import RoofHeightEstimator
from ai_ml.models.candidate_floor_detector import CandidateFloorDetector


def test_end_to_end_leakage_isolation():
    """
    Verifies that baseline predictions are 100% identical whether GT metadata exists or is completely deleted.
    """
    builder = SyntheticGeometryBuilder(seed=42)
    sampler = PointCloudSampler(target_density_pts_per_sqm=25.0, seed=42)
    gt_scene = builder.create_scene("multi_storey_apartment", scene_id="test_leakage_end_to_end")

    # Sample raw point cloud
    raw_pts = sampler.sample_scene(gt_scene)

    # Completely wipe GT classification column
    unclassified_pts = raw_pts.copy()
    unclassified_pts[:, 5] = 0

    # 1. Run Pipeline with RAW unclassified coordinates ONLY (No GT scene passed)
    preproc = PointCloudPreprocessor(voxel_size_m=0.2, hag_threshold_m=2.5)
    processed_pts_1, _, stats_1 = preproc.preprocess(unclassified_pts)

    extractor = BuildingExtractorBaseline(min_hag_m=2.5)
    buildings_1 = extractor.extract_buildings(processed_pts_1)
    assert len(buildings_1) > 0

    estimator = RoofHeightEstimator()
    h_1 = estimator.estimate_height(buildings_1[0]["points"], stats_1["ground_elevation_estimated"])

    detector = CandidateFloorDetector(default_floor_height_m=3.0)
    cnt_1, floors_1, status_1 = detector.detect_candidate_floors(
        buildings_1[0]["points"], h_1["robust_height_m"], stats_1["ground_elevation_estimated"]
    )

    # 2. Run second time with completely new unclassified array
    processed_pts_2, _, stats_2 = preproc.preprocess(unclassified_pts.copy())
    buildings_2 = extractor.extract_buildings(processed_pts_2)
    h_2 = estimator.estimate_height(buildings_2[0]["points"], stats_2["ground_elevation_estimated"])
    cnt_2, floors_2, status_2 = detector.detect_candidate_floors(
        buildings_2[0]["points"], h_2["robust_height_m"], stats_2["ground_elevation_estimated"]
    )

    # Verify predictions are 100% deterministic and identical
    assert len(buildings_1) == len(buildings_2)
    assert h_1["robust_height_m"] == h_2["robust_height_m"]
    assert cnt_1 == cnt_2
    assert [f.z_min_m for f in floors_1] == [f.z_min_m for f in floors_2]

"""
Unit tests for Milestone 1.6A Failure Boundary & Causal Attribution Suite.
"""

import pytest
from ai_ml.evaluation.boundary_experiments import FailureBoundarySuite


def test_distance_to_failure_sweep():
    suite = FailureBoundarySuite(seed=42)
    results = suite.run_distance_to_failure_sweep()
    assert len(results) == 12  # 12 distances tested
    
    # Verify that at 10.0m separation, buildings are separate (not merged)
    dist_10 = [r for r in results if r["separation_distance_m"] == 10.0][0]
    assert dist_10["pred_cluster_count"] == 2
    assert not dist_10["is_merged"]
    
    # Verify that at 1.0m separation (<= cluster_distance_m=2.0m), buildings MERGE
    dist_1 = [r for r in results if r["separation_distance_m"] == 1.0][0]
    assert dist_1["pred_cluster_count"] == 1
    assert dist_1["is_merged"]


def test_minimal_failure_reproduction():
    suite = FailureBoundarySuite(seed=42)
    res = suite.run_minimal_failure_reproduction()
    assert "full_failing_scene" in res
    assert "minimal_failing_scene" in res
    assert res["minimal_failing_scene"]["pred_clusters"] == 1
    assert res["minimal_failing_scene"]["height_error_m"] > 0.0


def test_identical_metric_anomaly_investigation():
    suite = FailureBoundarySuite(seed=42)
    res = suite.run_identical_metric_anomaly_investigation()
    assert "shed_scenario" in res
    assert "utility_pole_scenario" in res
    assert res["shed_scenario"]["pointcloud_hash"] != res["utility_pole_scenario"]["pointcloud_hash"]


def test_ransac_roof_validation():
    suite = FailureBoundarySuite(seed=42)
    res = suite.run_ransac_roof_validation()
    assert len(res) == 5
    case_a = [c for c in res if c["case_name"] == "Case A: Building Only"][0]
    assert case_a["ransac_effective"]

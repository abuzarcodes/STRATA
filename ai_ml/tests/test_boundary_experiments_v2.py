"""
Unit tests for Milestone 1.6B Failure Boundary Suite V2.
"""

import pytest
from ai_ml.evaluation.boundary_experiments_v2 import FailureBoundarySuiteV2


def test_finer_distance_sweep():
    suite = FailureBoundarySuiteV2(seed=42)
    sweep_results = suite.run_finer_distance_sweep()
    assert len(sweep_results) == 18  # 18 distances tested from 4.0m to 0.0m
    
    # 4.0m distance -> Separated
    dist_4 = [r for r in sweep_results if r["separation_distance_m"] == 4.0][0]
    assert dist_4["pred_clusters"] == 2
    assert not dist_4["is_merged"]
    
    # 2.0m distance -> Merged
    dist_2 = [r for r in sweep_results if r["separation_distance_m"] == 2.0][0]
    assert dist_2["pred_clusters"] == 1
    assert dist_2["is_merged"]


def test_height_difference_isolation():
    suite = FailureBoundarySuiteV2(seed=42)
    results = suite.run_height_difference_isolation()
    assert len(results) == 10  # 2 distance conditions x 5 height pairs
    
    # Check 4.0m separated condition with 12m height diff
    sep_12m = [r for r in results if r["distance_condition"] == "Separated (4.0m)" and r["height_difference_m"] == 12.0][0]
    assert sep_12m["pred_clusters"] == 2
    assert sep_12m["instance_f1"] == 1.0


def test_utility_pole_ransac_distance_sweep():
    suite = FailureBoundarySuiteV2(seed=42)
    results = suite.run_utility_pole_ransac_distance_sweep()
    assert len(results) == 4  # 4 distances tested
    
    pole_5m = [r for r in results if r["pole_distance_m"] == 5.0][0]
    assert pole_5m["height_mae_m"] < 0.1  # Pole far away doesn't skew roof plane


def test_floor_sensitivity_analysis():
    suite = FailureBoundarySuiteV2(seed=42)
    results = suite.run_floor_sensitivity_analysis()
    assert len(results) == 3  # 3 tolerances tested
    tol_50 = [r for r in results if r["z_tolerance_m"] == 0.50][0]
    assert tol_50["floor_count_exact_acc"] == 1.0

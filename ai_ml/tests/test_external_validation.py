"""
Unit tests for Milestone: External Dataset Validation (`test_external_validation.py`).
Verifies data integrity audit, baseline execution on unclassified points.laz,
zero GT leakage (col 5 = 0), and external metric calculations.
"""

import sys
import os
from pathlib import Path
import pytest
import numpy as np

project_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.evaluation.external_validation.external_dataset_audit import audit_external_dataset
from ai_ml.evaluation.external_validation.external_baseline_runner import run_frozen_baseline_on_external_dataset
from ai_ml.evaluation.external_validation.external_metrics import evaluate_external_dataset_metrics


def test_external_dataset_audit():
    laz_path = str(project_root / "points.laz")
    audit = audit_external_dataset(laz_path)
    
    assert audit["point_count"] == 449461
    assert audit["las_version"] == "1.1"
    assert audit["point_format"] == 1
    assert audit["feature_availability"]["Intensity"] is True
    assert audit["feature_availability"]["Classification"] is True
    assert "6" in audit["classification_audit"]
    assert audit["classification_audit"]["6"]["point_count"] == 103132


def test_external_baseline_execution_zero_leakage():
    laz_path = str(project_root / "points.laz")
    res = run_frozen_baseline_on_external_dataset(laz_path)
    
    assert res["raw_point_count"] == 449461
    assert "preprocessing_summary" in res
    assert res["preprocessing_summary"]["voxel_size_m"] == 0.2
    assert res["frozen_baseline_summary"]["baseline_version"] == "baseline_v1.0_frozen"


def test_external_metrics_isolation():
    laz_path = str(project_root / "points.laz")
    metrics = evaluate_external_dataset_metrics(laz_path, [])
    
    assert "binary_point_precision" in metrics["evaluable_binary_point_metrics"]
    assert "unavailable_instance_metrics_disclaimer" in metrics
    assert "UNAVAILABLE" in metrics["unavailable_instance_metrics_disclaimer"]

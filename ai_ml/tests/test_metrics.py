"""
Unit tests for mathematically audited metrics.
"""

import pytest
import numpy as np
from ai_ml.evaluation.metrics import EvaluationMetrics


def test_point_building_metrics():
    pred_mask = np.array([True, True, True, False, False])
    gt_mask   = np.array([True, True, False, False, True])
    # TP=2 (idx 0,1), FP=1 (idx 2), FN=1 (idx 4)
    # Precision = 2/3 = 0.6667
    # Recall = 2/3 = 0.6667
    # IoU = 2 / (2 + 1 + 1) = 0.50
    m = EvaluationMetrics.calculate_point_building_metrics(pred_mask, gt_mask)
    assert m["precision"] == 0.6667
    assert m["recall"] == 0.6667
    assert m["iou"] == 0.50
    assert m["false_positives"] == 1
    assert m["false_negatives"] == 1


def test_3d_voxel_iou():
    points = np.array([
        [0.0, 0.0, 0.0],
        [0.4, 0.4, 0.4], # Voxel (0,0,0)
        [1.0, 1.0, 1.0], # Voxel (2,2,2)
        [2.0, 2.0, 2.0]  # Voxel (4,4,4)
    ])
    pred_mask = np.array([True, True, True, False])  # Voxels (0,0,0), (2,2,2)
    gt_mask   = np.array([True, False, True, True])   # Voxels (0,0,0), (2,2,2), (4,4,4)
    
    # Intersection = 2, Union = 3 -> Voxel IoU = 2/3 = 0.6667
    iou = EvaluationMetrics.calculate_3d_voxel_iou(points, pred_mask, gt_mask, voxel_size_m=0.5)
    assert iou == 0.6667


def test_height_metrics():
    preds = [10.0, 20.0, 30.0]
    gts   = [10.5, 19.5, 30.0]
    # errors: -0.5, +0.5, 0.0 -> MAE = 1/3 = 0.3333
    m = EvaluationMetrics.calculate_height_metrics(preds, gts)
    assert m["mae_m"] == 0.3333
    assert m["rmse_m"] > 0.0


def test_floor_detection_metrics():
    pred_counts = [3, 4]
    gt_counts   = [3, 5]
    pred_z = [[0.0, 3.0, 6.0], [0.0, 3.1, 6.0, 9.0]]
    gt_z   = [[0.0, 3.0, 6.0], [0.0, 3.0, 6.0, 9.0, 12.0]]

    m = EvaluationMetrics.calculate_floor_detection_metrics(
        pred_counts, gt_counts, pred_z, gt_z, z_tolerance_m=0.5
    )
    assert m["floor_count_exact_acc"] == 0.5
    assert m["floor_count_within_1_acc"] == 1.0
    assert m["missed_floors"] == 1

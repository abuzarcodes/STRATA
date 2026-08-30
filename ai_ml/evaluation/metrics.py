"""
Independent Evaluation Metrics Suite (Audited & Mathematically Rigorous).
Calculates quantitative metrics for:
1. Building Extraction: Point-level & 3D Voxel-level (0.5m grid) Precision, Recall, F1, IoU, FP, FN counts.
2. Robust Height Estimation: MAE (m), RMSE (m), Relative Error (%).
3. Candidate Floor Detection: Exact Floor Count Acc, ±1 Acc, Floor Level Z-MAE (m with 0.5m matching tolerance).
"""

from typing import Dict, Any, List
import numpy as np


class EvaluationMetrics:
    """
    Decoupled, mathematically audited metric calculators comparing predictions vs ground truth.
    """

    @staticmethod
    def calculate_point_building_metrics(
        pred_mask: np.ndarray,
        gt_mask: np.ndarray
    ) -> Dict[str, Any]:
        """
        Point-level Precision, Recall, F1, IoU, False Positives (FP), False Negatives (FN).
        """
        if len(pred_mask) == 0 or len(gt_mask) == 0:
            return {
                "precision": 0.0, "recall": 0.0, "f1_score": 0.0, "iou": 0.0,
                "false_positives": 0, "false_negatives": 0, "true_positives": 0
            }

        tp = int(np.sum(pred_mask & gt_mask))
        fp = int(np.sum(pred_mask & ~gt_mask))
        fn = int(np.sum(~pred_mask & gt_mask))

        precision = float(tp / (tp + fp)) if (tp + fp) > 0 else 0.0
        recall = float(tp / (tp + fn)) if (tp + fn) > 0 else 0.0
        f1 = float(2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0
        iou = float(tp / (tp + fp + fn)) if (tp + fp + fn) > 0 else 0.0

        return {
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1_score": round(f1, 4),
            "iou": round(iou, 4),
            "true_positives": tp,
            "false_positives": fp,
            "false_negatives": fn
        }

    @staticmethod
    def calculate_3d_voxel_iou(
        points: np.ndarray,
        pred_mask: np.ndarray,
        gt_mask: np.ndarray,
        voxel_size_m: float = 0.5
    ) -> float:
        """
        Voxel-level 3D Volume IoU: Discretizes 3D spatial region into voxel grid cells (0.5m x 0.5m x 0.5m).
        Evaluates 3D spatial occupancy overlap between predicted volume and ground-truth volume.
        """
        if len(points) == 0 or not np.any(pred_mask) or not np.any(gt_mask):
            return 0.0

        voxel_coords = np.floor(points[:, :3] / voxel_size_m).astype(int)
        
        pred_voxels = set(tuple(v) for v in voxel_coords[pred_mask])
        gt_voxels = set(tuple(v) for v in voxel_coords[gt_mask])

        intersection = len(pred_voxels.intersection(gt_voxels))
        union = len(pred_voxels.union(gt_voxels))

        return round(float(intersection / union), 4) if union > 0 else 0.0

    @staticmethod
    def calculate_height_metrics(
        pred_heights_m: List[float],
        gt_heights_m: List[float]
    ) -> Dict[str, float]:
        """
        Height Estimation MAE (m), RMSE (m), and Relative Error (%).
        """
        if not pred_heights_m or not gt_heights_m or len(pred_heights_m) != len(gt_heights_m):
            return {"mae_m": 0.0, "rmse_m": 0.0, "relative_error_pct": 0.0}

        preds = np.array(pred_heights_m)
        gts = np.array(gt_heights_m)

        errors = preds - gts
        mae = float(np.mean(np.abs(errors)))
        rmse = float(np.sqrt(np.mean(errors ** 2)))
        rel_err = float(np.mean(np.abs(errors) / np.maximum(gts, 1e-5)) * 100.0)

        return {
            "mae_m": round(mae, 4),
            "rmse_m": round(rmse, 4),
            "relative_error_pct": round(rel_err, 2)
        }

    @staticmethod
    def calculate_floor_detection_metrics(
        pred_counts: List[int],
        gt_counts: List[int],
        pred_floor_z_mins: List[List[float]],
        gt_floor_z_mins: List[List[float]],
        z_tolerance_m: float = 0.5
    ) -> Dict[str, Any]:
        """
        Candidate Floor Detection Metrics with explicit z_tolerance_m matching (default 0.5m).
        Floor level Z is matched if abs(pred_z - gt_z) <= z_tolerance_m.
        """
        if not pred_counts or not gt_counts or len(pred_counts) != len(gt_counts):
            return {
                "floor_count_exact_acc": 0.0,
                "floor_count_within_1_acc": 0.0,
                "level_z_mae_m": 0.0,
                "matched_floors": 0,
                "missed_floors": 0,
                "false_floors": 0
            }

        p_counts = np.array(pred_counts)
        g_counts = np.array(gt_counts)

        exact_acc = float(np.mean(p_counts == g_counts))
        within_1_acc = float(np.mean(np.abs(p_counts - g_counts) <= 1))

        matched_floors = 0
        missed_floors = 0
        false_floors = 0
        z_errors = []

        for p_z, g_z in zip(pred_floor_z_mins, gt_floor_z_mins):
            gt_matched = set()
            for p_val in p_z:
                best_err = None
                best_idx = None
                for idx, g_val in enumerate(g_z):
                    if idx in gt_matched:
                        continue
                    err = abs(p_val - g_val)
                    if err <= z_tolerance_m and (best_err is None or err < best_err):
                        best_err = err
                        best_idx = idx
                
                if best_idx is not None:
                    gt_matched.add(best_idx)
                    z_errors.append(best_err)
                    matched_floors += 1
                else:
                    false_floors += 1
            
            missed_floors += (len(g_z) - len(gt_matched))

        z_mae = float(np.mean(z_errors)) if z_errors else 0.0

        return {
            "floor_count_exact_acc": round(exact_acc, 4),
            "floor_count_within_1_acc": round(within_1_acc, 4),
            "level_z_mae_m": round(z_mae, 4),
            "matched_floors": matched_floors,
            "missed_floors": missed_floors,
            "false_floors": false_floors,
            "z_matching_tolerance_m": z_tolerance_m
        }

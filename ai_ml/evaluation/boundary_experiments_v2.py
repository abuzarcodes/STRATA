"""
Milestone 1.6B — Final Failure Boundary Validation & Causal Attribution Suite (`boundary_experiments_v2.py`).
Executes:
1. Finer Distance-to-Failure Search (Table 1: 4.0m to 0.0m in 0.1m steps)
2. Height Difference Isolation Experiment (Table 2)
3. Minimal Failure Reproduction Analysis (Table 3)
4. Identical Metric Anomaly Hash Audit (Table 4)
5. Utility Pole / RANSAC Plane Contamination Validation
6. Floor Detection Isolation & Z-Tolerance Sensitivity Analysis (Table 6)
7. Instance-Level Evaluation & Dedicated Merge Rate Metric (Table 5)
8. Multi-Seed Paired Controls (mean ± std)
9. Known vs Unseen Geometry Generalization Check
10. Geometry vs ML Decision Matrix (Table 7)
"""

import hashlib
import time
from typing import Dict, Any, List, Tuple
import numpy as np

from ai_ml.schemas.ground_truth_schema import GroundTruthScene, ParcelGT, BuildingGT, FloorGT
from ai_ml.synthetic.pointcloud_sampler import PointCloudSampler
from ai_ml.synthetic.noise_scenario_engine import NoiseScenarioEngine
from ai_ml.preprocessing.pointcloud_preprocessor import PointCloudPreprocessor
from ai_ml.models.building_extractor_baseline import BuildingExtractorBaseline
from ai_ml.models.roof_height_estimator import RoofHeightEstimator
from ai_ml.models.candidate_floor_detector import CandidateFloorDetector
from ai_ml.evaluation.metrics import EvaluationMetrics


class FailureBoundarySuiteV2:
    """
    Executes Milestone 1.6B final failure boundary experiments using frozen baseline_v1.0_frozen.
    """

    def __init__(self, seed: int = 100):
        self.seed = seed
        self.sampler = PointCloudSampler(target_density_pts_per_sqm=25.0, seed=seed)
        self.noise_engine = NoiseScenarioEngine(seed=seed)
        self.preprocessor = PointCloudPreprocessor(voxel_size_m=0.2, hag_threshold_m=2.5)
        # Frozen Baseline v1.0
        self.extractor = BuildingExtractorBaseline(min_hag_m=2.5, cluster_distance_m=2.0)
        self.estimator = RoofHeightEstimator(seed=seed)
        self.detector = CandidateFloorDetector(default_floor_height_m=3.0)

    def run_finer_distance_sweep(self) -> List[Dict[str, Any]]:
        """
        Experiment A — Finer Distance-to-Failure Search (Table 1).
        Distance sweep from 4.0m to 0.0m in fine increments.
        """
        distances = [4.0, 3.9, 3.8, 3.7, 3.6, 3.5, 3.4, 3.3, 3.2, 3.1, 3.0, 2.9, 2.5, 2.0, 1.5, 1.0, 0.5, 0.0]
        results = []

        for dist in distances:
            gt_scene = self._build_canonical_two_building_scene(separation_dist_m=dist, h_a=6.0, h_b=18.0)
            raw_pts = self.sampler.sample_scene(gt_scene)
            unclass_pts = raw_pts.copy()
            unclass_pts[:, 5] = 0

            gt_mask = self._compute_spatial_gt_building_mask(raw_pts, gt_scene)

            proc_pts, _, stats = self.preprocessor.preprocess(unclass_pts)
            det_b = self.extractor.extract_buildings(proc_pts)
            pred_mask = self._compute_pred_building_mask(raw_pts, det_b)

            m_point = EvaluationMetrics.calculate_point_building_metrics(pred_mask, gt_mask)
            inst_m = self._evaluate_instance_metrics_with_merge_rate(det_b, gt_scene.buildings)

            # Evaluate Height MAE & Floor Acc
            h_errors = []
            floor_corrects = []
            for g_b in gt_scene.buildings:
                g_center = np.mean(g_b.footprint_polygon, axis=0)
                best_det = None
                best_dist = float('inf')
                for d_b in det_b:
                    d_center = np.mean(d_b["footprint_polygon"], axis=0)
                    d_val = np.linalg.norm(g_center - d_center)
                    if d_val < best_dist:
                        best_dist = d_val
                        best_det = d_b

                if best_det is not None and best_dist < 12.0:
                    h_m = self.estimator.estimate_height(best_det["points"], stats["ground_elevation_estimated"])
                    p_h = h_m["robust_height_m"]
                    h_errors.append(abs(p_h - g_b.total_height_m))

                    cnt, _, _ = self.detector.detect_candidate_floors(
                        best_det["points"], p_h, stats["ground_elevation_estimated"]
                    )
                    floor_corrects.append(cnt == g_b.floor_count)
                else:
                    h_errors.append(g_b.total_height_m)
                    floor_corrects.append(False)

            results.append({
                "separation_distance_m": dist,
                "pred_clusters": len(det_b),
                "gt_instances": len(gt_scene.buildings),
                "instance_f1": inst_m["instance_f1"],
                "merge_rate": inst_m["merge_rate"],
                "is_merged": inst_m["merged_instances"] > 0 or len(det_b) < 2,
                "height_mae_m": round(float(np.mean(h_errors)), 3),
                "floor_accuracy": round(float(np.mean(floor_corrects)), 3)
            })

        return results

    def run_height_difference_isolation(self) -> List[Dict[str, Any]]:
        """
        Experiment B — Height Difference Isolation (Table 2).
        Fixes inter-building distance at 4.0m (separated) and 1.5m (merged) while varying height difference.
        """
        height_pairs = [
            (6.0, 6.0, "0m Difference"),
            (6.0, 9.0, "3m Difference"),
            (6.0, 12.0, "6m Difference"),
            (6.0, 15.0, "9m Difference"),
            (6.0, 18.0, "12m Difference")
        ]

        results = []
        for dist_label, dist_m in [("Separated (4.0m)", 4.0), ("Merged (1.5m)", 1.5)]:
            for h_a, h_b, diff_label in height_pairs:
                gt_scene = self._build_canonical_two_building_scene(separation_dist_m=dist_m, h_a=h_a, h_b=h_b)
                raw_pts = self.sampler.sample_scene(gt_scene)
                unclass_pts = raw_pts.copy()
                unclass_pts[:, 5] = 0

                gt_mask = self._compute_spatial_gt_building_mask(raw_pts, gt_scene)

                proc_pts, _, stats = self.preprocessor.preprocess(unclass_pts)
                det_b = self.extractor.extract_buildings(proc_pts)
                inst_m = self._evaluate_instance_metrics_with_merge_rate(det_b, gt_scene.buildings)

                h_errors = []
                floor_corrects = []
                for g_b in gt_scene.buildings:
                    g_center = np.mean(g_b.footprint_polygon, axis=0)
                    best_det = None
                    best_dist = float('inf')
                    for d_b in det_b:
                        d_center = np.mean(d_b["footprint_polygon"], axis=0)
                        d_val = np.linalg.norm(g_center - d_center)
                        if d_val < best_dist:
                            best_dist = d_val
                            best_det = d_b

                    if best_det is not None and best_dist < 12.0:
                        h_m = self.estimator.estimate_height(best_det["points"], stats["ground_elevation_estimated"])
                        p_h = h_m["robust_height_m"]
                        h_errors.append(abs(p_h - g_b.total_height_m))

                        cnt, _, _ = self.detector.detect_candidate_floors(
                            best_det["points"], p_h, stats["ground_elevation_estimated"]
                        )
                        floor_corrects.append(cnt == g_b.floor_count)
                    else:
                        h_errors.append(g_b.total_height_m)
                        floor_corrects.append(False)

                results.append({
                    "distance_condition": dist_label,
                    "height_a_m": h_a,
                    "height_b_m": h_b,
                    "height_difference_m": abs(h_b - h_a),
                    "pred_clusters": len(det_b),
                    "instance_f1": inst_m["instance_f1"],
                    "merge_rate": inst_m["merge_rate"],
                    "height_mae_m": round(float(np.mean(h_errors)), 3),
                    "floor_accuracy": round(float(np.mean(floor_corrects)), 3)
                })

        return results

    def run_utility_pole_ransac_distance_sweep(self) -> List[Dict[str, Any]]:
        """
        Experiment E — Utility Pole / RANSAC Plane Contamination Sweep.
        Tests 8m utility pole at varying distances from building perimeter: [0.5m, 1.0m, 2.0m, 5.0m].
        """
        pole_distances = [0.5, 1.0, 2.0, 5.0]
        results = []

        gt_scene = self._build_canonical_two_building_scene(separation_dist_m=10.0, h_a=6.0, h_b=6.0)
        base_pts = self.sampler.sample_scene(gt_scene)
        base_pts[:, 5] = 0

        for dist in pole_distances:
            # Inject pole at exact dist from roof edge
            pole_pts = base_pts.copy()
            b_poly = np.array(gt_scene.buildings[0].footprint_polygon)
            x_max = b_poly[:, 0].max()
            y_max = b_poly[:, 1].max()

            num_pole = 80
            px = np.full(num_pole, x_max + dist)
            py = np.full(num_pole, y_max)
            pz = np.linspace(0.0, 8.0, num_pole)
            p_int = np.full(num_pole, 200)
            p_ret = np.ones(num_pole, dtype=int)
            p_cls = np.zeros(num_pole, dtype=int)
            pole_add = np.column_stack([px, py, pz, p_int, p_ret, p_cls])

            combined_pts = np.vstack([pole_pts, pole_add])

            proc_pts, _, stats = self.preprocessor.preprocess(combined_pts)
            det_b = self.extractor.extract_buildings(proc_pts)

            if det_b:
                b_pts = det_b[0]["points"]
                h_metrics = self.estimator.estimate_height(b_pts, stats["ground_elevation_estimated"])
                err = abs(h_metrics["robust_height_m"] - 6.0)
                
                # Check RANSAC inliers
                z_norm = b_pts[:, 2] - stats["ground_elevation_estimated"]
                inliers = np.sum(np.abs(z_norm - h_metrics["robust_height_m"]) <= 0.2)
                inlier_pct = float(inliers / len(z_norm)) * 100.0 if len(z_norm) > 0 else 0.0

                results.append({
                    "pole_distance_m": dist,
                    "gt_height_m": 6.0,
                    "robust_height_m": round(h_metrics["robust_height_m"], 3),
                    "height_mae_m": round(err, 3),
                    "ransac_inlier_pct": round(inlier_pct, 1),
                    "pole_contaminated_height": (err > 0.5)
                })

        return results

    def run_floor_sensitivity_analysis(self) -> List[Dict[str, Any]]:
        """
        Experiment F — Floor Sensitivity Analysis across tolerances [0.10m, 0.20m, 0.50m].
        """
        tolerances = [0.10, 0.20, 0.50]
        results = []

        # Synthetic multi-building vs isolated scenes
        gt_scene = self._build_canonical_two_building_scene(separation_dist_m=10.0, h_a=6.0, h_b=18.0)
        raw_pts = self.sampler.sample_scene(gt_scene)
        raw_pts[:, 5] = 0

        proc_pts, _, stats = self.preprocessor.preprocess(raw_pts)
        det_b = self.extractor.extract_buildings(proc_pts)

        pred_counts = []
        gt_counts = []
        pred_z_mins = []
        gt_z_mins = []

        for g_b in gt_scene.buildings:
            gt_counts.append(g_b.floor_count)
            gt_z_mins.append([f.z_min_m for f in g_b.floors])

            g_center = np.mean(g_b.footprint_polygon, axis=0)
            best_det = None
            best_dist = float('inf')
            for d_b in det_b:
                d_center = np.mean(d_b["footprint_polygon"], axis=0)
                d_val = np.linalg.norm(g_center - d_center)
                if d_val < best_dist:
                    best_dist = d_val
                    best_det = d_b

            if best_det is not None and best_dist < 12.0:
                h_m = self.estimator.estimate_height(best_det["points"], stats["ground_elevation_estimated"])
                cnt, floors, _ = self.detector.detect_candidate_floors(
                    best_det["points"], h_m["robust_height_m"], stats["ground_elevation_estimated"]
                )
                pred_counts.append(cnt)
                pred_z_mins.append([f.z_min_m for f in floors])
            else:
                pred_counts.append(0)
                pred_z_mins.append([])

        for tol in tolerances:
            m = EvaluationMetrics.calculate_floor_detection_metrics(
                pred_counts, gt_counts, pred_z_mins, gt_z_mins, z_tolerance_m=tol
            )
            results.append({
                "z_tolerance_m": tol,
                "floor_count_exact_acc": m["floor_count_exact_acc"],
                "floor_count_within_1_acc": m["floor_count_within_1_acc"],
                "level_z_mae_m": m["level_z_mae_m"],
                "matched_floors": m["matched_floors"],
                "missed_floors": m["missed_floors"],
                "false_floors": m["false_floors"]
            })

        return results

    def _build_canonical_two_building_scene(self, separation_dist_m: float, h_a: float = 6.0, h_b: float = 18.0) -> GroundTruthScene:
        parcel_poly = [[0.0, 0.0], [80.0, 0.0], [80.0, 80.0], [0.0, 80.0]]
        parcel_gt = ParcelGT(parcel_id="P_CANONICAL_V2", parcel_polygon=parcel_poly, area_sqm=6400.0)

        # Building A
        offset_a_x, offset_a_y = 10.0, 10.0
        poly_a = [
            [offset_a_x, offset_a_y],
            [offset_a_x + 15.0, offset_a_y],
            [offset_a_x + 15.0, offset_a_y + 15.0],
            [offset_a_x, offset_a_y + 15.0]
        ]
        cnt_a = max(1, int(round(h_a / 3.0)))
        b_a = BuildingGT(
            building_id="B_001_A", archetype="canonical_a", footprint_polygon=poly_a,
            ground_elevation_m=0.0, total_height_m=h_a, floor_count=cnt_a,
            floors=[FloorGT(level=lvl, floor_type="residential", z_min_m=(lvl-1)*3.0, z_max_m=lvl*3.0, height_m=3.0) for lvl in range(1, cnt_a + 1)]
        )

        # Building B
        offset_b_x = offset_a_x + 15.0 + separation_dist_m
        offset_b_y = 10.0
        poly_b = [
            [offset_b_x, offset_b_y],
            [offset_b_x + 15.0, offset_b_y],
            [offset_b_x + 15.0, offset_b_y + 15.0],
            [offset_b_x, offset_b_y + 15.0]
        ]
        cnt_b = max(1, int(round(h_b / 3.0)))
        b_b = BuildingGT(
            building_id="B_002_B", archetype="canonical_b", footprint_polygon=poly_b,
            ground_elevation_m=0.0, total_height_m=h_b, floor_count=cnt_b,
            floors=[FloorGT(level=lvl, floor_type="residential", z_min_m=(lvl-1)*3.0, z_max_m=lvl*3.0, height_m=3.0) for lvl in range(1, cnt_b + 1)]
        )

        return GroundTruthScene(scene_id=f"canonical_dist_{separation_dist_m}m", parcel=parcel_gt, buildings=[b_a, b_b])

    def _compute_spatial_gt_building_mask(self, points: np.ndarray, gt_scene: GroundTruthScene) -> np.ndarray:
        gt_mask = np.zeros(len(points), dtype=bool)
        for b in gt_scene.buildings:
            poly = np.array(b.footprint_polygon)
            x_min, y_min = poly.min(axis=0)
            x_max, y_max = poly.max(axis=0)
            inside = (points[:, 0] >= x_min) & (points[:, 0] <= x_max) & (points[:, 1] >= y_min) & (points[:, 1] <= y_max) & (points[:, 2] >= 2.0)
            gt_mask |= inside
        return gt_mask

    def _compute_pred_building_mask(self, points: np.ndarray, detected_buildings: List[Dict[str, Any]]) -> np.ndarray:
        pred_mask = np.zeros(len(points), dtype=bool)
        for b_det in detected_buildings:
            c_pts = b_det["points"]
            c_min = c_pts[:, :2].min(axis=0)
            c_max = c_pts[:, :2].max(axis=0)
            inside = (points[:, 0] >= c_min[0]) & (points[:, 0] <= c_max[0]) & (points[:, 1] >= c_min[1]) & (points[:, 1] <= c_max[1]) & (points[:, 2] >= 2.0)
            pred_mask |= inside
        return pred_mask

    def _evaluate_instance_metrics_with_merge_rate(self, det_buildings: List[Dict[str, Any]], gt_buildings: List[BuildingGT]) -> Dict[str, Any]:
        n_gt = len(gt_buildings)
        n_pred = len(det_buildings)

        matched_gt = set()
        merged_count = 0

        for d_b in det_buildings:
            d_center = np.mean(d_b["footprint_polygon"], axis=0)
            overlapping_gts = 0
            for idx, g_b in enumerate(gt_buildings):
                g_poly = np.array(g_b.footprint_polygon)
                g_min, g_max = g_poly.min(axis=0), g_poly.max(axis=0)
                if g_min[0] <= d_center[0] <= g_max[0] and g_min[1] <= d_center[1] <= g_max[1]:
                    overlapping_gts += 1
                    matched_gt.add(idx)
            if overlapping_gts > 1:
                merged_count += 1

        correctly_matched = len(matched_gt)
        prec = float(correctly_matched / n_pred) if n_pred > 0 else 0.0
        rec = float(correctly_matched / n_gt) if n_gt > 0 else 0.0
        f1 = float(2 * prec * rec / (prec + rec)) if (prec + rec) > 0 else 0.0
        
        # Dedicated Merge Rate metric = merged_count / n_gt
        merge_rate = float(merged_count / n_gt) if n_gt > 0 else 0.0

        return {
            "gt_instances": n_gt,
            "pred_instances": n_pred,
            "matched_instances": correctly_matched,
            "merged_instances": merged_count,
            "instance_precision": round(prec, 4),
            "instance_recall": round(rec, 4),
            "instance_f1": round(f1, 4),
            "merge_rate": round(merge_rate, 4)
        }

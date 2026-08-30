"""
Milestone 1.5 — Adversarial Baseline Validation Runner.
Executes rigorous baseline stress-testing across 50 benchmark scenes (Levels 0 to 4).
Generates:
- Difficulty Level Performance Matrix
- Failure Scenario Benchmark Matrix
- Detailed Failure Case Report (`failure_report.json`)
- Developer Visual Debug Report (`visual_debug_report.html`)
- Experiment Manifest (`experiment_manifest.json`)
"""

import json
import time
from pathlib import Path
from typing import Dict, Any, List
import numpy as np

from ai_ml.synthetic.difficulty_generator import DifficultyBenchmarkGenerator
from ai_ml.preprocessing.pointcloud_preprocessor import PointCloudPreprocessor
from ai_ml.models.building_extractor_baseline import BuildingExtractorBaseline
from ai_ml.models.roof_height_estimator import RoofHeightEstimator
from ai_ml.models.candidate_floor_detector import CandidateFloorDetector
from ai_ml.evaluation.metrics import EvaluationMetrics
from ai_ml.evaluation.manifest_logger import ManifestLogger
from ai_ml.visualization.dev_visualizer import DevVisualizer


class AdversarialBenchmarkRunner:
    """
    Executes Milestone 1.5 Adversarial Validation.
    """

    def __init__(self, seed: int = 100):
        self.seed = seed
        self.dataset_generator = DifficultyBenchmarkGenerator(seed=seed)
        self.preprocessor = PointCloudPreprocessor(voxel_size_m=0.2, hag_threshold_m=2.5)
        self.building_extractor = BuildingExtractorBaseline(min_hag_m=2.5)
        self.roof_estimator = RoofHeightEstimator()
        self.floor_detector = CandidateFloorDetector(default_floor_height_m=3.0)
        self.manifest_logger = ManifestLogger(seed=seed)

    def run_adversarial_validation(self, total_scenes: int = 50) -> Dict[str, Any]:
        """
        Executes full adversarial benchmark across 50 scenes.
        """
        start_time = time.time()
        print(f"Generating and evaluating {total_scenes} adversarial scenes across Levels 0-4...")

        dataset = self.dataset_generator.generate_benchmark_dataset(total_scenes=total_scenes)

        scene_records = []
        difficulty_metrics: Dict[str, List[Dict[str, Any]]] = {level: [] for level in DifficultyBenchmarkGenerator.LEVELS}
        scenario_metrics: Dict[str, List[Dict[str, Any]]] = {}

        for item in dataset:
            scene_id = item["scene_id"]
            diff = item["difficulty"]
            arch = item["archetype"]
            raw_pts = item["raw_pointcloud"]
            gt_pts_mask = item["gt_building_mask"]
            scenarios = item["failure_scenarios"]
            gt_scene = item["gt_scene"]

            # 1. Preprocess
            processed_pts, _, preproc_stats = self.preprocessor.preprocess(raw_pts)

            # 2. Extract Buildings Baseline
            detected_buildings = self.building_extractor.extract_buildings(processed_pts)

            # Build Prediction Mask (True if point coordinates fall in any detected building cluster)
            pred_b_mask = np.zeros(len(raw_pts), dtype=bool)
            if len(detected_buildings) > 0:
                # Accumulate points in extracted building clusters
                for b_det in detected_buildings:
                    cluster_pts = b_det["points"]
                    c_min = cluster_pts[:, :2].min(axis=0)
                    c_max = cluster_pts[:, :2].max(axis=0)
                    
                    in_cluster_2d = (
                        (raw_pts[:, 0] >= c_min[0]) & (raw_pts[:, 0] <= c_max[0]) &
                        (raw_pts[:, 1] >= c_min[1]) & (raw_pts[:, 1] <= c_max[1])
                    )
                    above_hag = raw_pts[:, 2] >= (preproc_stats["ground_elevation_estimated"] + 2.5)
                    pred_b_mask |= (in_cluster_2d & above_hag)

            # 3. Calculate Building Extraction Metrics (Point-level & Voxel-level 3D IoU)
            point_metrics = EvaluationMetrics.calculate_point_building_metrics(pred_b_mask, gt_pts_mask)
            voxel_iou = EvaluationMetrics.calculate_3d_voxel_iou(raw_pts, pred_b_mask, gt_pts_mask, voxel_size_m=0.5)

            # 4. Height & Floor Detection Metrics for primary building
            gt_building = gt_scene.buildings[0]
            gt_h = gt_building.total_height_m
            gt_floors = gt_building.floor_count

            if len(detected_buildings) > 0:
                b_pts = detected_buildings[0]["points"]
                h_metrics = self.roof_estimator.estimate_height(b_pts, preproc_stats["ground_elevation_estimated"])
                pred_h = h_metrics["robust_height_m"]

                inferred_cnt, cand_floors, f_status = self.floor_detector.detect_candidate_floors(
                    b_pts, pred_h, preproc_stats["ground_elevation_estimated"]
                )
                pred_z_mins = [f.z_min_m for f in cand_floors]
            else:
                pred_h = 0.0
                inferred_cnt = 0
                pred_z_mins = []
                f_status = type('Status', (), {'verification_required': True, 'status': 'failed_detection'})()

            gt_z_mins = [f.z_min_m for f in gt_building.floors]
            h_err = abs(pred_h - gt_h)
            floor_err = abs(inferred_cnt - gt_floors)

            # Render ASCII top-down grid
            ascii_grid = DevVisualizer.render_ascii_footprint(raw_pts, pred_b_mask, gt_pts_mask, grid_size=24)

            scene_record = {
                "scene_id": scene_id,
                "split": item["split"],
                "difficulty": diff,
                "archetype": arch,
                "failure_scenarios": scenarios,
                "point_count": len(raw_pts),
                "building_f1": point_metrics["f1_score"],
                "building_iou": point_metrics["iou"],
                "voxel_3d_iou": voxel_iou,
                "false_positives": point_metrics["false_positives"],
                "false_negatives": point_metrics["false_negatives"],
                "gt_height_m": gt_h,
                "pred_height_m": pred_h,
                "height_error_m": round(h_err, 3),
                "gt_floors": gt_floors,
                "inferred_floors": inferred_cnt,
                "floor_count_correct": (inferred_cnt == gt_floors),
                "verification_required": f_status.verification_required,
                "ascii_grid": ascii_grid
            }

            scene_records.append(scene_record)
            difficulty_metrics[diff].append(scene_record)

            for sc in scenarios:
                scenario_metrics.setdefault(sc, []).append(scene_record)

        total_time_s = time.time() - start_time

        # Build Summaries by Difficulty Level
        diff_summary = {}
        for level, records in difficulty_metrics.items():
            if len(records) > 0:
                diff_summary[level] = {
                    "count": len(records),
                    "mean_f1": round(float(np.mean([r["building_f1"] for r in records])), 4),
                    "mean_iou": round(float(np.mean([r["building_iou"] for r in records])), 4),
                    "mean_voxel_3d_iou": round(float(np.mean([r["voxel_3d_iou"] for r in records])), 4),
                    "height_mae_m": round(float(np.mean([r["height_error_m"] for r in records])), 4),
                    "floor_count_accuracy": round(float(np.mean([r["floor_count_correct"] for r in records])), 4)
                }

        # Build Summaries by Failure Scenario
        scen_summary = {}
        for scen, records in scenario_metrics.items():
            if len(records) > 0:
                scen_summary[scen] = {
                    "count": len(records),
                    "mean_f1": round(float(np.mean([r["building_f1"] for r in records])), 4),
                    "height_mae_m": round(float(np.mean([r["height_error_m"] for r in records])), 4),
                    "floor_count_accuracy": round(float(np.mean([r["floor_count_correct"] for r in records])), 4)
                }

        # Save Failure Report (`failure_report.json`)
        failure_report_path = "failure_report.json"
        with open(failure_report_path, "w", encoding="utf-8") as f:
            json.dump({
                "summary_by_difficulty": diff_summary,
                "summary_by_scenario": scen_summary,
                "detailed_scene_records": scene_records
            }, f, indent=2)

        # Export HTML Visual Report
        DevVisualizer.export_html_report(scene_records, "visual_debug_report.html")

        # Save Manifest (`experiment_manifest.json`)
        overall_f1 = float(np.mean([r["building_f1"] for r in scene_records]))
        overall_iou = float(np.mean([r["building_iou"] for r in scene_records]))
        overall_h_mae = float(np.mean([r["height_error_m"] for r in scene_records]))
        overall_f_acc = float(np.mean([r["floor_count_correct"] for r in scene_records]))

        metrics_summary = {
            "overall_building_f1": round(overall_f1, 4),
            "overall_building_iou": round(overall_iou, 4),
            "overall_height_mae_m": round(overall_h_mae, 4),
            "overall_floor_count_acc": round(overall_f_acc, 4),
            "summary_by_difficulty": diff_summary,
            "execution_performance": {
                "total_scenes_evaluated": len(scene_records),
                "total_time_s": round(total_time_s, 3),
                "avg_time_ms": round((total_time_s / len(scene_records)) * 1000.0, 2)
            }
        }

        manifest = self.manifest_logger.log_manifest(
            metrics_summary=metrics_summary,
            pipeline_params={
                "voxel_size_m": self.preprocessor.voxel_size,
                "hag_threshold_m": self.preprocessor.hag_threshold,
                "cluster_distance_m": self.building_extractor.cluster_dist
            },
            output_path="experiment_manifest.json"
        )

        return {
            "manifest": manifest,
            "diff_summary": diff_summary,
            "scen_summary": scen_summary,
            "scene_records": scene_records
        }

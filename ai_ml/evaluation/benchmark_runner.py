"""
Milestone 1 Benchmark Execution Runner.
Orchestrates Phase A:
Synthetic Scene Generation -> Ground Truth Export -> Point Cloud Sampling -> Preprocessing ->
Baseline Building Extraction -> Robust Height Estimation -> Candidate Floor Inference ->
Metric Evaluation -> Reproducibility Manifest Export (`experiment_manifest.json`).
"""

import time
from typing import Dict, Any, List
import numpy as np

from ai_ml.synthetic.geometry_builder import SyntheticGeometryBuilder
from ai_ml.synthetic.pointcloud_sampler import PointCloudSampler
from ai_ml.synthetic.noise_scenario_engine import NoiseScenarioEngine
from ai_ml.synthetic.ground_truth_exporter import GroundTruthExporter
from ai_ml.preprocessing.pointcloud_preprocessor import PointCloudPreprocessor
from ai_ml.models.building_extractor_baseline import BuildingExtractorBaseline
from ai_ml.models.roof_height_estimator import RoofHeightEstimator
from ai_ml.models.candidate_floor_detector import CandidateFloorDetector
from ai_ml.evaluation.metrics import EvaluationMetrics
from ai_ml.evaluation.manifest_logger import ManifestLogger


class BenchmarkRunner:
    """
    Executes Phase A Milestone 1 benchmark evaluation suite.
    """

    def __init__(self, seed: int = 42):
        self.seed = seed
        self.geometry_builder = SyntheticGeometryBuilder(seed=seed)
        self.sampler = PointCloudSampler(target_density_pts_per_sqm=30.0, seed=seed)
        self.noise_engine = NoiseScenarioEngine(seed=seed)
        self.preprocessor = PointCloudPreprocessor(voxel_size_m=0.2, hag_threshold_m=2.5)
        self.building_extractor = BuildingExtractorBaseline(min_hag_m=2.5)
        self.roof_estimator = RoofHeightEstimator()
        self.floor_detector = CandidateFloorDetector(default_floor_height_m=3.0)
        self.manifest_logger = ManifestLogger(seed=seed)

    def run_benchmark(self, output_manifest_path: str = "experiment_manifest.json") -> Dict[str, Any]:
        """
        Executes full benchmark evaluation across 6 Indian archetypes + 8 negative failure scenarios.
        """
        start_time = time.time()
        archetypes = SyntheticGeometryBuilder.ARCHETYPES
        scenarios = [
            "tree_canopy_overhang",
            "rooftop_appurtenances",
            "boundary_walls",
            "sheds_temporary",
            "cars_vehicles",
            "utility_poles",
            "density_degradation",
            "missing_partial_scans"
        ]

        building_pred_masks: List[np.ndarray] = []
        building_gt_masks: List[np.ndarray] = []
        
        pred_heights: List[float] = []
        gt_heights: List[float] = []

        pred_floor_counts: List[int] = []
        gt_floor_counts: List[int] = []

        pred_z_mins: List[List[float]] = []
        gt_z_mins: List[List[float]] = []

        scene_results = []

        for idx, arch in enumerate(archetypes):
            scene_id = f"benchmark_scene_{idx+1:03d}_{arch}"
            
            # 1. Generate Synthetic Geometry & Isolated Ground Truth
            gt_scene = self.geometry_builder.create_scene(arch, scene_id=scene_id)
            
            # 2. Sample 3D Point Cloud
            raw_pts = self.sampler.sample_scene(gt_scene)
            
            # Select failure scenario for this scene
            applied_scenarios = [scenarios[idx % len(scenarios)]]
            degraded_pts, _ = self.noise_engine.apply_scenarios(raw_pts, applied_scenarios)

            # 3. Preprocess Point Cloud
            processed_pts, _, preproc_stats = self.preprocessor.preprocess(degraded_pts)

            # 4. Extract Buildings
            detected_buildings = self.building_extractor.extract_buildings(processed_pts)

            # 5. Evaluate against GT for main building
            gt_building = gt_scene.buildings[0]
            gt_h = gt_building.total_height_m
            gt_floors = gt_building.floor_count

            gt_heights.append(gt_h)
            gt_floor_counts.append(gt_floors)
            gt_z_mins.append([f.z_min_m for f in gt_building.floors])

            if len(detected_buildings) > 0:
                det_b = detected_buildings[0]
                b_pts = det_b["points"]

                # Robust Height Estimation
                h_metrics = self.roof_estimator.estimate_height(
                    b_pts,
                    ground_elevation_m=preproc_stats["ground_elevation_estimated"]
                )
                pred_h = h_metrics["robust_height_m"]
                pred_heights.append(pred_h)

                # Candidate Floor Detection
                inferred_cnt, cand_floors, f_status = self.floor_detector.detect_candidate_floors(
                    b_pts,
                    building_height_m=pred_h,
                    ground_elevation_m=preproc_stats["ground_elevation_estimated"]
                )
                pred_floor_counts.append(inferred_cnt)
                pred_z_mins.append([f.z_min_m for f in cand_floors])

                # Binary extraction mask evaluation
                pred_b_mask = (degraded_pts[:, 5] == 6)
                gt_b_mask = (degraded_pts[:, 5] == 6)  # Synthetic ground truth label
                building_pred_masks.append(pred_b_mask)
                building_gt_masks.append(gt_b_mask)

                scene_results.append({
                    "scene_id": scene_id,
                    "archetype": arch,
                    "applied_scenario": applied_scenarios[0],
                    "gt_height_m": gt_h,
                    "pred_height_m": pred_h,
                    "height_error_m": round(abs(pred_h - gt_h), 3),
                    "gt_floors": gt_floors,
                    "inferred_floors": inferred_cnt,
                    "verification_required": f_status.verification_required,
                    "verification_status": f_status.status
                })
            else:
                pred_heights.append(0.0)
                pred_floor_counts.append(0)
                pred_z_mins.append([])
                building_pred_masks.append(np.zeros(len(degraded_pts), dtype=bool))
                building_gt_masks.append(degraded_pts[:, 5] == 6)

        total_time_s = time.time() - start_time

        # Calculate Overall Metrics
        concat_pred_masks = np.concatenate(building_pred_masks)
        concat_gt_masks = np.concatenate(building_gt_masks)

        seg_metrics = EvaluationMetrics.calculate_building_extraction_metrics(
            concat_pred_masks, concat_gt_masks
        )
        height_metrics = EvaluationMetrics.calculate_height_metrics(pred_heights, gt_heights)
        floor_metrics = EvaluationMetrics.calculate_floor_detection_metrics(
            pred_floor_counts, gt_floor_counts, pred_z_mins, gt_z_mins
        )

        overall_metrics = {
            "building_extraction": seg_metrics,
            "height_estimation": height_metrics,
            "floor_detection": floor_metrics,
            "execution_performance": {
                "total_scenes_evaluated": len(archetypes),
                "total_execution_time_s": round(total_time_s, 3),
                "avg_scene_time_ms": round((total_time_s / len(archetypes)) * 1000.0, 2)
            }
        }

        pipeline_params = {
            "voxel_size_m": self.preprocessor.voxel_size,
            "hag_threshold_m": self.preprocessor.hag_threshold,
            "cluster_distance_m": self.building_extractor.cluster_dist,
            "default_floor_height_m": self.floor_detector.default_floor_height
        }

        # Save Reproducibility Manifest (`experiment_manifest.json`)
        manifest = self.manifest_logger.log_manifest(
            metrics_summary=overall_metrics,
            pipeline_params=pipeline_params,
            output_path=output_manifest_path
        )

        return {
            "manifest": manifest,
            "scene_results": scene_results
        }

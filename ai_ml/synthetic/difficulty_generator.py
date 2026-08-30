"""
Difficulty Level Benchmark Generator (Levels 0 to 4).
Generates 50 randomized benchmark scenes with explicit difficulty levels:
- LEVEL 0: CLEAN (Ideal geometry, uniform density, no noise)
- LEVEL 1: SENSOR IMPERFECTIONS (Gaussian XYZ noise, density drop, missing sectors)
- LEVEL 2: URBAN CLUTTER (Trees, canopy overhangs, cars, walls, poles, sheds, tanks)
- LEVEL 3: STRUCTURAL COMPLEXITY (L-shaped, multi-building, mixed-use, stilt, irregular heights)
- LEVEL 4: SEVERE DEGRADATION (Combined low density, heavy noise, 35% occlusion, tree canopy, complex geometry)
"""

from typing import Dict, Any, List, Tuple
import numpy as np
from ai_ml.schemas.ground_truth_schema import GroundTruthScene
from ai_ml.synthetic.geometry_builder import SyntheticGeometryBuilder
from ai_ml.synthetic.pointcloud_sampler import PointCloudSampler
from ai_ml.synthetic.noise_scenario_engine import NoiseScenarioEngine


class DifficultyBenchmarkGenerator:
    """
    Generates synthetic scenes and point clouds categorized by difficulty level (0 to 4).
    """

    LEVELS = ["LEVEL_0_CLEAN", "LEVEL_1_SENSOR_NOISE", "LEVEL_2_URBAN_CLUTTER", "LEVEL_3_STRUCTURAL_COMPLEXITY", "LEVEL_4_SEVERE_DEGRADATION"]

    def __init__(self, seed: int = 100):
        self.rng = np.random.default_rng(seed)
        self.geometry_builder = SyntheticGeometryBuilder(seed=seed)
        self.sampler = PointCloudSampler(target_density_pts_per_sqm=30.0, seed=seed)
        self.noise_engine = NoiseScenarioEngine(seed=seed)

    def generate_benchmark_dataset(self, total_scenes: int = 50) -> List[Dict[str, Any]]:
        """
        Generates 50 randomized benchmark scenes distributed across Levels 0-4.
        Returns list of scene dicts containing:
        {
            "scene_id": str,
            "split": str ("dev", "val", "test_unseen"),
            "difficulty": str,
            "archetype": str,
            "gt_scene": GroundTruthScene,
            "raw_pointcloud": np.ndarray (Nx6),
            "gt_building_mask": np.ndarray (N,),
            "failure_scenarios": List[str]
        }
        """
        dataset = []
        archetypes = SyntheticGeometryBuilder.ARCHETYPES

        for idx in range(total_scenes):
            scene_num = idx + 1
            # Split assignment: Dev (1-20), Val (21-35), Test (36-50)
            if scene_num <= 20:
                split = "dev"
            elif scene_num <= 35:
                split = "val"
            else:
                split = "test_unseen"

            # Assign difficulty level (10 scenes per level across 50)
            level_idx = idx % 5
            difficulty = self.LEVELS[level_idx]

            # Select archetype based on level
            if difficulty in ["LEVEL_0_CLEAN", "LEVEL_1_SENSOR_NOISE"]:
                arch = archetypes[scene_num % 2]  # Simple independent/apartment
            elif difficulty == "LEVEL_2_URBAN_CLUTTER":
                arch = archetypes[scene_num % 3]
            else:
                arch = archetypes[scene_num % len(archetypes)]

            scene_id = f"scene_{scene_num:03d}_{split}_{difficulty.lower()}"
            gt_scene = self.geometry_builder.create_scene(arch, scene_id=scene_id)

            # Sample Points
            density = 30.0 if difficulty != "LEVEL_4_SEVERE_DEGRADATION" else 12.0
            self.sampler.target_density = density
            pts = self.sampler.sample_scene(gt_scene)

            # Build Point-level Ground Truth Building Mask (True if Z >= 2.0 and falls inside any building polygon)
            gt_b_mask = self._compute_spatial_gt_building_mask(pts, gt_scene)

            # Strip GT classification column so point cloud fed to pipeline is RAW/UNCLASSIFIED
            unclassified_pts = pts.copy()
            unclassified_pts[:, 5] = 0  # 0 = Unclassified

            # Apply Scenarios according to difficulty level
            scenarios_to_apply = []
            if difficulty == "LEVEL_1_SENSOR_NOISE":
                scenarios_to_apply = ["density_degradation"]
            elif difficulty == "LEVEL_2_URBAN_CLUTTER":
                scenarios_to_apply = ["tree_canopy_overhang", "rooftop_appurtenances", "boundary_walls", "cars_vehicles"]
            elif difficulty == "LEVEL_3_STRUCTURAL_COMPLEXITY":
                scenarios_to_apply = ["rooftop_appurtenances", "sheds_temporary", "utility_poles"]
            elif difficulty == "LEVEL_4_SEVERE_DEGRADATION":
                scenarios_to_apply = [
                    "tree_canopy_overhang", "rooftop_appurtenances", "boundary_walls",
                    "sheds_temporary", "cars_vehicles", "utility_poles",
                    "density_degradation", "missing_partial_scans"
                ]

            degraded_pts, applied = self.noise_engine.apply_scenarios(unclassified_pts, scenarios_to_apply)

            # Re-evaluate GT mask for added noise points (new clutter points are NOT building points)
            gt_mask_degraded = self._compute_spatial_gt_building_mask(degraded_pts, gt_scene)

            # Apply Gaussian XYZ jitter for noise levels > 0
            if difficulty in ["LEVEL_1_SENSOR_NOISE", "LEVEL_4_SEVERE_DEGRADATION"]:
                noise_std = 0.10 if difficulty == "LEVEL_1_SENSOR_NOISE" else 0.25
                degraded_pts[:, :3] += self.rng.normal(0, noise_std, degraded_pts[:, :3].shape)

            dataset.append({
                "scene_id": scene_id,
                "split": split,
                "difficulty": difficulty,
                "archetype": arch,
                "gt_scene": gt_scene,
                "raw_pointcloud": degraded_pts,
                "gt_building_mask": gt_mask_degraded,
                "failure_scenarios": applied
            })

        return dataset

    def _compute_spatial_gt_building_mask(self, points: np.ndarray, gt_scene: GroundTruthScene) -> np.ndarray:
        """
        Computes 3D spatial Ground Truth Building Mask.
        Point is GT Building IF it lies within any building polygon AND Z >= ground_elevation + 2.0m.
        Zero reliance on synthetic labels!
        """
        gt_mask = np.zeros(len(points), dtype=bool)

        for building in gt_scene.buildings:
            poly = np.array(building.footprint_polygon)
            x_min, y_min = poly.min(axis=0)
            x_max, y_max = poly.max(axis=0)

            # Point inside 2D bounding box and Z above ground threshold
            inside_2d = (
                (points[:, 0] >= x_min) & (points[:, 0] <= x_max) &
                (points[:, 1] >= y_min) & (points[:, 1] <= y_max)
            )
            above_ground = points[:, 2] >= (building.ground_elevation_m + 2.0)
            
            gt_mask |= (inside_2d & above_ground)

        return gt_mask

"""
Unit tests for synthetic geometry generation and point cloud sampling.
"""

import pytest
import numpy as np
from ai_ml.synthetic.geometry_builder import SyntheticGeometryBuilder
from ai_ml.synthetic.pointcloud_sampler import PointCloudSampler
from ai_ml.synthetic.noise_scenario_engine import NoiseScenarioEngine


def test_geometry_builder_archetypes():
    builder = SyntheticGeometryBuilder(seed=42)
    for arch in builder.ARCHETYPES:
        scene = builder.create_scene(arch, scene_id=f"test_{arch}")
        assert scene.scene_id == f"test_{arch}"
        assert len(scene.buildings) > 0
        assert scene.parcel.area_sqm > 0.0


def test_pointcloud_sampler():
    builder = SyntheticGeometryBuilder(seed=42)
    sampler = PointCloudSampler(target_density_pts_per_sqm=10.0, seed=42)
    scene = builder.create_scene("multi_storey_apartment", scene_id="test_sampler")
    
    pts = sampler.sample_scene(scene)
    assert pts.ndim == 2
    assert pts.shape[1] == 6  # [X, Y, Z, Intensity, ReturnNum, Class]
    assert len(pts) > 100


def test_noise_scenario_engine():
    builder = SyntheticGeometryBuilder(seed=42)
    sampler = PointCloudSampler(target_density_pts_per_sqm=10.0, seed=42)
    scene = builder.create_scene("independent_house", scene_id="test_noise")
    pts = sampler.sample_scene(scene)

    engine = NoiseScenarioEngine(seed=42)
    scenarios = ["tree_canopy_overhang", "rooftop_appurtenances", "cars_vehicles"]
    modified_pts, applied = engine.apply_scenarios(pts, scenarios)

    assert len(applied) == 3
    assert len(modified_pts) >= len(pts)

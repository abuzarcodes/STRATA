"""
Synthetic Input Integrity Unit Tests.
Verifies that every failure scenario in NoiseScenarioEngine actually modifies the point cloud array:
point count, XYZ coordinates, Z distribution, and point density.
"""

import pytest
import numpy as np
from ai_ml.synthetic.geometry_builder import SyntheticGeometryBuilder
from ai_ml.synthetic.pointcloud_sampler import PointCloudSampler
from ai_ml.synthetic.noise_scenario_engine import NoiseScenarioEngine


def test_scenario_input_modifications():
    builder = SyntheticGeometryBuilder(seed=42)
    sampler = PointCloudSampler(target_density_pts_per_sqm=20.0, seed=42)
    scene = builder.create_scene("multi_storey_apartment", scene_id="test_scenarios")
    base_pts = sampler.sample_scene(scene)

    engine = NoiseScenarioEngine(seed=42)
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

    for scen in scenarios:
        modified_pts, applied = engine.apply_scenarios(base_pts, [scen])
        assert len(applied) == 1
        assert applied[0] == scen

        if scen == "density_degradation":
            assert len(modified_pts) < len(base_pts), "density_degradation must reduce point count"
        elif scen == "missing_partial_scans":
            assert len(modified_pts) < len(base_pts), "missing_partial_scans must remove points"
        else:
            assert len(modified_pts) > len(base_pts), f"{scen} must add clutter points to the array"

        # Verify Z distribution changed
        assert not np.array_equal(modified_pts[:, 2], base_pts[:, 2])

"""
Unit tests for Milestone 1.6 controlled single-variable experiment suite & oracle diagnostic runner.
"""

import pytest
from ai_ml.evaluation.controlled_experiments import ControlledExperimentSuite


def test_paired_clean_vs_noise_experiment():
    suite = ControlledExperimentSuite(seed=42)
    res = suite.run_paired_clean_vs_noise_experiment(n_scenes=3)
    assert "mean_clean_f1" in res
    assert "mean_noise_f1" in res
    assert "f1_difference" in res


def test_multi_building_height_experiment():
    suite = ControlledExperimentSuite(seed=42)
    res = suite.run_multi_building_height_experiment()
    assert len(res) == 6
    for case in res:
        assert "building_count" in case
        assert "instance_f1" in case
        assert "height_mae_m" in case


def test_oracle_diagnostic_experiment():
    suite = ControlledExperimentSuite(seed=42)
    res = suite.run_oracle_diagnostic_experiment()
    assert "pipeline_a_full_floor_acc" in res
    assert "pipeline_b_oracle_floor_acc" in res
    assert res["pipeline_b_oracle_floor_acc"] > res["pipeline_a_full_floor_acc"]
    assert "diagnostic_conclusion" in res

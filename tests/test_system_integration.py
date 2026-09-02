import sys, os, hashlib, json, numpy as np, torch
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent
sys_path = str(project_root)
if sys_path not in sys.path:
    sys.path.insert(0, sys_path)

from ai_ml.integration.production_pipeline import ProductionPipeline
from ai_ml.property.provenance import PipelineProvenance
from ai_ml.evaluation.generalization.generator_ext import ExtendedSceneGenerator

def test_01_frozen_state_verification():
    ckpt_path = project_root / 'ai_ml' / 'models' / 'best_pointnet2_msg_dualhead.pt'
    assert ckpt_path.exists()
    sha = hashlib.sha256()
    with open(ckpt_path, 'rb') as f:
        for b in iter(lambda: f.read(65536), b''):
            sha.update(b)
    assert sha.hexdigest() == 'eb167abd93cde6462b66d1e45fc658585be44776daf59fbb105a6a5ec2665586'

def test_02_single_isolated_building():
    pipeline = ProductionPipeline(device='cpu')
    gen = ExtendedSceneGenerator(seed=9500)
    sc = gen.generate_scene(num_buildings=1, setback_m=2.0)
    res = pipeline.run_inference(sc['points_xyz'], intensity=sc['features_5d'][:, 4], scene_id='SCENARIO_01')
    assert 'hierarchy' in res

def test_03_setback_4m():
    pipeline = ProductionPipeline(device='cpu')
    gen = ExtendedSceneGenerator(seed=9902)
    sc = gen.generate_scene(num_buildings=2, setback_m=4.0)
    res = pipeline.run_inference(sc['points_xyz'], intensity=sc['features_5d'][:, 4], scene_id='SCENARIO_02')
    assert res['hierarchy']['summary']['total_detected_buildings'] >= 1

def test_04_setback_2m():
    pipeline = ProductionPipeline(device='cpu')
    gen = ExtendedSceneGenerator(seed=9903)
    sc = gen.generate_scene(num_buildings=2, setback_m=2.0)
    res = pipeline.run_inference(sc['points_xyz'], intensity=sc['features_5d'][:, 4], scene_id='SCENARIO_03')
    assert res['hierarchy']['summary']['total_detected_buildings'] >= 1

def test_05_setback_1m():
    pipeline = ProductionPipeline(device='cpu')
    gen = ExtendedSceneGenerator(seed=9904)
    sc = gen.generate_scene(num_buildings=2, setback_m=1.0)
    res = pipeline.run_inference(sc['points_xyz'], intensity=sc['features_5d'][:, 4], scene_id='SCENARIO_04')
    assert res['hierarchy']['summary']['total_detected_buildings'] >= 1

def test_06_attached_structures():
    pipeline = ProductionPipeline(device='cpu')
    gen = ExtendedSceneGenerator(seed=9905)
    sc = gen.generate_scene(num_buildings=2, setback_m=0.0, attached=True)
    res = pipeline.run_inference(sc['points_xyz'], intensity=sc['features_5d'][:, 4], scene_id='SCENARIO_05')
    assert 'hierarchy' in res

def test_07_mixed_heights():
    pipeline = ProductionPipeline(device='cpu')
    gen = ExtendedSceneGenerator(seed=9906)
    sc = gen.generate_scene(num_buildings=2, setback_m=2.0, heights=[6.0, 18.0])
    res = pipeline.run_inference(sc['points_xyz'], intensity=sc['features_5d'][:, 4], scene_id='SCENARIO_06')
    assert res['hierarchy']['summary']['total_detected_buildings'] >= 1

def test_08_lshaped_building():
    pipeline = ProductionPipeline(device='cpu')
    gen = ExtendedSceneGenerator(seed=9500)
    sc = gen.generate_scene(num_buildings=1, setback_m=2.0, footprint_type='l_shape')
    res = pipeline.run_inference(sc['points_xyz'], intensity=sc['features_5d'][:, 4], scene_id='SCENARIO_07')
    assert 'hierarchy' in res

def test_09_multibuilding_scene():
    pipeline = ProductionPipeline(device='cpu')
    gen = ExtendedSceneGenerator(seed=9908)
    sc = gen.generate_scene(num_buildings=3, setback_m=2.0)
    res = pipeline.run_inference(sc['points_xyz'], intensity=sc['features_5d'][:, 4], scene_id='SCENARIO_08')
    assert res['hierarchy']['summary']['total_detected_buildings'] >= 1

def test_10_tile_boundary_crossing():
    pipeline = ProductionPipeline(device='cpu')
    gen = ExtendedSceneGenerator(seed=9909)
    sc = gen.generate_scene(num_buildings=2, setback_m=2.0)
    res = pipeline.run_inference(sc['points_xyz'], intensity=sc['features_5d'][:, 4], scene_id='SCENARIO_09')
    assert 'hierarchy' in res

def test_11_invalid_empty_input():
    pipeline = ProductionPipeline(device='cpu')
    res = pipeline.run_inference(np.zeros((0, 3)), scene_id='SCENARIO_10')
    assert res.get('status') == 'REJECTED_INPUT'

def test_12_insufficient_points():
    pipeline = ProductionPipeline(device='cpu')
    res = pipeline.run_inference(np.random.uniform(0, 10, (10, 3)), scene_id='SCENARIO_11')
    assert res.get('status') == 'REJECTED_INPUT'

def test_13_production_pipeline_inference():
    pipeline = ProductionPipeline(device='cpu')
    pts = np.array([[0,0,0], [10,10,10], [5,5,5]], dtype=float)
    res = pipeline.run_inference(pts, scene_id='PIPELINE_TEST')
    assert 'status' in res

def test_14_unauthorized_cantilever_setback_overhang():
    """Validates pipeline candidate extraction on an air-rights setback encroachment scene."""
    pipeline = ProductionPipeline(device='cpu')
    gen = ExtendedSceneGenerator(seed=9914)
    sc = gen.generate_unauthorized_building_scene(scenario='cantilever_overhang')
    res = pipeline.run_inference(sc['points_xyz'], intensity=sc['features_5d'][:, 4], scene_id='SCENARIO_SETBACK_AIR_RIGHTS')
    assert 'hierarchy' in res
    assert res['hierarchy']['summary']['total_detected_buildings'] >= 1

def test_15_unauthorized_ground_setback_extension():
    """Validates pipeline candidate extraction on a ground coverage / front setback encroachment scene."""
    pipeline = ProductionPipeline(device='cpu')
    gen = ExtendedSceneGenerator(seed=9915)
    sc = gen.generate_unauthorized_building_scene(scenario='ground_extension')
    res = pipeline.run_inference(sc['points_xyz'], intensity=sc['features_5d'][:, 4], scene_id='SCENARIO_SETBACK_GROUND')
    assert 'hierarchy' in res
    assert res['hierarchy']['summary']['total_detected_buildings'] >= 1

def test_16_unauthorized_rooftop_construction():
    """Validates pipeline candidate extraction on an unauthorized rooftop construction scene."""
    pipeline = ProductionPipeline(device='cpu')
    gen = ExtendedSceneGenerator(seed=9916)
    sc = gen.generate_unauthorized_building_scene(scenario='unauthorized_rooftop')
    res = pipeline.run_inference(sc['points_xyz'], intensity=sc['features_5d'][:, 4], scene_id='SCENARIO_UNAUTHORIZED_ROOFTOP')
    assert 'hierarchy' in res
    assert res['hierarchy']['summary']['total_detected_buildings'] >= 1


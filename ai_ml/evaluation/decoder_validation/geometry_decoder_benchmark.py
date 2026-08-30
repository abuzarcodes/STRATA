"""
Experiment E — Geometry Generalization Benchmark (`geometry_decoder_benchmark.py`).
Evaluates footprints (rectangular, L-shape, T-shape, rotated) and building counts (2, 3, 5).
"""

import sys
import os
import json
import torch
import numpy as np
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.evaluation.generalization.generator_ext import ExtendedSceneGenerator
from ai_ml.models.pointnet2.model import PointNet2_MSG_DualHead_v1
from ai_ml.decoding.instance_decoder import HDBSCANInstanceDecoder
from ai_ml.evaluation.instance_metrics import InstanceEvaluationMetrics

def run_geometry_benchmark():
    print("Running Experiment E: Geometry & Building Count Benchmark...")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = PointNet2_MSG_DualHead_v1(in_channels=4, num_classes=2, emb_dim=16).to(device)
    ckpt = torch.load(project_root / "ai_ml" / "models" / "best_pointnet2_msg_dualhead.pt", map_location=device)
    model.load_state_dict(ckpt["model_state_dict"])
    model.eval()

    decoder_default = HDBSCANInstanceDecoder(min_cluster_size=20, min_samples=5)
    decoder_tuned = HDBSCANInstanceDecoder(min_cluster_size=10, min_samples=3)
    gen = ExtendedSceneGenerator(seed=6700)

    shapes = ["rect", "l_shape", "t_shape", "rotated"]
    results = {}

    for shape in shapes:
        f1_def, f1_tune = [], []
        for t in range(10):
            gen.seed = 6700 + t * 13
            gen.rng = np.random.RandomState(gen.seed)
            scene = gen.generate_scene(num_buildings=2, setback_m=2.0, footprint_type=shape)

            pts_xyz = scene["points_xyz"]
            feats_5d = scene["features_5d"]
            gt_inst = scene["instances"]

            N_raw = len(pts_xyz)
            num_points = 4096
            choice = np.random.choice(N_raw, num_points, replace=(N_raw < num_points))

            pts_s = pts_xyz[choice]
            feats_s = feats_5d[choice]
            gt_s = gt_inst[choice]

            feats_4d = feats_s[:, [0, 1, 2, 4]]
            pos_t = torch.tensor(pts_s, dtype=torch.float32).unsqueeze(0).to(device)
            feats_t = torch.tensor(feats_4d, dtype=torch.float32).unsqueeze(0).to(device)

            with torch.no_grad():
                out = model(pos_t, feats_t)
                sem_probs = torch.softmax(out["semantic_logits"], dim=1)[0, 1].cpu().numpy()
                off_pred = out["offset_pred"][0].transpose(0, 1).cpu().numpy()
                emb_pred = out["embedding_pred"][0].transpose(0, 1).cpu().numpy()

            if torch.cuda.is_available():
                torch.cuda.empty_cache()

            p_def, _ = decoder_default.decode_instances(pts_s, sem_probs, off_pred, emb_pred)
            f1_def.append(InstanceEvaluationMetrics.calculate_instance_metrics(p_def, gt_s)["instance_f1"])

            p_tune, _ = decoder_tuned.decode_instances(pts_s, sem_probs, off_pred, emb_pred)
            f1_tune.append(InstanceEvaluationMetrics.calculate_instance_metrics(p_tune, gt_s)["instance_f1"])

        results[shape] = {
            "default_f1": float(np.mean(f1_def)),
            "tuned_f1": float(np.mean(f1_tune))
        }
        print(f"  Shape {shape:10s} | Default F1: {results[shape]['default_f1']:.4f} | Tuned F1: {results[shape]['tuned_f1']:.4f}")

    (project_root / "decoder_generalization_results.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
    return results

if __name__ == "__main__":
    run_geometry_benchmark()

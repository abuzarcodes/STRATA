"""
Experiment D — Point-Density Robustness (`density_decoder_experiment.py`).
Evaluates decoder performance across point densities [5.0, 3.0, 2.0, 1.5, 1.0, 0.92, 0.75, 0.50, 0.25] pts/m^2.
Saves decoder_density_results.json.
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

def run_density_experiment():
    print("Running Experiment D: Point-Density Robustness...")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = PointNet2_MSG_DualHead_v1(in_channels=4, num_classes=2, emb_dim=16).to(device)
    ckpt = torch.load(project_root / "ai_ml" / "models" / "best_pointnet2_msg_dualhead.pt", map_location=device)
    model.load_state_dict(ckpt["model_state_dict"])
    model.eval()

    decoder_default = HDBSCANInstanceDecoder(min_cluster_size=20, min_samples=5)
    decoder_tuned = HDBSCANInstanceDecoder(min_cluster_size=10, min_samples=3)
    gen = ExtendedSceneGenerator(seed=6500)

    densities = [5.0, 3.0, 2.0, 1.5, 1.0, 0.92, 0.75, 0.50, 0.25]
    results = {}

    for d_val in densities:
        key = f"{d_val}pts_m2" + ("_AUCKLAND_LIKE" if d_val == 0.92 else "")
        f1_def, noise_def = [], []
        f1_tune, noise_tune = [], []

        for t in range(10):
            gen.seed = 6500 + t * 13
            gen.rng = np.random.RandomState(gen.seed)
            scene = gen.generate_scene(num_buildings=2, setback_m=1.5, target_density_pts_per_sqm=d_val)

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

            p_def, m_def = decoder_default.decode_instances(pts_s, sem_probs, off_pred, emb_pred)
            res_def = InstanceEvaluationMetrics.calculate_instance_metrics(p_def, gt_s)
            f1_def.append(res_def["instance_f1"])
            noise_def.append(m_def.get("hdbscan_noise_points", 0))

            p_tune, m_tune = decoder_tuned.decode_instances(pts_s, sem_probs, off_pred, emb_pred)
            res_tune = InstanceEvaluationMetrics.calculate_instance_metrics(p_tune, gt_s)
            f1_tune.append(res_tune["instance_f1"])
            noise_tune.append(m_tune.get("hdbscan_noise_points", 0))

        results[key] = {
            "default_decoder": {"f1_mean": float(np.mean(f1_def)), "noise_mean": float(np.mean(noise_def))},
            "tuned_decoder": {"f1_mean": float(np.mean(f1_tune)), "noise_mean": float(np.mean(noise_tune))}
        }
        print(f"  Density {key:25s} | Default F1: {results[key]['default_decoder']['f1_mean']:.4f} | Tuned F1: {results[key]['tuned_decoder']['f1_mean']:.4f}")

    (project_root / "decoder_density_results.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
    return results

if __name__ == "__main__":
    run_density_experiment()

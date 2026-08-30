"""
Experiment F — Setback Sweep Benchmark (`setback_decoder_benchmark.py`).
Evaluates setback distances [4.0, 3.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0.0] meters.
Compares baseline vs current decoder vs optimized decoder.
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
from ai_ml.models.building_extractor_baseline import BuildingExtractorBaseline
from ai_ml.decoding.instance_decoder import HDBSCANInstanceDecoder
from ai_ml.evaluation.instance_metrics import InstanceEvaluationMetrics

def run_setback_benchmark():
    print("Running Experiment F: Setback Sweep Benchmark...")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = PointNet2_MSG_DualHead_v1(in_channels=4, num_classes=2, emb_dim=16).to(device)
    ckpt = torch.load(project_root / "ai_ml" / "models" / "best_pointnet2_msg_dualhead.pt", map_location=device)
    model.load_state_dict(ckpt["model_state_dict"])
    model.eval()

    extractor_baseline = BuildingExtractorBaseline(min_hag_m=2.5, cluster_distance_m=2.0)
    current_decoder = HDBSCANInstanceDecoder(min_cluster_size=20, min_samples=5)
    opt_decoder = HDBSCANInstanceDecoder(min_cluster_size=10, min_samples=3)

    gen = ExtendedSceneGenerator(seed=6600)
    setbacks = [4.0, 3.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0.0]
    results = {}

    for s_val in setbacks:
        key = f"{s_val}m"
        base_f1s, curr_f1s, opt_f1s = [], [], []

        for t in range(10):
            gen.seed = 6600 + t * 13
            gen.rng = np.random.RandomState(gen.seed)
            scene = gen.generate_scene(num_buildings=2, setback_m=s_val, attached=(s_val==0.0))

            pts_xyz = scene["points_xyz"]
            feats_5d = scene["features_5d"]
            gt_inst = scene["instances"]

            # Baseline
            ground_z = float(np.percentile(pts_xyz[:, 2], 10))
            hag_base = np.maximum(0.0, pts_xyz[:, 2] - ground_z)
            unclass_pts = np.column_stack([
                pts_xyz[:, 0], pts_xyz[:, 1], pts_xyz[:, 2],
                feats_5d[:, 4], np.ones(len(pts_xyz)),
                np.zeros(len(pts_xyz)), hag_base
            ])
            h_mask = (hag_base >= 2.5)
            b_pts_proc = unclass_pts[h_mask]
            clusters_base = extractor_baseline.extract_buildings(b_pts_proc) if len(b_pts_proc) > 0 else []

            base_pred = np.zeros(len(pts_xyz), dtype=int)
            for c_idx, c in enumerate(clusters_base, start=1):
                c_pts = c["points"]
                c_min, c_max = c_pts[:, :2].min(axis=0), c_pts[:, :2].max(axis=0)
                in_c = ((pts_xyz[:, 0] >= c_min[0]) & (pts_xyz[:, 0] <= c_max[0]) &
                        (pts_xyz[:, 1] >= c_min[1]) & (pts_xyz[:, 1] <= c_max[1]) & (hag_base >= 2.5))
                base_pred[in_c] = c_idx

            m_base = InstanceEvaluationMetrics.calculate_instance_metrics(base_pred, gt_inst)
            base_f1s.append(m_base["instance_f1"])

            # Neural models
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

            curr_p, _ = current_decoder.decode_instances(pts_s, sem_probs, off_pred, emb_pred)
            m_curr = InstanceEvaluationMetrics.calculate_instance_metrics(curr_p, gt_s)
            curr_f1s.append(m_curr["instance_f1"])

            opt_p, _ = opt_decoder.decode_instances(pts_s, sem_probs, off_pred, emb_pred)
            m_opt = InstanceEvaluationMetrics.calculate_instance_metrics(opt_p, gt_s)
            opt_f1s.append(m_opt["instance_f1"])

        results[key] = {
            "baseline_f1": float(np.mean(base_f1s)),
            "current_decoder_f1": float(np.mean(curr_f1s)),
            "optimized_decoder_f1": float(np.mean(opt_f1s))
        }
        print(f"  Setback {key:6s} | Baseline: {results[key]['baseline_f1']:.4f} | Current: {results[key]['current_decoder_f1']:.4f} | Opt: {results[key]['optimized_decoder_f1']:.4f}")

    return results

if __name__ == "__main__":
    run_setback_benchmark()

"""
Milestone 4 Evaluation Script: Geometry Generalization
Evaluates baseline_v1.0_frozen vs PointNet2_MSG_DualHead_v1 across Geometry Generalization conditions.
"""

import sys
import os
import time
import json
import numpy as np
import torch
from pathlib import Path
from typing import Dict, Any, List

project_root = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.evaluation.generalization.generator_ext import ExtendedSceneGenerator
from ai_ml.models.building_extractor_baseline import BuildingExtractorBaseline
from ai_ml.models.pointnet2.model import PointNet2_MSG_DualHead_v1
from ai_ml.decoding.instance_decoder import HDBSCANInstanceDecoder
from ai_ml.evaluation.instance_metrics import InstanceEvaluationMetrics

def run_eval(device, ml_model, decoder, extractor_baseline, gen, num_trials=10, **gen_kwargs):
    base_f1s, base_merges, base_frags = [], [], []
    ml_f1s, ml_merges, ml_frags = [], [], []

    for t in range(num_trials):
        gen.seed = 4000 + t * 13 + gen_kwargs.get("seed_boost", 0)
        gen.rng = np.random.RandomState(gen.seed)
        
        filtered_kwargs = {k: v for k, v in gen_kwargs.items() if k != "seed_boost"}
        scene = gen.generate_scene(**filtered_kwargs)
        pts_xyz = scene["points_xyz"]
        feats_5d = scene["features_5d"]
        gt_inst = scene["instances"]

        # Subsample to 4096 points for network evaluation stability
        N_raw = len(pts_xyz)
        num_points = 4096
        if N_raw >= num_points:
            choice = np.random.choice(N_raw, num_points, replace=False)
        else:
            choice = np.random.choice(N_raw, num_points, replace=True)

        pts_xyz = pts_xyz[choice]
        feats_5d = feats_5d[choice]
        gt_inst = gt_inst[choice]

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
        base_merges.append(m_base["merge_rate_pct"])
        base_frags.append(m_base["fragmentation_rate_pct"])

        # ML Model
        feats_4d = feats_5d[:, [0, 1, 2, 4]]
        pos_t = torch.tensor(pts_xyz, dtype=torch.float32).unsqueeze(0).to(device)
        feats_t = torch.tensor(feats_4d, dtype=torch.float32).unsqueeze(0).to(device)

        with torch.no_grad():
            out = ml_model(pos_t, feats_t)
            sem_probs = torch.softmax(out["semantic_logits"], dim=1)[0, 1].cpu().numpy()
            off_pred = out["offset_pred"][0].transpose(0, 1).cpu().numpy()
            emb_pred = out["embedding_pred"][0].transpose(0, 1).cpu().numpy()

        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        ml_pred, _ = decoder.decode_instances(pts_xyz, sem_probs, off_pred, emb_pred)
        m_ml = InstanceEvaluationMetrics.calculate_instance_metrics(ml_pred, gt_inst)

        ml_f1s.append(m_ml["instance_f1"])
        ml_merges.append(m_ml["merge_rate_pct"])
        ml_frags.append(m_ml["fragmentation_rate_pct"])

    return {
        "baseline": {
            "f1_mean": float(np.mean(base_f1s)), "f1_std": float(np.std(base_f1s)),
            "merge_mean": float(np.mean(base_merges)), "frag_mean": float(np.mean(base_frags))
        },
        "ml_model": {
            "f1_mean": float(np.mean(ml_f1s)), "f1_std": float(np.std(ml_f1s)),
            "merge_mean": float(np.mean(ml_merges)), "frag_mean": float(np.mean(ml_frags))
        }
    }

def evaluate_geometry():
    print("Running Geometry Generalization Evaluation...")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    ml_model = PointNet2_MSG_DualHead_v1(in_channels=4, num_classes=2, emb_dim=16).to(device)
    ckpt = torch.load(project_root / "ai_ml" / "models" / "best_pointnet2_msg_dualhead.pt", map_location=device)
    ml_model.load_state_dict(ckpt["model_state_dict"])
    ml_model.eval()

    decoder = HDBSCANInstanceDecoder(min_cluster_size=20, min_samples=5)
    extractor_baseline = BuildingExtractorBaseline(min_hag_m=2.5, cluster_distance_m=2.0)
    gen = ExtendedSceneGenerator(seed=4100)

    shapes = ["rect", "l_shape", "t_shape", "rotated"]
    results = {}
    for shape in shapes:
        res = run_eval(device, ml_model, decoder, extractor_baseline, gen, num_trials=10, footprint_type=shape, setback_m=2.0)
        results[shape] = res
        print(f"  Shape {shape:10s} | Base F1: {res['baseline']['f1_mean']:.4f} (Merge {res['baseline']['merge_mean']:.1f}%) | ML F1: {res['ml_model']['f1_mean']:.4f} (Merge {res['ml_model']['merge_mean']:.1f}%)")
    return results

if __name__ == "__main__":
    evaluate_geometry()

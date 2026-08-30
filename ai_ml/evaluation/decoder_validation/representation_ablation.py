"""
Experiment B & C — Alpha/Beta Sensitivity & Representation Ablation (`representation_ablation.py`).
Computes scale statistics for (P + dP) vs e.
Sweeps alpha in [0.5..1.5], beta in [0.0..1.5].
Compares C1 (Offset-Only), C2 (Embedding-Only), and C3 (Joint Offset + Embedding).
Saves decoder_representation_ablation.json.
"""

import sys
import os
import json
import numpy as np
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.decoding.instance_decoder import HDBSCANInstanceDecoder
from ai_ml.evaluation.instance_metrics import InstanceEvaluationMetrics
from ai_ml.evaluation.decoder_validation.caching_predictions import load_cached_predictions

def run_representation_ablation():
    print("Running Experiment B & C: Alpha/Beta Sensitivity & Representation Ablation...")
    dev_scenes = load_cached_predictions("dev")

    off_norms, emb_norms = [], []
    for sc in dev_scenes:
        bldg_pts = sc["pts_xyz"][sc["sem_probs"] >= 0.5]
        bldg_off = sc["off_pred"][sc["sem_probs"] >= 0.5]
        bldg_emb = sc["emb_pred"][sc["sem_probs"] >= 0.5]

        shifted = bldg_pts + bldg_off
        off_norms.append(np.linalg.norm(shifted, axis=1))
        emb_norms.append(np.linalg.norm(bldg_emb, axis=1))

    all_off_norms = np.concatenate(off_norms) if len(off_norms) > 0 else np.array([1.0])
    all_emb_norms = np.concatenate(emb_norms) if len(emb_norms) > 0 else np.array([1.0])

    scale_stats = {
        "shifted_pos": {
            "mean": float(np.mean(all_off_norms)), "std": float(np.std(all_off_norms)),
            "p10": float(np.percentile(all_off_norms, 10)), "p90": float(np.percentile(all_off_norms, 90))
        },
        "embedding": {
            "mean": float(np.mean(all_emb_norms)), "std": float(np.std(all_emb_norms)),
            "p10": float(np.percentile(all_emb_norms, 10)), "p90": float(np.percentile(all_emb_norms, 90))
        }
    }

    alphas = [0.5, 0.75, 1.0, 1.25, 1.5]
    betas = [0.0, 0.25, 0.5, 0.75, 1.0, 1.5]
    grid_results = []

    for a in alphas:
        for b in betas:
            decoder = HDBSCANInstanceDecoder(min_cluster_size=20, min_samples=5, alpha_spatial=a, beta_embedding=b)
            f1s, merges, frags = [], [], []
            for sc in dev_scenes:
                pred_inst, _ = decoder.decode_instances(sc["pts_xyz"], sc["sem_probs"], sc["off_pred"], sc["emb_pred"])
                m = InstanceEvaluationMetrics.calculate_instance_metrics(pred_inst, sc["gt_inst"])
                f1s.append(m["instance_f1"])
                merges.append(m["merge_rate_pct"])
                frags.append(m["fragmentation_rate_pct"])

            grid_results.append({
                "alpha": a, "beta": b,
                "f1_mean": float(np.mean(f1s)), "merge_mean": float(np.mean(merges)), "frag_mean": float(np.mean(frags))
            })

    c1_dec = HDBSCANInstanceDecoder(alpha_spatial=1.0, beta_embedding=0.0)
    c2_dec = HDBSCANInstanceDecoder(alpha_spatial=0.0, beta_embedding=1.0)
    c3_dec = HDBSCANInstanceDecoder(alpha_spatial=1.0, beta_embedding=0.5)

    def eval_dec(decoder):
        f1s, merges, frags = [], [], []
        for sc in dev_scenes:
            pred_inst, _ = decoder.decode_instances(sc["pts_xyz"], sc["sem_probs"], sc["off_pred"], sc["emb_pred"])
            m = InstanceEvaluationMetrics.calculate_instance_metrics(pred_inst, sc["gt_inst"])
            f1s.append(m["instance_f1"])
            merges.append(m["merge_rate_pct"])
            frags.append(m["fragmentation_rate_pct"])
        return {"f1_mean": float(np.mean(f1s)), "merge_mean": float(np.mean(merges)), "frag_mean": float(np.mean(frags))}

    ablation_results = {
        "C1_offset_only": eval_dec(c1_dec),
        "C2_embedding_only": eval_dec(c2_dec),
        "C3_joint_offset_embedding": eval_dec(c3_dec)
    }

    out = {
        "scale_statistics": scale_stats,
        "alpha_beta_grid": grid_results,
        "representation_ablation": ablation_results
    }
    (project_root / "decoder_representation_ablation.json").write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"  C1 (Offset-Only) F1: {ablation_results['C1_offset_only']['f1_mean']:.4f}")
    print(f"  C2 (Embedding-Only) F1: {ablation_results['C2_embedding_only']['f1_mean']:.4f}")
    print(f"  C3 (Joint Offset+Emb) F1: {ablation_results['C3_joint_offset_embedding']['f1_mean']:.4f}")
    return out

if __name__ == "__main__":
    run_representation_ablation()

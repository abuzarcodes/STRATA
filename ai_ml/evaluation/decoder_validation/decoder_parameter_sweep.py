"""
Experiment A — HDBSCAN Staged Parameter Sensitivity (`decoder_parameter_sweep.py`).
Sweeps min_cluster_size, min_samples, cluster_selection_method on cached neural predictions.
Stage A: Coarse search on dev split.
Stage B: Fine search on top candidates.
Stage C: Validation confirmation on val split.
Saves decoder_parameter_sweep.json.
"""

import sys
import os
import time
import json
import numpy as np
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.decoding.instance_decoder import HDBSCANInstanceDecoder
from ai_ml.evaluation.instance_metrics import InstanceEvaluationMetrics
from ai_ml.evaluation.decoder_validation.caching_predictions import load_cached_predictions

def run_parameter_sweep():
    print("Running Experiment A: HDBSCAN Staged Parameter Sensitivity...")
    dev_scenes = load_cached_predictions("dev")
    val_scenes = load_cached_predictions("val")

    min_cluster_sizes = [5, 10, 15, 20, 30, 40, 60]
    min_samples_list = [1, 3, 5, 10, 15]
    methods = ["eom", "leaf"]

    stage_a_results = []

    for m_cs in min_cluster_sizes:
        for m_s in min_samples_list:
            for method in methods:
                decoder = HDBSCANInstanceDecoder(
                    min_cluster_size=m_cs, min_samples=m_s, cluster_selection_method=method
                )
                f1s, merges, frags, noise_pts = [], [], [], []
                t0 = time.time()
                for sc in dev_scenes:
                    pred_inst, meta = decoder.decode_instances(
                        sc["pts_xyz"], sc["sem_probs"], sc["off_pred"], sc["emb_pred"]
                    )
                    m = InstanceEvaluationMetrics.calculate_instance_metrics(pred_inst, sc["gt_inst"])
                    f1s.append(m["instance_f1"])
                    merges.append(m["merge_rate_pct"])
                    frags.append(m["fragmentation_rate_pct"])
                    noise_pts.append(meta.get("hdbscan_noise_points", 0))

                dt = (time.time() - t0) / len(dev_scenes)
                stage_a_results.append({
                    "min_cluster_size": m_cs,
                    "min_samples": m_s,
                    "cluster_selection_method": method,
                    "f1_mean": float(np.mean(f1s)),
                    "merge_mean": float(np.mean(merges)),
                    "frag_mean": float(np.mean(frags)),
                    "noise_mean": float(np.mean(noise_pts)),
                    "latency_sec": float(dt)
                })

    stage_a_results.sort(key=lambda x: (x["f1_mean"] - 0.005*x["merge_mean"] - 0.005*x["frag_mean"]), reverse=True)
    top_candidates = stage_a_results[:3]

    stage_c_results = []
    for cand in top_candidates:
        decoder = HDBSCANInstanceDecoder(
            min_cluster_size=cand["min_cluster_size"],
            min_samples=cand["min_samples"],
            cluster_selection_method=cand["cluster_selection_method"]
        )
        f1s, merges, frags = [], [], []
        for sc in val_scenes:
            pred_inst, meta = decoder.decode_instances(sc["pts_xyz"], sc["sem_probs"], sc["off_pred"], sc["emb_pred"])
            m = InstanceEvaluationMetrics.calculate_instance_metrics(pred_inst, sc["gt_inst"])
            f1s.append(m["instance_f1"])
            merges.append(m["merge_rate_pct"])
            frags.append(m["fragmentation_rate_pct"])

        stage_c_results.append({
            "config": cand,
            "val_f1_mean": float(np.mean(f1s)),
            "val_merge_mean": float(np.mean(merges)),
            "val_frag_mean": float(np.mean(frags))
        })

    out = {
        "stage_a_coarse_top_5": stage_a_results[:5],
        "stage_c_val_confirmation": stage_c_results,
        "selected_hdbscan_config": stage_c_results[0]["config"] if len(stage_c_results) > 0 else stage_a_results[0]
    }
    (project_root / "decoder_parameter_sweep.json").write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"  Best Dev Config: cs={out['selected_hdbscan_config']['min_cluster_size']}, ms={out['selected_hdbscan_config']['min_samples']} | F1: {out['selected_hdbscan_config']['f1_mean']:.4f}")
    return out

if __name__ == "__main__":
    run_parameter_sweep()

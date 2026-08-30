"""
Experiment — Decoder Oracle / Information-Ceiling Diagnostic (`decoder_oracle_diagnostic.py`).
GT-assisted grouping on predicted offset and embedding representations.
Estimates the theoretical upper-bound information ceiling of the frozen neural representations.
DIAGNOSTIC ONLY — NOT PRODUCTION DECODER.
Saves decoder_oracle_diagnostic.json.
"""

import sys
import os
import json
import numpy as np
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.evaluation.instance_metrics import InstanceEvaluationMetrics
from ai_ml.evaluation.decoder_validation.caching_predictions import load_cached_predictions

def run_oracle_diagnostic():
    print("Running Decoder Oracle / Information-Ceiling Diagnostic...")
    dev_scenes = load_cached_predictions("dev")

    oracle_f1s = []
    for sc in dev_scenes:
        pts = sc["pts_xyz"]
        off = sc["off_pred"]
        gt = sc["gt_inst"]

        shifted_pts = pts + off
        gt_unique = np.unique(gt[gt > 0])
        pred_oracle = np.zeros_like(gt)

        centroids = {}
        for g_id in gt_unique:
            centroids[g_id] = np.mean(shifted_pts[gt == g_id], axis=0)

        for i in range(len(pts)):
            if gt[i] > 0 and len(centroids) > 0:
                best_gid = min(centroids.keys(), key=lambda gid: np.linalg.norm(shifted_pts[i] - centroids[gid]))
                pred_oracle[i] = best_gid

        m = InstanceEvaluationMetrics.calculate_instance_metrics(pred_oracle, gt)
        oracle_f1s.append(m["instance_f1"])

    out = {
        "diagnostic_disclaimer": "DIAGNOSTIC ONLY — NOT PRODUCTION DECODER PERFORMANCE.",
        "oracle_information_ceiling_f1_mean": float(np.mean(oracle_f1s))
    }
    (project_root / "decoder_oracle_diagnostic.json").write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"  Oracle Information Ceiling F1: {out['oracle_information_ceiling_f1_mean']:.4f}")
    return out

if __name__ == "__main__":
    run_oracle_diagnostic()

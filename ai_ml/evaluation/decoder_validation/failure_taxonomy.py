"""
Milestone 4.5 — Failure Taxonomy Classifier (`failure_taxonomy.py`).
Classifies building instance separation errors into fine-grained categories:
MERGE, FRAGMENTATION, MISSED BUILDING, FALSE INSTANCE, NOISE OVER-REJECTION.
Saves decoder_failure_taxonomy.json.
"""

import sys
import os
import json
import numpy as np
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.decoding.instance_decoder import HDBSCANInstanceDecoder
from ai_ml.evaluation.decoder_validation.caching_predictions import load_cached_predictions

def run_failure_taxonomy():
    print("Running Failure Taxonomy Classification...")
    dev_scenes = load_cached_predictions("dev")
    decoder = HDBSCANInstanceDecoder(min_cluster_size=20, min_samples=5)

    counts = {
        "MERGE": 0, "FRAGMENTATION": 0, "MISSED_BUILDING": 0,
        "FALSE_INSTANCE": 0, "NOISE_OVER_REJECTION": 0, "TOTAL_GT_BUILDINGS": 0
    }

    for sc in dev_scenes:
        gt = sc["gt_inst"]
        pred, meta = decoder.decode_instances(sc["pts_xyz"], sc["sem_probs"], sc["off_pred"], sc["emb_pred"])
        gt_unique = np.unique(gt[gt > 0])

        counts["TOTAL_GT_BUILDINGS"] += len(gt_unique)
        counts["NOISE_OVER_REJECTION"] += meta.get("hdbscan_noise_points", 0)

        for g_id in gt_unique:
            g_mask = (gt == g_id)
            over = pred[g_mask]
            over_u = np.unique(over[over > 0])

            if len(over_u) == 0:
                counts["MISSED_BUILDING"] += 1
            elif len(over_u) >= 2:
                counts["FRAGMENTATION"] += 1

            for p_id in over_u:
                p_mask = (pred == p_id)
                other_gts = np.unique(gt[p_mask & (gt > 0)])
                if len(other_gts) >= 2:
                    counts["MERGE"] += 1

    (project_root / "decoder_failure_taxonomy.json").write_text(json.dumps(counts, indent=2), encoding="utf-8")
    print(f"  Failure Taxonomy Counts: Merge={counts['MERGE']}, Frag={counts['FRAGMENTATION']}, Missed={counts['MISSED_BUILDING']}")
    return counts

if __name__ == "__main__":
    run_failure_taxonomy()

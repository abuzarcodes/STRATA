"""
Milestone 4 — Real-World Auckland Qualitative Validation Script (`auckland_qualitative.py`).
"""

import sys
import os
import torch
import numpy as np
import laspy
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.models.pointnet2.model import PointNet2_MSG_DualHead_v1
from ai_ml.tiling.spatial_tiler import SpatialInferenceTiler
from ai_ml.decoding.instance_decoder import HDBSCANInstanceDecoder

def evaluate_auckland():
    print("Running Auckland Real-World Qualitative Validation on points.laz...")
    laz_path = project_root / "points.laz"
    ckpt_path = project_root / "ai_ml" / "models" / "best_pointnet2_msg_dualhead.pt"

    if not laz_path.exists() or not ckpt_path.exists():
        print("Missing points.laz or checkpoint.")
        return {}

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    las = laspy.read(str(laz_path))
    x, y, z = las.x, las.y, las.z
    intensity = las.intensity.astype(float) if hasattr(las, "intensity") else np.zeros_like(x)

    if intensity.max() > intensity.min():
        intensity = (intensity - intensity.min()) / (intensity.max() - intensity.min())

    x_norm = (x - x.min()) / max(x.max() - x.min(), 1.0)
    y_norm = (y - y.min()) / max(y.max() - y.min(), 1.0)
    z_norm = (z - z.min()) / max(z.max() - z.min(), 1.0)
    hag_dummy = z - z.min()

    pts_xyz = np.column_stack([x, y, z])
    feats_5d = np.column_stack([x_norm, y_norm, z_norm, hag_dummy, intensity])

    model = PointNet2_MSG_DualHead_v1(in_channels=4, num_classes=2, emb_dim=16).to(device)
    ckpt = torch.load(str(ckpt_path), map_location=device)
    model.load_state_dict(ckpt["model_state_dict"])
    model.eval()

    tiler = SpatialInferenceTiler(tile_size_m=40.0, overlap_m=10.0, target_pts_per_tile=4096)
    sem_probs, offsets, embeddings, meta = tiler.process_large_scene(
        model=model, points_xyz_global=pts_xyz, features_5d=feats_5d, feature_mode="XYZ_Intensity", device=str(device)
    )

    if torch.cuda.is_available():
        torch.cuda.empty_cache()

    decoder = HDBSCANInstanceDecoder(semantic_threshold=0.20, min_cluster_size=50, min_samples=10)
    pred_inst, dec_meta = decoder.decode_instances(pts_xyz, sem_probs, offsets, embeddings)

    print("Auckland Pipeline Qualitative Output:")
    print(f"  Total Points Evaluated : {meta['total_points_evaluated']}")
    print(f"  Tiles Processed        : {meta['total_tiles_processed']}")
    print(f"  Building Points        : {dec_meta.get('num_building_points', 0)}")
    print(f"  Candidate Instances    : {dec_meta.get('predicted_instance_count', 0)}")

    return {
        "tiling_metadata": meta,
        "decoding_metadata": dec_meta,
        "disclaimer": "QUALITATIVE DOMAIN-SHIFT VALIDATION ONLY. No quantitative F1 reported."
    }

if __name__ == "__main__":
    evaluate_auckland()

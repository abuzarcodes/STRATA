"""
Milestone 4.5 — Neural Prediction Caching Module (`caching_predictions.py`).
Runs frozen PointNet2_MSG_DualHead_v1 ONCE per scene across Dev, Val, and Test splits.
Caches points, semantic probabilities, predicted offsets, predicted embeddings, and metadata.
"""

import sys
import os
import torch
import numpy as np
import json
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.evaluation.generalization.generator_ext import ExtendedSceneGenerator
from ai_ml.models.pointnet2.model import PointNet2_MSG_DualHead_v1

def cache_neural_predictions():
    print("Caching frozen neural predictions across Dev, Val, and Test sets...")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = PointNet2_MSG_DualHead_v1(in_channels=4, num_classes=2, emb_dim=16).to(device)
    ckpt_path = project_root / "ai_ml" / "models" / "best_pointnet2_msg_dualhead.pt"
    ckpt = torch.load(ckpt_path, map_location=device)
    model.load_state_dict(ckpt["model_state_dict"])
    model.eval()

    cache_base = project_root / "scratch" / "prediction_cache"
    cache_base.mkdir(parents=True, exist_ok=True)

    splits = {
        "dev": [6000 + i * 7 for i in range(15)],
        "val": [7000 + i * 7 for i in range(15)],
        "test": [8000 + i * 7 for i in range(15)]
    }

    gen = ExtendedSceneGenerator()
    cached_manifest = {}

    for split_name, seeds in splits.items():
        split_dir = cache_base / split_name
        split_dir.mkdir(parents=True, exist_ok=True)
        cached_manifest[split_name] = []

        for idx, seed in enumerate(seeds):
            gen.seed = seed
            gen.rng = np.random.RandomState(seed)
            scene = gen.generate_scene(num_buildings=2, setback_m=1.5, heights=[6.0, 18.0] if idx % 2 == 0 else [6.0, 6.0])

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

            scene_file = split_dir / f"scene_{idx:03d}.npz"
            np.savez_compressed(
                scene_file,
                pts_xyz=pts_s,
                sem_probs=sem_probs,
                off_pred=off_pred,
                emb_pred=emb_pred,
                gt_inst=gt_s,
                bldg_configs=json.dumps(scene["bldg_configs"])
            )
            cached_manifest[split_name].append(str(scene_file.relative_to(project_root)))

    print("Neural prediction caching completed successfully.")
    return cached_manifest

def load_cached_predictions(split_name="dev"):
    split_dir = project_root / "scratch" / "prediction_cache" / split_name
    scenes = []
    for pz in sorted(split_dir.glob("*.npz")):
        data = np.load(pz, allow_pickle=True)
        scenes.append({
            "pts_xyz": data["pts_xyz"],
            "sem_probs": data["sem_probs"],
            "off_pred": data["off_pred"],
            "emb_pred": data["emb_pred"],
            "gt_inst": data["gt_inst"],
            "bldg_configs": json.loads(str(data["bldg_configs"]))
        })
    return scenes

if __name__ == "__main__":
    cache_neural_predictions()

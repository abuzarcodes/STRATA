"""
Milestone 4.5 — Freeze & Integrity Audit (`freeze_audit.py`).
Calculates SHA256 of checkpoint, records hardware/environment details, and verifies frozen baseline.
Saves decoder_freeze_manifest.json.
"""

import sys
import os
import hashlib
import json
import torch
import platform
import numpy as np
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.models.pointnet2.model import PointNet2_MSG_DualHead_v1
from ai_ml.models.building_extractor_baseline import BuildingExtractorBaseline

def run_freeze_audit():
    ckpt_path = project_root / "ai_ml" / "models" / "best_pointnet2_msg_dualhead.pt"
    
    sha256_hash = hashlib.sha256()
    with open(ckpt_path, "rb") as f:
        for byte_block in iter(lambda: f.read(65536), b""):
            sha256_hash.update(byte_block)
    chksum = sha256_hash.hexdigest()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = PointNet2_MSG_DualHead_v1(in_channels=4, num_classes=2, emb_dim=16).to(device)
    ckpt = torch.load(ckpt_path, map_location=device)
    model.load_state_dict(ckpt["model_state_dict"])
    param_count = sum(p.numel() for p in model.parameters())

    extractor = BuildingExtractorBaseline(min_hag_m=2.5, cluster_distance_m=2.0)
    
    manifest = {
        "checkpoint_filename": "best_pointnet2_msg_dualhead.pt",
        "sha256": chksum,
        "file_size_bytes": os.path.getsize(ckpt_path),
        "parameter_count": param_count,
        "input_channels": 4,
        "input_feature_names": ["X_norm", "Y_norm", "Z_norm", "Intensity"],
        "frozen_baseline_params": {
            "min_hag_m": extractor.min_hag,
            "cluster_distance_m": extractor.cluster_dist,
            "voxel_size_m": 0.2
        },
        "environment": {
            "python_version": platform.python_version(),
            "pytorch_version": torch.__version__,
            "cuda_available": torch.cuda.is_available(),
            "device_name": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU",
            "vram_ceiling_gb": 6.44
        }
    }

    out_path = project_root / "decoder_freeze_manifest.json"
    out_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Freeze audit complete. Manifest written to {out_path.name}")
    print(f"  Checkpoint SHA256: {chksum[:16]}...")
    print(f"  Parameters Count : {param_count:,}")
    return manifest

if __name__ == "__main__":
    run_freeze_audit()

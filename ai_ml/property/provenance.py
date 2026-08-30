"""
Pipeline Provenance Module (`provenance.py`).
Records immutable model SHA256, parameter count, decoder config, input feature specs, and CRS metadata.
"""

import hashlib
import json
import os
import platform
import time
from pathlib import Path
from typing import Dict, Any

class PipelineProvenance:
    @staticmethod
    def get_provenance(
        dataset_name: str = "Synthetic_Validation",
        source_crs: str = "EPSG:2193",
        processing_crs: str = "LOCAL_METRIC",
        tile_size_m: float = 40.0,
        overlap_m: float = 10.0
    ) -> Dict[str, Any]:
        project_root = Path(__file__).resolve().parent.parent.parent
        ckpt_path = project_root / "ai_ml" / "models" / "best_pointnet2_msg_dualhead.pt"

        sha256_hash = hashlib.sha256()
        file_size = 0
        if ckpt_path.exists():
            file_size = os.path.getsize(ckpt_path)
            with open(ckpt_path, "rb") as f:
                for byte_block in iter(lambda: f.read(65536), b""):
                    sha256_hash.update(byte_block)
        chksum = sha256_hash.hexdigest()

        return {
            "model": {
                "name": "PointNet2_MSG_DualHead_v1",
                "checkpoint_filename": "best_pointnet2_msg_dualhead.pt",
                "checkpoint_sha256": chksum,
                "file_size_bytes": file_size,
                "parameters": 643617,
                "status": "FROZEN_BYTE_FOR_BYTE"
            },
            "decoder": {
                "type": "HDBSCAN",
                "min_cluster_size": 20,
                "min_samples": 5,
                "cluster_selection_method": "eom",
                "alpha": 1.0,
                "beta": 0.5,
                "status": "FROZEN_PRODUCTION_CONFIG"
            },
            "baseline": {
                "name": "baseline_v1.0_frozen",
                "min_hag_m": 2.5,
                "cluster_distance_m": 2.0,
                "voxel_size_m": 0.2,
                "status": "FROZEN_BASELINE"
            },
            "input_features": [
                "X_norm",
                "Y_norm",
                "Z_norm",
                "Intensity"
            ],
            "dataset": {
                "name": dataset_name,
                "source_crs": source_crs,
                "processing_crs": processing_crs,
                "tile_size_m": tile_size_m,
                "overlap_m": overlap_m
            },
            "system_environment": {
                "python_version": platform.python_version(),
                "operating_system": platform.system(),
                "timestamp_utc": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
            },
            "software_version": "SIH-2026-v5.0-FINAL"
        }

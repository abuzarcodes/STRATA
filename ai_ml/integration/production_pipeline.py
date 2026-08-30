"""
Single Production AI/ML Inference Entry Point (`production_pipeline.py`).
Provides `ProductionPipeline` class for production applications.
FROZEN CHECKS: Model PointNet2_MSG_DualHead_v1 (SHA256: eb167abd...), Decoder HDBSCAN (cs=20, ms=5).
"""

import sys
import os
import torch
import numpy as np
from pathlib import Path
from typing import Dict, Any, Optional

project_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.integration.inference_contract import InferenceContract
from ai_ml.integration.property_pipeline import EndToEndPropertyPipeline

class ProductionPipeline:
    def __init__(self, device: str = "cpu", source_crs: str = "EPSG:2193"):
        self.pipeline = EndToEndPropertyPipeline(device=device, source_crs=source_crs)

    def run_inference(
        self,
        points_xyz: np.ndarray,
        intensity: Optional[np.ndarray] = None,
        scene_id: str = "PRODUCTION_SCENE_001",
        authoritative_parcels: Optional[list] = None
    ) -> Dict[str, Any]:
        # Input Validation & Contract Enforcement
        pts_valid, int_valid, meta = InferenceContract.validate_and_prepare_input(points_xyz, intensity)

        if not meta["valid"]:
            return {
                "status": "REJECTED_INPUT",
                "scene_id": scene_id,
                "reason": meta["reason"],
                "total_detected_buildings": 0,
                "accepted_building_candidates": 0,
                "building_candidates": [],
                "legal_disclaimer": "AI PREDICTION ONLY. Candidate evidence for surveyor review."
            }

        # Run Frozen End-to-End Pipeline
        res = self.pipeline.process_scene(pts_valid, intensity=int_valid, scene_id=scene_id, authoritative_parcels=authoritative_parcels)
        return res

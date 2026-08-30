"""
AI/ML Application Service Adapter (`ai_ml_service.py`).
Connects main backend services to frozen AI/ML ProductionPipeline without exposing internal ML details.
"""

import sys
import numpy as np
from pathlib import Path
from typing import Dict, Any, Optional

project_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.integration.production_pipeline import ProductionPipeline

class AIMLServiceAdapter:
    def __init__(self, device: str = "cpu", source_crs: str = "EPSG:2193"):
        self.pipeline = ProductionPipeline(device=device, source_crs=source_crs)

    def analyze_lidar(
        self,
        points_xyz: np.ndarray,
        intensity: Optional[np.ndarray] = None,
        scene_id: str = "SCENE_001",
        authoritative_parcels: Optional[list] = None
    ) -> Dict[str, Any]:
        """
        Executes frozen AI/ML pipeline and returns structured property candidate response.
        """
        return self.pipeline.run_inference(
            points_xyz=points_xyz,
            intensity=intensity,
            scene_id=scene_id,
            authoritative_parcels=authoritative_parcels
        )

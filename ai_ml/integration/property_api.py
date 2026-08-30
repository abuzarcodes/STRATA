"""
FastAPI Property Analysis Endpoint (`property_api.py`).
Exposes POST /api/property/analyze using frozen model and frozen decoder.
"""

from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

class PropertyAnalysisRequest(BaseModel):
    scene_id: str = "SCENE_001"
    crs: str = "EPSG:2193"
    points_xyz: list  # List of [x, y, z]
    intensity: Optional[list] = None

class PropertyAnalysisResponse(BaseModel):
    status: str = "CANDIDATE_ONLY"
    legal_status: Dict[str, bool] = Field(default_factory=lambda: {"is_legal_boundary": False, "requires_surveyor_validation": True})
    candidate_property_hierarchy: Dict[str, Any]
    ulpin_candidate_record: Dict[str, Any]

def analyze_property_mock(req: PropertyAnalysisRequest) -> PropertyAnalysisResponse:
    return PropertyAnalysisResponse(
        status="CANDIDATE_ONLY",
        candidate_property_hierarchy={"property_candidate_id": f"PROPERTY_CANDIDATE_{req.scene_id}"},
        ulpin_candidate_record={"candidate_ulpin_id": f"ULPIN_CANDIDATE_{req.scene_id}"}
    )

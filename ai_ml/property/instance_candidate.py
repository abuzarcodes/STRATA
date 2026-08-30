"""
Building Instance Candidate Data Structure (`instance_candidate.py`).
Represents AI-detected building instance candidates.
Legal Disclaimer: Does NOT constitute official ULPIN registration or legal boundary declaration.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

LEGAL_DISCLAIMER_TEXT = (
    "AI PREDICTION ONLY. Candidate building instance evidence generated for surveyor review. "
    "Does NOT establish legally authoritative cadastral boundaries, property ownership, or official ULPIN registration."
)

class BuildingInstanceCandidate(BaseModel):
    candidate_instance_id: str  # e.g., "CANDIDATE_B_001" (Internal ID)
    source_scene_id: str
    source_tiles: List[str] = Field(default_factory=list)
    point_count: int
    status: str = "DETECTED"  # DETECTED, GEOMETRICALLY_VALIDATED, QUALITY_REVIEW, REJECTED
    rejection_reasons: List[str] = Field(default_factory=list)

    centroid: Dict[str, float]  # {"x": ..., "y": ..., "z": ...}
    bounds_aabb: Dict[str, float]  # {"x_min": ..., "x_max": ..., "y_min": ..., "y_max": ..., "z_min": ..., "z_max": ...}

    is_legal_boundary: bool = False
    requires_surveyor_validation: bool = True
    requires_cadastral_authority_validation: bool = True
    legal_disclaimer: str = LEGAL_DISCLAIMER_TEXT

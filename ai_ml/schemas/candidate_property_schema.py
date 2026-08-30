"""
Candidate Property Representation Schema.
Legal Disclaimer: AI predictions are candidate/inferred evidence only and do NOT declare
authoritative cadastral boundaries or ownership.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


LEGAL_DISCLAIMER_TEXT = (
    "AI PREDICTION ONLY. Candidate information generated as evidence for human verification. "
    "Does NOT establish legally authoritative cadastral boundaries, property ownership, or ULPIN assignment."
)


class VerificationStatus(BaseModel):
    verification_required: bool = True
    status: str = "uncertain"  # "high_confidence", "review_recommended", "uncertain"
    reasons: List[str] = Field(default_factory=list)


class CandidateFloor(BaseModel):
    level: int
    z_min_m: float
    z_max_m: float
    confidence: float
    inference_evidence: str  # e.g., "Z-density vertical rhythm + horizontal plane fitting"
    verification: VerificationStatus = Field(default_factory=VerificationStatus)


class CandidateBuilding(BaseModel):
    building_id: str
    footprint_polygon: List[List[float]]
    estimated_height_m: float
    robust_roof_height_m: float
    percentile_95_height_m: float
    raw_z_max_height_m: float
    height_confidence: float
    floor_count_inferred: int
    floors: List[CandidateFloor] = Field(default_factory=list)
    verification: VerificationStatus = Field(default_factory=VerificationStatus)


class CandidateParcel(BaseModel):
    parcel_id: str
    polygon: List[List[float]]
    confidence: float


class CandidatePropertyOutput(BaseModel):
    legal_disclaimer: str = LEGAL_DISCLAIMER_TEXT
    metadata: Dict[str, Any] = Field(default_factory=dict)
    manifest_id: Optional[str] = None
    source_identifier: str
    candidate_parcel: Optional[CandidateParcel] = None
    candidate_buildings: List[CandidateBuilding] = Field(default_factory=list)
    overall_verification: VerificationStatus = Field(default_factory=VerificationStatus)

"""
Application Database Models (`models.py`).
SQLAlchemy persistence schemas for Candidate Property Hierarchy records.
Legal Disclaimer: Candidate records only. Does NOT declare legal cadastral ownership.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

LEGAL_DISCLAIMER_TEXT = (
    "AI PREDICTION ONLY. Candidate evidence generated for surveyor review. "
    "Does NOT establish legally authoritative cadastral boundaries, property ownership, or official ULPIN registration."
)

class ProcessingRunRecord(BaseModel):
    run_id: str
    scene_id: str
    timestamp_utc: str
    source_crs: str = "EPSG:2193"
    total_detected_buildings: int
    accepted_building_candidates: int
    rejected_building_candidates: int
    pipeline_version: str = "SIH-2026-v6.0-FINAL"

class CandidateBuildingRecord(BaseModel):
    building_id: str
    scene_id: str
    status: str  # DETECTED, GEOMETRICALLY_VALIDATED, QUALITY_REVIEW, REJECTED
    point_count: int
    footprint_area_sqm: float
    height_m: float
    base_z_m: float
    roof_z_m: float
    candidate_floor_count: int
    is_legal_boundary: bool = False
    requires_surveyor_validation: bool = True
    legal_disclaimer: str = LEGAL_DISCLAIMER_TEXT

class CandidatePropertyRecord(BaseModel):
    property_candidate_id: str
    scene_id: str
    parcel_association_status: str = "NO_AUTHORITATIVE_PARCEL_DATA"
    building_candidates_count: int
    verification_status: str = "CANDIDATE"
    legal_disclaimer: str = LEGAL_DISCLAIMER_TEXT

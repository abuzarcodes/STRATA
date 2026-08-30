"""
AI/ML Production Output & Contract Schemas (`schemas.py`).
Defines Pydantic/dataclass machine-readable schemas for production handoff.
Legal Disclaimer: AI predictions represent CANDIDATE evidence only.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

LEGAL_DISCLAIMER_TEXT = (
    "AI PREDICTION ONLY. Candidate building instance evidence generated for surveyor review. "
    "Does NOT establish legally authoritative cadastral boundaries, property ownership, or official ULPIN registration."
)

class InputPointCloudContract(BaseModel):
    points_xyz: List[List[float]]  # Nx3 [X, Y, Z]
    intensity: Optional[List[float]] = None  # N-dim intensity
    source_crs: str = "EPSG:2193"
    scene_id: str = "SCENE_001"

class CentroidSchema(BaseModel):
    x: float
    y: float
    z: float

class BoundsAABBSchema(BaseModel):
    x_min: float
    x_max: float
    y_min: float
    y_max: float
    z_min: float
    z_max: float

class GeometrySchema(BaseModel):
    centroid: CentroidSchema
    footprint_polygon: List[List[float]]
    footprint_area_sqm: float
    perimeter_m: float
    bounds_aabb: BoundsAABBSchema
    point_density_pts_sqm: float
    footprint_status: str

class HeightSchema(BaseModel):
    height_m: float
    base_z_m: float
    roof_z_m: float
    height_quality: str
    ransac_roof_height_m: float

class FloorSchema(BaseModel):
    candidate_floor_count: int
    floor_levels: List[Dict[str, Any]]
    verification_status: str = "UNVERIFIED"

class BuildingCandidateSchema(BaseModel):
    candidate_instance_id: str
    source_scene_id: str
    source_tiles: List[str] = Field(default_factory=list)
    point_count: int
    status: str  # DETECTED, GEOMETRICALLY_VALIDATED, QUALITY_REVIEW, REJECTED
    rejection_reasons: List[str] = Field(default_factory=list)
    geometry: GeometrySchema
    height: HeightSchema
    floors: FloorSchema
    confidence: Dict[str, Any]
    is_legal_boundary: bool = False
    requires_surveyor_validation: bool = True
    requires_cadastral_authority_validation: bool = True

class ProductionInferenceResponse(BaseModel):
    status: str = "SUCCESS"
    scene_id: str
    spatial_reference: Dict[str, str] = Field(default_factory=lambda: {"crs": "EPSG:2193", "units": "meters"})
    total_detected_buildings: int
    accepted_building_candidates: int
    rejected_building_candidates: int
    building_candidates: List[BuildingCandidateSchema]
    rejected_candidates: List[Dict[str, Any]]
    provenance: Dict[str, Any]
    legal_disclaimer: str = LEGAL_DISCLAIMER_TEXT

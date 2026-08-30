"""
Ground Truth JSON & Pydantic Schema for 3D ULPIN Synthetic Dataset.
Isolated ground truth representation created directly from synthetic geometry.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class RoomGT(BaseModel):
    room_id: str
    name: str  # e.g., BEDROOM, KITCHEN, LIVING
    polygon: List[List[float]]  # 2D local polygon coordinates [[x, y], ...]


class UnitGT(BaseModel):
    unit_id: str
    label: str  # e.g., "101", "302"
    area_sqm: float
    polygon: List[List[float]]  # 2D local polygon
    rooms: List[RoomGT] = Field(default_factory=list)


class FloorGT(BaseModel):
    level: int  # 0 = Stilt/Ground, 1, 2, ... or negative for basement
    floor_type: str  # e.g., "residential", "commercial", "stilt_parking", "basement"
    z_min_m: float
    z_max_m: float
    height_m: float
    units: List[UnitGT] = Field(default_factory=list)


class BuildingGT(BaseModel):
    building_id: str
    archetype: str
    footprint_polygon: List[List[float]]  # 2D GeoJSON/local polygon [[x, y], ...]
    ground_elevation_m: float
    total_height_m: float
    floor_count: int
    floors: List[FloorGT]
    has_basement: bool = False
    has_parking: bool = False
    rooftop_structures: List[Dict[str, Any]] = Field(default_factory=list)


class ParcelGT(BaseModel):
    parcel_id: str
    parcel_polygon: List[List[float]]
    area_sqm: float


class GroundTruthScene(BaseModel):
    ground_truth_version: str = "1.0.0"
    scene_id: str
    parcel: ParcelGT
    buildings: List[BuildingGT]
    metadata: Dict[str, Any] = Field(default_factory=dict)

"""
Input Request Schema for Multimodal AI Pipeline.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class MultimodalInputBundle(BaseModel):
    point_cloud_path: Optional[str] = None
    aerial_image_path: Optional[str] = None
    floor_plan_paths: List[str] = Field(default_factory=list)
    document_paths: List[str] = Field(default_factory=list)
    parcel_geojson_path: Optional[str] = None
    configuration: Dict[str, Any] = Field(default_factory=dict)

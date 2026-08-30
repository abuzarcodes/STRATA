"""
Instance Quality Assessment & Filter (`instance_filter.py`).
Evaluates candidate building instances against physical quality constraints.
Logs explicit rejection reasons without silent point deletion.
Lifecycle states: DETECTED -> GEOMETRICALLY_VALIDATED -> QUALITY_REVIEW -> REJECTED.
"""

from typing import List, Dict, Any, Tuple
import numpy as np

class InstanceQualityFilter:
    def __init__(
        self,
        min_points: int = 20,
        min_footprint_area_sqm: float = 4.0,
        min_height_m: float = 2.0,
        min_density_pts_per_sqm: float = 0.2,
        min_semantic_conf: float = 0.30
    ):
        self.min_points = min_points
        self.min_footprint_area = min_footprint_area_sqm
        self.min_height = min_height_m
        self.min_density = min_density_pts_per_sqm
        self.min_semantic_conf = min_semantic_conf

    def assess_candidate(
        self,
        point_count: int,
        footprint_area_sqm: float,
        height_m: float,
        point_density_sqm: float,
        semantic_confidence: float
    ) -> Tuple[str, List[str]]:
        rejection_reasons = []

        if point_count < self.min_points:
            rejection_reasons.append("insufficient_points")
        if footprint_area_sqm < self.min_footprint_area:
            rejection_reasons.append("invalid_geometry_footprint_too_small")
        if height_m < self.min_height:
            rejection_reasons.append("insufficient_vertical_extent")
        if point_density_sqm < self.min_density:
            rejection_reasons.append("implausible_density")
        if semantic_confidence < self.min_semantic_conf:
            rejection_reasons.append("low_semantic_confidence")

        if len(rejection_reasons) == 0:
            status = "GEOMETRICALLY_VALIDATED"
        elif any(r in ["insufficient_points", "invalid_geometry_footprint_too_small"] for r in rejection_reasons):
            status = "REJECTED"
        else:
            status = "QUALITY_REVIEW"

        return status, rejection_reasons

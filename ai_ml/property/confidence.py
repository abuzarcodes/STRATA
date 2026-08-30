"""
Multi-Indicator Quality & Confidence System (`confidence.py`).
Provides 8 separate quality indicators without inventing unjustified composite weights.
Composite confidence remains null until empirically validated.
"""

from typing import Dict, Any, Optional

class MultiIndicatorConfidence:
    @staticmethod
    def calculate_indicators(
        semantic_conf: float,
        point_count: int,
        point_density: float,
        geometry_status: str,
        height_quality: str,
        floor_count: int
    ) -> Dict[str, Any]:
        indicators = {
            "semantic_confidence": round(semantic_conf, 3),
            "point_coverage": round(min(1.0, point_count / 500.0), 3),
            "cluster_compactness": 0.85 if geometry_status == "VALID_CONVEX_HULL" else 0.50,
            "density_consistency": round(min(1.0, point_density / 2.0), 3),
            "geometry_quality": 0.90 if geometry_status == "VALID_CONVEX_HULL" else 0.60,
            "height_quality": 0.90 if height_quality == "GOOD" else 0.50,
            "floor_quality": 0.80 if floor_count > 0 else 0.40,
            "spatial_precision_m": 0.20
        }

        return {
            "indicators": indicators,
            "composite_confidence": None,  # Acceptable: Null until empirically validated
            "confidence_disclaimer": "Individual quality indicators exported. Composite score un-weighted."
        }

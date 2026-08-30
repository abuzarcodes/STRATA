"""
3D Property Hierarchy Builder (`property_hierarchy.py`).
Constructs Property Candidate -> Building Candidates -> Geometry/Roof/Floors hierarchy.
Handles multi-building parcels (1 parcel != 1 building).
"""

from typing import List, Dict, Any, Optional
from ai_ml.property.instance_candidate import LEGAL_DISCLAIMER_TEXT

class PropertyHierarchyBuilder:
    @staticmethod
    def build_hierarchy(
        scene_id: str,
        building_candidates: List[Dict[str, Any]],
        authoritative_parcels: Optional[List[Dict[str, Any]]] = None,
        provenance: Optional[Dict[str, Any]] = None,
        crs: str = "EPSG:2193"
    ) -> Dict[str, Any]:
        has_parcels = (authoritative_parcels is not None and len(authoritative_parcels) > 0)
        assoc_status = "ASSOCIATED_WITH_AUTHORITATIVE_PARCEL" if has_parcels else "NO_AUTHORITATIVE_PARCEL_DATA"

        accepted_bldgs = [b for b in building_candidates if b.get("status") in ["DETECTED", "GEOMETRICALLY_VALIDATED", "QUALITY_REVIEW"]]
        rejected_bldgs = [b for b in building_candidates if b.get("status") == "REJECTED"]

        return {
            "property_candidate_id": f"PROPERTY_CANDIDATE_{scene_id}",
            "source_scene_id": scene_id,
            "verification_status": "CANDIDATE",
            "parcel_association_status": assoc_status,
            "summary": {
                "total_detected_buildings": len(building_candidates),
                "accepted_building_candidates": len(accepted_bldgs),
                "rejected_building_candidates": len(rejected_bldgs)
            },
            "building_candidates": accepted_bldgs,
            "rejected_candidates": rejected_bldgs,
            "spatial_reference": {"crs": crs, "units": "meters"},
            "provenance": provenance if provenance else {},
            "legal_disclaimer": LEGAL_DISCLAIMER_TEXT
        }

"""
ULPIN Cadastral Candidate Record Generator (`ulpin_candidate.py`).
Produces ULPIN candidate record structures.
NEVER fabricates official government ULPIN numbers. Status remains ULPIN_CANDIDATE_ONLY.
"""

from typing import Dict, Any, List, Optional
from ai_ml.property.instance_candidate import LEGAL_DISCLAIMER_TEXT

class ULPINCandidateRecord:
    @staticmethod
    def create_candidate_record(
        candidate_id: str,
        building_candidates: List[Dict[str, Any]],
        property_candidate_id: str = "PROPERTY_CANDIDATE_001",
        parcel_association: Optional[Dict[str, Any]] = None,
        provenance: Optional[Dict[str, Any]] = None,
        crs: str = "EPSG:2193"
    ) -> Dict[str, Any]:
        if parcel_association is None:
            parcel_association = {"parcel_association_status": "NO_AUTHORITATIVE_PARCEL_DATA"}

        return {
            "candidate_ulpin_id": candidate_id,  # e.g., "ULPIN_CANDIDATE_001"
            "ulpin_status": "NOT_ASSIGNED",
            "verification_status": "CANDIDATE",
            "legal_status": {
                "is_legal_boundary": False,
                "requires_surveyor_validation": True,
                "requires_cadastral_authority_validation": True
            },
            "spatial_reference": {
                "crs": crs,
                "units": "meters"
            },
            "property_candidate": {
                "property_candidate_id": property_candidate_id,
                "parcel_association": parcel_association,
                "building_candidates_count": len(building_candidates)
            },
            "building_candidates": building_candidates,
            "provenance": provenance if provenance else {},
            "legal_disclaimer": LEGAL_DISCLAIMER_TEXT
        }

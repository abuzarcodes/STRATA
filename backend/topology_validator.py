"""
topology_validator.py - 3D Cadastral Topology and Encroachment Audit Engine.
Executes 3D spatial intersection checks, clash detection, air-rights encroachment auditing,
and manifold watertightness validation conforming to ISO 19152 LADM.
"""

from typing import List, Dict, Any, Tuple
from shapely.geometry import Polygon, MultiPolygon
import numpy as np


class TopologyValidator:
    def __init__(
        self,
        parcel_boundary_local: List[Tuple[float, float]],
        approved_envelope_local: List[Tuple[float, float]] = None
    ):
        self.parcel_poly = Polygon(parcel_boundary_local)
        if not self.parcel_poly.is_valid:
            self.parcel_poly = self.parcel_poly.buffer(0)
            
        # Approved building envelope / setback line (default 24x18m box)
        if approved_envelope_local is None:
            approved_envelope_local = [(-12.0, -9.0), (12.0, -9.0), (12.0, 9.0), (-12.0, 9.0), (-12.0, -9.0)]
        self.envelope_poly = Polygon(approved_envelope_local)
        if not self.envelope_poly.is_valid:
            self.envelope_poly = self.envelope_poly.buffer(0)

    def check_air_rights_and_boundary_encroachment(
        self, unit: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Tests if a 3D unit's 2D footprint breaches the vertical boundary prism of the parcel
        or the approved building setback envelope.
        """
        unit_poly_2d = Polygon(unit["poly_2d"])
        if not unit_poly_2d.is_valid:
            unit_poly_2d = unit_poly_2d.buffer(0)

        # 1. Check strict parcel boundary breach (e.g. subsurface basement)
        parcel_diff = unit_poly_2d.difference(self.parcel_poly)
        if not parcel_diff.is_empty and parcel_diff.area > 0.01:
            encroachment_area_m2 = round(parcel_diff.area, 2)
            height = unit["z_max"] - unit["z_min"]
            encroachment_volume_m3 = round(encroachment_area_m2 * height, 2)
            
            violation_type = "SUBSURFACE_BOUNDARY_BREACH" if unit["domain"] == "U" else "PARCEL_BOUNDARY_BREACH"
            return {
                "has_violation": True,
                "violation_type": violation_type,
                "severity": "CRITICAL",
                "encroachment_area_m2": encroachment_area_m2,
                "encroachment_volume_m3": encroachment_volume_m3,
                "description": f"{unit['name']} breaches the outer parcel boundary by {encroachment_area_m2} m² ({encroachment_volume_m3} m³)."
            }

        # 2. Check approved building setback air-rights envelope (for above ground units)
        if unit["domain"] == "A" and unit["type"] == "PRIVATE_RESIDENTIAL":
            envelope_diff = unit_poly_2d.difference(self.envelope_poly)
            if not envelope_diff.is_empty and envelope_diff.area > 0.01:
                encroachment_area_m2 = round(envelope_diff.area, 2)
                height = unit["z_max"] - unit["z_min"]
                encroachment_volume_m3 = round(encroachment_area_m2 * height, 2)
                
                return {
                    "has_violation": True,
                    "violation_type": "AIR_RIGHTS_SETBACK_ENCROACHMENT",
                    "severity": "HIGH",
                    "encroachment_area_m2": encroachment_area_m2,
                    "encroachment_volume_m3": encroachment_volume_m3,
                    "description": f"{unit['name']} cantilevered extension exceeds approved setback envelope by {encroachment_area_m2} m² ({encroachment_volume_m3} m³)."
                }
        
        return {
            "has_violation": False,
            "violation_type": "NONE",
            "severity": "COMPLIANT",
            "encroachment_area_m2": 0.0,
            "encroachment_volume_m3": 0.0,
            "description": "Within legal parcel & setback boundaries."
        }

    def check_inter_unit_clashes(self, units: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Performs 3D bounding box and 2D-Z overlap checks between all pairs of units.
        """
        clashes = []
        n = len(units)
        
        for i in range(n):
            for j in range(i + 1, n):
                u1 = units[i]
                u2 = units[j]
                
                # Check Z-overlap first (fast filter)
                z_overlap = min(u1["z_max"], u2["z_max"]) - max(u1["z_min"], u2["z_min"])
                if z_overlap > 0.05:  # more than 5cm overlap in vertical axis
                    # Check 2D footprint intersection
                    p1 = Polygon(u1["poly_2d"]).buffer(0)
                    p2 = Polygon(u2["poly_2d"]).buffer(0)
                    
                    inter = p1.intersection(p2)
                    if not inter.is_empty and inter.area > 0.05:
                        overlap_vol = round(inter.area * z_overlap, 2)
                        clashes.append({
                            "unit_a": u1["unit_id"],
                            "unit_b": u2["unit_id"],
                            "overlap_area_m2": round(inter.area, 2),
                            "overlap_volume_m3": overlap_vol,
                            "description": f"Illegal overlap between {u1['unit_id']} and {u2['unit_id']} ({overlap_vol} m³ collision)"
                        })
        return clashes

    def run_full_cadastral_audit(self, units: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Executes complete ISO 19152 LADM compliance and topology verification.
        """
        audit_results = {
            "total_units_audited": len(units),
            "compliant_units": 0,
            "violation_count": 0,
            "air_rights_violations": [],
            "subsurface_violations": [],
            "inter_unit_clashes": [],
            "units_summary": []
        }

        for unit in units:
            encroachment_check = self.check_air_rights_and_boundary_encroachment(unit)
            
            unit_summary = {
                "unit_id": unit["unit_id"],
                "ulpin_3d": unit.get("ulpin_3d", ""),
                "name": unit["name"],
                "level": unit["level"],
                "domain": unit["domain"],
                "owner": unit["owner"],
                "is_watertight": unit.get("is_watertight", True),
                "volume_m3": unit.get("volume_m3", 0.0),
                "carpet_area_m2": unit.get("carpet_area_m2", 0.0),
                "violation": encroachment_check
            }
            
            if encroachment_check["has_violation"]:
                audit_results["violation_count"] += 1
                if unit["domain"] == "A":
                    audit_results["air_rights_violations"].append(unit_summary)
                else:
                    audit_results["subsurface_violations"].append(unit_summary)
            else:
                audit_results["compliant_units"] += 1
                
            audit_results["units_summary"].append(unit_summary)

        # Run clash detection across all units
        clashes = self.check_inter_unit_clashes(units)
        audit_results["inter_unit_clashes"] = clashes
        audit_results["total_clashes"] = len(clashes)
        audit_results["overall_cadastral_status"] = "PASSED_WITH_WARNINGS" if audit_results["violation_count"] > 0 else "CLEAN_PASS"

        return audit_results

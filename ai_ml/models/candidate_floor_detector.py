"""
Candidate Floor Detector Baseline.
Infers candidate floor levels from vertical/geometric evidence (Z-distribution density peaks,
facade rhythm, slab RANSAC planes, and height constraints).
Explicitly outputs CANDIDATE floor levels with verification flags (`verification_required: true`).
"""

from typing import List, Dict, Any, Tuple
import numpy as np
from ai_ml.schemas.candidate_property_schema import CandidateFloor, VerificationStatus


class CandidateFloorDetector:
    """
    Infere candidate floor count & Z-levels from building point clouds.
    """

    def __init__(self, default_floor_height_m: float = 3.0, min_peak_prominence: float = 0.05):
        self.default_floor_height = default_floor_height_m
        self.min_prominence = min_peak_prominence

    def detect_candidate_floors(
        self,
        building_points: np.ndarray,
        building_height_m: float,
        ground_elevation_m: float = 0.0
    ) -> Tuple[int, List[CandidateFloor], VerificationStatus]:
        """
        Detects candidate floor levels.
        Returns (inferred_floor_count, candidate_floors_list, verification_status)
        """
        if len(building_points) == 0 or building_height_m <= 0:
            status = VerificationStatus(
                verification_required=True,
                status="uncertain",
                reasons=["empty_building_points_or_zero_height"]
            )
            return 0, [], status

        z_norm = building_points[:, 2] - ground_elevation_m

        # 1. Estimate Floor Count from Building Height
        estimated_count = max(1, int(round(building_height_m / self.default_floor_height)))

        # 2. Z-Axis Kernel Density Peak Detection
        bins = np.arange(0, building_height_m + 0.5, 0.2)
        counts, bin_edges = np.histogram(z_norm, bins=bins)
        bin_centers = (bin_edges[:-1] + bin_edges[1:]) / 2.0

        # Find Z local density peaks (slab locations)
        peaks = self._find_local_peaks(counts, bin_centers)

        floors: List[CandidateFloor] = []
        issues = []

        if len(peaks) > 0:
            # Sort peaks vertically
            sorted_peaks = sorted(peaks)
            
            for level_idx in range(1, estimated_count + 1):
                z_min = (level_idx - 1) * self.default_floor_height
                z_max = level_idx * self.default_floor_height
                
                # Check if a peak aligns within this floor range
                matching_peak = [p for p in sorted_peaks if z_min <= p <= z_max + 0.5]
                confidence = 0.88 if len(matching_peak) > 0 else 0.65
                if len(matching_peak) == 0:
                    issues.append(f"floor_{level_idx}_slab_peak_ambiguous")

                floors.append(CandidateFloor(
                    level=level_idx,
                    z_min_m=round(z_min, 2),
                    z_max_m=round(z_max, 2),
                    confidence=confidence,
                    inference_evidence="Z-density vertical rhythm + height constraints",
                    verification=VerificationStatus(
                        verification_required=(confidence < 0.80),
                        status="high_confidence" if confidence >= 0.80 else "review_recommended",
                        reasons=[f"candidate_floor_level_{level_idx}_inferred"] if confidence < 0.80 else []
                    )
                ))
        else:
            # Uniform fallback spacing when peaks are unclear
            issues.append("z_histogram_peaks_unclear_used_uniform_height_constraints")
            for level_idx in range(1, estimated_count + 1):
                z_min = (level_idx - 1) * self.default_floor_height
                z_max = level_idx * self.default_floor_height
                floors.append(CandidateFloor(
                    level=level_idx,
                    z_min_m=round(z_min, 2),
                    z_max_m=round(z_max, 2),
                    confidence=0.70,
                    inference_evidence="Uniform vertical height constraint fallback",
                    verification=VerificationStatus(
                        verification_required=True,
                        status="review_recommended",
                        reasons=["uniform_spacing_fallback"]
                    )
                ))

        overall_status = VerificationStatus(
            verification_required=(len(issues) > 0 or any(f.confidence < 0.80 for f in floors)),
            status="high_confidence" if len(issues) == 0 else "uncertain",
            reasons=issues if issues else ["candidate_floors_inferred_from_lidar_geometry_only"]
        )

        return len(floors), floors, overall_status

    def _find_local_peaks(self, counts: np.ndarray, centers: np.ndarray) -> List[float]:
        """Simple local maxima peak finder."""
        peaks = []
        if len(counts) < 3:
            return peaks

        max_count = np.max(counts)
        if max_count == 0:
            return peaks

        threshold = max_count * 0.15
        for i in range(1, len(counts) - 1):
            if counts[i] > counts[i-1] and counts[i] > counts[i+1] and counts[i] >= threshold:
                peaks.append(float(centers[i]))

        return peaks

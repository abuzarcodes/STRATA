"""
ulpin_generator.py - Standardized 3D ULPIN (Unique Land Parcel Identification Number) Generation Engine.
Implements the 3D cadastral spatial hashing formula extending India's 14-digit Bhu-Aadhaar into volumetric 3D space.
"""

import hashlib
import json
from typing import Dict, Any, List, Tuple


class ULPINGenerator:
    def __init__(self, base_ulpin: str = "IND280145987621"):
        """
        :param base_ulpin: 14-digit national cadastral surface parcel identifier
        """
        self.base_ulpin = base_ulpin

    def generate_spatial_hash(
        self,
        domain_flag: str,
        floor_index: int,
        centroid: Tuple[float, float, float],
        bbox: Tuple[float, float, float, float, float, float],
        unit_code: str
    ) -> str:
        """
        Generates a deterministic 4-character cryptographic token based on spatial attributes.
        :param centroid: (x, y, z) or (lon, lat, alt)
        :param bbox: (min_x, min_y, min_z, max_x, max_y, max_z)
        :param unit_code: e.g., 'Unit-101', 'Slot-B1-02'
        """
        # Quantize coordinates to prevent floating point jitter across platforms
        cx, cy, cz = round(centroid[0], 4), round(centroid[1], 4), round(centroid[2], 2)
        min_x, min_y, min_z, max_x, max_y, max_z = [round(v, 2) for v in bbox]
        
        raw_payload = f"{self.base_ulpin}:{domain_flag}:{floor_index:+03d}:{unit_code}:C({cx},{cy},{cz}):B({min_x},{min_y},{min_z},{max_x},{max_y},{max_z})"
        sha = hashlib.sha256(raw_payload.encode("utf-8")).hexdigest().upper()
        return sha[:4]

    def generate_3d_ulpin(
        self,
        domain_flag: str,
        floor_index: int,
        unit_code: str,
        centroid: Tuple[float, float, float],
        bbox: Tuple[float, float, float, float, float, float]
    ) -> Dict[str, Any]:
        """
        Generates full 3D-ULPIN record.
        Domain Flags:
          - 'S': Surface Land Parcel (floor_index = 0)
          - 'A': Above-Ground Spatial Unit (floor_index > 0)
          - 'U': Underground / Subsurface Spatial Unit (floor_index < 0)
        """
        domain_flag = domain_flag.upper()
        if domain_flag not in ('S', 'A', 'U'):
            raise ValueError(f"Invalid domain flag: {domain_flag}. Must be 'S', 'A', or 'U'.")

        spatial_hash = self.generate_spatial_hash(domain_flag, floor_index, centroid, bbox, unit_code)
        
        # Format: IND280145987621-A+04-8E2A or IND280145987621-U-01-3F1B
        if domain_flag == 'S':
            ulpin_3d = f"{self.base_ulpin}-S00-{spatial_hash}"
        else:
            ulpin_3d = f"{self.base_ulpin}-{domain_flag}{floor_index:+03d}-{spatial_hash}"

        # Generate digital deed verification token (Full SHA256)
        full_token_raw = f"{ulpin_3d}:{unit_code}:{bbox}:{centroid}"
        deed_verification_token = hashlib.sha256(full_token_raw.encode("utf-8")).hexdigest()

        return {
            "ulpin_3d": ulpin_3d,
            "base_ulpin": self.base_ulpin,
            "domain_flag": domain_flag,
            "floor_index": floor_index,
            "unit_code": unit_code,
            "spatial_hash": spatial_hash,
            "deed_token": deed_verification_token,
            "qr_payload": {
                "id": ulpin_3d,
                "base": self.base_ulpin,
                "domain": domain_flag,
                "floor": floor_index,
                "unit": unit_code,
                "token": deed_verification_token[:16]
            }
        }

    @staticmethod
    def parse_3d_ulpin(ulpin_3d: str) -> Dict[str, Any]:
        """
        Deconstructs a 3D-ULPIN string back into its constituent metadata components.
        """
        parts = ulpin_3d.split('-')
        if len(parts) < 3:
            raise ValueError(f"Invalid 3D-ULPIN format: {ulpin_3d}")
        
        base_ulpin = parts[0]
        domain_floor = parts[1]
        spatial_hash = parts[2]
        
        domain_flag = domain_floor[0]
        floor_index = int(domain_floor[1:]) if len(domain_floor) > 1 else 0
        
        return {
            "base_ulpin": base_ulpin,
            "domain_flag": domain_flag,
            "floor_index": floor_index,
            "spatial_hash": spatial_hash
        }

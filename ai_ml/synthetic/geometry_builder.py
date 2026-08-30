"""
Modular Synthetic 3D Geometry Builder for Indian Urban Archetypes.
Generates exact 3D parametric vector geometries for parcels, buildings, floors, and rooms.
"""

from typing import Dict, Any, List, Tuple
import numpy as np
from ai_ml.schemas.ground_truth_schema import (
    GroundTruthScene, ParcelGT, BuildingGT, FloorGT, UnitGT, RoomGT
)


class SyntheticGeometryBuilder:
    """
    Parametric generator for 6 Indian urban archetypes.
    """

    ARCHETYPES = [
        "independent_house",
        "multi_storey_apartment",
        "multi_building_parcel",
        "mixed_use_building",
        "irregular_l_shaped",
        "stilt_parking_basement"
    ]

    def __init__(self, seed: int = 42):
        self.rng = np.random.default_rng(seed)

    def create_scene(self, archetype: str, scene_id: str = "scene_001") -> GroundTruthScene:
        """
        Creates a synthetic ground truth scene with exact spatial geometry.
        """
        if archetype not in self.ARCHETYPES:
            raise ValueError(f"Unknown archetype: {archetype}. Available: {self.ARCHETYPES}")

        # Base Parcel (50m x 50m bounding footprint)
        parcel_poly = [[0.0, 0.0], [50.0, 0.0], [50.0, 50.0], [0.0, 50.0]]
        parcel_gt = ParcelGT(
            parcel_id=f"P_{scene_id}",
            parcel_polygon=parcel_poly,
            area_sqm=2500.0
        )

        buildings: List[BuildingGT] = []

        if archetype == "independent_house":
            b = self._build_independent_house("B_001", offset_x=10.0, offset_y=10.0)
            buildings.append(b)

        elif archetype == "multi_storey_apartment":
            b = self._build_apartment("B_001", offset_x=10.0, offset_y=10.0, floors_count=6)
            buildings.append(b)

        elif archetype == "multi_building_parcel":
            b1 = self._build_independent_house("B_001", offset_x=5.0, offset_y=5.0)
            b2 = self._build_apartment("B_002", offset_x=28.0, offset_y=10.0, floors_count=4)
            buildings.extend([b1, b2])

        elif archetype == "mixed_use_building":
            b = self._build_mixed_use("B_001", offset_x=12.0, offset_y=12.0)
            buildings.append(b)

        elif archetype == "irregular_l_shaped":
            b = self._build_l_shaped("B_001", offset_x=10.0, offset_y=10.0)
            buildings.append(b)

        elif archetype == "stilt_parking_basement":
            b = self._build_stilt_parking("B_001", offset_x=10.0, offset_y=10.0)
            buildings.append(b)

        return GroundTruthScene(
            scene_id=scene_id,
            parcel=parcel_gt,
            buildings=buildings,
            metadata={"archetype": archetype, "seed": int(self.rng.integers(0, 10000))}
        )

    def _build_independent_house(self, b_id: str, offset_x: float, offset_y: float) -> BuildingGT:
        width, length = 12.0, 15.0
        footprint = [
            [offset_x, offset_y],
            [offset_x + width, offset_y],
            [offset_x + width, offset_y + length],
            [offset_x, offset_y + length]
        ]
        floor_height = 3.2
        floor_count = 2
        floors = []
        for level in range(1, floor_count + 1):
            z_min = (level - 1) * floor_height
            z_max = level * floor_height
            units = [
                UnitGT(
                    unit_id=f"{b_id}_U{level}01",
                    label=f"{level}01",
                    area_sqm=width * length,
                    polygon=footprint,
                    rooms=[
                        RoomGT(room_id="R1", name="LIVING", polygon=footprint),
                        RoomGT(room_id="R2", name="BEDROOM", polygon=footprint)
                    ]
                )
            ]
            floors.append(FloorGT(
                level=level,
                floor_type="residential",
                z_min_m=z_min,
                z_max_m=z_max,
                height_m=floor_height,
                units=units
            ))

        return BuildingGT(
            building_id=b_id,
            archetype="independent_house",
            footprint_polygon=footprint,
            ground_elevation_m=0.0,
            total_height_m=floor_count * floor_height,
            floor_count=floor_count,
            floors=floors
        )

    def _build_apartment(self, b_id: str, offset_x: float, offset_y: float, floors_count: int = 6) -> BuildingGT:
        width, length = 18.0, 24.0
        footprint = [
            [offset_x, offset_y],
            [offset_x + width, offset_y],
            [offset_x + width, offset_y + length],
            [offset_x, offset_y + length]
        ]
        floor_height = 3.0
        floors = []
        for level in range(1, floors_count + 1):
            z_min = (level - 1) * floor_height
            z_max = level * floor_height
            units = [
                UnitGT(unit_id=f"{b_id}_U{level}01", label=f"{level}01", area_sqm=100.0, polygon=footprint),
                UnitGT(unit_id=f"{b_id}_U{level}02", label=f"{level}02", area_sqm=100.0, polygon=footprint)
            ]
            floors.append(FloorGT(
                level=level,
                floor_type="residential",
                z_min_m=z_min,
                z_max_m=z_max,
                height_m=floor_height,
                units=units
            ))

        return BuildingGT(
            building_id=b_id,
            archetype="multi_storey_apartment",
            footprint_polygon=footprint,
            ground_elevation_m=0.0,
            total_height_m=floors_count * floor_height,
            floor_count=floors_count,
            floors=floors,
            rooftop_structures=[{"type": "water_tank", "height_m": 2.0}]
        )

    def _build_mixed_use(self, b_id: str, offset_x: float, offset_y: float) -> BuildingGT:
        width, length = 16.0, 20.0
        footprint = [
            [offset_x, offset_y],
            [offset_x + width, offset_y],
            [offset_x + width, offset_y + length],
            [offset_x, offset_y + length]
        ]
        # Ground floor: Commercial (height 4.0m), Upper floors: Residential (height 3.0m)
        floors = [
            FloorGT(level=1, floor_type="commercial", z_min_m=0.0, z_max_m=4.0, height_m=4.0),
            FloorGT(level=2, floor_type="residential", z_min_m=4.0, z_max_m=7.0, height_m=3.0),
            FloorGT(level=3, floor_type="residential", z_min_m=7.0, z_max_m=10.0, height_m=3.0),
            FloorGT(level=4, floor_type="residential", z_min_m=10.0, z_max_m=13.0, height_m=3.0)
        ]
        return BuildingGT(
            building_id=b_id,
            archetype="mixed_use_building",
            footprint_polygon=footprint,
            ground_elevation_m=0.0,
            total_height_m=13.0,
            floor_count=4,
            floors=floors
        )

    def _build_l_shaped(self, b_id: str, offset_x: float, offset_y: float) -> BuildingGT:
        # L-shaped polygon
        footprint = [
            [offset_x, offset_y],
            [offset_x + 20.0, offset_y],
            [offset_x + 20.0, offset_y + 8.0],
            [offset_x + 8.0, offset_y + 8.0],
            [offset_x + 8.0, offset_y + 20.0],
            [offset_x, offset_y + 20.0]
        ]
        floor_height = 3.0
        floor_count = 5
        floors = [
            FloorGT(level=lvl, floor_type="residential", z_min_m=(lvl-1)*3.0, z_max_m=lvl*3.0, height_m=3.0)
            for lvl in range(1, floor_count + 1)
        ]
        return BuildingGT(
            building_id=b_id,
            archetype="irregular_l_shaped",
            footprint_polygon=footprint,
            ground_elevation_m=0.0,
            total_height_m=floor_count * floor_height,
            floor_count=floor_count,
            floors=floors
        )

    def _build_stilt_parking(self, b_id: str, offset_x: float, offset_y: float) -> BuildingGT:
        width, length = 15.0, 18.0
        footprint = [
            [offset_x, offset_y],
            [offset_x + width, offset_y],
            [offset_x + width, offset_y + length],
            [offset_x, offset_y + length]
        ]
        floors = [
            FloorGT(level=0, floor_type="stilt_parking", z_min_m=0.0, z_max_m=3.0, height_m=3.0),
            FloorGT(level=1, floor_type="residential", z_min_m=3.0, z_max_m=6.0, height_m=3.0),
            FloorGT(level=2, floor_type="residential", z_min_m=6.0, z_max_m=9.0, height_m=3.0),
            FloorGT(level=3, floor_type="residential", z_min_m=9.0, z_max_m=12.0, height_m=3.0)
        ]
        return BuildingGT(
            building_id=b_id,
            archetype="stilt_parking_basement",
            footprint_polygon=footprint,
            ground_elevation_m=0.0,
            total_height_m=12.0,
            floor_count=4,
            floors=floors,
            has_parking=True
        )

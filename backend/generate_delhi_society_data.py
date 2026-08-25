"""
generate_delhi_society_data.py - Generates 2D cadastral footprint, floor plans, and context infrastructure
for a high-density Delhi Residential Society (Aura Residency, Dwarka Sector 10, New Delhi).
Includes both compliant units and intentional topological violations for testing the audit engine.
"""

from typing import Dict, Any, List
from shapely.geometry import Polygon, box, MultiPolygon
from coordinates import default_converter


def generate_cadastral_society_dataset() -> Dict[str, Any]:
    """
    Constructs the 2D polygon vectors for all units across all vertical levels,
    along with the surface parcel boundary and surrounding urban context.
    """
    
    # 1. Surface Parcel Boundary (36m x 28m)
    # Origin (0, 0) is the center of the building footprint
    # Building is 24m wide (-12 to +12), 18m deep (-9 to +9)
    # Plot bounds: X in [-18, +18], Y in [-14, +14]
    parcel_polygon_local = [
        (-18.0, -14.0),
        (18.0, -14.0),
        (18.0, 14.0),
        (-18.0, 14.0),
        (-18.0, -14.0)
    ]
    
    # Setback limits:
    # North (Road side): Y <= 9.0 (Building max Y is 9.0)
    # South (Rear): Y >= -9.0
    # East/West: X in [-12.0, +12.0]
    
    # 2. Road Network & Surrounding Plots for Visual Context
    north_road = [
        (-35.0, 14.0),
        (35.0, 14.0),
        (35.0, 26.0),
        (-35.0, 26.0),
        (-35.0, 14.0)
    ]
    east_road = [
        (18.0, -30.0),
        (26.0, -30.0),
        (26.0, 30.0),
        (18.0, 30.0),
        (18.0, -30.0)
    ]
    
    neighbor_plot_west = [
        (-35.0, -14.0),
        (-18.0, -14.0),
        (-18.0, 14.0),
        (-35.0, 14.0),
        (-35.0, -14.0)
    ]
    neighbor_plot_south = [
        (-18.0, -30.0),
        (18.0, -30.0),
        (18.0, -14.0),
        (-18.0, -14.0),
        (-18.0, -30.0)
    ]
    
    # 3. Unit Floor Plan Templates
    # Building Core: Central Lobby & Lift/Stairs: X in [-3.0, 3.0], Y in [-3.0, 3.0]
    core_corridor = [(-3.0, -3.0), (3.0, -3.0), (3.0, 3.0), (-3.0, 3.0), (-3.0, -3.0)]
    lift_shaft = [(-1.2, -1.2), (1.2, -1.2), (1.2, 1.2), (-1.2, 1.2), (-1.2, -1.2)]
    
    # 4 Units per residential floor (NE, NW, SE, SW):
    # Unit 1 (NW): X in [-12.0, -3.0], Y in [0.0, 9.0]
    unit_nw = [(-12.0, 0.0), (-3.0, 0.0), (-3.0, 9.0), (-12.0, 9.0), (-12.0, 0.0)]
    
    # Unit 2 (NE - Compliant version): X in [3.0, 12.0], Y in [0.0, 9.0]
    unit_ne = [(3.0, 0.0), (12.0, 0.0), (12.0, 9.0), (3.0, 9.0), (3.0, 0.0)]
    
    # Unit 2 (NE with Intentional Air-Rights Encroachment on Floor 2):
    # Balcony extends Y from 9.0 up to 11.0m (into the 5m setback towards North Road!)
    unit_ne_encroached = [
        (3.0, 0.0), 
        (12.0, 0.0), 
        (12.0, 9.0), 
        (11.0, 9.0), 
        (11.0, 11.0),  # Cantilevered Balcony protruding +2.0m!
        (4.0, 11.0),
        (4.0, 9.0),
        (3.0, 9.0), 
        (3.0, 0.0)
    ]
    
    # Unit 3 (SW): X in [-12.0, -3.0], Y in [-9.0, 0.0]
    unit_sw = [(-12.0, -9.0), (-3.0, -9.0), (-3.0, 0.0), (-12.0, 0.0), (-12.0, -9.0)]
    
    # Unit 4 (SE): X in [3.0, 12.0], Y in [-9.0, 0.0]
    unit_se = [(3.0, -9.0), (12.0, -9.0), (12.0, 0.0), (3.0, 0.0), (3.0, -9.0)]

    # 4. Basement Parking Layout (Z = -3.5m to -0.2m)
    # 6 Parking slots (6m x 3m each), Driveway in middle, Pump Room
    slot_b1_01 = [(-11.5, 3.5), (-5.5, 3.5), (-5.5, 8.5), (-11.5, 8.5), (-11.5, 3.5)]
    slot_b1_02 = [(-5.5, 3.5), (0.5, 3.5), (0.5, 8.5), (-5.5, 8.5), (-5.5, 3.5)]
    slot_b1_03 = [(0.5, 3.5), (6.5, 3.5), (6.5, 8.5), (0.5, 8.5), (0.5, 3.5)]
    slot_b1_04 = [(-11.5, -8.5), (-5.5, -8.5), (-5.5, -3.5), (-11.5, -3.5), (-11.5, -8.5)]
    slot_b1_05 = [(-5.5, -8.5), (0.5, -8.5), (0.5, -3.5), (-5.5, -3.5), (-5.5, -8.5)]
    
    # Slot B1-06 (Intentional Subsurface Encroachment extending past plot boundary on East side)
    # Plot boundary is X = +18.0. Slot extends from X=11.5 to X=19.5 (1.5m encroachment!)
    slot_b1_06_encroached = [(11.5, -8.5), (19.5, -8.5), (19.5, -3.5), (11.5, -3.5), (11.5, -8.5)]
    
    basement_utility_room = [(6.5, 3.5), (11.5, 3.5), (11.5, 8.5), (6.5, 8.5), (6.5, 3.5)]
    basement_aisle = [(-12.0, -3.5), (12.0, -3.5), (12.0, 3.5), (-12.0, 3.5), (-12.0, -3.5)]

    # 5. Assemble all spatial unit definitions
    units_catalog = []
    
    # --- Basement Level (-1) ---
    units_catalog.extend([
        {
            "unit_id": "PARK-B101",
            "name": "Basement Parking Bay #01",
            "level": -1,
            "domain": "U",
            "type": "RESTRICTED_COMMON_PARKING",
            "owner": "Rajesh Kumar (Flat 101 Link)",
            "poly_2d": slot_b1_01,
            "z_min": -3.5,
            "z_max": -0.2,
            "color": "#38bdf8"
        },
        {
            "unit_id": "PARK-B102",
            "name": "Basement Parking Bay #02",
            "level": -1,
            "domain": "U",
            "type": "RESTRICTED_COMMON_PARKING",
            "owner": "Priya Sharma (Flat 102 Link)",
            "poly_2d": slot_b1_02,
            "z_min": -3.5,
            "z_max": -0.2,
            "color": "#38bdf8"
        },
        {
            "unit_id": "PARK-B103",
            "name": "Basement Parking Bay #03",
            "level": -1,
            "domain": "U",
            "type": "RESTRICTED_COMMON_PARKING",
            "owner": "Amitabh Verma (Flat 201 Link)",
            "poly_2d": slot_b1_03,
            "z_min": -3.5,
            "z_max": -0.2,
            "color": "#38bdf8"
        },
        {
            "unit_id": "PARK-B104",
            "name": "Basement Parking Bay #04",
            "level": -1,
            "domain": "U",
            "type": "RESTRICTED_COMMON_PARKING",
            "owner": "Sunita Rao (Flat 202 Link)",
            "poly_2d": slot_b1_04,
            "z_min": -3.5,
            "z_max": -0.2,
            "color": "#38bdf8"
        },
        {
            "unit_id": "PARK-B105",
            "name": "Basement Parking Bay #05",
            "level": -1,
            "domain": "U",
            "type": "RESTRICTED_COMMON_PARKING",
            "owner": "Vikram Malhotra (Flat 301 Link)",
            "poly_2d": slot_b1_05,
            "z_min": -3.5,
            "z_max": -0.2,
            "color": "#38bdf8"
        },
        {
            "unit_id": "PARK-B106",
            "name": "Basement Parking Bay #06 (Unapproved Extension)",
            "level": -1,
            "domain": "U",
            "type": "RESTRICTED_COMMON_PARKING",
            "owner": "Builder Reserved / Unsanctioned",
            "poly_2d": slot_b1_06_encroached,
            "z_min": -3.5,
            "z_max": -0.2,
            "color": "#ef4444"
        },
        {
            "unit_id": "UTIL-B101",
            "name": "Basement Substation & Pump Room",
            "level": -1,
            "domain": "U",
            "type": "COMMON_UTILITY",
            "owner": "Aura Residency RWA",
            "poly_2d": basement_utility_room,
            "z_min": -3.5,
            "z_max": -0.2,
            "color": "#64748b"
        }
    ])

    # --- Ground Floor (Level 0) ---
    ground_lobby = [(-12.0, -9.0), (12.0, -9.0), (12.0, 9.0), (-12.0, 9.0), (-12.0, -9.0)]
    units_catalog.append({
        "unit_id": "COMM-G01",
        "name": "Grand Entrance Lobby & Admin Office",
        "level": 0,
        "domain": "S",
        "type": "COMMON_AMENITY",
        "owner": "Aura Residency RWA",
        "poly_2d": ground_lobby,
        "z_min": 0.2,
        "z_max": 3.0,
        "color": "#10b981"
    })

    # --- Residential Floors 1 to 4 ---
    owners_roster = {
        1: [("01", "Rajesh Kumar", "3BHK Executive"), ("02", "Priya Sharma", "3BHK Executive"), 
            ("03", "Karan Kapoor", "2BHK Premium"), ("04", "Deepak Joshi", "2BHK Premium")],
        2: [("01", "Amitabh Verma", "3BHK Executive"), ("02", "Sunita Rao (Cantilever Balcony)", "3BHK Deluxe Encroached"), 
            ("03", "Ananya Sen", "2BHK Premium"), ("04", "Harish Mehta", "2BHK Premium")],
        3: [("01", "Vikram Malhotra", "3BHK Executive"), ("02", "Suresh Raina", "3BHK Executive"), 
            ("03", "Pooja Hegde", "2BHK Premium"), ("04", "Naveen Jindal", "2BHK Premium")],
        4: [("01", "Rohan Singhania", "Penthouse North-A"), ("02", "Manish Goel", "Penthouse North-B"), 
            ("03", "Sanjay Dutt", "Penthouse South-A"), ("04", "Alok Nath", "Penthouse South-B")]
    }

    unit_polys_map = {
        "01": unit_nw,
        "02": unit_ne,        # Default compliant
        "03": unit_sw,
        "04": unit_se
    }

    for fl in range(1, 5):
        z_min = fl * 3.0 + 0.2  # 0.2m slab offset
        z_max = (fl + 1) * 3.0
        
        # Central lobby corridor for this floor
        units_catalog.append({
            "unit_id": f"LOBBY-{fl}00",
            "name": f"Floor {fl} Elevator Lobby & Fire Corridor",
            "level": fl,
            "domain": "A",
            "type": "COMMON_CIRCULATION",
            "owner": "Aura Residency RWA",
            "poly_2d": core_corridor,
            "z_min": z_min,
            "z_max": z_max,
            "color": "#94a3b8"
        })

        for unit_suffix, owner_name, flat_desc in owners_roster[fl]:
            full_unit_num = f"{fl}{unit_suffix}"
            poly = unit_polys_map[unit_suffix]
            
            # Floor 2, Unit 202 uses the encroaching cantilevered balcony polygon
            if fl == 2 and unit_suffix == "02":
                poly = unit_ne_encroached
                color = "#ef4444"
            else:
                color = "#6366f1" if "3BHK" in flat_desc or "Penthouse" in flat_desc else "#3b82f6"

            units_catalog.append({
                "unit_id": f"FLAT-{full_unit_num}",
                "name": f"Apartment {full_unit_num} ({flat_desc})",
                "level": fl,
                "domain": "A",
                "type": "PRIVATE_RESIDENTIAL",
                "owner": owner_name,
                "poly_2d": poly,
                "z_min": z_min,
                "z_max": z_max,
                "color": color
            })

    # --- Roof Level (Level 5) ---
    roof_slab = [(-12.0, -9.0), (12.0, -9.0), (12.0, 9.0), (-12.0, 9.0), (-12.0, -9.0)]
    units_catalog.append({
        "unit_id": "ROOF-501",
        "name": "Terrace Solar Array & Overhead Water Storage",
        "level": 5,
        "domain": "A",
        "type": "COMMON_UTILITY",
        "owner": "Aura Residency RWA",
        "poly_2d": roof_slab,
        "z_min": 15.2,
        "z_max": 17.5,
        "color": "#0ea5e9"
    })

    return {
        "society_name": "Aura Residency CGHS",
        "locality": "Plot 12, Sector 10, Dwarka, New Delhi 110075",
        "state_code": "07 (Delhi NCT)",
        "district": "South West Delhi",
        "sub_registrar_office": "Kapashera / Dwarka",
        "base_ulpin": "IND280145987621",
        "parcel_boundary_local": parcel_polygon_local,
        "units": units_catalog,
        "context_layers": {
            "north_road": north_road,
            "east_road": east_road,
            "neighbor_west": neighbor_plot_west,
            "neighbor_south": neighbor_plot_south
        }
    }


if __name__ == "__main__":
    dataset = generate_cadastral_society_dataset()
    print(f"Generated dataset for {dataset['society_name']} with {len(dataset['units'])} spatial units.")

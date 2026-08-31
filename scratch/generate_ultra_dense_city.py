import json
import math
import random
import os

def generate_ultra_dense_indian_city():
    print("=================================================================")
    print("STRATA: Generating Ultra-Dense Indian City with Full Street Access")
    print("=================================================================")

    # 1. Citizens & Stakeholder Pool
    CITIZENS = [
        {"name": "Deepak Joshi", "aadhaar": "XXXX-XXXX-8849", "pan": "ABCDE1234F", "phone": "+91 98101 23456"},
        {"name": "Rajesh Kumar", "aadhaar": "XXXX-XXXX-9124", "pan": "BKLPQ5678M", "phone": "+91 98112 34567"},
        {"name": "Priya Sharma", "aadhaar": "XXXX-XXXX-7341", "pan": "CRTYU9012N", "phone": "+91 98183 45678"},
        {"name": "Vikram Malhotra", "aadhaar": "XXXX-XXXX-4562", "pan": "DVWXY3456P", "phone": "+91 98194 56789"},
        {"name": "Sneha Reddy", "aadhaar": "XXXX-XXXX-3198", "pan": "EZABC7890Q", "phone": "+91 98205 67890"},
        {"name": "Amit Verma", "aadhaar": "XXXX-XXXX-6284", "pan": "FBCDE1234R", "phone": "+91 98216 78901"},
        {"name": "Dr. Sunita Rao", "aadhaar": "XXXX-XXXX-5521", "pan": "GKLMN5678S", "phone": "+91 98227 89012"},
        {"name": "Sanjay Singhania", "aadhaar": "XXXX-XXXX-9832", "pan": "HPQRS9012T", "phone": "+91 98238 90123"},
        {"name": "Meera Nambiar", "aadhaar": "XXXX-XXXX-1478", "pan": "ITUVW3456U", "phone": "+91 98249 01234"},
        {"name": "Ansh Tyagi", "aadhaar": "XXXX-XXXX-8213", "pan": "JXYZB7890V", "phone": "+91 98260 12345"},
        {"name": "Ayush Sharma", "aadhaar": "XXXX-XXXX-6743", "pan": "KBCDF1234W", "phone": "+91 98271 23456"},
        {"name": "Rudhraa Tyagi", "aadhaar": "XXXX-XXXX-2950", "pan": "LMNPQ5678X", "phone": "+91 98282 34567"}
    ]

    CORPORATES = [
        "DLF CyberCity Real Estate Ltd",
        "Max Healthcare Institute Ltd",
        "Delhi Police Headquarters (Dwarka Sub-Division)",
        "DMRC Metro Rail Corporation",
        "State Bank of India Corporate Assets",
        "HDFC Asset Management Trust",
        "Infosys Innovation Campus",
        "Reliance Realty Trust"
    ]

    ENCUMBRANCES = [
        {"status": "Clear & Freehold", "bank": None},
        {"status": "Clear & Freehold", "bank": None},
        {"status": "Mortgaged to State Bank of India", "bank": "State Bank of India (Dwarka Branch)"},
        {"status": "Mortgaged to HDFC Bank Ltd", "bank": "HDFC Bank (Sector 10 Branch)"},
        {"status": "Mortgaged to ICICI Bank Ltd", "bank": "ICICI Bank (Sector 6 Branch)"}
    ]

    # -------------------------------------------------------------------------
    # 2. DEFINE STREET NETWORK GEOMETRY (260m x 260m)
    # Primary Avenues (10m wide), Secondary Streets (6m wide), Thinner Galis (3.5m wide)
    # -------------------------------------------------------------------------
    streets_data = []

    # Main Arterial Highway (Diagonal Across City)
    streets_data.append({
        "name": "Khurrampur-Dwarka Main Boulevard",
        "type": "primary",
        "width": 10.0,
        "line": [(-120, -70), (120, 70)]
    })

    # North-South Secondary Feeder Avenues
    ns_x_coords = [-90, -55, -20, 15, 50, 85]
    for i, x in enumerate(ns_x_coords):
        streets_data.append({
            "name": f"Sector Avenue NS-{i+1}",
            "type": "secondary",
            "width": 6.0,
            "line": [(x, -120), (x + random.uniform(-10, 10), 120)]
        })

    # East-West Secondary Feeder Avenues
    ew_z_coords = [-90, -55, -20, 15, 50, 85]
    for i, z in enumerate(ew_z_coords):
        streets_data.append({
            "name": f"Sector Avenue EW-{i+1}",
            "type": "secondary",
            "width": 6.0,
            "line": [(-120, z), (120, z + random.uniform(-10, 10))]
        })

    # Thinner Access Galis & Alleyways between blocks
    gali_counter = 1
    for row_z in [-72, -38, -2, 32, 68]:
        for col_x in [-72, -38, -2, 32, 68]:
            streets_data.append({
                "name": f"Gali No. {gali_counter}",
                "type": "gali",
                "width": 3.5,
                "line": [(col_x - 12, row_z), (col_x + 12, row_z)]
            })
            gali_counter += 1

    # Save street network geometry to JSON for frontend rendering
    with open(r"d:\sih\frontend\src\data\realOsmRoads.json", "w", encoding="utf-8") as f:
        json.dump(streets_data, f, indent=2)

    # -------------------------------------------------------------------------
    # 3. PLACE 125 DENSE BUILDINGS ALONGSIDE STREETS WITH STRICT ROAD CLEARANCE
    # -------------------------------------------------------------------------
    buildings = []

    # Iconic Skyscraper in City Center (Like reference photo!)
    buildings.append({
        "code": "T-ICONIC",
        "name": "Strata Pinnacle Skyscraper (Center)",
        "complex": "Downtown Cyber Metropolis",
        "zone": "ZONE_3_COMMERCIAL",
        "domain": "C",
        "cx": 0.0, "cz": -5.0, "w": 14.0, "d": 12.0, "rot": 0,
        "floors": 32, "owner_idx": 0
    })

    # Generate 124 dense buildings positioned strictly in street blocks
    b_idx = 1
    
    # 5x5 Block Grid System spanning [-105, 105] with 1.8m setback from street edges
    block_centers = []
    for bx in [-80, -42, -5, 32, 70]:
        for bz in [-80, -42, -5, 32, 70]:
            # Skip center block reserved for Iconic Skyscraper & Central Park
            if abs(bx) < 15 and abs(bz) < 15:
                continue
            block_centers.append((bx, bz))

    # In each block, place 4 to 6 dense buildings facing the streets
    for bx, bz in block_centers:
        sub_offsets = [
            (-6.5, -6.5), (6.5, -6.5), (-6.5, 6.5), (6.5, 6.5), (0.0, -7.5)
        ]
        
        for ox, oz in sub_offsets:
            cx = round(bx + ox, 1)
            cz = round(bz + oz, 1)
            
            # Determine building typology organically based on distance from city center
            dist = math.sqrt(cx*cx + cz*cz)
            
            if dist < 45:
                # Commercial / Mixed High-Rise Tower (10 to 22 storeys)
                b_type = "C" if random.random() > 0.4 else "R"
                floors = random.choice([10, 12, 14, 16, 18, 22])
                w = round(random.uniform(7.5, 9.5), 1)
                d = round(random.uniform(7.0, 9.0), 1)
                name = f"Cyber Hub Block C-{b_idx:02d}" if b_type == "C" else f"Skyline Tower T-{b_idx:02d}"
                zone = "ZONE_3_COMMERCIAL" if b_type == "C" else "ZONE_1_HIGHRISE"
            elif dist < 85:
                # Mid-Rise Residential & Plotted Complexes (4 to 8 storeys)
                b_type = "R"
                floors = random.choice([4, 5, 6, 7, 8])
                w = round(random.uniform(6.5, 8.0), 1)
                d = round(random.uniform(6.0, 7.5), 1)
                name = f"Dwarka Enclave Block B-{b_idx:02d}"
                zone = "ZONE_1_HIGHRISE"
            else:
                # Dense Urban Village Abadi Dwellings (2 to 4 storeys)
                b_type = "R"
                floors = random.choice([2, 3, 4])
                w = round(random.uniform(5.5, 6.8), 1)
                d = round(random.uniform(5.2, 6.5), 1)
                name = f"Khurrampur Abadi House #{b_idx}"
                zone = "ZONE_2_PLOTTED"

            buildings.append({
                "code": f"B{b_idx:03d}",
                "name": name,
                "complex": "Delhi Metropolis Cadastre",
                "zone": zone,
                "domain": b_type,
                "cx": cx, "cz": cz, "w": w, "d": d,
                "rot": random.choice([0, 10, -15, 20]),
                "floors": floors, "owner_idx": b_idx
            })
            b_idx += 1

    print(f"Generated {len(buildings)} dense buildings with 100% street access!")

    # -------------------------------------------------------------------------
    # 4. PARCEL INTO VOLUMETRIC 3D UNITS
    # -------------------------------------------------------------------------
    units = []

    for b_idx, b in enumerate(buildings):
        b_code = b["code"]
        b_name = b["name"]
        cx, cz = b["cx"], b["cz"]
        w, d = b["w"], b["d"]
        floors = b["floors"]
        zone = b["zone"]
        domain = b["domain"]
        o_idx = b["owner_idx"]

        if floors >= 6 and domain == "R":
            flat_cfgs = [
                ("A", -w * 0.24, -d * 0.24, w * 0.46, d * 0.46, "3BHK Luxury", 138.0, 400.0),
                ("B", w * 0.24, -d * 0.24, w * 0.46, d * 0.46, "2BHK Premium", 88.0, 255.0),
                ("C", -w * 0.24, d * 0.24, w * 0.46, d * 0.46, "3BHK Deluxe", 134.0, 385.0),
                ("D", w * 0.24, d * 0.24, w * 0.46, d * 0.46, "2BHK Compact", 84.0, 242.0),
            ]
            for fl in range(1, floors + 1):
                floor_y = (fl - 1) * 1.5 + 0.75

                if fl == floors:
                    pent_owner = CITIZENS[(o_idx + fl) % len(CITIZENS)]
                    enc = random.choice(ENCUMBRANCES)
                    u_id = f"{b_code}-{fl}01"
                    ulpin = f"IND280145987621-{b_code}-L{fl:02d}-PENT"
                    units.append({
                        "unit_id": u_id,
                        "ulpin_3d": ulpin,
                        "name": f"Penthouse {fl}01, {b_name}",
                        "complex": b["complex"],
                        "type": "Residential Sky Penthouse",
                        "domain": "R",
                        "level": fl,
                        "zone": zone,
                        "floor_type": "PENTHOUSE",
                        "owner": pent_owner["name"],
                        "owner_details": pent_owner,
                        "carpet_area_m2": round(w * d * 3.8, 1),
                        "rera_volume_m3": round(w * d * 11.5, 1),
                        "volume_m3": round(w * d * 11.5, 1),
                        "encumbrance": enc["status"],
                        "mortgage_bank": enc["bank"],
                        "circle_rate_inr_m2": 150000,
                        "property_tax_inr": 92000,
                        "registration_date": "14-MAR-2023",
                        "bbox_local": [
                            [round(cx - w / 2.0 + 0.3, 2), round(floor_y - 0.75, 2), round(cz - d / 2.0 + 0.3, 2)],
                            [round(cx + w / 2.0 - 0.3, 2), round(floor_y + 0.75, 2), round(cz + d / 2.0 - 0.3, 2)]
                        ],
                        "centroid_local": [cx, cz, round(floor_y, 2)],
                        "dimensions": [round(w - 0.6, 2), round(d - 0.6, 2), 1.5],
                        "violation": {"has_violation": False, "type": "NONE"}
                    })
                else:
                    for f_letter, ox, oz, fw, fd, f_type, area, vol in flat_cfgs:
                        flat_no = f"{fl}{f_letter}"
                        u_id = f"{b_code}-{flat_no}"
                        ulpin = f"IND280145987621-{b_code}-L{fl:02d}-{flat_no}"
                        owner = CITIZENS[(o_idx * 7 + fl * 3 + ord(f_letter)) % len(CITIZENS)]
                        enc = random.choice(ENCUMBRANCES)

                        has_viol = (b_idx == 5 and fl == 4 and f_letter == "B")
                        viol_info = {
                            "has_violation": has_viol,
                            "type": "UNAUTHORIZED_BALCONY_EXTENSION" if has_viol else "NONE",
                            "excess_volume_m3": 14.5 if has_viol else 0.0,
                            "penalty_inr": 125000 if has_viol else 0
                        }

                        units.append({
                            "unit_id": u_id,
                            "ulpin_3d": ulpin,
                            "name": f"Flat {flat_no} ({f_type}), {b_name}",
                            "complex": b["complex"],
                            "type": f"Residential {f_type}",
                            "domain": "R",
                            "level": fl,
                            "zone": zone,
                            "floor_type": "APARTMENT",
                            "owner": owner["name"],
                            "owner_details": owner,
                            "carpet_area_m2": area,
                            "rera_volume_m3": vol,
                            "volume_m3": vol + (14.5 if has_viol else 0.0),
                            "encumbrance": enc["status"],
                            "mortgage_bank": enc["bank"],
                            "circle_rate_inr_m2": 118000,
                            "property_tax_inr": round(area * 185),
                            "registration_date": "10-JUN-2022",
                            "bbox_local": [
                                [round(cx + ox - fw / 2.0, 2), round(floor_y - 0.7, 2), round(cz + oz - fd / 2.0, 2)],
                                [round(cx + ox + fw / 2.0, 2), round(floor_y + 0.7, 2), round(cz + oz + fd / 2.0, 2)]
                            ],
                            "centroid_local": [round(cx + ox, 2), round(cz + oz, 2), round(floor_y, 2)],
                            "dimensions": [round(fw, 2), round(fd, 2), 1.4],
                            "violation": viol_info
                        })
        elif domain == "C":
            for fl in range(1, floors + 1):
                floor_y = (fl - 1) * 2.2 + 1.1
                u_id = f"{b_code}-L{fl:02d}"
                ulpin = f"IND280145987621-{b_code}-L{fl:02d}"
                owner_corp = CORPORATES[(o_idx + fl) % len(CORPORATES)]

                units.append({
                    "unit_id": u_id,
                    "ulpin_3d": ulpin,
                    "name": f"Level {fl} Corporate Office, {b_name}",
                    "complex": b["complex"],
                    "type": "Corporate Office Suite",
                    "domain": "C",
                    "level": fl,
                    "zone": zone,
                    "floor_type": "OFFICE",
                    "owner": owner_corp,
                    "owner_details": {"name": owner_corp, "category": "Corporate Entity"},
                    "carpet_area_m2": round(w * d * 4.0, 1),
                    "rera_volume_m3": round(w * d * 10.0, 1),
                    "volume_m3": round(w * d * 10.0, 1),
                    "encumbrance": "Clear & Freehold",
                    "mortgage_bank": None,
                    "circle_rate_inr_m2": 245000,
                    "property_tax_inr": 280000,
                    "registration_date": "10-JAN-2020",
                    "bbox_local": [
                        [round(cx - w / 2.0, 2), round(floor_y - 1.0, 2), round(cz - d / 2.0, 2)],
                        [round(cx + w / 2.0, 2), round(floor_y + 1.0, 2), round(cz + d / 2.0, 2)]
                    ],
                    "centroid_local": [cx, cz, round(floor_y, 2)],
                    "dimensions": [round(w, 2), round(d, 2), 2.0],
                    "violation": {"has_violation": False, "type": "NONE"}
                })
        else:
            for fl in range(1, floors + 1):
                floor_y = (fl - 1) * 2.0 + 1.0
                u_id = f"{b_code}-L{fl}"
                ulpin = f"IND280145987621-{b_code}-L0{fl}"
                owner = CITIZENS[o_idx % len(CITIZENS)]
                enc = random.choice(ENCUMBRANCES)

                units.append({
                    "unit_id": u_id,
                    "ulpin_3d": ulpin,
                    "name": f"Floor {fl} Dwelling, {b_name}",
                    "complex": b["complex"],
                    "type": "Urban Residence",
                    "domain": "R",
                    "level": fl,
                    "zone": zone,
                    "floor_type": "INDEPENDENT_FLOOR",
                    "owner": owner["name"],
                    "owner_details": owner,
                    "carpet_area_m2": round(w * d * 3.6, 1),
                    "rera_volume_m3": round(w * d * 10.5, 1),
                    "volume_m3": round(w * d * 10.5, 1),
                    "encumbrance": enc["status"],
                    "mortgage_bank": enc["bank"],
                    "circle_rate_inr_m2": 145000,
                    "property_tax_inr": 42000,
                    "registration_date": "18-FEB-2021",
                    "bbox_local": [
                        [round(cx - w / 2.0, 2), round(floor_y - 0.95, 2), round(cz - d / 2.0, 2)],
                        [round(cx + w / 2.0, 2), round(floor_y + 0.95, 2), round(cz + d / 2.0, 2)]
                    ],
                    "centroid_local": [cx, cz, round(floor_y, 2)],
                    "dimensions": [round(w, 2), round(d, 2), 1.9],
                    "violation": {"has_violation": False, "type": "NONE"}
                })

    # Subsurface Corridor
    subsurface = [
        {
            "unit_id": "DMRC-METRO-TUBE-SEC10",
            "ulpin_3d": "IND280145987621-SUB-DMRC-TUBE",
            "name": "DMRC Blue Line Metro Transit Tunnel Tube",
            "complex": "Delhi Metro Rail Corporation Infrastructure",
            "type": "Subsurface Metro Transit Corridor",
            "domain": "U",
            "level": -2,
            "zone": "ZONE_5_SUBSURFACE",
            "floor_type": "METRO_TUNNEL",
            "owner": "Delhi Metro Rail Corporation (DMRC)",
            "owner_details": {"name": "Delhi Metro Rail Corporation", "category": "Statutory Authority"},
            "carpet_area_m2": 4500.0,
            "rera_volume_m3": 18500.0,
            "volume_m3": 18500.0,
            "encumbrance": "Public Transport Statutory Easement",
            "mortgage_bank": None,
            "circle_rate_inr_m2": 0,
            "property_tax_inr": 0,
            "registration_date": "24-OCT-2017",
            "bbox_local": [[-110.0, -6.8, -110.0], [110.0, -4.6, 110.0]],
            "centroid_local": [0, 0, -5.7],
            "dimensions": [6.2, 220.0, 2.2],
            "violation": {"has_violation": False, "type": "NONE"}
        },
        {
            "unit_id": "BSES-11KV-POWER-TRUNK",
            "ulpin_3d": "IND280145987621-SUB-BSES-11KV",
            "name": "BSES 11kV Subterranean Power Trunk Conduit",
            "complex": "Power Distribution Infrastructure",
            "type": "Subsurface High-Voltage Utility",
            "domain": "U",
            "level": -1,
            "zone": "ZONE_5_SUBSURFACE",
            "floor_type": "POWER_CONDUIT",
            "owner": "BSES Rajdhani Power Limited",
            "owner_details": {"name": "BSES Rajdhani Power Limited", "category": "Utility Discom"},
            "carpet_area_m2": 850.0,
            "rera_volume_m3": 2400.0,
            "volume_m3": 2400.0,
            "encumbrance": "Subsurface Energy Conveyance Right",
            "mortgage_bank": None,
            "circle_rate_inr_m2": 0,
            "property_tax_inr": 0,
            "registration_date": "12-MAR-2018",
            "bbox_local": [[-110.0, -3.2, -110.0], [110.0, -2.0, 110.0]],
            "centroid_local": [4.9, 0, -2.6],
            "dimensions": [2.0, 220.0, 1.2],
            "violation": {"has_violation": False, "type": "NONE"}
        }
    ]
    units.extend(subsurface)

    master_cadastre = {
        "metadata": {
            "version": "9.0.0",
            "standard": "ISO 19152:2024 LADM Part 2",
            "datasource": "Ultra-Dense Indian Metropolis (Mumbai & Delhi Skyline Model)",
            "parcel_id": "DL-DWR-SEC10-07",
            "society_name": "Delhi-Mumbai Ultra-Dense Metropolis Digital Twin",
            "state": "Delhi / Maharashtra",
            "district": "Metropolitan Sub-Division",
            "total_buildings": len(buildings),
            "total_units": len(units),
            "crs": "EPSG:4326 (WGS84) + EPSG:2193 (LiDAR Source)",
            "datum_elevation_msl": 215.0,
            "volumetric_tolerance_m": 0.02
        },
        "zones": [
            {
                "id": "ZONE_1_HIGHRISE",
                "name": "Metropolitan High-Rise Towers & Skyscrapers",
                "description": "High-density residential skyscrapers and tower blocks",
                "centroid": [-40, 20, 40]
            },
            {
                "id": "ZONE_2_PLOTTED",
                "name": "Urban Village Abadi & Residential Blocks",
                "description": "Dense residential dwellings along access galis and lanes",
                "centroid": [40, 10, 40]
            },
            {
                "id": "ZONE_3_COMMERCIAL",
                "name": "Downtown Cyber Tech & Commercial Hub",
                "description": "Central skyscraper, corporate plazas, and trade suites",
                "centroid": [0, 20, -10]
            },
            {
                "id": "ZONE_4_CIVIC",
                "name": "Civic & Governance Infrastructure",
                "description": "Hospitals, police stations, libraries, and public utilities",
                "centroid": [-40, 12, -40]
            },
            {
                "id": "ZONE_5_SUBSURFACE",
                "name": "Subsurface Transit & Utility Corridor",
                "description": "DMRC Blue Line tunnel tube and 11kV subterranean conduits",
                "centroid": [0, -5, 0]
            }
        ],
        "units": units
    }

    society_out_path = r"d:\sih\frontend\src\data\societyData.json"
    with open(society_out_path, "w", encoding="utf-8") as f:
        json.dump(master_cadastre, f, indent=2)

    print(f"=================================================================")
    print(f"SUCCESS: Generated Ultra-Dense Metropolis Cadastre with {len(buildings)} Buildings!")
    print(f"Total Volumetric Units: {len(units)}")
    print(f"Saved to: {society_out_path}")
    print(f"=================================================================")

if __name__ == "__main__":
    generate_ultra_dense_indian_city()

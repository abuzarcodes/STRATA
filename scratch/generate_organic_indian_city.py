import json
import math
import random
import os

def generate_organic_indian_city():
    print("=================================================================")
    print("STRATA: Generating Organic Expanded Indian City Digital Twin")
    print("=================================================================")

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
        {"name": "Rudhraa Tyagi", "aadhaar": "XXXX-XXXX-2950", "pan": "LMNPQ5678X", "phone": "+91 98282 34567"},
        {"name": "Kavita Krishnamurthy", "aadhaar": "XXXX-XXXX-9102", "pan": "MNPQR1234Z", "phone": "+91 98293 45678"},
        {"name": "Rohan Mehra", "aadhaar": "XXXX-XXXX-3412", "pan": "PQRST5678A", "phone": "+91 98304 56789"},
        {"name": "Pooja Hegde", "aadhaar": "XXXX-XXXX-7821", "pan": "STUVW9012B", "phone": "+91 98315 67890"}
    ]

    CORPORATES = [
        "DLF CyberCity Real Estate Ltd",
        "Max Healthcare Institute Ltd",
        "Delhi Police Headquarters (Dwarka Sub-Division)",
        "DMRC Metro Rail Corporation",
        "State Bank of India Corporate Assets",
        "HDFC Asset Management Trust",
        "Infosys Innovation Campus",
        "Delhi Public Library Trust"
    ]

    ENCUMBRANCES = [
        {"status": "Clear & Freehold", "bank": None},
        {"status": "Clear & Freehold", "bank": None},
        {"status": "Mortgaged to State Bank of India", "bank": "State Bank of India (Dwarka Branch)"},
        {"status": "Mortgaged to HDFC Bank Ltd", "bank": "HDFC Bank (Sector 10 Branch)"},
        {"status": "Mortgaged to ICICI Bank Ltd", "bank": "ICICI Bank (Sector 6 Branch)"}
    ]

    # Sample LiDAR point cloud across expanded 240m x 240m map
    lidar_points_data = []
    for _ in range(45000):
        rx = random.uniform(-110, 110)
        rz = random.uniform(-110, 110)
        ry = random.uniform(0, 24)
        lidar_points_data.append({
            "pos": [round(rx, 2), round(ry, 2), round(rz, 2)],
            "intensity": round(random.uniform(0.1, 1.0), 3),
            "elevation": round(ry * 4.5 + 215.0, 2)
        })

    with open(r"d:\sih\frontend\src\data\lidarPoints.json", "w", encoding="utf-8") as f:
        json.dump(lidar_points_data, f)
    print(f"Saved {len(lidar_points_data):,} LiDAR points across expanded 240m canvas.")

    units = []

    # -------------------------------------------------------------------------
    # DENSE ORGANIC UNSTRUCTURED BUILDING LAYOUT (82 Buildings across [-100, 100])
    # -------------------------------------------------------------------------
    buildings = []

    # 1. Khurrampur Urban Village Cluster (Organic Densely Packed Abadi Houses)
    village_names = [
        "Ansh's Home (Khurrampur Marg)", "Ayush's Home (Gali 2)", "Rudhraa Tyagi's House",
        "Lucky Jewellers & Residence", "Choudhary Urban Market", "Sharma Nivas",
        "Verma Homestead", "Deepak Joshi Ancestral Property", "Malhotra Villa",
        "Reddy Residence", "Rao Sadan", "Singhania Bhawan", "Nambiar House",
        "Desai Corner Plot", "Chawla Cottage", "Krishnamurthy Villa", "Mehra Residence",
        "Hegde House", "Kapoor Bhawan", "Gupta Store & Residence"
    ]

    # Generate 32 organic village plots along curved Khurrampur Marg
    random.seed(42)
    for i in range(32):
        angle = random.uniform(0, 2 * math.pi)
        dist = random.uniform(15, 95)
        cx = round(math.cos(angle) * dist, 1)
        cz = round(math.sin(angle) * dist, 1)
        w = round(random.uniform(5.2, 7.5), 1)
        d = round(random.uniform(5.0, 7.0), 1)
        rot = random.choice([0, 12, -18, 25, -30, 45, -10])
        floors = random.choice([2, 3, 4])
        
        name = village_names[i % len(village_names)]
        if i >= len(village_names):
            name += f" Annexe #{i+1}"
            
        buildings.append({
            "code": f"VIL{i+1:02d}",
            "name": name,
            "complex": "Khurrampur Urban Village",
            "zone": "ZONE_2_PLOTTED",
            "domain": "R",
            "cx": cx, "cz": cz, "w": w, "d": d, "rot": rot,
            "floors": floors, "owner_idx": i
        })

    # 2. High-Rise Residential Towers (Staggered across sector)
    tower_names = [
        "Emerald Heights Tower A", "Emerald Heights Tower B (L-Wing)", "Emerald Heights Tower C",
        "Silver Oak Signature Tower", "Silver Oak Tower 2", "Silver Oak Tower 3",
        "Maple Woods High-Rise 1", "Maple Woods High-Rise 2", "Maple Woods Club Tower",
        "Palm Crest Sky Villa Tower", "Cyber Heights Residency 1", "Cyber Heights Residency 2",
        "Skyline Imperial Tower", "Prestige Horizon Tower", "Royal Palm Heights"
    ]

    tower_locs = [
        (-85, 45, 16), (-68, 60, 20), (-50, 78, 14), (-90, 10, 22), (-72, -15, 18),
        (-55, -45, 15), (-35, 85, 17), (-15, 92, 19), (15, 88, 12), (45, 85, 24),
        (-80, -75, 16), (-60, -90, 14), (-25, -85, 18), (65, 75, 21), (85, 60, 20)
    ]

    for i, (cx, cz, floors) in enumerate(tower_locs):
        buildings.append({
            "code": f"T{i+1:02d}",
            "name": tower_names[i % len(tower_names)],
            "complex": "High-Rise Master Enclave",
            "zone": "ZONE_1_HIGHRISE",
            "domain": "R",
            "cx": cx, "cz": cz,
            "w": round(random.uniform(9.0, 11.5), 1),
            "d": round(random.uniform(8.5, 10.5), 1),
            "rot": random.choice([0, 15, -20, 30]),
            "floors": floors, "owner_idx": i + 5
        })

    # 3. Commercial & Tech Plazas
    comm_names = [
        "Cyber Tower Alpha (Glass Facade)", "Cyber Tower Beta", "Apex Financial Plaza",
        "Infosys Innovation Center", "One Cyber Hub Multi-Deck", "Vanguard Corporate Suites",
        "Dwarka Trade & Expo Center", "Tech Park Executive Annexe", "DLF Galleria Plaza",
        "Global Business Park Block A", "Global Business Park Block B", "Max Corporate Suites"
    ]

    comm_locs = [
        (45, -35, 10), (62, -25, 8), (80, -40, 12), (35, -60, 7), (55, -70, 6),
        (78, -65, 9), (92, -30, 5), (68, -90, 8), (25, -92, 6), (88, -85, 11)
    ]

    for i, (cx, cz, floors) in enumerate(comm_locs):
        buildings.append({
            "code": f"C{i+1:02d}",
            "name": comm_names[i % len(comm_names)],
            "complex": "Cyber Heights Tech Park",
            "zone": "ZONE_3_COMMERCIAL",
            "domain": "C",
            "cx": cx, "cz": cz,
            "w": round(random.uniform(10.0, 13.0), 1),
            "d": round(random.uniform(9.0, 11.0), 1),
            "rot": random.choice([0, -15, 25, -40]),
            "floors": floors, "owner_idx": i + 2
        })

    # 4. Civic & Public Infrastructure
    civic_specs = [
        ("CIV01", "Max Super Speciality Hospital Main Wing", -25, -35, 14.0, 11.0, 6, "Hospital"),
        ("CIV01B", "Hospital Emergency & Trauma Pavilion", -10, -45, 11.0, 8.0, 3, "Trauma Center"),
        ("CIV02", "Dwarka Sub-District Police Station", -45, -20, 11.0, 9.0, 3, "Police Precinct"),
        ("CIV03", "Delhi Public Library & Cultural Center", -15, 25, 12.0, 10.0, 4, "Public Library"),
        ("CIV04", "Dwarka Sub-Divisional Magistrate Court", 20, -35, 13.0, 9.0, 3, "Revenue Court"),
        ("CIV05", "BSES Power Distribution Substation", -50, 30, 10.0, 8.0, 2, "Power Substation"),
        ("CIV06", "Fire & Emergency Response Station 10", 30, 35, 11.0, 8.5, 3, "Fire Station"),
        ("CIV07", "Dwarka Civil Sports Complex", -70, -20, 15.0, 12.0, 3, "Sports Complex")
    ]

    for c_id, c_name, cx, cz, w, d, floors, c_type in civic_specs:
        buildings.append({
            "code": c_id,
            "name": c_name,
            "complex": "Civic & Governance Infrastructure",
            "zone": "ZONE_4_CIVIC",
            "domain": "G",
            "cx": cx, "cz": cz, "w": w, "d": d, "rot": 0,
            "floors": floors, "owner_idx": 0
        })

    # -------------------------------------------------------------------------
    # GENERATE 3D VOLUMETRIC UNITS
    # -------------------------------------------------------------------------
    for b_idx, b in enumerate(buildings):
        b_code = b["code"]
        b_name = b["name"]
        cx, cz = b["cx"], b["cz"]
        w, d = b["w"], b["d"]
        floors = b["floors"]
        zone = b["zone"]
        domain = b["domain"]
        o_idx = b["owner_idx"]

        if floors >= 4 and domain == "R":
            # Multi-apartment residential tower
            flat_cfgs = [
                ("A", -w * 0.24, -d * 0.24, w * 0.46, d * 0.46, "3BHK Luxury", 140.0, 405.0),
                ("B", w * 0.24, -d * 0.24, w * 0.46, d * 0.46, "2BHK Premium", 90.0, 262.0),
                ("C", -w * 0.24, d * 0.24, w * 0.46, d * 0.46, "3BHK Deluxe", 136.0, 390.0),
                ("D", w * 0.24, d * 0.24, w * 0.46, d * 0.46, "2BHK Compact", 85.0, 246.0),
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

                        if b_idx == 32 and fl == 4 and f_letter == "A":
                            owner = CITIZENS[0] # Deepak Joshi
                            enc = {"status": "Clear & Freehold", "bank": None}
                        elif b_idx == 32 and fl == 10 and f_letter == "C":
                            owner = CITIZENS[0] # Deepak Joshi
                            enc = {"status": "Mortgaged to State Bank of India", "bank": "State Bank of India (Dwarka Branch)"}
                        elif b_idx == 33 and fl == 5 and f_letter == "B":
                            owner = CITIZENS[1] # Rajesh Kumar
                            enc = {"status": "Clear & Freehold", "bank": None}
                        elif b_idx == 34 and fl == 8 and f_letter == "A":
                            owner = CITIZENS[2] # Priya Sharma
                            enc = {"status": "Mortgaged to HDFC Bank Ltd", "bank": "HDFC Bank (Sector 10 Branch)"}
                        else:
                            owner = CITIZENS[(o_idx * 7 + fl * 3 + ord(f_letter)) % len(CITIZENS)]
                            enc = random.choice(ENCUMBRANCES)

                        has_viol = (b_idx == 35 and fl == 4 and f_letter == "B")
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
                            "registration_date": f"{(fl*3)%28 + 1:02d}-{(fl*2)%12 + 1:02d}-2022",
                            "bbox_local": [
                                [round(cx + ox - fw / 2.0, 2), round(floor_y - 0.7, 2), round(cz + oz - fd / 2.0, 2)],
                                [round(cx + ox + fw / 2.0, 2), round(floor_y + 0.7, 2), round(cz + oz + fd / 2.0, 2)]
                            ],
                            "centroid_local": [round(cx + ox, 2), round(cz + oz, 2), round(floor_y, 2)],
                            "dimensions": [round(fw, 2), round(fd, 2), 1.4],
                            "violation": viol_info
                        })
        elif domain == "C":
            # Commercial corporate tower
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
            # Low-rise abadi villa or civic facility
            for fl in range(1, floors + 1):
                floor_y = (fl - 1) * 2.0 + 1.0
                u_id = f"{b_code}-L{fl}"
                ulpin = f"IND280145987621-{b_code}-L0{fl}"
                
                if domain == "G":
                    owner = {"name": "Govt of NCT of Delhi", "category": "Government Dept"}
                    enc = {"status": "Government Statutory Reserve (Non-Alienated)", "bank": None}
                else:
                    owner = CITIZENS[o_idx % len(CITIZENS)]
                    enc = random.choice(ENCUMBRANCES)

                is_ground_retail = (fl == 1 and ("Market" in b_name or "Jewellers" in b_name or "Store" in b_name))

                units.append({
                    "unit_id": u_id,
                    "ulpin_3d": ulpin,
                    "name": f"{'Ground Retail Shop' if is_ground_retail else f'Floor {fl} Residence'}, {b_name}",
                    "complex": b["complex"],
                    "type": "Civic Facility" if domain == "G" else ("Retail Shop" if is_ground_retail else "Urban Village Residence"),
                    "domain": domain,
                    "level": fl,
                    "zone": zone,
                    "floor_type": "CIVIC" if domain == "G" else ("RETAIL" if is_ground_retail else "INDEPENDENT_FLOOR"),
                    "owner": owner["name"],
                    "owner_details": owner,
                    "carpet_area_m2": round(w * d * 3.6, 1),
                    "rera_volume_m3": round(w * d * 10.5, 1),
                    "volume_m3": round(w * d * 10.5, 1),
                    "encumbrance": enc["status"],
                    "mortgage_bank": enc["bank"],
                    "circle_rate_inr_m2": 0 if domain == "G" else 145000,
                    "property_tax_inr": 0 if domain == "G" else 45000,
                    "registration_date": "18-FEB-2021",
                    "bbox_local": [
                        [round(cx - w / 2.0, 2), round(floor_y - 0.95, 2), round(cz - d / 2.0, 2)],
                        [round(cx + w / 2.0, 2), round(floor_y + 0.95, 2), round(cz + d / 2.0, 2)]
                    ],
                    "centroid_local": [cx, cz, round(floor_y, 2)],
                    "dimensions": [round(w, 2), round(d, 2), 1.9],
                    "violation": {"has_violation": False, "type": "NONE"}
                })

    # Subsurface Metro & Utilities Corridor (Curved alignment across expanded canvas)
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
            "version": "8.0.0",
            "standard": "ISO 19152:2024 LADM Part 2",
            "datasource": "Organic Expanded Indian City (Khurrampur Abadi + Dwarka Sector Twin)",
            "parcel_id": "DL-DWR-SEC10-07",
            "society_name": "Delhi Expanded Organic Digital Twin (Khurrampur & Dwarka)",
            "state": "Delhi (NCT)",
            "district": "South West Delhi",
            "sub_division": "Dwarka",
            "total_buildings": len(buildings),
            "total_units": len(units),
            "crs": "EPSG:4326 (WGS84) + EPSG:2193 (LiDAR Source)",
            "datum_elevation_msl": 215.0,
            "volumetric_tolerance_m": 0.02
        },
        "zones": [
            {
                "id": "ZONE_1_HIGHRISE",
                "name": "High-Rise Residential Sector (Staggered Towers)",
                "description": "Multi-apartment high-density residential towers",
                "centroid": [-60, 16, 45]
            },
            {
                "id": "ZONE_2_PLOTTED",
                "name": "Khurrampur Organic Urban Village (Abadi Settlement)",
                "description": "Dense organic low-rise residential & commercial shops along Khurrampur Marg",
                "centroid": [35, 10, 35]
            },
            {
                "id": "ZONE_3_COMMERCIAL",
                "name": "Cyber Heights Commercial & Tech Park",
                "description": "Retail showrooms and corporate tech park towers",
                "centroid": [60, 14, -60]
            },
            {
                "id": "ZONE_4_CIVIC",
                "name": "Civic & Healthcare Campus (Max Hospital & SDM Court)",
                "description": "Hospitals, police stations, libraries, and public utilities",
                "centroid": [-30, 12, -45]
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
    print(f"SUCCESS: Generated Organic Expanded City Cadastre!")
    print(f"Total Organic Buildings: {len(buildings)}")
    print(f"Total Volumetric Units: {len(units)}")
    print(f"Saved to: {society_out_path}")
    print(f"=================================================================")

if __name__ == "__main__":
    generate_organic_indian_city()

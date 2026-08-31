import json
import math
import random
import os

def generate_hybrid_indian_cadastre():
    print("=================================================================")
    print("STRATA: Generating Hybrid Indian Urban Cadastre (Delhi Architecture)")
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
        {"name": "Rudhraa Tyagi", "aadhaar": "XXXX-XXXX-2950", "pan": "LMNPQ5678X", "phone": "+91 98282 34567"}
    ]

    CORPORATES = [
        "DLF CyberCity Real Estate Ltd",
        "Max Healthcare Institute Ltd",
        "Delhi Police Headquarters (Dwarka Sub-Division)",
        "DMRC Metro Rail Corporation",
        "State Bank of India Corporate Assets",
        "HDFC Asset Management Trust"
    ]

    ENCUMBRANCES = [
        {"status": "Clear & Freehold", "bank": None},
        {"status": "Clear & Freehold", "bank": None},
        {"status": "Mortgaged to State Bank of India", "bank": "State Bank of India (Dwarka Branch)"},
        {"status": "Mortgaged to HDFC Bank Ltd", "bank": "HDFC Bank (Sector 10 Branch)"}
    ]

    units = []
    building_specs = []

    # -------------------------------------------------------------------------
    # REGION A: URBAN VILLAGE / ABADI COLONY ("Khurrampur & Dwarka Village")
    # Organic non-grid cluster, narrow alleys, 0m setbacks, G+2/G+3/G+4 structures
    # Position: X in [12, 48], Z in [12, 48]
    # -------------------------------------------------------------------------
    village_plots = [
        # (ID, Name, cx, cz, w, d, floors, owner_idx)
        ("VIL01", "Ansh's Home (Khurrampur Marg)", 16.0, 16.0, 5.5, 6.2, 3, 9),
        ("VIL02", "Ayush's Home (Gali No. 2)", 23.5, 15.5, 5.0, 5.8, 4, 10),
        ("VIL03", "Rudhraa Tyagi's House", 31.0, 16.5, 6.2, 5.5, 3, 11),
        ("VIL04", "Lucky Jewellers & Residence (Ground Commercial)", 38.5, 16.0, 6.5, 6.0, 3, 0),
        ("VIL05", "Choudhary Urban Market Complex", 46.0, 17.0, 7.0, 6.5, 4, 1),
        
        ("VIL06", "Sharma Nivas (Gali No. 3)", 15.5, 24.5, 5.8, 5.2, 3, 2),
        ("VIL07", "Verma Homestead", 23.0, 24.0, 5.2, 6.0, 2, 5),
        ("VIL08", "Deepak Joshi Ancestral Property", 30.5, 25.0, 6.5, 5.8, 4, 0),
        ("VIL09", "Malhotra Villa", 38.0, 24.5, 5.5, 6.2, 3, 3),
        ("VIL10", "Reddy Residence", 45.5, 25.5, 6.0, 5.5, 3, 4),

        ("VIL11", "Rao Sadan (Gali No. 4)", 16.5, 33.0, 5.2, 5.5, 3, 6),
        ("VIL12", "Singhania Bhawan", 24.0, 32.5, 6.0, 6.2, 4, 7),
        ("VIL13", "Nambiar House", 31.5, 33.5, 5.5, 5.0, 2, 8),
        ("VIL14", "Desai Corner Plot", 39.0, 33.0, 6.8, 6.5, 3, 9),
        ("VIL15", "Khurrampur Community Center", 46.5, 34.0, 7.5, 7.0, 3, 10),

        ("VIL16", "Chawla Cottage", 20.0, 42.0, 5.5, 5.8, 3, 11),
        ("VIL17", "Krishnamurthy Villa", 28.0, 41.5, 6.0, 6.0, 3, 1),
        ("VIL18", "Mehra Residence", 36.0, 42.5, 5.8, 5.2, 2, 2),
        ("VIL19", "Hegde House", 44.0, 42.0, 6.2, 6.5, 3, 3)
    ]

    for p_id, p_name, cx, cz, w, d, floors, o_idx in village_plots:
        owner = CITIZENS[o_idx % len(CITIZENS)]
        for fl in range(1, floors + 1):
            floor_y = (fl - 1) * 2.0 + 1.0
            u_id = f"{p_id}-L{fl}"
            ulpin = f"IND280145987621-{p_id}-L0{fl}"
            enc = random.choice(ENCUMBRANCES)

            # Ground floor commercial shop for market plots
            is_ground_retail = (fl == 1 and ("Market" in p_name or "Jewellers" in p_name))

            units.append({
                "unit_id": u_id,
                "ulpin_3d": ulpin,
                "name": f"{'Ground Retail Shop' if is_ground_retail else f'Floor {fl} Family Title'}, {p_name}",
                "complex": "Khurrampur Urban Village",
                "type": "Commercial Retail Shop" if is_ground_retail else "Urban Village Residence",
                "domain": "C" if is_ground_retail else "R",
                "level": fl,
                "zone": "ZONE_2_PLOTTED",
                "floor_type": "RETAIL" if is_ground_retail else "INDEPENDENT_FLOOR",
                "owner": owner["name"],
                "owner_details": owner,
                "carpet_area_m2": round(w * d * 3.6, 1),
                "rera_volume_m3": round(w * d * 10.5, 1),
                "volume_m3": round(w * d * 10.5, 1),
                "encumbrance": enc["status"],
                "mortgage_bank": enc["bank"],
                "circle_rate_inr_m2": 145000,
                "property_tax_inr": round(w * d * 65),
                "registration_date": "18-FEB-2021",
                "bbox_local": [
                    [round(cx - w / 2.0, 2), round(floor_y - 0.95, 2), round(cz - d / 2.0, 2)],
                    [round(cx + w / 2.0, 2), round(floor_y + 0.95, 2), round(cz + d / 2.0, 2)]
                ],
                "centroid_local": [cx, cz, round(floor_y, 2)],
                "dimensions": [round(w, 2), round(d, 2), 1.9],
                "violation": {"has_violation": False, "type": "NONE"}
            })

    # -------------------------------------------------------------------------
    # REGION B: PLANNED HIGH-RISE SECTOR ("Dwarka Sector 10 High-Rise Enclave")
    # Staggered towers, 12 to 24 storeys, 4 flats per floor, penthouses
    # Position: X in [-48, -14], Z in [14, 48]
    # -------------------------------------------------------------------------
    towers = [
        ("T01", "Emerald Heights Tower A", -42.0, 16.0, 10.0, 8.5, 16),
        ("T02", "Emerald Heights Tower B (L-Wing)", -28.0, 15.0, 9.0, 9.0, 20),
        ("T03", "Emerald Heights Tower C", -14.0, 17.0, 8.5, 8.0, 14),
        ("T04", "Silver Oak Signature Tower", -44.0, 29.0, 11.0, 9.5, 22),
        ("T05", "Silver Oak Tower 2", -30.0, 28.0, 8.5, 8.5, 18),
        ("T06", "Silver Oak Tower 3", -16.0, 30.0, 8.0, 8.0, 12),
        ("T07", "Maple Woods High-Rise 1", -42.0, 42.0, 9.5, 8.5, 15),
        ("T08", "Maple Woods High-Rise 2", -28.0, 41.0, 8.5, 8.5, 17),
        ("T09", "Palm Crest Sky Villa Tower", -14.0, 43.0, 9.0, 9.0, 24)
    ]

    for t_idx, (t_id, t_name, bx, bz, bw, bd, floors) in enumerate(towers):
        flat_configs = [
            ("A", -bw * 0.24, -bd * 0.24, bw * 0.46, bd * 0.46, "3BHK Luxury", 140.0, 405.0),
            ("B", bw * 0.24, -bd * 0.24, bw * 0.46, bd * 0.46, "2BHK Premium", 90.0, 262.0),
            ("C", -bw * 0.24, bd * 0.24, bw * 0.46, bd * 0.46, "3BHK Deluxe", 136.0, 390.0),
            ("D", bw * 0.24, bd * 0.24, bw * 0.46, bd * 0.46, "2BHK Compact", 85.0, 246.0),
        ]

        for fl in range(1, floors + 1):
            floor_y = (fl - 1) * 1.5 + 0.75

            if fl == floors:
                pent_owner = CITIZENS[(t_idx * 3 + fl) % len(CITIZENS)]
                enc = random.choice(ENCUMBRANCES)
                u_id = f"{t_id}-{fl}01"
                ulpin = f"IND280145987621-{t_id}-L{fl:02d}-PENT"
                units.append({
                    "unit_id": u_id,
                    "ulpin_3d": ulpin,
                    "name": f"Penthouse {fl}01, {t_name}",
                    "complex": "Emerald & Silver Oak Enclave",
                    "type": "Residential Sky Penthouse",
                    "domain": "R",
                    "level": fl,
                    "zone": "ZONE_1_HIGHRISE",
                    "floor_type": "PENTHOUSE",
                    "owner": pent_owner["name"],
                    "owner_details": pent_owner,
                    "carpet_area_m2": round(bw * bd * 3.8, 1),
                    "rera_volume_m3": round(bw * bd * 11.5, 1),
                    "volume_m3": round(bw * bd * 11.5, 1),
                    "encumbrance": enc["status"],
                    "mortgage_bank": enc["bank"],
                    "circle_rate_inr_m2": 150000,
                    "property_tax_inr": 92000,
                    "registration_date": "14-MAR-2023",
                    "bbox_local": [
                        [round(bx - bw / 2.0 + 0.3, 2), round(floor_y - 0.75, 2), round(bz - bd / 2.0 + 0.3, 2)],
                        [round(bx + bw / 2.0 - 0.3, 2), round(floor_y + 0.75, 2), round(bz + bd / 2.0 - 0.3, 2)]
                    ],
                    "centroid_local": [bx, bz, round(floor_y, 2)],
                    "dimensions": [round(bw - 0.6, 2), round(bd - 0.6, 2), 1.5],
                    "violation": {"has_violation": False, "type": "NONE"}
                })
            else:
                for f_letter, ox, oz, fw, fd, f_type, area, vol in flat_configs:
                    flat_no = f"{fl}{f_letter}"
                    u_id = f"{t_id}-{flat_no}"
                    ulpin = f"IND280145987621-{t_id}-L{fl:02d}-{flat_no}"

                    if t_idx == 0 and fl == 4 and f_letter == "A":
                        owner = CITIZENS[0] # Deepak Joshi
                        enc = {"status": "Clear & Freehold", "bank": None}
                    elif t_idx == 0 and fl == 10 and f_letter == "C":
                        owner = CITIZENS[0] # Deepak Joshi
                        enc = {"status": "Mortgaged to State Bank of India", "bank": "State Bank of India (Dwarka Branch)"}
                    elif t_idx == 1 and fl == 5 and f_letter == "B":
                        owner = CITIZENS[1] # Rajesh Kumar
                        enc = {"status": "Clear & Freehold", "bank": None}
                    elif t_idx == 2 and fl == 8 and f_letter == "A":
                        owner = CITIZENS[2] # Priya Sharma
                        enc = {"status": "Mortgaged to HDFC Bank Ltd", "bank": "HDFC Bank (Sector 10 Branch)"}
                    else:
                        owner = CITIZENS[(t_idx * 17 + fl * 4 + ord(f_letter)) % len(CITIZENS)]
                        enc = random.choice(ENCUMBRANCES)

                    has_viol = (t_idx == 4 and fl == 4 and f_letter == "B")
                    viol_info = {
                        "has_violation": has_viol,
                        "type": "UNAUTHORIZED_BALCONY_EXTENSION" if has_viol else "NONE",
                        "excess_volume_m3": 14.5 if has_viol else 0.0,
                        "penalty_inr": 125000 if has_viol else 0
                    }

                    units.append({
                        "unit_id": u_id,
                        "ulpin_3d": ulpin,
                        "name": f"Flat {flat_no} ({f_type}), {t_name}",
                        "complex": "Emerald & Silver Oak Enclave",
                        "type": f"Residential {f_type}",
                        "domain": "R",
                        "level": fl,
                        "zone": "ZONE_1_HIGHRISE",
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
                            [round(bx + ox - fw / 2.0, 2), round(floor_y - 0.7, 2), round(bz + oz - fd / 2.0, 2)],
                            [round(bx + ox + fw / 2.0, 2), round(floor_y + 0.7, 2), round(bz + oz + fd / 2.0, 2)]
                        ],
                        "centroid_local": [round(bx + ox, 2), round(bz + oz, 2), round(floor_y, 2)],
                        "dimensions": [round(fw, 2), round(fd, 2), 1.4],
                        "violation": viol_info
                    })

    # -------------------------------------------------------------------------
    # REGION C: CYBER HEIGHTS COMMERCIAL PLAZA (X in [14, 48], Z in [-48, -14])
    # -------------------------------------------------------------------------
    comm_towers = [
        ("C01", "Cyber Tower Alpha (Glass Facade)", 16.0, -16.0, 11.0, 9.5, 10),
        ("C02", "Cyber Tower Beta", 30.0, -15.0, 12.0, 8.5, 8),
        ("C03", "Apex Financial Plaza", 44.0, -17.0, 10.0, 10.0, 12),
        ("C04", "Infosys Innovation Center", 17.0, -30.0, 12.0, 10.0, 7),
        ("C05", "One Cyber Hub Multi-Deck", 31.0, -29.0, 10.5, 9.5, 6),
        ("C06", "Vanguard Corporate Suites", 45.0, -31.0, 9.0, 9.0, 9),
        ("C07", "Dwarka Trade & Expo Center", 23.0, -44.0, 15.0, 9.5, 5),
        ("C08", "Tech Park Executive Annexe", 40.0, -43.0, 10.5, 8.0, 6)
    ]

    for c_id, c_name, bx, bz, bw, bd, floors in comm_towers:
        for fl in range(1, floors + 1):
            floor_y = (fl - 1) * 2.2 + 1.1
            u_id = f"{c_id}-L{fl:02d}"
            ulpin = f"IND280145987621-{c_id}-L{fl:02d}"
            owner_corp = CORPORATES[(ord(c_id[1]) + fl) % len(CORPORATES)]

            units.append({
                "unit_id": u_id,
                "ulpin_3d": ulpin,
                "name": f"Level {fl} Corporate Office, {c_name}",
                "complex": "Cyber Heights Tech Park",
                "type": "Corporate Office Suite",
                "domain": "C",
                "level": fl,
                "zone": "ZONE_3_COMMERCIAL",
                "floor_type": "OFFICE",
                "owner": owner_corp,
                "owner_details": {"name": owner_corp, "category": "Corporate Entity"},
                "carpet_area_m2": round(bw * bd * 4.0, 1),
                "rera_volume_m3": round(bw * bd * 10.0, 1),
                "volume_m3": round(bw * bd * 10.0, 1),
                "encumbrance": "Clear & Freehold",
                "mortgage_bank": None,
                "circle_rate_inr_m2": 245000,
                "property_tax_inr": 280000,
                "registration_date": "10-JAN-2020",
                "bbox_local": [
                    [round(bx - bw / 2.0, 2), round(floor_y - 1.0, 2), round(bz - bd / 2.0, 2)],
                    [round(bx + bw / 2.0, 2), round(floor_y + 1.0, 2), round(bz + bd / 2.0, 2)]
                ],
                "centroid_local": [bx, bz, round(floor_y, 2)],
                "dimensions": [round(bw, 2), round(bd, 2), 2.0],
                "violation": {"has_violation": False, "type": "NONE"}
            })

    # -------------------------------------------------------------------------
    # REGION D: CIVIC & HEALTHCARE CAMPUS (X in [-48, -14], Z in [-48, -14])
    # -------------------------------------------------------------------------
    civic_blocks = [
        ("CIV01", "Max Super Speciality Hospital Main Wing", -18.0, -16.0, 13.0, 10.0, 6, "Hospital"),
        ("CIV01B", "Hospital Emergency & Trauma Pavilion", -18.0, -28.0, 10.0, 7.0, 3, "Trauma Center"),
        ("CIV02", "Dwarka Sub-District Police Station", -36.0, -16.0, 10.5, 8.5, 3, "Police Precinct"),
        ("CIV03", "Delhi Public Library & Cultural Center", -37.0, -29.0, 11.5, 9.5, 4, "Public Library"),
        ("CIV04", "Dwarka Sub-Divisional Magistrate Court", -22.0, -40.0, 12.5, 8.5, 3, "Revenue Court"),
        ("CIV05", "BSES Power Distribution Substation", -40.0, -43.0, 9.5, 7.5, 2, "Power Substation")
    ]

    for c_id, c_name, bx, bz, bw, bd, floors, c_type in civic_blocks:
        for fl in range(1, floors + 1):
            floor_y = (fl - 1) * 2.2 + 1.1
            u_id = f"{c_id}-L{fl:02d}"
            ulpin = f"IND280145987621-{c_id}-L{fl:02d}"

            units.append({
                "unit_id": u_id,
                "ulpin_3d": ulpin,
                "name": f"Level {fl}, {c_name}",
                "complex": "Civic & Healthcare Governance Campus",
                "type": f"Civic {c_type}",
                "domain": "G",
                "level": fl,
                "zone": "ZONE_4_CIVIC",
                "floor_type": "CIVIC",
                "owner": "Govt of NCT of Delhi / Municipal Authority",
                "owner_details": {"name": "Govt of NCT of Delhi", "category": "Government Dept"},
                "carpet_area_m2": round(bw * bd * 4.2, 1),
                "rera_volume_m3": round(bw * bd * 10.5, 1),
                "volume_m3": round(bw * bd * 10.5, 1),
                "encumbrance": "Government Statutory Reserve (Non-Alienated)",
                "mortgage_bank": None,
                "circle_rate_inr_m2": 0,
                "property_tax_inr": 0,
                "registration_date": "15-AUG-2019",
                "bbox_local": [
                    [round(bx - bw / 2.0, 2), round(floor_y - 1.0, 2), round(bz - bd / 2.0, 2)],
                    [round(bx + bw / 2.0, 2), round(floor_y + 1.0, 2), round(bz + bd / 2.0, 2)]
                ],
                "centroid_local": [bx, bz, round(floor_y, 2)],
                "dimensions": [round(bw, 2), round(bd, 2), 2.0],
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
            "carpet_area_m2": 1850.0,
            "rera_volume_m3": 8450.0,
            "volume_m3": 8450.0,
            "encumbrance": "Public Transport Statutory Easement",
            "mortgage_bank": None,
            "circle_rate_inr_m2": 0,
            "property_tax_inr": 0,
            "registration_date": "24-OCT-2017",
            "bbox_local": [[-2.6, -6.8, -50.0], [2.6, -4.6, 50.0]],
            "centroid_local": [0, 0, -5.7],
            "dimensions": [5.2, 100.0, 2.2],
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
            "carpet_area_m2": 260.0,
            "rera_volume_m3": 980.0,
            "volume_m3": 980.0,
            "encumbrance": "Subsurface Energy Conveyance Right",
            "mortgage_bank": None,
            "circle_rate_inr_m2": 0,
            "property_tax_inr": 0,
            "registration_date": "12-MAR-2018",
            "bbox_local": [[4.2, -3.2, -50.0], [5.6, -2.0, 50.0]],
            "centroid_local": [4.9, 0, -2.6],
            "dimensions": [1.4, 100.0, 1.2],
            "violation": {"has_violation": False, "type": "NONE"}
        }
    ]
    units.extend(subsurface)

    master_cadastre = {
        "metadata": {
            "version": "7.0.0",
            "standard": "ISO 19152:2024 LADM Part 2",
            "datasource": "Hybrid Real Indian Cadastre (Urban Village + Planned High-Rise)",
            "parcel_id": "DL-DWR-SEC10-07",
            "society_name": "Delhi Urban Hybrid Cadastre (Khurrampur Abadi & Dwarka Sector 10)",
            "state": "Delhi (NCT)",
            "district": "South West Delhi",
            "sub_division": "Dwarka",
            "total_buildings": len(village_plots) + len(towers) + len(comm_towers) + len(civic_blocks),
            "total_units": len(units),
            "crs": "EPSG:4326 (WGS84) + EPSG:2193 (LiDAR Source)",
            "datum_elevation_msl": 215.0,
            "volumetric_tolerance_m": 0.02
        },
        "zones": [
            {
                "id": "ZONE_1_HIGHRISE",
                "name": "High-Rise Residential Sector (Dwarka Master Plan)",
                "description": "Multi-apartment high-density residential towers",
                "centroid": [-28, 16, 28]
            },
            {
                "id": "ZONE_2_PLOTTED",
                "name": "Khurrampur Urban Village / Abadi Colony",
                "description": "Dense organic low-rise residential & commercial shops along Khurrampur Marg",
                "centroid": [28, 10, 28]
            },
            {
                "id": "ZONE_3_COMMERCIAL",
                "name": "Cyber Heights Commercial & Tech Park",
                "description": "Retail showrooms and corporate tech park towers",
                "centroid": [28, 14, -28]
            },
            {
                "id": "ZONE_4_CIVIC",
                "name": "Civic & Healthcare Campus (Max Hospital & SDM Court)",
                "description": "Hospitals, police stations, libraries, and public utilities",
                "centroid": [-28, 12, -28]
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
    print(f"SUCCESS: Generated Hybrid Indian Urban Cadastre!")
    print(f"Total Buildings: {master_cadastre['metadata']['total_buildings']}")
    print(f"Total Multi-Apartment Units: {len(units)}")
    print(f"Saved to: {society_out_path}")
    print(f"=================================================================")

if __name__ == "__main__":
    generate_hybrid_indian_cadastre()

import laspy
import json
import numpy as np
import random
import os

def generate_city_and_lidar():
    print("=================================================================")
    print("STRATA: Large-Scale City Cadastre & LiDAR Integration Pipeline")
    print("=================================================================")

    # -------------------------------------------------------------------------
    # 1. Read & Sample points.laz LiDAR Cloud
    # -------------------------------------------------------------------------
    laz_path = r"D:\sih\points.laz"
    lidar_points_data = []
    
    if os.path.exists(laz_path):
        print(f"Reading LiDAR point cloud from: {laz_path}...")
        with laspy.open(laz_path) as reader:
            total_pts = reader.header.point_count
            print(f"Total LiDAR points in file: {total_pts:,}")
            target_sample = 45000
            step = max(1, total_pts // target_sample)
            
            raw_pts = []
            raw_intensities = []
            
            for chunk in reader.chunk_iterator(1000000):
                indices = np.arange(0, len(chunk), step)
                if len(indices) > 0:
                    xs = chunk.x[indices]
                    ys = chunk.y[indices]
                    zs = chunk.z[indices]
                    intensities = chunk.intensity[indices]
                    
                    for x, y, z, val in zip(xs, ys, zs, intensities):
                        raw_pts.append([float(x), float(y), float(z)])
                        raw_intensities.append(float(val))
                        if len(raw_pts) >= target_sample:
                            break
                if len(raw_pts) >= target_sample:
                    break
            
            print(f"Sampled {len(raw_pts):,} representative points.")
            pts_np = np.array(raw_pts)
            mins = pts_np.min(axis=0)
            maxs = pts_np.max(axis=0)
            ranges = maxs - mins
            print(f"Raw Extent: X={ranges[0]:.1f}m, Y={ranges[1]:.1f}m, Z={ranges[2]:.1f}m")
            
            # Normalize to Sector coordinate space: X in [-50, 50], Z in [-50, 50], Y in [0, 20]
            norm_x = (pts_np[:, 0] - mins[0]) / (ranges[0] if ranges[0] > 0 else 1.0) * 100.0 - 50.0
            norm_z = (pts_np[:, 1] - mins[1]) / (ranges[1] if ranges[1] > 0 else 1.0) * 100.0 - 50.0
            norm_y = (pts_np[:, 2] - mins[2]) / (ranges[2] if ranges[2] > 0 else 1.0) * 18.0
            
            # Normalize intensity
            int_min = min(raw_intensities) if raw_intensities else 0
            int_max = max(raw_intensities) if raw_intensities else 1
            int_range = (int_max - int_min) if int_max > int_min else 1.0
            norm_int = [(val - int_min) / int_range for val in raw_intensities]
            
            for i in range(len(raw_pts)):
                lidar_points_data.append({
                    "pos": [round(float(norm_x[i]), 2), round(float(norm_y[i]), 2), round(float(norm_z[i]), 2)],
                    "intensity": round(float(norm_int[i]), 3),
                    "elevation": round(float(pts_np[i, 2]), 2)
                })
    else:
        print("points.laz not found at specified path, generating synthetic LiDAR points.")
        for _ in range(30000):
            rx = random.uniform(-50, 50)
            rz = random.uniform(-50, 50)
            ry = random.uniform(0, 15)
            lidar_points_data.append({
                "pos": [round(rx, 2), round(ry, 2), round(rz, 2)],
                "intensity": round(random.uniform(0.1, 1.0), 3),
                "elevation": round(ry * 5.0 + 215.0, 2)
            })

    # Save sampled LiDAR points JSON
    lidar_out_path = r"d:\sih\frontend\src\data\lidarPoints.json"
    with open(lidar_out_path, "w", encoding="utf-8") as f:
        json.dump(lidar_points_data, f)
    print(f"Saved {len(lidar_points_data):,} LiDAR points to {lidar_out_path}")

    # -------------------------------------------------------------------------
    # 2. ML / Statistical Stakeholder Dataset & Owner Generator
    # -------------------------------------------------------------------------
    CITIZEN_PROFILES = [
        {"name": "Deepak Joshi", "aadhaar": "XXXX-XXXX-8849", "pan": "ABCDE1234F", "phone": "+91 98101 23456", "category": "General"},
        {"name": "Rajesh Kumar", "aadhaar": "XXXX-XXXX-9124", "pan": "BKLPQ5678M", "phone": "+91 98112 34567", "category": "General"},
        {"name": "Priya Sharma", "aadhaar": "XXXX-XXXX-7341", "pan": "CRTYU9012N", "phone": "+91 98183 45678", "category": "General"},
        {"name": "Vikram Malhotra", "aadhaar": "XXXX-XXXX-4562", "pan": "DVWXY3456P", "phone": "+91 98194 56789", "category": "General"},
        {"name": "Sneha Reddy", "aadhaar": "XXXX-XXXX-3198", "pan": "EZABC7890Q", "phone": "+91 98205 67890", "category": "General"},
        {"name": "Amit Verma", "aadhaar": "XXXX-XXXX-6284", "pan": "FBCDE1234R", "phone": "+91 98216 78901", "category": "General"},
        {"name": "Dr. Sunita Rao", "aadhaar": "XXXX-XXXX-5521", "pan": "GKLMN5678S", "phone": "+91 98227 89012", "category": "General"},
        {"name": "Sanjay Singhania", "aadhaar": "XXXX-XXXX-9832", "pan": "HPQRS9012T", "phone": "+91 98238 90123", "category": "General"},
        {"name": "Meera Nambiar", "aadhaar": "XXXX-XXXX-1478", "pan": "ITUVW3456U", "phone": "+91 98249 01234", "category": "General"},
        {"name": "Ananya Desai", "aadhaar": "XXXX-XXXX-8213", "pan": "JXYZB7890V", "phone": "+91 98260 12345", "category": "General"},
        {"name": "Harish Chawla", "aadhaar": "XXXX-XXXX-6743", "pan": "KBCDF1234W", "phone": "+91 98271 23456", "category": "General"},
        {"name": "Kavita Krishnamurthy", "aadhaar": "XXXX-XXXX-2950", "pan": "LMNPQ5678X", "phone": "+91 98282 34567", "category": "General"},
        {"name": "Rohan Mehra", "aadhaar": "XXXX-XXXX-4109", "pan": "MRSTU9012Y", "phone": "+91 98293 45678", "category": "General"},
        {"name": "Pooja Hegde", "aadhaar": "XXXX-XXXX-7681", "pan": "NVWXY3456Z", "phone": "+91 98304 56789", "category": "General"},
        {"name": "Arjun Kapoor", "aadhaar": "XXXX-XXXX-5032", "pan": "OABCD7890A", "phone": "+91 98315 67890", "category": "General"},
        {"name": "Shweta Tiwari", "aadhaar": "XXXX-XXXX-3891", "pan": "PEFGH1234B", "phone": "+91 98326 78901", "category": "General"},
        {"name": "Gaurav Bansal", "aadhaar": "XXXX-XXXX-9420", "pan": "QIJKL5678C", "phone": "+91 98337 89012", "category": "General"},
        {"name": "Nidhi Agarwal", "aadhaar": "XXXX-XXXX-6154", "pan": "RMNOP9012D", "phone": "+91 98348 90123", "category": "General"},
        {"name": "Manoj Bajpayee", "aadhaar": "XXXX-XXXX-2789", "pan": "SQRST3456E", "phone": "+91 98359 01234", "category": "General"},
        {"name": "Divya Khosla", "aadhaar": "XXXX-XXXX-8367", "pan": "TUVWX7890F", "phone": "+91 98370 12345", "category": "General"}
    ]

    CORPORATE_PROFILES = [
        "DLF CyberCity Real Estate Ltd",
        "Max Healthcare Institute Ltd",
        "Delhi Police Headquarters (Dwarka Sub-Division)",
        "DMRC Metro Rail Corporation",
        "State Bank of India Corporate Assets",
        "HDFC Asset Management Trust",
        "Infosys Innovation Campus",
        "Delhi Public Library Trust"
    ]

    ENCUMBRANCE_STATUSES = [
        {"status": "Clear & Freehold", "bank": None, "type": "CLEAR"},
        {"status": "Clear & Freehold", "bank": None, "type": "CLEAR"},
        {"status": "Clear & Freehold", "bank": None, "type": "CLEAR"},
        {"status": "Mortgaged to State Bank of India", "bank": "State Bank of India (Dwarka Branch)", "type": "MORTGAGE"},
        {"status": "Mortgaged to HDFC Bank Ltd", "bank": "HDFC Bank (Sector 10 Branch)", "type": "MORTGAGE"},
        {"status": "Mortgaged to ICICI Bank Ltd", "bank": "ICICI Bank (Sector 6 Branch)", "type": "MORTGAGE"},
        {"status": "Under Family Partition Review", "bank": None, "type": "DISPUTE"}
    ]

    # -------------------------------------------------------------------------
    # 3. Master Building Layout with Exact Setbacks & Multi-Apartment Parcels
    # -------------------------------------------------------------------------
    units = []

    # QUADRANT 1: High-Rise Residential Sector (12 Towers, T01-T12, 12 to 18 storeys)
    # Each tower is subdivided into 4 distinct apartment parcels per floor (2BHK, 3BHK, 4BHK) + Penthouse on top
    tower_positions = [
        (-42, 14), (-30, 14), (-18, 14),
        (-42, 26), (-30, 26), (-18, 26),
        (-42, 38), (-30, 38), (-18, 38),
        (-42, 46), (-30, 46), (-18, 46)
    ]

    for t_idx, (bx, bz) in enumerate(tower_positions):
        tower_id = f"T{t_idx+1:02d}"
        tower_name = f"Tower {tower_id} (Emerald Heights)"
        floors = 14 if t_idx < 8 else 18
        
        # Tower dimensions: 8m width, 8m depth (subdivided into 4 flats per floor: each 3.8m x 3.8m)
        flat_offsets = [
            ("A", -1.9, -1.9, "3BHK Luxury", 135.0, 390.0),
            ("B", 1.9, -1.9, "2BHK Premium", 90.0, 260.0),
            ("C", -1.9, 1.9, "3BHK Deluxe", 140.0, 405.0),
            ("D", 1.9, 1.9, "2BHK Compact", 85.0, 245.0),
        ]

        for fl in range(1, floors + 1):
            floor_y = (fl - 1) * 1.5 + 0.75
            
            # If top floor: Luxury Duplex Penthouse (2 combined units or 1 massive unit)
            if fl == floors:
                pent_owner = CITIZEN_PROFILES[(t_idx * 3 + fl) % len(CITIZEN_PROFILES)]
                enc = random.choice(ENCUMBRANCE_STATUSES)
                u_id = f"{tower_id}-{fl}01"
                ulpin = f"IND280145987621-{tower_id}-L{fl:02d}-PENT"
                units.append({
                    "unit_id": u_id,
                    "ulpin_3d": ulpin,
                    "name": f"Penthouse {fl}01, {tower_name}",
                    "complex": "Emerald Heights Luxury Enclave",
                    "type": "Residential Penthouse",
                    "domain": "R",
                    "level": fl,
                    "zone": "ZONE_1_HIGHRISE",
                    "floor_type": "PENTHOUSE",
                    "owner": pent_owner["name"],
                    "owner_details": pent_owner,
                    "carpet_area_m2": 320.0,
                    "rera_volume_m3": 925.0,
                    "volume_m3": 925.0,
                    "encumbrance": enc["status"],
                    "mortgage_bank": enc["bank"],
                    "circle_rate_inr_m2": 145000,
                    "property_tax_inr": 82000,
                    "registration_date": "14-MAR-2023",
                    "bbox_local": [
                        [bx - 3.8, floor_y - 0.75, bz - 3.8],
                        [bx + 3.8, floor_y + 0.75, bz + 3.8]
                    ],
                    "centroid_local": [bx, bz, floor_y],
                    "dimensions": [7.6, 7.6, 1.5],
                    "violation": {"has_violation": False, "type": "NONE"}
                })
            else:
                # 4 separate flats per floor
                for f_letter, ox, oz, f_type, area, vol in flat_offsets:
                    flat_no = f"{fl}{f_letter}"
                    u_id = f"{tower_id}-{flat_no}"
                    ulpin = f"IND280145987621-{tower_id}-L{fl:02d}-{flat_no}"
                    
                    # Specific owner distribution:
                    # Give Deepak Joshi prominent flats in T01 and T02
                    if t_idx == 0 and fl == 4 and f_letter == "A":
                        owner = CITIZEN_PROFILES[0] # Deepak Joshi
                        enc = {"status": "Clear & Freehold", "bank": None, "type": "CLEAR"}
                    elif t_idx == 0 and fl == 10 and f_letter == "C":
                        owner = CITIZEN_PROFILES[0] # Deepak Joshi
                        enc = {"status": "Mortgaged to State Bank of India", "bank": "State Bank of India (Dwarka)", "type": "MORTGAGE"}
                    elif t_idx == 1 and fl == 5 and f_letter == "B":
                        owner = CITIZEN_PROFILES[1] # Rajesh Kumar
                        enc = {"status": "Clear & Freehold", "bank": None, "type": "CLEAR"}
                    elif t_idx == 2 and fl == 8 and f_letter == "A":
                        owner = CITIZEN_PROFILES[2] # Priya Sharma
                        enc = {"status": "Mortgaged to HDFC Bank Ltd", "bank": "HDFC Bank (Sector 10)", "type": "MORTGAGE"}
                    elif t_idx == 3 and fl == 12 and f_letter == "D":
                        owner = CITIZEN_PROFILES[3] # Vikram Malhotra
                        enc = {"status": "Clear & Freehold", "bank": None, "type": "CLEAR"}
                    else:
                        owner_idx = (t_idx * 17 + fl * 4 + ord(f_letter)) % len(CITIZEN_PROFILES)
                        owner = CITIZEN_PROFILES[owner_idx]
                        enc = random.choice(ENCUMBRANCE_STATUSES)

                    # Simulate realistic setback violation on Unit T05-04B
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
                        "name": f"Flat {flat_no} ({f_type}), {tower_name}",
                        "complex": "Emerald Heights Luxury Enclave",
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
                        "circle_rate_inr_m2": 115000,
                        "property_tax_inr": round(area * 180),
                        "registration_date": f"{(fl*3)%28 + 1:02d}-{(fl*2)%12 + 1:02d}-2022",
                        "bbox_local": [
                            [round(bx + ox - 1.8, 2), round(floor_y - 0.7, 2), round(bz + oz - 1.8, 2)],
                            [round(bx + ox + 1.8, 2), round(floor_y + 0.7, 2), round(bz + oz + 1.8, 2)]
                        ],
                        "centroid_local": [round(bx + ox, 2), round(bz + oz, 2), round(floor_y, 2)],
                        "dimensions": [3.6, 3.6, 1.4],
                        "violation": viol_info
                    })

    print(f"Generated Quadrant 1 High-Rise Towers: {len(units)} apartment units created.")

    # QUADRANT 2: Plotted Residential Villas (16 Independent Plots, P01-P16, G+2 floors)
    villa_positions = [
        (14, 14), (24, 14), (34, 14), (44, 14),
        (14, 24), (24, 24), (34, 24), (44, 24),
        (14, 34), (24, 34), (34, 34), (44, 34),
        (14, 44), (24, 44), (34, 44), (44, 44)
    ]

    for p_idx, (bx, bz) in enumerate(villa_positions):
        plot_id = f"P{p_idx+1:02d}"
        plot_name = f"Plot {plot_id}, Gulmohar Enclave"
        
        # Give Deepak Joshi Plot P-04
        if p_idx == 3:
            plot_owner = CITIZEN_PROFILES[0] # Deepak Joshi
        elif p_idx == 7:
            plot_owner = CITIZEN_PROFILES[1] # Rajesh Kumar
        elif p_idx == 11:
            plot_owner = CITIZEN_PROFILES[2] # Priya Sharma
        else:
            plot_owner = CITIZEN_PROFILES[(p_idx * 5) % len(CITIZEN_PROFILES)]

        # 3 distinct floors (Ground, First, Second with terrace)
        floor_names = ["Ground Floor Unit", "First Floor Unit", "Second Floor + Terrace"]
        for fl in range(1, 4):
            floor_y = (fl - 1) * 2.0 + 1.0
            u_id = f"{plot_id}-L{fl}"
            ulpin = f"IND280145987621-{plot_id}-L0{fl}"
            enc = random.choice(ENCUMBRANCE_STATUSES)

            units.append({
                "unit_id": u_id,
                "ulpin_3d": ulpin,
                "name": f"{floor_names[fl-1]}, {plot_name}",
                "complex": "Gulmohar Plotted Enclave",
                "type": "Plotted Residential Villa",
                "domain": "R",
                "level": fl,
                "zone": "ZONE_2_PLOTTED",
                "floor_type": "INDEPENDENT_FLOOR",
                "owner": plot_owner["name"],
                "owner_details": plot_owner,
                "carpet_area_m2": 185.0,
                "rera_volume_m3": 540.0,
                "volume_m3": 540.0,
                "encumbrance": enc["status"],
                "mortgage_bank": enc["bank"],
                "circle_rate_inr_m2": 165000,
                "property_tax_inr": 48500,
                "registration_date": "18-FEB-2021",
                "bbox_local": [
                    [round(bx - 3.2, 2), round(floor_y - 0.95, 2), round(bz - 3.2, 2)],
                    [round(bx + 3.2, 2), round(floor_y + 0.95, 2), round(bz + 3.2, 2)]
                ],
                "centroid_local": [bx, bz, round(floor_y, 2)],
                "dimensions": [6.4, 6.4, 1.9],
                "violation": {"has_violation": False, "type": "NONE"}
            })

    print(f"Generated Quadrant 2 Plotted Villas: total units now = {len(units)}")

    # QUADRANT 3: Commercial & Corporate Plazas (8 Plazas, C01-C08, G+6 floors)
    comm_positions = [
        (14, -14), (26, -14), (38, -14),
        (14, -28), (26, -28), (38, -28),
        (14, -42), (26, -42)
    ]

    for c_idx, (bx, bz) in enumerate(comm_positions):
        comm_id = f"C{c_idx+1:02d}"
        comm_name = f"Plaza {comm_id} (Cyber Heights Tech Park)"
        floors = 6

        for fl in range(1, floors + 1):
            floor_y = (fl - 1) * 2.2 + 1.1
            
            # Ground floor: 2 Retail Showrooms
            if fl == 1:
                for r_sub, ox in [("East Retail Wing", -2.5), ("West Retail Wing", 2.5)]:
                    u_id = f"{comm_id}-G0{1 if ox < 0 else 2}"
                    ulpin = f"IND280145987621-{comm_id}-G0{1 if ox < 0 else 2}"
                    owner_corp = CORPORATE_PROFILES[c_idx % len(CORPORATE_PROFILES)]
                    units.append({
                        "unit_id": u_id,
                        "ulpin_3d": ulpin,
                        "name": f"{r_sub}, {comm_name}",
                        "complex": "Cyber Heights Tech Park",
                        "type": "Commercial Retail Showroom",
                        "domain": "C",
                        "level": 1,
                        "zone": "ZONE_3_COMMERCIAL",
                        "floor_type": "RETAIL",
                        "owner": owner_corp,
                        "owner_details": {"name": owner_corp, "category": "Corporate Entity"},
                        "carpet_area_m2": 210.0,
                        "rera_volume_m3": 720.0,
                        "volume_m3": 720.0,
                        "encumbrance": "Clear & Freehold",
                        "mortgage_bank": None,
                        "circle_rate_inr_m2": 220000,
                        "property_tax_inr": 165000,
                        "registration_date": "10-JAN-2020",
                        "bbox_local": [
                            [round(bx + ox - 2.2, 2), round(floor_y - 1.0, 2), round(bz - 4.5, 2)],
                            [round(bx + ox + 2.2, 2), round(floor_y + 1.0, 2), round(bz + 4.5, 2)]
                        ],
                        "centroid_local": [round(bx + ox, 2), bz, round(floor_y, 2)],
                        "dimensions": [4.4, 9.0, 2.0],
                        "violation": {"has_violation": False, "type": "NONE"}
                    })
            else:
                # Upper floors: Corporate office suites
                u_id = f"{comm_id}-L{fl:02d}"
                ulpin = f"IND280145987621-{comm_id}-L{fl:02d}"
                owner_corp = CORPORATE_PROFILES[(c_idx + fl) % len(CORPORATE_PROFILES)]
                units.append({
                    "unit_id": u_id,
                    "ulpin_3d": ulpin,
                    "name": f"Corporate Suite L{fl}, {comm_name}",
                    "complex": "Cyber Heights Tech Park",
                    "type": "Corporate Office Suite",
                    "domain": "C",
                    "level": fl,
                    "zone": "ZONE_3_COMMERCIAL",
                    "floor_type": "OFFICE",
                    "owner": owner_corp,
                    "owner_details": {"name": owner_corp, "category": "Corporate Entity"},
                    "carpet_area_m2": 450.0,
                    "rera_volume_m3": 1480.0,
                    "volume_m3": 1480.0,
                    "encumbrance": "Clear & Freehold",
                    "mortgage_bank": None,
                    "circle_rate_inr_m2": 240000,
                    "property_tax_inr": 290000,
                    "registration_date": "10-JAN-2020",
                    "bbox_local": [
                        [round(bx - 5.0, 2), round(floor_y - 1.0, 2), round(bz - 5.0, 2)],
                        [round(bx + 5.0, 2), round(floor_y + 1.0, 2), round(bz + 5.0, 2)]
                    ],
                    "centroid_local": [bx, bz, round(floor_y, 2)],
                    "dimensions": [10.0, 10.0, 2.0],
                    "violation": {"has_violation": False, "type": "NONE"}
                })

    print(f"Generated Quadrant 3 Commercial Plazas: total units now = {len(units)}")

    # QUADRANT 4: Civic, Healthcare & Governance Campus (6 Blocks, CIV01-CIV06)
    civic_positions = [
        (-16, -16, "CIV01", "Max Super Speciality Hospital", "Healthcare", 5),
        (-32, -16, "CIV02", "Dwarka Sub-District Police Station", "Public Safety", 3),
        (-16, -32, "CIV03", "Delhi Public Library & Archives", "Public Education", 4),
        (-32, -32, "CIV04", "Dwarka Municipal Revenue Court", "Judicial / Revenue", 3),
        (-16, -44, "CIV05", "Sector 10 Community Health Center", "Healthcare", 3),
        (-32, -44, "CIV06", "BSES Power Distribution Substation", "Utilities Infrastructure", 2),
    ]

    for bx, bz, civ_id, civ_name, civ_type, floors in civic_positions:
        for fl in range(1, floors + 1):
            floor_y = (fl - 1) * 2.2 + 1.1
            u_id = f"{civ_id}-L{fl:02d}"
            ulpin = f"IND280145987621-{civ_id}-L{fl:02d}"
            
            units.append({
                "unit_id": u_id,
                "ulpin_3d": ulpin,
                "name": f"Level {fl}, {civ_name}",
                "complex": "Civic & Healthcare Governance Campus",
                "type": f"Civic {civ_type}",
                "domain": "G",
                "level": fl,
                "zone": "ZONE_4_CIVIC",
                "floor_type": "CIVIC",
                "owner": "Govt of NCT of Delhi / Municipal Corporation",
                "owner_details": {"name": "Govt of NCT of Delhi", "category": "Government Dept"},
                "carpet_area_m2": 520.0,
                "rera_volume_m3": 1650.0,
                "volume_m3": 1650.0,
                "encumbrance": "Government Statutory Reserve (Non-Alienated)",
                "mortgage_bank": None,
                "circle_rate_inr_m2": 0,
                "property_tax_inr": 0,
                "registration_date": "15-AUG-2019",
                "bbox_local": [
                    [round(bx - 5.5, 2), round(floor_y - 1.0, 2), round(bz - 5.5, 2)],
                    [round(bx + 5.5, 2), round(floor_y + 1.0, 2), round(bz + 5.5, 2)]
                ],
                "centroid_local": [bx, bz, round(floor_y, 2)],
                "dimensions": [11.0, 11.0, 2.0],
                "violation": {"has_violation": False, "type": "NONE"}
            })

    # QUADRANT 5: Subsurface Infrastructure (DMRC Metro Tube + BSES Power Trunk)
    subsurface_units = [
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
            "bbox_local": [[-2.5, -6.5, -45.0], [2.5, -4.5, 45.0]],
            "centroid_local": [0, 0, -5.5],
            "dimensions": [5.0, 90.0, 2.0],
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
            "carpet_area_m2": 240.0,
            "rera_volume_m3": 950.0,
            "volume_m3": 950.0,
            "encumbrance": "Subsurface Energy Conveyance Right",
            "mortgage_bank": None,
            "circle_rate_inr_m2": 0,
            "property_tax_inr": 0,
            "registration_date": "12-MAR-2018",
            "bbox_local": [[3.0, -3.5, -45.0], [4.2, -2.5, 45.0]],
            "centroid_local": [3.6, 0, -3.0],
            "dimensions": [1.2, 90.0, 1.0],
            "violation": {"has_violation": False, "type": "NONE"}
        }
    ]
    units.extend(subsurface_units)

    # Master Society Structure
    master_cadastre = {
        "metadata": {
            "version": "3.0.0",
            "standard": "ISO 19152:2024 LADM Part 2",
            "parcel_id": "DL-DWR-SEC10-07",
            "society_name": "Dwarka Sector 10 Integrated Urban Cadastre",
            "state": "Delhi (NCT)",
            "district": "South West Delhi",
            "sub_division": "Dwarka",
            "total_buildings": 44,
            "total_units": len(units),
            "crs": "EPSG:4326 (WGS84) + EPSG:2193 (LiDAR Source)",
            "lidar_source": {
                "file": "points.laz",
                "total_points": 157131574,
                "crs_horizontal": "EPSG:2193",
                "crs_vertical": "EPSG:4440",
                "extent_km": "5.94km x 5.07km"
            },
            "datum_elevation_msl": 215.0,
            "volumetric_tolerance_m": 0.02
        },
        "zones": [
            {
                "id": "ZONE_1_HIGHRISE",
                "name": "High-Rise Residential Towers (T01-T12)",
                "description": "Multi-apartment high-density residential towers (14-18 storeys)",
                "centroid": [-30, 14, 30]
            },
            {
                "id": "ZONE_2_PLOTTED",
                "name": "Plotted Residential Villas (P01-P16)",
                "description": "Low-rise plotted independent residential units (G+2)",
                "centroid": [29, 10, 29]
            },
            {
                "id": "ZONE_3_COMMERCIAL",
                "name": "Commercial & Corporate Plazas (C01-C08)",
                "description": "Retail showrooms and Grade-A tech park office suites (G+6)",
                "centroid": [26, 12, -28]
            },
            {
                "id": "ZONE_4_CIVIC",
                "name": "Civic & Healthcare Campus (CIV01-CIV06)",
                "description": "Hospitals, police stations, libraries, and public utilities",
                "centroid": [-24, 10, -30]
            },
            {
                "id": "ZONE_5_SUBSURFACE",
                "name": "Subsurface Infrastructure Corridor",
                "description": "DMRC Blue Line Metro tunnel tube and 11kV subterranean conduits",
                "centroid": [0, -5, 0]
            }
        ],
        "units": units
    }

    society_out_path = r"d:\sih\frontend\src\data\societyData.json"
    with open(society_out_path, "w", encoding="utf-8") as f:
        json.dump(master_cadastre, f, indent=2)

    print(f"=================================================================")
    print(f"SUCCESS: Generated Master City Cadastre with {len(units)} Multi-Apartment Units!")
    print(f"Saved to: {society_out_path}")
    print(f"=================================================================")

if __name__ == "__main__":
    generate_city_and_lidar()

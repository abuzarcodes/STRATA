import laspy
import json
import numpy as np
import random
import os
import math

def generate_realistic_city():
    print("=================================================================")
    print("STRATA: Generating Realistic Asymmetric Urban City Digital Twin")
    print("=================================================================")

    # 1. Sample LiDAR Point Cloud
    laz_path = r"D:\sih\points.laz"
    lidar_points_data = []
    
    if os.path.exists(laz_path):
        print(f"Reading LiDAR points from: {laz_path}...")
        with laspy.open(laz_path) as reader:
            total_pts = reader.header.point_count
            target_sample = 40000
            step = max(1, total_pts // target_sample)
            raw_pts, raw_intensities = [], []
            
            for chunk in reader.chunk_iterator(1000000):
                indices = np.arange(0, len(chunk), step)
                if len(indices) > 0:
                    xs, ys, zs = chunk.x[indices], chunk.y[indices], chunk.z[indices]
                    intensities = chunk.intensity[indices]
                    for x, y, z, val in zip(xs, ys, zs, intensities):
                        raw_pts.append([float(x), float(y), float(z)])
                        raw_intensities.append(float(val))
                        if len(raw_pts) >= target_sample:
                            break
                if len(raw_pts) >= target_sample:
                    break
            
            pts_np = np.array(raw_pts)
            mins, maxs = pts_np.min(axis=0), pts_np.max(axis=0)
            ranges = maxs - mins
            
            norm_x = (pts_np[:, 0] - mins[0]) / (ranges[0] if ranges[0] > 0 else 1.0) * 110.0 - 55.0
            norm_z = (pts_np[:, 1] - mins[1]) / (ranges[1] if ranges[1] > 0 else 1.0) * 110.0 - 55.0
            norm_y = (pts_np[:, 2] - mins[2]) / (ranges[2] if ranges[2] > 0 else 1.0) * 22.0
            
            int_min, int_max = (min(raw_intensities), max(raw_intensities)) if raw_intensities else (0, 1)
            int_range = (int_max - int_min) if int_max > int_min else 1.0
            norm_int = [(val - int_min) / int_range for val in raw_intensities]
            
            for i in range(len(raw_pts)):
                lidar_points_data.append({
                    "pos": [round(float(norm_x[i]), 2), round(float(norm_y[i]), 2), round(float(norm_z[i]), 2)],
                    "intensity": round(float(norm_int[i]), 3),
                    "elevation": round(float(pts_np[i, 2]), 2)
                })
    else:
        for _ in range(30000):
            rx = random.uniform(-55, 55)
            rz = random.uniform(-55, 55)
            ry = random.uniform(0, 16)
            lidar_points_data.append({
                "pos": [round(rx, 2), round(ry, 2), round(rz, 2)],
                "intensity": round(random.uniform(0.1, 1.0), 3),
                "elevation": round(ry * 5.0 + 215.0, 2)
            })

    with open(r"d:\sih\frontend\src\data\lidarPoints.json", "w", encoding="utf-8") as f:
        json.dump(lidar_points_data, f)
    print(f"Saved {len(lidar_points_data):,} LiDAR points.")

    # 2. Stakeholder Pool
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
        {"name": "Ananya Desai", "aadhaar": "XXXX-XXXX-8213", "pan": "JXYZB7890V", "phone": "+91 98260 12345"},
        {"name": "Harish Chawla", "aadhaar": "XXXX-XXXX-6743", "pan": "KBCDF1234W", "phone": "+91 98271 23456"},
        {"name": "Kavita Krishnamurthy", "aadhaar": "XXXX-XXXX-2950", "pan": "LMNPQ5678X", "phone": "+91 98282 34567"},
        {"name": "Rohan Mehra", "aadhaar": "XXXX-XXXX-4109", "pan": "MRSTU9012Y", "phone": "+91 98293 45678"},
        {"name": "Pooja Hegde", "aadhaar": "XXXX-XXXX-7681", "pan": "NVWXY3456Z", "phone": "+91 98304 56789"},
        {"name": "Arjun Kapoor", "aadhaar": "XXXX-XXXX-5032", "pan": "OABCD7890A", "phone": "+91 98315 67890"},
        {"name": "Nidhi Agarwal", "aadhaar": "XXXX-XXXX-6154", "pan": "RMNOP9012D", "phone": "+91 98348 90123"},
        {"name": "Manoj Bajpayee", "aadhaar": "XXXX-XXXX-2789", "pan": "SQRST3456E", "phone": "+91 98359 01234"},
        {"name": "Divya Khosla", "aadhaar": "XXXX-XXXX-8367", "pan": "TUVWX7890F", "phone": "+91 98370 12345"}
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

    ENCUMBRANCES = [
        {"status": "Clear & Freehold", "bank": None},
        {"status": "Clear & Freehold", "bank": None},
        {"status": "Clear & Freehold", "bank": None},
        {"status": "Mortgaged to State Bank of India", "bank": "State Bank of India (Dwarka Branch)"},
        {"status": "Mortgaged to HDFC Bank Ltd", "bank": "HDFC Bank (Sector 10 Branch)"},
        {"status": "Mortgaged to ICICI Bank Ltd", "bank": "ICICI Bank (Sector 6 Branch)"}
    ]

    units = []

    # -------------------------------------------------------------------------
    # ZONE 1: HIGH-RISE RESIDENTIAL TOWERS (Asymmetric Layout & Varied Heights)
    # Staggered orientations, L-shaped podiums, towers ranging from 8 to 22 storeys
    # -------------------------------------------------------------------------
    towers_meta = [
        # (ID, Name, center_x, center_z, width, depth, floors, rotation_deg)
        ("T01", "Emerald Heights Tower A", -42.0, 15.0, 10.0, 8.0, 16, 0),
        ("T02", "Emerald Heights Tower B (L-Wing)", -28.0, 12.0, 8.5, 9.5, 20, 15),
        ("T03", "Emerald Heights Tower C", -14.0, 17.0, 9.0, 8.0, 14, -10),
        ("T04", "Silver Oak Signature Tower", -45.0, 30.0, 11.0, 9.0, 22, 5),
        ("T05", "Silver Oak Tower 2", -32.0, 27.0, 8.0, 8.0, 18, 0),
        ("T06", "Silver Oak Tower 3", -18.0, 31.0, 8.5, 7.5, 12, -5),
        ("T07", "Maple Woods High-Rise 1", -40.0, 44.0, 9.5, 8.5, 15, -12),
        ("T08", "Maple Woods High-Rise 2", -26.0, 42.0, 8.0, 8.0, 17, 8),
        ("T09", "Maple Woods Club Tower", -12.0, 45.0, 10.5, 9.0, 8, 0),
        ("T10", "Palm Crest Sky Villa Tower", -35.0, 52.0, 9.0, 9.0, 24, 0)
    ]

    for t_idx, (t_id, t_name, bx, bz, bw, bd, floors, rot) in enumerate(towers_meta):
        # 4 Flats per floor with realistic size differences
        # Flat A (3BHK Large): 55% width, 55% depth
        # Flat B (2BHK Compact): 45% width, 55% depth
        # Flat C (3BHK Deluxe): 55% width, 45% depth
        # Flat D (2BHK Study): 45% width, 45% depth
        w_half = bw / 2.0
        d_half = bd / 2.0
        
        flat_configs = [
            ("A", -w_half * 0.48, -d_half * 0.48, w_half * 0.92, d_half * 0.92, "3BHK Luxury", 142.0, 410.0),
            ("B", w_half * 0.48, -d_half * 0.48, w_half * 0.92, d_half * 0.92, "2BHK Premium", 92.0, 268.0),
            ("C", -w_half * 0.48, d_half * 0.48, w_half * 0.92, d_half * 0.92, "3BHK Deluxe", 138.0, 400.0),
            ("D", w_half * 0.48, d_half * 0.48, w_half * 0.92, d_half * 0.92, "2BHK Compact", 86.0, 250.0),
        ]

        for fl in range(1, floors + 1):
            floor_y = (fl - 1) * 1.5 + 0.75
            
            # Top floor: Duplex Sky Penthouse
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
                    "carpet_area_m2": round(bw * bd * 4.2, 1),
                    "rera_volume_m3": round(bw * bd * 12.0, 1),
                    "volume_m3": round(bw * bd * 12.0, 1),
                    "encumbrance": enc["status"],
                    "mortgage_bank": enc["bank"],
                    "circle_rate_inr_m2": 150000,
                    "property_tax_inr": 92000,
                    "registration_date": "14-MAR-2023",
                    "bbox_local": [
                        [round(bx - w_half + 0.3, 2), round(floor_y - 0.75, 2), round(bz - d_half + 0.3, 2)],
                        [round(bx + w_half - 0.3, 2), round(floor_y + 0.75, 2), round(bz + d_half - 0.3, 2)]
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
                    
                    # Specific owner distribution
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
                    elif t_idx == 3 and fl == 12 and f_letter == "D":
                        owner = CITIZENS[3] # Vikram Malhotra
                        enc = {"status": "Clear & Freehold", "bank": None}
                    else:
                        owner = CITIZENS[(t_idx * 13 + fl * 3 + ord(f_letter)) % len(CITIZENS)]
                        enc = random.choice(ENCUMBRANCES)

                    has_viol = (t_idx == 4 and fl == 4 and f_letter == "B")
                    viol_info = {
                        "has_violation": has_viol,
                        "type": "UNAUTHORIZED_BALCONY_EXTENSION" if has_viol else "NONE",
                        "excess_volume_m3": 14.5 if has_viol else 0.0,
                        "penalty_inr": 125000 if has_viol else 0
                    }

                    fx_min = bx + ox - fw / 2.0
                    fx_max = bx + ox + fw / 2.0
                    fz_min = bz + oz - fd / 2.0
                    fz_max = bz + oz + fd / 2.0

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
                            [round(fx_min, 2), round(floor_y - 0.7, 2), round(fz_min, 2)],
                            [round(fx_max, 2), round(floor_y + 0.7, 2), round(fz_max, 2)]
                        ],
                        "centroid_local": [round(bx + ox, 2), round(bz + oz, 2), round(floor_y, 2)],
                        "dimensions": [round(fw, 2), round(fd, 2), 1.4],
                        "violation": viol_info
                    })

    # -------------------------------------------------------------------------
    # ZONE 2: PLOTTED RESIDENTIAL VILLAS & BUNGALOWS (Organic Plot Dimensions)
    # Varied plot sizes (250m2, 350m2, 500m2 corner plots, staggered setbacks)
    # -------------------------------------------------------------------------
    villas_meta = [
        # (PlotID, Name, center_x, center_z, width, depth, storeys)
        ("P01", "Villa Royal Corner Plot 1", 13.5, 14.0, 7.5, 6.5, 3),
        ("P02", "Gulmohar Bungalow 2", 23.0, 13.5, 6.0, 6.5, 2),
        ("P03", "Gulmohar Bungalow 3", 31.0, 14.0, 5.5, 6.0, 3),
        ("P04", "Pine Grove Villa 4 (Deepak Joshi)", 39.5, 14.5, 7.0, 7.0, 3),
        ("P05", "Pine Grove Corner Plot 5", 48.0, 15.0, 8.0, 7.5, 2),
        
        ("P06", "Gulmohar Villa 6", 14.0, 24.5, 6.5, 7.0, 2),
        ("P07", "Gulmohar Duplex 7", 23.5, 25.0, 7.0, 6.5, 3),
        ("P08", "Pine Grove Estate 8 (Rajesh Kumar)", 32.5, 24.5, 6.5, 7.0, 3),
        ("P09", "Pine Grove Bungalow 9", 41.0, 25.0, 6.0, 6.0, 2),
        ("P10", "East Park Corner Villa 10", 49.0, 26.0, 7.5, 7.0, 3),

        ("P11", "Park View Villa 11", 13.5, 36.0, 6.5, 6.5, 3),
        ("P12", "Park View Villa 12 (Priya Sharma)", 22.5, 36.5, 7.0, 7.0, 3),
        ("P13", "Gulmohar Retreat 13", 31.5, 35.5, 6.0, 6.5, 2),
        ("P14", "Pine Valley Villa 14", 40.5, 36.0, 6.5, 6.5, 3),
        ("P15", "East Avenue Estate 15", 49.5, 37.0, 7.5, 7.5, 3),

        ("P16", "South-East Sanctuary Villa 16", 28.0, 46.5, 8.5, 7.5, 3),
        ("P17", "South-East Garden Bungalow 17", 41.5, 47.0, 7.5, 7.0, 2)
    ]

    for p_id, p_name, bx, bz, bw, bd, storeys in villas_meta:
        if p_id == "P04": plot_owner = CITIZENS[0] # Deepak Joshi
        elif p_id == "P08": plot_owner = CITIZENS[1] # Rajesh Kumar
        elif p_id == "P12": plot_owner = CITIZENS[2] # Priya Sharma
        else: plot_owner = CITIZENS[random.randint(0, len(CITIZENS)-1)]

        floor_names = ["Ground Floor Master Residence", "First Floor Family Suite", "Second Floor + Open Terrace Lounge"]
        for fl in range(1, storeys + 1):
            floor_y = (fl - 1) * 2.0 + 1.0
            u_id = f"{p_id}-L{fl}"
            ulpin = f"IND280145987621-{p_id}-L0{fl}"
            enc = random.choice(ENCUMBRANCES)

            # Step-back for terrace on upper floors for realistic architectural look
            cur_w = bw if fl < 3 else bw * 0.75
            cur_d = bd if fl < 3 else bd * 0.8

            units.append({
                "unit_id": u_id,
                "ulpin_3d": ulpin,
                "name": f"{floor_names[fl-1]}, {p_name}",
                "complex": "Gulmohar Plotted Enclave",
                "type": "Plotted Residential Villa",
                "domain": "R",
                "level": fl,
                "zone": "ZONE_2_PLOTTED",
                "floor_type": "INDEPENDENT_FLOOR",
                "owner": plot_owner["name"],
                "owner_details": plot_owner,
                "carpet_area_m2": round(cur_w * cur_d * 4.0, 1),
                "rera_volume_m3": round(cur_w * cur_d * 11.5, 1),
                "volume_m3": round(cur_w * cur_d * 11.5, 1),
                "encumbrance": enc["status"],
                "mortgage_bank": enc["bank"],
                "circle_rate_inr_m2": 168000,
                "property_tax_inr": round(cur_w * cur_d * 85),
                "registration_date": "18-FEB-2021",
                "bbox_local": [
                    [round(bx - cur_w / 2.0, 2), round(floor_y - 0.95, 2), round(bz - cur_d / 2.0, 2)],
                    [round(bx + cur_w / 2.0, 2), round(floor_y + 0.95, 2), round(bz + cur_d / 2.0, 2)]
                ],
                "centroid_local": [bx, bz, round(floor_y, 2)],
                "dimensions": [round(cur_w, 2), round(cur_d, 2), 1.9],
                "violation": {"has_violation": False, "type": "NONE"}
            })

    # -------------------------------------------------------------------------
    # ZONE 3: COMMERCIAL TECH PARK & RETAIL PODIUMS (Asymmetric Corporate Blocks)
    # -------------------------------------------------------------------------
    comm_meta = [
        # (ID, Name, center_x, center_z, width, depth, floors)
        ("C01", "Cyber Tower Alpha (Glass Facade)", 15.0, -15.0, 12.0, 10.0, 10),
        ("C02", "Cyber Tower Beta", 32.0, -14.0, 14.0, 9.0, 8),
        ("C03", "Apex Financial Plaza", 47.0, -16.0, 10.0, 11.0, 12),
        ("C04", "Infosys Innovation Center", 16.0, -31.0, 13.0, 11.0, 7),
        ("C05", "One Cyber Hub Multi-Deck", 33.0, -30.0, 11.0, 10.0, 6),
        ("C06", "Vanguard Corporate Suites", 48.0, -32.0, 9.5, 9.5, 9),
        ("C07", "Dwarka Trade & Expo Center", 24.0, -46.0, 16.0, 10.0, 5),
        ("C08", "Tech Park Executive Annexe", 42.0, -45.0, 11.0, 8.5, 6)
    ]

    for c_id, c_name, bx, bz, bw, bd, floors in comm_meta:
        for fl in range(1, floors + 1):
            floor_y = (fl - 1) * 2.2 + 1.1
            
            # Ground floor: Retail Showroom
            if fl == 1:
                for r_sub, ox, ow in [("East Retail Wing", -bw * 0.25, bw * 0.46), ("West Retail Wing", bw * 0.25, bw * 0.46)]:
                    u_id = f"{c_id}-G0{1 if ox < 0 else 2}"
                    ulpin = f"IND280145987621-{c_id}-G0{1 if ox < 0 else 2}"
                    owner_corp = CORPORATE_PROFILES[random.randint(0, len(CORPORATE_PROFILES)-1)]
                    units.append({
                        "unit_id": u_id,
                        "ulpin_3d": ulpin,
                        "name": f"{r_sub}, {c_name}",
                        "complex": "Cyber Heights Tech Park",
                        "type": "Commercial Retail Showroom",
                        "domain": "C",
                        "level": 1,
                        "zone": "ZONE_3_COMMERCIAL",
                        "floor_type": "RETAIL",
                        "owner": owner_corp,
                        "owner_details": {"name": owner_corp, "category": "Corporate Entity"},
                        "carpet_area_m2": round(ow * bd * 3.8, 1),
                        "rera_volume_m3": round(ow * bd * 9.5, 1),
                        "volume_m3": round(ow * bd * 9.5, 1),
                        "encumbrance": "Clear & Freehold",
                        "mortgage_bank": None,
                        "circle_rate_inr_m2": 225000,
                        "property_tax_inr": 175000,
                        "registration_date": "10-JAN-2020",
                        "bbox_local": [
                            [round(bx + ox - ow / 2.0, 2), round(floor_y - 1.0, 2), round(bz - bd / 2.0 + 0.3, 2)],
                            [round(bx + ox + ow / 2.0, 2), round(floor_y + 1.0, 2), round(bz + bd / 2.0 - 0.3, 2)]
                        ],
                        "centroid_local": [round(bx + ox, 2), bz, round(floor_y, 2)],
                        "dimensions": [round(ow, 2), round(bd - 0.6, 2), 2.0],
                        "violation": {"has_violation": False, "type": "NONE"}
                    })
            else:
                # Stepped upper office floors
                cur_w = bw if fl <= 5 else bw * 0.85
                cur_d = bd if fl <= 5 else bd * 0.85
                u_id = f"{c_id}-L{fl:02d}"
                ulpin = f"IND280145987621-{c_id}-L{fl:02d}"
                owner_corp = CORPORATE_PROFILES[random.randint(0, len(CORPORATE_PROFILES)-1)]
                units.append({
                    "unit_id": u_id,
                    "ulpin_3d": ulpin,
                    "name": f"Corporate Suite L{fl}, {c_name}",
                    "complex": "Cyber Heights Tech Park",
                    "type": "Corporate Office Suite",
                    "domain": "C",
                    "level": fl,
                    "zone": "ZONE_3_COMMERCIAL",
                    "floor_type": "OFFICE",
                    "owner": owner_corp,
                    "owner_details": {"name": owner_corp, "category": "Corporate Entity"},
                    "carpet_area_m2": round(cur_w * cur_d * 4.2, 1),
                    "rera_volume_m3": round(cur_w * cur_d * 10.0, 1),
                    "volume_m3": round(cur_w * cur_d * 10.0, 1),
                    "encumbrance": "Clear & Freehold",
                    "mortgage_bank": None,
                    "circle_rate_inr_m2": 245000,
                    "property_tax_inr": 310000,
                    "registration_date": "10-JAN-2020",
                    "bbox_local": [
                        [round(bx - cur_w / 2.0, 2), round(floor_y - 1.0, 2), round(bz - cur_d / 2.0, 2)],
                        [round(bx + cur_w / 2.0, 2), round(floor_y + 1.0, 2), round(bz + cur_d / 2.0, 2)]
                    ],
                    "centroid_local": [bx, bz, round(floor_y, 2)],
                    "dimensions": [round(cur_w, 2), round(cur_d, 2), 2.0],
                    "violation": {"has_violation": False, "type": "NONE"}
                })

    # -------------------------------------------------------------------------
    # ZONE 4: CIVIC, HEALTHCARE & INSTITUTIONAL CAMPUS (Curved & Multi-Wing)
    # -------------------------------------------------------------------------
    civic_meta = [
        # (ID, Name, center_x, center_z, width, depth, floors, type)
        ("CIV01", "Max Super Speciality Hospital (Main Wing)", -16.0, -15.0, 14.0, 11.0, 6, "Hospital"),
        ("CIV01B", "Hospital Emergency & Trauma Pavilion", -16.0, -25.0, 11.0, 7.0, 3, "Trauma Center"),
        ("CIV02", "Dwarka Sub-District Police Station", -34.0, -15.0, 11.0, 9.0, 3, "Police Precinct"),
        ("CIV03", "Delhi Public Library & Cultural Center", -35.0, -28.0, 12.0, 10.0, 4, "Public Library"),
        ("CIV04", "Dwarka Sub-Divisional Magistrate Court", -20.0, -38.0, 13.0, 9.0, 3, "Revenue Court"),
        ("CIV05", "BSES Power Distribution Substation", -38.0, -42.0, 10.0, 8.0, 2, "Power Substation"),
    ]

    for c_id, c_name, bx, bz, bw, bd, floors, c_type in civic_meta:
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
                "carpet_area_m2": round(bw * bd * 4.5, 1),
                "rera_volume_m3": round(bw * bd * 11.0, 1),
                "volume_m3": round(bw * bd * 11.0, 1),
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

    # -------------------------------------------------------------------------
    # ZONE 5: SUBSURFACE METRO CORRIDOR & UNDERGROUND STATION
    # -------------------------------------------------------------------------
    subsurface_units = [
        {
            "unit_id": "DMRC-STATION-CONCOURSE",
            "ulpin_3d": "IND280145987621-SUB-STN-CONCOURSE",
            "name": "Dwarka Sec-10 Underground Metro Station Concourse",
            "complex": "Delhi Metro Rail Corporation Infrastructure",
            "type": "Subsurface Metro Transit Station",
            "domain": "U",
            "level": -1,
            "zone": "ZONE_5_SUBSURFACE",
            "floor_type": "STATION_CONCOURSE",
            "owner": "Delhi Metro Rail Corporation (DMRC)",
            "owner_details": {"name": "Delhi Metro Rail Corporation", "category": "Statutory Authority"},
            "carpet_area_m2": 2400.0,
            "rera_volume_m3": 11500.0,
            "volume_m3": 11500.0,
            "encumbrance": "Public Transport Statutory Easement",
            "mortgage_bank": None,
            "circle_rate_inr_m2": 0,
            "property_tax_inr": 0,
            "registration_date": "24-OCT-2017",
            "bbox_local": [[-7.0, -3.8, -18.0], [7.0, -1.8, 18.0]],
            "centroid_local": [0, 0, -2.8],
            "dimensions": [14.0, 36.0, 2.0],
            "violation": {"has_violation": False, "type": "NONE"}
        },
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
    units.extend(subsurface_units)

    master_cadastre = {
        "metadata": {
            "version": "3.2.0",
            "standard": "ISO 19152:2024 LADM Part 2",
            "parcel_id": "DL-DWR-SEC10-07",
            "society_name": "Dwarka Sector 10 Integrated Urban Cadastre",
            "state": "Delhi (NCT)",
            "district": "South West Delhi",
            "sub_division": "Dwarka",
            "total_buildings": len(towers_meta) + len(villas_meta) + len(comm_meta) + len(civic_meta),
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
                "name": "High-Rise Residential Towers (Emerald & Silver Oak)",
                "description": "Multi-apartment high-density residential towers (12-24 storeys)",
                "centroid": [-30, 16, 30]
            },
            {
                "id": "ZONE_2_PLOTTED",
                "name": "Plotted Residential Villas (Gulmohar & Pine Grove)",
                "description": "Low-rise plotted independent residential bungalows (G+2 / G+3)",
                "centroid": [30, 10, 30]
            },
            {
                "id": "ZONE_3_COMMERCIAL",
                "name": "Commercial & Corporate Plazas (Cyber Heights Tech Park)",
                "description": "Retail showrooms and Grade-A tech park corporate towers (G+6 to G+12)",
                "centroid": [32, 14, -28]
            },
            {
                "id": "ZONE_4_CIVIC",
                "name": "Civic & Healthcare Campus (Max Hospital & SDM Court)",
                "description": "Hospitals, police stations, libraries, and public utility nodes",
                "centroid": [-26, 12, -28]
            },
            {
                "id": "ZONE_5_SUBSURFACE",
                "name": "Subsurface Infrastructure Corridor & Station",
                "description": "DMRC Blue Line underground station box, transit tunnel tube, and 11kV conduits",
                "centroid": [0, -5, 0]
            }
        ],
        "units": units
    }

    out_path = r"d:\sih\frontend\src\data\societyData.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(master_cadastre, f, indent=2)

    print(f"=================================================================")
    print(f"SUCCESS: Generated Asymmetric Realistic City with {len(units)} Units across {master_cadastre['metadata']['total_buildings']} Buildings!")
    print(f"Saved to: {out_path}")
    print(f"=================================================================")

if __name__ == "__main__":
    generate_realistic_city()

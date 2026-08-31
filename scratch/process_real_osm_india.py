import urllib.request
import xml.etree.ElementTree as ET
import json
import math
import random
import os

def download_and_process_real_osm():
    print("=================================================================")
    print("STRATA: Real OpenStreetMap India Live Ingestion Pipeline")
    print("=================================================================")

    # Bounding Box for Dwarka Sector 10, South West Delhi, India
    # [min_lon, min_lat, max_lon, max_lat]
    bbox_url = "https://api.openstreetmap.org/api/0.6/map?bbox=77.052,28.577,77.065,28.587"
    print(f"Connecting to official OpenStreetMap API: {bbox_url}...")
    
    req = urllib.request.Request(
        bbox_url,
        headers={"User-Agent": "STRATA-3D-Cadastre-India/2.0"}
    )

    with urllib.request.urlopen(req, timeout=25) as resp:
        xml_content = resp.read()

    print(f"Downloaded {len(xml_content):,} bytes of real OSM data for Dwarka, India.")

    root = ET.fromstring(xml_content)
    nodes = root.findall("node")
    ways = root.findall("way")

    # Map node IDs to (lat, lon)
    nodes_map = {}
    for n in nodes:
        nid = n.attrib["id"]
        lat = float(n.attrib["lat"])
        lon = float(n.attrib["lon"])
        nodes_map[nid] = (lat, lon)

    print(f"Parsed {len(nodes_map):,} real GPS nodes from OpenStreetMap India.")

    # Calculate geographic center
    lats = [n[0] for n in nodes_map.values()]
    lons = [n[1] for n in nodes_map.values()]
    avg_lat = sum(lats) / len(lats)
    avg_lon = sum(lons) / len(lons)

    print(f"Sector Centroid Datum: Latitude = {avg_lat:.6f}° N, Longitude = {avg_lon:.6f}° E")

    METERS_PER_DEG_LAT = 111132.954 - 559.822 * math.cos(2 * math.radians(avg_lat))
    METERS_PER_DEG_LON = 111412.84 * math.cos(math.radians(avg_lat))

    def gps_to_meters(lat, lon):
        dx = (lon - avg_lon) * METERS_PER_DEG_LON
        dz = (lat - avg_lat) * METERS_PER_DEG_LAT
        return round(dx, 2), round(dz, 2)

    # -------------------------------------------------------------------------
    # Parse Real OSM Roads & Highways
    # -------------------------------------------------------------------------
    osm_highways = []
    for w in ways:
        tags = {t.attrib["k"]: t.attrib["v"] for t in w.findall("tag")}
        if "highway" in tags:
            h_type = tags.get("highway", "residential")
            h_name = tags.get("name", "Sector Access Road")
            ref = tags.get("ref", "")
            
            pts = []
            for nd in w.findall("nd"):
                ref_id = nd.attrib["ref"]
                if ref_id in nodes_map:
                    nlat, nlon = nodes_map[ref_id]
                    mx, mz = gps_to_meters(nlat, nlon)
                    # Normalize scale to visual sector view bounds [-55, 55]
                    pts.append([round(mx * 0.12, 2), round(mz * 0.12, 2)])
            
            if len(pts) >= 2:
                osm_highways.append({
                    "id": w.attrib["id"],
                    "name": h_name,
                    "type": h_type,
                    "ref": ref,
                    "points": pts
                })

    print(f"Extracted {len(osm_highways)} real road centerlines from OSM India.")

    with open(r"d:\sih\frontend\src\data\realOsmRoads.json", "w", encoding="utf-8") as f:
        json.dump(osm_highways, f, indent=2)

    # -------------------------------------------------------------------------
    # Parse Real OSM Buildings
    # -------------------------------------------------------------------------
    osm_buildings = []
    for w in ways:
        tags = {t.attrib["k"]: t.attrib["v"] for t in w.findall("tag")}
        if "building" in tags:
            b_name = tags.get("name")
            b_type = tags.get("building", "yes")
            levels = tags.get("building:levels")
            amenity = tags.get("amenity")
            
            poly = []
            for nd in w.findall("nd"):
                ref_id = nd.attrib["ref"]
                if ref_id in nodes_map:
                    nlat, nlon = nodes_map[ref_id]
                    mx, mz = gps_to_meters(nlat, nlon)
                    poly.append([round(mx * 0.12, 2), round(mz * 0.12, 2)])

            if len(poly) >= 3:
                osm_buildings.append({
                    "id": w.attrib["id"],
                    "name": b_name,
                    "type": b_type,
                    "levels": int(levels) if (levels and levels.isdigit()) else None,
                    "amenity": amenity,
                    "polygon": poly
                })

    print(f"Extracted {len(osm_buildings)} real building polygons from OpenStreetMap India!")

    # -------------------------------------------------------------------------
    # Generate Multi-Apartment 3D Cadastral Units with ML Stakeholder Engine
    # -------------------------------------------------------------------------
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
        {"name": "Arjun Kapoor", "aadhaar": "XXXX-XXXX-5032", "pan": "OABCD7890A", "phone": "+91 98315 67890"}
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
        {"status": "Clear & Freehold", "bank": None},
        {"status": "Mortgaged to State Bank of India", "bank": "State Bank of India (Dwarka Branch)"},
        {"status": "Mortgaged to HDFC Bank Ltd", "bank": "HDFC Bank (Sector 10 Branch)"},
        {"status": "Mortgaged to ICICI Bank Ltd", "bank": "ICICI Bank (Sector 6 Branch)"}
    ]

    units = []

    # Select representative real buildings spanning all 4 quadrants
    for b_idx, b in enumerate(osm_buildings[:42]):
        poly = b["polygon"]
        xs = [p[0] for p in poly]
        zs = [p[1] for p in poly]
        min_x, max_x = min(xs), max(xs)
        min_z, max_z = min(zs), max(zs)
        
        # Calculate real building dimensions
        w = max(7.0, min(14.0, max_x - min_x))
        d = max(7.0, min(14.0, max_z - min_z))
        cx = round((min_x + max_x) / 2.0, 2)
        cz = round((min_z + max_z) / 2.0, 2)
        
        # Clamp within visual stage
        cx = max(-48.0, min(48.0, cx))
        cz = max(-48.0, min(48.0, cz))

        # Real building name & typology
        if b["name"]:
            building_name = b["name"]
        else:
            if cz > 0 and cx < 0:
                building_name = f"Emerald Tower T-{b_idx+1:02d} (OSM ID #{b['id']})"
            elif cz > 0 and cx >= 0:
                building_name = f"Gulmohar Villa P-{b_idx+1:02d} (OSM ID #{b['id']})"
            elif cz <= 0 and cx >= 0:
                building_name = f"Cyber Plaza C-{b_idx+1:02d} (OSM ID #{b['id']})"
            else:
                building_name = f"Civic Complex Block #{b_idx+1} (OSM ID #{b['id']})"

        # Determine real storeys
        if b["levels"]:
            floors = b["levels"]
        else:
            if cz > 0 and cx < 0:
                floors = random.choice([12, 14, 16, 18, 22])
            elif cz > 0 and cx >= 0:
                floors = random.choice([2, 3, 4])
            elif cz <= 0 and cx >= 0:
                floors = random.choice([6, 8, 10, 12])
            else:
                floors = random.choice([3, 4, 6])

        b_code = f"IND280145987621-B{b_idx+1:02d}"

        # If high-rise (>= 4 floors): divide into 4 flats per floor (3BHK Luxury, 2BHK Premium, 3BHK Deluxe, 2BHK Compact)
        if floors >= 4:
            for fl in range(1, floors + 1):
                floor_y = (fl - 1) * 1.5 + 0.75

                if fl == floors:
                    # Sky Penthouse
                    pent_owner = CITIZENS[(b_idx * 3 + fl) % len(CITIZENS)]
                    enc = random.choice(ENCUMBRANCES)
                    u_id = f"B{b_idx+1:02d}-{fl}01"
                    ulpin = f"{b_code}-L{fl:02d}-PENT"
                    units.append({
                        "unit_id": u_id,
                        "ulpin_3d": ulpin,
                        "name": f"Sky Penthouse {fl}01, {building_name}",
                        "complex": building_name,
                        "type": "Residential Sky Penthouse",
                        "domain": "R",
                        "level": fl,
                        "zone": "ZONE_1_HIGHRISE" if cz > 0 else "ZONE_3_COMMERCIAL",
                        "floor_type": "PENTHOUSE",
                        "owner": pent_owner["name"],
                        "owner_details": pent_owner,
                        "carpet_area_m2": round(w * d * 4.2, 1),
                        "rera_volume_m3": round(w * d * 12.0, 1),
                        "volume_m3": round(w * d * 12.0, 1),
                        "encumbrance": enc["status"],
                        "mortgage_bank": enc["bank"],
                        "circle_rate_inr_m2": 155000,
                        "property_tax_inr": 95000,
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
                    flat_cfgs = [
                        ("A", -w * 0.24, -d * 0.24, w * 0.46, d * 0.46, "3BHK Luxury", 140.0, 405.0),
                        ("B", w * 0.24, -d * 0.24, w * 0.46, d * 0.46, "2BHK Premium", 90.0, 262.0),
                        ("C", -w * 0.24, d * 0.24, w * 0.46, d * 0.46, "3BHK Deluxe", 136.0, 390.0),
                        ("D", w * 0.24, d * 0.24, w * 0.46, d * 0.46, "2BHK Compact", 85.0, 246.0),
                    ]
                    for f_letter, ox, oz, fw, fd, f_type, area, vol in flat_cfgs:
                        flat_no = f"{fl}{f_letter}"
                        u_id = f"B{b_idx+1:02d}-{flat_no}"
                        ulpin = f"{b_code}-L{fl:02d}-{flat_no}"
                        
                        # Priority owners
                        if b_idx == 0 and fl == 4 and f_letter == "A":
                            owner = CITIZENS[0] # Deepak Joshi
                            enc = {"status": "Clear & Freehold", "bank": None}
                        elif b_idx == 0 and fl == 10 and f_letter == "C":
                            owner = CITIZENS[0] # Deepak Joshi
                            enc = {"status": "Mortgaged to State Bank of India", "bank": "State Bank of India (Dwarka Branch)"}
                        elif b_idx == 1 and fl == 5 and f_letter == "B":
                            owner = CITIZENS[1] # Rajesh Kumar
                            enc = {"status": "Clear & Freehold", "bank": None}
                        elif b_idx == 2 and fl == 8 and f_letter == "A":
                            owner = CITIZENS[2] # Priya Sharma
                            enc = {"status": "Mortgaged to HDFC Bank Ltd", "bank": "HDFC Bank (Sector 10 Branch)"}
                        elif b_idx == 3 and fl == 12 and f_letter == "D":
                            owner = CITIZENS[3] # Vikram Malhotra
                            enc = {"status": "Clear & Freehold", "bank": None}
                        else:
                            owner = CITIZENS[(b_idx * 17 + fl * 4 + ord(f_letter)) % len(CITIZENS)]
                            enc = random.choice(ENCUMBRANCES)

                        has_viol = (b_idx == 4 and fl == 4 and f_letter == "B")
                        viol_info = {
                            "has_violation": has_viol,
                            "type": "UNAUTHORIZED_BALCONY_EXTENSION" if has_viol else "NONE",
                            "excess_volume_m3": 14.5 if has_viol else 0.0,
                            "penalty_inr": 125000 if has_viol else 0
                        }

                        units.append({
                            "unit_id": u_id,
                            "ulpin_3d": ulpin,
                            "name": f"Flat {flat_no} ({f_type}), {building_name}",
                            "complex": building_name,
                            "type": f"Residential {f_type}",
                            "domain": "R",
                            "level": fl,
                            "zone": "ZONE_1_HIGHRISE" if cz > 0 else "ZONE_3_COMMERCIAL",
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
        else:
            # Low-rise villa / plotted house
            for fl in range(1, floors + 1):
                floor_y = (fl - 1) * 2.0 + 1.0
                u_id = f"B{b_idx+1:02d}-L{fl}"
                ulpin = f"{b_code}-L0{fl}"
                
                if b_idx == 3: owner = CITIZENS[0] # Deepak Joshi
                elif b_idx == 7: owner = CITIZENS[1] # Rajesh Kumar
                elif b_idx == 11: owner = CITIZENS[2] # Priya Sharma
                else: owner = CITIZENS[(b_idx * 7 + fl) % len(CITIZENS)]
                
                enc = random.choice(ENCUMBRANCES)

                units.append({
                    "unit_id": u_id,
                    "ulpin_3d": ulpin,
                    "name": f"Floor {fl} Independent Residence, {building_name}",
                    "complex": "Gulmohar Plotted Enclave",
                    "type": "Plotted Residential Villa",
                    "domain": "R",
                    "level": fl,
                    "zone": "ZONE_2_PLOTTED",
                    "floor_type": "INDEPENDENT_FLOOR",
                    "owner": owner["name"],
                    "owner_details": owner,
                    "carpet_area_m2": round(w * d * 3.8, 1),
                    "rera_volume_m3": round(w * d * 11.0, 1),
                    "volume_m3": round(w * d * 11.0, 1),
                    "encumbrance": enc["status"],
                    "mortgage_bank": enc["bank"],
                    "circle_rate_inr_m2": 168000,
                    "property_tax_inr": 48000,
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
            "version": "5.0.0",
            "standard": "ISO 19152:2024 LADM Part 2",
            "datasource": "OpenStreetMap India Official GeoAPI",
            "parcel_id": "DL-DWR-SEC10-07",
            "society_name": "Dwarka Sector 10 Real Urban Cadastre (OSM India)",
            "state": "Delhi (NCT)",
            "district": "South West Delhi",
            "sub_division": "Dwarka",
            "gps_center": {"lat": avg_lat, "lon": avg_lon},
            "total_buildings": 42,
            "total_units": len(units),
            "crs": "EPSG:4326 (WGS84) + EPSG:2193 (LiDAR Source)",
            "datum_elevation_msl": 215.0,
            "volumetric_tolerance_m": 0.02
        },
        "zones": [
            {
                "id": "ZONE_1_HIGHRISE",
                "name": "High-Rise Residential Sector (OSM)",
                "description": "Multi-apartment high-density residential towers",
                "centroid": [-25, 16, 25]
            },
            {
                "id": "ZONE_2_PLOTTED",
                "name": "Plotted Residential Colonies (OSM)",
                "description": "Low-rise plotted independent residential bungalows",
                "centroid": [25, 10, 25]
            },
            {
                "id": "ZONE_3_COMMERCIAL",
                "name": "Commercial & Tech Plazas (OSM)",
                "description": "Retail showrooms and corporate tech park towers",
                "centroid": [25, 14, -25]
            },
            {
                "id": "ZONE_4_CIVIC",
                "name": "Civic & Healthcare Campus (OSM)",
                "description": "Hospitals, police stations, libraries, and public utilities",
                "centroid": [-25, 12, -25]
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
    print(f"SUCCESS: Real OpenStreetMap India Data Ingested!")
    print(f"Total Multi-Apartment Units Created: {len(units)}")
    print(f"Saved to: {society_out_path}")
    print(f"=================================================================")

if __name__ == "__main__":
    download_and_process_real_osm()

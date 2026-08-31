import json
import hashlib

def make_box_unit(unit_id, ulpin_3d, name, owner, block, level, unit_type, x_min, x_max, y_min, y_max, z_min, z_max, deed_no, mortgage="NONE (Clear Title)", tax_status="PAID (FY 2025-26)", violation=None):
    v = [
        [round(x_min, 2), round(y_min, 2), round(z_min, 2)],
        [round(x_max, 2), round(y_min, 2), round(z_min, 2)],
        [round(x_max, 2), round(y_max, 2), round(z_min, 2)],
        [round(x_min, 2), round(y_max, 2), round(z_min, 2)],
        [round(x_min, 2), round(y_min, 2), round(z_max, 2)],
        [round(x_max, 2), round(y_min, 2), round(z_max, 2)],
        [round(x_max, 2), round(y_max, 2), round(z_max, 2)],
        [round(x_min, 2), round(y_max, 2), round(z_max, 2)]
    ]
    faces = [
        [2, 0, 3], [0, 2, 1], # bottom
        [6, 7, 4], [4, 5, 6], # top
        [0, 1, 5], [0, 5, 4], # front
        [1, 2, 6], [1, 6, 5], # right
        [2, 3, 7], [2, 7, 6], # back
        [3, 0, 4], [3, 4, 7]  # left
    ]
    centroid = [
        round((x_min + x_max) / 2, 2),
        round((y_min + y_max) / 2, 2),
        round((z_min + z_max) / 2, 2)
    ]
    carpet_area = round((x_max - x_min) * (y_max - y_min) * 0.82, 1)
    volume = round((x_max - x_min) * (y_max - y_min) * (z_max - z_min), 1)
    
    deed_token = hashlib.sha256(f"{unit_id}:{ulpin_3d}:{deed_no}".encode()).hexdigest()
    
    unit_obj = {
        "unit_id": unit_id,
        "ulpin_3d": ulpin_3d,
        "name": name,
        "owner": owner,
        "block": block,
        "level": level,
        "type": unit_type,
        "domain": "U" if level < 0 else ("S" if level == 0 else "A"),
        "carpet_area_m2": carpet_area,
        "rera_volume_m3": volume,
        "is_watertight": True,
        "centroid_local": centroid,
        "vertices_local": v,
        "faces": faces,
        "deed_no": deed_no,
        "deed_token": deed_token,
        "registration_date": "14-OCT-2023",
        "mortgage": mortgage,
        "tax_status": tax_status,
        "circle_rate_inr_m2": 74500,
        "estimated_valuation_inr": int(carpet_area * 74500 * 1.25),
        "violation": violation if violation else {
            "has_violation": False,
            "violation_type": "NONE",
            "severity": "COMPLIANT",
            "encroachment_area_m2": 0.0,
            "encroachment_volume_m3": 0.0,
            "description": "Within statutory FAR & property envelope boundaries."
        }
    }
    return unit_obj

units = []

# ==============================================================================
# BLOCK A: Aura Residency CGHS (Residential Towers A & B)
# Origin centered around (-8, -6)
# ==============================================================================

# Tower A (Left Wing: x in [-14, -4], y in [-14, -2])
# Level -1: Basement Parking
units.append(make_box_unit("PARK-B101", "IND280145987621-U-01-39F1", "Basement Parking Bay #01", "Rajesh Kumar", "BLOCK_A", -1, "PARKING", -14, -9, -14, -8, -3.5, -0.2, "DEL-DWK-2023-88901"))
units.append(make_box_unit("PARK-B102", "IND280145987621-U-01-0004", "Basement Parking Bay #02", "Priya Sharma", "BLOCK_A", -1, "PARKING", -9, -4, -14, -8, -3.5, -0.2, "DEL-DWK-2023-88902"))
units.append(make_box_unit("PARK-B103", "IND280145987621-U-01-161F", "Basement Parking Bay #03", "Amitabh Verma", "BLOCK_A", -1, "PARKING", -14, -9, -8, -2, -3.5, -0.2, "DEL-DWK-2023-88903"))
units.append(make_box_unit("PARK-B104", "IND280145987621-U-01-E59D", "Basement Parking Bay #04", "Deepak Joshi", "BLOCK_A", -1, "PARKING", -9, -4, -8, -2, -3.5, -0.2, "DEL-DWK-2023-88904"))

# Level 0: Ground Entrance Lobby & Stilt
units.append(make_box_unit("LOBBY-G01", "IND280145987621-S00-76B4", "Tower A Ground Lobby & Concierge", "Aura Residency RWA", "BLOCK_A", 0, "COMMON_LOBBY", -14, -4, -14, -2, 0.2, 3.0, "DEL-DWK-2023-RWA01"))

# Level 1: Flats 101, 102, 103, 104
units.append(make_box_unit("FLAT-101", "IND280145987621-A+01-E5D1", "Flat 101 (3BHK Executive, Tower A)", "Rajesh Kumar", "BLOCK_A", 1, "RESIDENTIAL", -14, -9, -14, -8, 3.2, 6.0, "DEL-DWK-2023-88901"))
units.append(make_box_unit("FLAT-102", "IND280145987621-A+01-869A", "Flat 102 (3BHK Executive, Tower A)", "Priya Sharma", "BLOCK_A", 1, "RESIDENTIAL", -9, -4, -14, -8, 3.2, 6.0, "DEL-DWK-2023-88902", mortgage="HDFC Home Loan (Active Lien: ₹38.0 L)"))
units.append(make_box_unit("FLAT-103", "IND280145987621-A+01-AF18", "Flat 103 (2BHK Premium, Tower A)", "Karan Kapoor", "BLOCK_A", 1, "RESIDENTIAL", -14, -9, -8, -2, 3.2, 6.0, "DEL-DWK-2023-88903"))
units.append(make_box_unit("FLAT-104", "IND280145987621-A+01-4DAC", "Flat 104 (Level 1, Tower A)", "Deepak Joshi", "BLOCK_A", 1, "RESIDENTIAL", -9, -4, -8, -2, 3.2, 6.0, "DEL-DWK-2023-88904"))

# Level 2: Flats 201, 202, 203, 204
units.append(make_box_unit("FLAT-201", "IND280145987621-A+02-811E", "Flat 201 (3BHK Executive, Tower A)", "Amitabh Verma", "BLOCK_A", 2, "RESIDENTIAL", -14, -9, -14, -8, 6.2, 9.0, "DEL-DWK-2023-88905"))
units.append(make_box_unit("FLAT-202", "IND280145987621-A+02-244A", "Flat 202 (3BHK Executive, Tower A)", "Sunita Rao", "BLOCK_A", 2, "RESIDENTIAL", -9, -4, -14, -8, 6.2, 9.0, "DEL-DWK-2023-88906"))
units.append(make_box_unit("FLAT-203", "IND280145987621-A+02-99B1", "Flat 203 (2BHK Premium, Tower A)", "Manish Tiwari", "BLOCK_A", 2, "RESIDENTIAL", -14, -9, -8, -2, 6.2, 9.0, "DEL-DWK-2023-88907"))
units.append(make_box_unit("FLAT-204", "IND280145987621-A+02-5A11", "Flat 204 (2BHK Premium, Tower A)", "Ananya Roy", "BLOCK_A", 2, "RESIDENTIAL", -9, -4, -8, -2, 6.2, 9.0, "DEL-DWK-2023-88908"))

# Level 3: Flats 301, 302, 303, 304
units.append(make_box_unit("FLAT-301", "IND280145987621-A+03-31C4", "Flat 301 (3BHK Executive, Tower A)", "Vikram Malhotra", "BLOCK_A", 3, "RESIDENTIAL", -14, -9, -14, -8, 9.2, 12.0, "DEL-DWK-2023-88909"))
units.append(make_box_unit("FLAT-302", "IND280145987621-A+03-9FB2", "Flat 302 (Level 3, Tower A)", "Deepak Joshi", "BLOCK_A", 3, "RESIDENTIAL", -9, -4, -14, -8, 9.2, 12.0, "DEL-DWK-2025-10492", mortgage="SBI Home Loan (Active Lien: ₹42.5 L)"))
units.append(make_box_unit("FLAT-303", "IND280145987621-A+03-67D2", "Flat 303 (2BHK Premium, Tower A)", "Neha Gupta", "BLOCK_A", 3, "RESIDENTIAL", -14, -9, -8, -2, 9.2, 12.0, "DEL-DWK-2023-88910"))

# Flat 304: Air-rights Setback Violation (Cantilever balcony extends +2m outward into setback)
violation_304 = {
    "has_violation": True,
    "violation_type": "AIR_RIGHTS_SETBACK_ENCROACHMENT",
    "severity": "HIGH",
    "encroachment_area_m2": 10.0,
    "encroachment_volume_m3": 28.0,
    "description": "Flat 304 unauthorized cantilevered balcony extends 2.0m into the statutory public road setback envelope."
}
units.append(make_box_unit("FLAT-304", "IND280145987621-A+03-7E91", "Flat 304 (3BHK Balcony Encroachment)", "Harpreet Singh", "BLOCK_A", 3, "RESIDENTIAL", -9, -2, -8, -2, 9.2, 12.0, "DEL-DWK-2023-88911", violation=violation_304))

# Level 4/5: Penthouses 401 & 402 (Duplex with step-back terrace)
units.append(make_box_unit("PENT-401", "IND280145987621-A+04-P401", "Sky Penthouse 401 (Duplex Luxury Suite)", "Anil Ambani Trust", "BLOCK_A", 4, "PENTHOUSE", -13, -4, -13, -3, 12.2, 15.5, "DEL-DWK-2024-99012", mortgage="Axis Bank Mortgage Lien: ₹1.4 Cr"))
units.append(make_box_unit("ROOF-501", "IND280145987621-A+05-A049", "Terrace Solar Array & Overhead Water Tanks", "Aura Residency RWA", "BLOCK_A", 5, "COMMON_ROOF", -13, -5, -13, -4, 15.6, 17.5, "DEL-DWK-2023-RWA02"))


# ==============================================================================
# BLOCK B: Sector 10 Community Commercial Arcade & Market Plaza
# Located at (4, -14) to (16, -2) [Facing the Main Avenue]
# ==============================================================================

# Level 0 (Ground Commercial Retail Arcade)
units.append(make_box_unit("COMM-G01", "IND280145987622-S00-11A1", "Shop 01: Apollo 24/7 Pharmacy & Clinic", "Apollo Health Enterprises", "BLOCK_B", 0, "COMMERCIAL", 4, 10, -14, -8, 0.2, 3.5, "DEL-DWK-2022-COM01"))
units.append(make_box_unit("COMM-G02", "IND280145987622-S00-22B2", "Shop 02: State Bank of India E-Corner & ATM", "SBI Delhi Region", "BLOCK_B", 0, "COMMERCIAL", 10, 16, -14, -8, 0.2, 3.5, "DEL-DWK-2022-COM02"))
units.append(make_box_unit("COMM-G03", "IND280145987622-S00-33C3", "Shop 03: Mother Dairy Milk & Organic Goods", "Delhi Milk Scheme", "BLOCK_B", 0, "COMMERCIAL", 4, 10, -8, -2, 0.2, 3.5, "DEL-DWK-2022-COM03"))

# Shop 04: Sidewalk Coverage Encroachment
violation_g04 = {
    "has_violation": True,
    "violation_type": "GROUND_COVERAGE_SIDEWALK_ENCROACHMENT",
    "severity": "CRITICAL",
    "encroachment_area_m2": 14.4,
    "encroachment_volume_m3": 47.5,
    "description": "Commercial Plaza G04 unauthorized front extension encroaches 2.4m onto public pedestrian walkway."
}
units.append(make_box_unit("COMM-G04", "IND280145987622-S00-44D4", "Shop 04: Cafe Coffee Day (Sidewalk Encroachment)", "CCD Delhi Franchise", "BLOCK_B", 0, "COMMERCIAL", 10, 18.4, -8, -2, 0.2, 3.5, "DEL-DWK-2022-COM04", violation=violation_g04))

# Level 1 (Commercial Professional Offices)
units.append(make_box_unit("OFFC-101", "IND280145987622-A+01-55E5", "Office 101: Sharma & Associates C.A.", "Ramesh Sharma, FCA", "BLOCK_B", 1, "COMMERCIAL_OFFICE", 4, 10, -14, -2, 3.7, 6.8, "DEL-DWK-2023-OFC01"))
units.append(make_box_unit("OFFC-102", "IND280145987622-A+01-66F6", "Office 102: Apex Geospatial & Legal Chambers", "Adv. Meenakshi Lekhi", "BLOCK_B", 1, "COMMERCIAL_OFFICE", 10, 16, -14, -2, 3.7, 6.8, "DEL-DWK-2023-OFC02"))

# Level 2 (Rooftop Open Cafe & Service Station)
units.append(make_box_unit("ROOF-C01", "IND280145987622-A+02-77G7", "Terrace Open-Air Food Court & Deck", "Sector 10 Market Association", "BLOCK_B", 2, "COMMERCIAL", 4, 16, -14, -2, 7.0, 9.2, "DEL-DWK-2023-OFC03"))


# ==============================================================================
# BLOCK C: Vardhman Mahavir Heights (Attached Society Block, G+3)
# Located at (-14, 4) to (-4, 16)
# ==============================================================================

units.append(make_box_unit("VMH-G01", "IND280145987623-S00-88H8", "VM Heights Stilt Parking & Gatehouse", "VM Heights RWA", "BLOCK_C", 0, "COMMON_STILT", -14, -4, 4, 16, 0.2, 3.0, "DEL-DWK-2021-VM01"))
units.append(make_box_unit("VMH-101", "IND280145987623-A+01-99I9", "Apartment 101: Suresh Oberoi", "Suresh Oberoi", "BLOCK_C", 1, "RESIDENTIAL", -14, -9, 4, 16, 3.2, 6.0, "DEL-DWK-2021-VM02"))
units.append(make_box_unit("VMH-102", "IND280145987623-A+01-00J0", "Apartment 102: Kavita Menon", "Kavita Menon", "BLOCK_C", 1, "RESIDENTIAL", -9, -4, 4, 16, 3.2, 6.0, "DEL-DWK-2021-VM03"))
units.append(make_box_unit("VMH-201", "IND280145987623-A+02-11K1", "Apartment 201: Ramesh Chawla", "Ramesh Chawla", "BLOCK_C", 2, "RESIDENTIAL", -14, -9, 4, 16, 6.2, 9.0, "DEL-DWK-2021-VM04"))
units.append(make_box_unit("VMH-202", "IND280145987623-A+02-22L2", "Apartment 202: Aarti Singhania", "Aarti Singhania", "BLOCK_C", 2, "RESIDENTIAL", -9, -4, 4, 16, 6.2, 9.0, "DEL-DWK-2021-VM05"))
units.append(make_box_unit("VMH-301", "IND280145987623-A+03-33M3", "Apartment 301: Dr. Rajiv Sethi", "Dr. Rajiv Sethi", "BLOCK_C", 3, "RESIDENTIAL", -14, -4, 4, 16, 9.2, 12.0, "DEL-DWK-2021-VM06"))


# ==============================================================================
# BLOCK D: Plotted Row Bungalows
# Located at (4, 4) to (16, 16)
# ==============================================================================

units.append(make_box_unit("PLOT-14A", "IND280145987624-S00-44N4", "Bungalow 14-A (G+1 Duplex & Lawn)", "Col. Balvinder Singh (Retd.)", "BLOCK_D", 1, "PLOTTED_BUNGALOW", 4, 9.5, 4, 16, 0.2, 6.5, "DEL-DWK-2019-PL01"))
units.append(make_box_unit("PLOT-14B", "IND280145987624-S00-55O5", "Bungalow 14-B (G+1 Duplex & Lawn)", "Dr. Meenakshi Sundaram", "BLOCK_D", 1, "PLOTTED_BUNGALOW", 10.5, 16, 4, 16, 0.2, 6.5, "DEL-DWK-2019-PL02"))


# ==============================================================================
# CORRIDOR U: Subsurface Blue Line Metro & Utility Infrastructure (Domain U)
# ==============================================================================

units.append(make_box_unit("METRO-T01", "IND280145987625-U-02-66P6", "DMRC Blue Line Metro Transit Tunnel Tube", "Delhi Metro Rail Corporation (DMRC)", "CORRIDOR_U", -2, "TRANSIT_METRO", -18, 18, -2, 2, -7.5, -4.5, "DMRC-NCT-METRO-2018-09"))
units.append(make_box_unit("UTIL-E01", "IND280145987625-U-01-77Q7", "BSES 11kV Subterranean Power Substation", "BSES Rajdhani Power Ltd.", "CORRIDOR_U", -1, "INFRA_POWER", -4, 4, -4, 4, -4.0, -1.0, "BSES-SWD-2020-PW01"))
units.append(make_box_unit("UTIL-W01", "IND280145987625-U-01-88R8", "Delhi Jal Board Stormwater Main Drainage Culvert", "Delhi Jal Board (DJB)", "CORRIDOR_U", -1, "INFRA_WATER", -18, 18, -16, -14, -3.5, -1.2, "DJB-SWD-2021-DR01"))


# Compile Final JSON Dataset
total_carpet = sum(u["carpet_area_m2"] for u in units)
total_vol = sum(u["rera_volume_m3"] for u in units)
violations = [u for u in units if u["violation"]["has_violation"]]

dataset = {
    "metadata": {
        "system": "STRATA 3D Bhu-Aadhaar Land Administration Platform",
        "standard_compliance": [
            "ISO 19152:2024 LADM Part 2",
            "OGC CityGML 3.0",
            "Survey of India 3D Bhu-Aadhaar Standard"
        ],
        "society_name": "Dwarka Sector 10 Urban Zone",
        "locality": "Sector 10, Dwarka, South West Delhi 110075",
        "state": "07 (Delhi NCT)",
        "district": "South West Delhi",
        "sub_registrar_office": "Dwarka Sub-District",
        "base_ulpin": "IND280145987621",
        "anchor_wgs84": {
            "latitude": 28.5823,
            "longitude": 77.0602,
            "elevation_msl": 215.0
        },
        "total_registered_units": len(units),
        "total_carpet_area_m2": round(total_carpet, 1),
        "total_volume_m3": round(total_vol, 1)
    },
    "audit_summary": {
        "total_units_audited": len(units),
        "compliant_units": len(units) - len(violations),
        "violation_count": len(violations),
        "air_rights_violations": [v for v in violations if v["violation"]["violation_type"] == "AIR_RIGHTS_SETBACK_ENCROACHMENT"],
        "subsurface_violations": [v for v in violations if v["violation"]["violation_type"] != "AIR_RIGHTS_SETBACK_ENCROACHMENT"]
    },
    "units": units
}

with open("d:/sih/frontend/src/data/societyData.json", "w", encoding="utf-8") as f:
    json.dump(dataset, f, indent=2)

print(f"Generated {len(units)} units successfully in societyData.json with {len(violations)} violations.")

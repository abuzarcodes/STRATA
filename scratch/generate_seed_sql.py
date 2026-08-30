import json
import uuid

def generate_seed_sql():
    with open("frontend/src/data/societyData.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    meta = data["metadata"]
    audit = data["audit_summary"]
    units = data["units"]

    sql_lines = []
    sql_lines.append("-- Seeding STRATA Dwarka 3D Society Dataset")
    sql_lines.append("BEGIN;")

    # 1. Users
    admin_id = "u0000000-0000-0000-0000-000000000001"
    surveyor_id = "u0000000-0000-0000-0000-000000000002"
    reviewer_id = "u0000000-0000-0000-0000-000000000003"
    owner_id = "u0000000-0000-0000-0000-000000000004"

    # Default bcrypt hash for 'Password@123'
    pwd_hash = "$2b$10$1WbMhXfVbFwD2C6Q7T8.reZbL8q9o4V2kC6e6tJ2G7qM7m9Y2y1i2"

    sql_lines.append(f"""
    INSERT INTO "strata_users" ("id", "email", "passwordHash", "name", "role", "isActive")
    VALUES 
      ('{admin_id}', 'admin@strata.cadastre.gov.in', '{pwd_hash}', 'National Cadastre Administrator', 'ADMIN', true),
      ('{surveyor_id}', 'rajesh.verma@surveyor.gov.in', '{pwd_hash}', 'Rajesh Verma (Senior Cadastral Surveyor)', 'SURVEYOR', true),
      ('{reviewer_id}', 'priya.sharma@cadastre.gov.in', '{pwd_hash}', 'Priya Sharma (Verification Officer)', 'REVIEWER', true),
      ('{owner_id}', 'sunita.rao@auragroup.in', '{pwd_hash}', 'Sunita Rao (Society Secretary)', 'PROPERTY_OWNER', true)
    ON CONFLICT ("id") DO NOTHING;
    """)

    # 2. Project
    project_id = "p0000000-0000-0000-0000-000000000001"
    sql_lines.append(f"""
    INSERT INTO "projects" ("id", "name", "description", "ownerId", "status")
    VALUES ('{project_id}', 'Aura Residency 3D Cadastral Survey & 3D-ULPIN Pilot', '3D Cadastral registration and air-rights verification for Aura Residency CGHS, Sector 10 Dwarka', '{owner_id}', 'ACTIVE')
    ON CONFLICT ("id") DO NOTHING;
    """)

    # 3. Project Assignment
    sql_lines.append(f"""
    INSERT INTO "project_assignments" ("id", "projectId", "userId", "assignmentRole", "assignedById")
    VALUES ('pa000000-0000-0000-0000-000000000001', '{project_id}', '{surveyor_id}', 'SURVEYOR', '{admin_id}')
    ON CONFLICT ("userId", "projectId") DO NOTHING;
    """)

    # 4. Property Application
    app_id = "app00000-0000-0000-0000-000000000001"
    sql_lines.append(f"""
    INSERT INTO "property_applications" (
      "id", "applicationNumber", "ownerId", "propertyName", "propertyType", "description",
      "addressLine1", "locality", "district", "state", "postalCode", "latitude", "longitude",
      "declaredArea", "declaredBuildingCount", "declaredFloorCount", "status", "projectId"
    ) VALUES (
      '{app_id}', 'APP-2026-DLR-0012', '{owner_id}', 'Aura Residency CGHS', 'RESIDENTIAL',
      'High-density vertical residential complex with basement parking and rooftop utility rights.',
      'Plot 12, Sector 10', 'Dwarka', 'South West Delhi', '07 (Delhi NCT)', '110075',
      {meta['anchor_wgs84']['latitude']}, {meta['anchor_wgs84']['longitude']},
      {meta['total_carpet_area_m2']}, 1, 8, 'APPROVED', '{project_id}'
    ) ON CONFLICT ("id") DO NOTHING;
    """)

    # 5. Parcel
    parcel_id = "parc0000-0000-0000-0000-000000000001"
    parcel_meta = json.dumps(data.get("parcel_boundary", {})).replace("'", "''")
    sql_lines.append(f"""
    INSERT INTO "parcels" ("id", "projectId", "name", "parcelNumber", "area", "metadata")
    VALUES ('{parcel_id}', '{project_id}', '{meta['society_name']}', '{meta['base_ulpin']}', 3200.0, '{parcel_meta}')
    ON CONFLICT ("id") DO NOTHING;
    """)

    # 6. Building
    bldg_id = "bldg0000-0000-0000-0000-000000000001"
    bldg_meta = json.dumps({"base_ulpin": meta["base_ulpin"], "elevation_msl": meta["anchor_wgs84"]["elevation_msl"]}).replace("'", "''")
    sql_lines.append(f"""
    INSERT INTO "buildings" ("id", "parcelId", "name", "numberOfFloors", "metadata")
    VALUES ('{bldg_id}', '{parcel_id}', 'Tower A (Residential & Stilt/Basement)', 8, '{bldg_meta}')
    ON CONFLICT ("id") DO NOTHING;
    """)

    # 7. Floors
    levels = sorted(list(set(u["level"] for u in units)))
    floor_id_map = {}
    for lvl in levels:
        f_id = f"flr00000-0000-0000-0000-{lvl+10:012d}"
        floor_id_map[lvl] = f_id
        elev = float(lvl * 3.0)
        sql_lines.append(f"""
        INSERT INTO "floors" ("id", "buildingId", "level", "elevation", "height")
        VALUES ('{f_id}', '{bldg_id}', {lvl}, {elev}, 3.0)
        ON CONFLICT ("id") DO NOTHING;
        """)

    # 8. Spatial Assets & Geometry Versions
    for u in units:
        asset_id = f"ast_{u['unit_id'].replace('-', '_').lower()}"
        f_id = floor_id_map[u["level"]]
        
        # Determine AssetType enum
        dom = u.get("domain", "A")
        if dom == "U":
            atype = "PARKING" if "PARK" in u["unit_id"] else "UTILITY"
        elif dom == "C":
            atype = "COMMON_AREA"
        else:
            atype = "PROPERTY_UNIT"

        asset_meta = json.dumps({
            "unit_id": u["unit_id"],
            "owner": u["owner"],
            "carpet_area_m2": u["carpet_area_m2"],
            "volume_m3": u["volume_m3"],
            "is_watertight": u["is_watertight"],
            "ulpin_3d": u["ulpin_3d"],
            "domain": u["domain"],
            "deed_token": u.get("deed_token", ""),
            "spatial_hash": u.get("spatial_hash", ""),
            "color": u.get("color", "#00D084")
        }).replace("'", "''")

        sql_lines.append(f"""
        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('{asset_id}', '{f_id}', '{u['name'].replace("'", "''")}', '{atype}', '{asset_meta}')
        ON CONFLICT ("id") DO NOTHING;
        """)

        geom_data = json.dumps({
            "ulpin_3d": u["ulpin_3d"],
            "base_ulpin": u["base_ulpin"],
            "z_min": u["z_min"],
            "z_max": u["z_max"],
            "poly_2d": u.get("poly_2d", []),
            "centroid_local": u.get("centroid_local", []),
            "bbox_local": u.get("bbox_local", []),
            "centroid_wgs84": u.get("centroid_wgs84", {}),
            "vertices_local": u.get("vertices_local", []),
            "faces": u.get("faces", []),
            "qr_payload": u.get("qr_payload", "")
        }).replace("'", "''")

        geom_id = f"gm_{u['unit_id'].replace('-', '_').lower()}_v1"
        sql_lines.append(f"""
        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('{geom_id}', '{asset_id}', 1, '3d_cadastre_survey', 'active', '{geom_data}')
        ON CONFLICT ("id") DO NOTHING;
        """)

    # 9. Violations (Air Rights & Subsurface Encroachment)
    # Unit 1: FLAT-202 (Cantilever encroachment)
    sql_lines.append(f"""
    INSERT INTO "violations" ("id", "spatialAssetId", "type", "severity", "description", "resolved", "details")
    VALUES (
      'viol0000-0000-0000-0000-000000000001',
      'ast_flat_202',
      'ENCROACHMENT',
      'HIGH',
      'Apartment 202 (3BHK Deluxe Encroached) cantilevered extension exceeds approved setback envelope by 14.0 m² (39.2 m³).',
      false,
      '{{"violation_type": "AIR_RIGHTS_SETBACK_ENCROACHMENT", "encroachment_area_m2": 14.0, "encroachment_volume_m3": 39.2, "domain": "A", "floor_level": 2}}'
    ) ON CONFLICT ("id") DO NOTHING;
    """)

    # Unit 2: PARK-B106 (Basement subsurface boundary breach)
    sql_lines.append(f"""
    INSERT INTO "violations" ("id", "spatialAssetId", "type", "severity", "description", "resolved", "details")
    VALUES (
      'viol0000-0000-0000-0000-000000000002',
      'ast_park_b106',
      'BOUNDARY_CONFLICT',
      'CRITICAL',
      'Basement Parking Bay #06 (Unapproved Extension) breaches the outer parcel boundary by 7.5 m² (24.75 m³).',
      false,
      '{{"violation_type": "SUBSURFACE_BOUNDARY_BREACH", "encroachment_area_m2": 7.5, "encroachment_volume_m3": 24.75, "domain": "U", "floor_level": -1}}'
    ) ON CONFLICT ("id") DO NOTHING;
    """)

    sql_lines.append("COMMIT;")

    return "\n".join(sql_lines)

if __name__ == "__main__":
    sql = generate_seed_sql()
    with open("scratch/seed_strata_dataset.sql", "w", encoding="utf-8") as f:
        f.write(sql)
    print("Generated SQL seed file with", len(sql.splitlines()), "lines.")

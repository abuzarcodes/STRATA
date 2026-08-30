import json

with open("frontend/src/data/societyData.json", "r", encoding="utf-8") as f:
    data = json.load(f)

units = data["units"]
levels = sorted(list(set(u["level"] for u in units)))
floor_id_map = {lvl: f"flr00000-0000-0000-0000-{lvl+10:012d}" for lvl in levels}

# Batch into 2 parts of ~15 units each to stay well within query limits
batches = [units[:15], units[15:]]

for i, batch in enumerate(batches):
    sql_lines = []
    for u in batch:
        asset_id = f"ast_{u['unit_id'].replace('-', '_').lower()}"
        f_id = floor_id_map[u["level"]]
        
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

    with open(f"scratch/batch_{i+1}.sql", "w", encoding="utf-8") as out:
        out.write("\n".join(sql_lines))

print("Created 2 batch files successfully.")

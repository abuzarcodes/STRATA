
        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_park_b106', 'flr00000-0000-0000-0000-000000000009', 'Basement Parking Bay #06 (Unapproved Extension)', 'PARKING', '{"unit_id": "PARK-B106", "owner": "Builder Reserved / Unsanctioned", "carpet_area_m2": 40.0, "volume_m3": 132.0, "is_watertight": true, "ulpin_3d": "IND280145987621-U-01-5FAF", "domain": "U", "deed_token": "99525d52213b3a83027fbae267e53ef84b126d285c6d0c8bdaed499b769d99c0", "spatial_hash": "5FAF", "color": "#ef4444"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_park_b106_v1', 'ast_park_b106', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-U-01-5FAF", "base_ulpin": "IND280145987621", "z_min": -3.5, "z_max": -0.2, "poly_2d": [[11.5, -8.5], [19.5, -8.5], [19.5, -3.5], [11.5, -3.5], [11.5, -8.5]], "centroid_local": [15.5, -6.0, -1.85], "bbox_local": [11.5, -8.5, -3.5, 19.5, -3.5, -0.2], "centroid_wgs84": [77.0603584, 28.5822459, 213.15], "vertices_local": [[11.5, -8.5, -3.5], [19.5, -8.5, -3.5], [19.5, -3.5, -3.5], [11.5, -3.5, -3.5], [11.5, -8.5, -0.2], [19.5, -8.5, -0.2], [19.5, -3.5, -0.2], [11.5, -3.5, -0.2]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-U-01-5FAF", "base": "IND280145987621", "domain": "U", "floor": -1, "unit": "PARK-B106", "token": "99525d52213b3a83"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_util_b101', 'flr00000-0000-0000-0000-000000000009', 'Basement Substation & Pump Room', 'UTILITY', '{"unit_id": "UTIL-B101", "owner": "Aura Residency RWA", "carpet_area_m2": 25.0, "volume_m3": 82.5, "is_watertight": true, "ulpin_3d": "IND280145987621-U-01-5BB7", "domain": "U", "deed_token": "a72dbf8c7e88c8fabbb1f4e6f918b6033c43c5978d23ecc60547e97533a3f3c3", "spatial_hash": "5BB7", "color": "#64748b"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_util_b101_v1', 'ast_util_b101', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-U-01-5BB7", "base_ulpin": "IND280145987621", "z_min": -3.5, "z_max": -0.2, "poly_2d": [[6.5, 3.5], [11.5, 3.5], [11.5, 8.5], [6.5, 8.5], [6.5, 3.5]], "centroid_local": [9.0, 6.0, -1.85], "bbox_local": [6.5, 3.5, -3.5, 11.5, 8.5, -0.2], "centroid_wgs84": [77.060292, 28.5823541, 213.15], "vertices_local": [[6.5, 3.5, -3.5], [11.5, 3.5, -3.5], [11.5, 8.5, -3.5], [6.5, 8.5, -3.5], [6.5, 3.5, -0.2], [11.5, 3.5, -0.2], [11.5, 8.5, -0.2], [6.5, 8.5, -0.2]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-U-01-5BB7", "base": "IND280145987621", "domain": "U", "floor": -1, "unit": "UTIL-B101", "token": "a72dbf8c7e88c8fa"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_comm_g01', 'flr00000-0000-0000-0000-000000000010', 'Grand Entrance Lobby & Admin Office', 'PROPERTY_UNIT', '{"unit_id": "COMM-G01", "owner": "Aura Residency RWA", "carpet_area_m2": 432.0, "volume_m3": 1209.6, "is_watertight": true, "ulpin_3d": "IND280145987621-S00-76B4", "domain": "S", "deed_token": "b1edc2e1b79338b858bcae082f72143761938bab6a480d3f7758c7b7ac87e536", "spatial_hash": "76B4", "color": "#10b981"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_comm_g01_v1', 'ast_comm_g01', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-S00-76B4", "base_ulpin": "IND280145987621", "z_min": 0.2, "z_max": 3.0, "poly_2d": [[-12.0, -9.0], [12.0, -9.0], [12.0, 9.0], [-12.0, 9.0], [-12.0, -9.0]], "centroid_local": [0.0, 0.0, 1.6], "bbox_local": [-12.0, -9.0, 0.2, 12.0, 9.0, 3.0], "centroid_wgs84": [77.0602, 28.5823, 216.6], "vertices_local": [[-12.0, -9.0, 0.2], [12.0, -9.0, 0.2], [12.0, 9.0, 0.2], [-12.0, 9.0, 0.2], [-12.0, -9.0, 3.0], [12.0, -9.0, 3.0], [12.0, 9.0, 3.0], [-12.0, 9.0, 3.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-S00-76B4", "base": "IND280145987621", "domain": "S", "floor": 0, "unit": "COMM-G01", "token": "b1edc2e1b79338b8"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_lobby_100', 'flr00000-0000-0000-0000-000000000011', 'Floor 1 Elevator Lobby & Fire Corridor', 'PROPERTY_UNIT', '{"unit_id": "LOBBY-100", "owner": "Aura Residency RWA", "carpet_area_m2": 36.0, "volume_m3": 100.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+01-48A2", "domain": "A", "deed_token": "88868dd7f486a8939344438ad39d9ff9069a531104ed5dc7702232c59a2e0ed8", "spatial_hash": "48A2", "color": "#94a3b8"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_lobby_100_v1', 'ast_lobby_100', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+01-48A2", "base_ulpin": "IND280145987621", "z_min": 3.2, "z_max": 6.0, "poly_2d": [[-3.0, -3.0], [3.0, -3.0], [3.0, 3.0], [-3.0, 3.0], [-3.0, -3.0]], "centroid_local": [0.0, 0.0, 4.6], "bbox_local": [-3.0, -3.0, 3.2, 3.0, 3.0, 6.0], "centroid_wgs84": [77.0602, 28.5823, 219.6], "vertices_local": [[-3.0, -3.0, 3.2], [3.0, -3.0, 3.2], [3.0, 3.0, 3.2], [-3.0, 3.0, 3.2], [-3.0, -3.0, 6.0], [3.0, -3.0, 6.0], [3.0, 3.0, 6.0], [-3.0, 3.0, 6.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+01-48A2", "base": "IND280145987621", "domain": "A", "floor": 1, "unit": "LOBBY-100", "token": "88868dd7f486a893"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_101', 'flr00000-0000-0000-0000-000000000011', 'Apartment 101 (3BHK Executive)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-101", "owner": "Rajesh Kumar", "carpet_area_m2": 81.0, "volume_m3": 226.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+01-E5D1", "domain": "A", "deed_token": "8506c1a48aec2bfc825f338cc2091236e0a7b9784814f693c4e83cb68e7967ac", "spatial_hash": "E5D1", "color": "#6366f1"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_101_v1', 'ast_flat_101', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+01-E5D1", "base_ulpin": "IND280145987621", "z_min": 3.2, "z_max": 6.0, "poly_2d": [[-12.0, 0.0], [-3.0, 0.0], [-3.0, 9.0], [-12.0, 9.0], [-12.0, 0.0]], "centroid_local": [-7.5, 4.5, 4.6], "bbox_local": [-12.0, 0.0, 3.2, -3.0, 9.0, 6.0], "centroid_wgs84": [77.0601233, 28.5823406, 219.6], "vertices_local": [[-12.0, 0.0, 3.2], [-3.0, 0.0, 3.2], [-3.0, 9.0, 3.2], [-12.0, 9.0, 3.2], [-12.0, 0.0, 6.0], [-3.0, 0.0, 6.0], [-3.0, 9.0, 6.0], [-12.0, 9.0, 6.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+01-E5D1", "base": "IND280145987621", "domain": "A", "floor": 1, "unit": "FLAT-101", "token": "8506c1a48aec2bfc"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_102', 'flr00000-0000-0000-0000-000000000011', 'Apartment 102 (3BHK Executive)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-102", "owner": "Priya Sharma", "carpet_area_m2": 81.0, "volume_m3": 226.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+01-869A", "domain": "A", "deed_token": "f45ff5adbe4cd13b871a4aa78412928859327a6c12912c3bbd3ea740b95c9cbd", "spatial_hash": "869A", "color": "#6366f1"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_102_v1', 'ast_flat_102', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+01-869A", "base_ulpin": "IND280145987621", "z_min": 3.2, "z_max": 6.0, "poly_2d": [[3.0, 0.0], [12.0, 0.0], [12.0, 9.0], [3.0, 9.0], [3.0, 0.0]], "centroid_local": [7.5, 4.5, 4.6], "bbox_local": [3.0, 0.0, 3.2, 12.0, 9.0, 6.0], "centroid_wgs84": [77.0602767, 28.5823406, 219.6], "vertices_local": [[3.0, 0.0, 3.2], [12.0, 0.0, 3.2], [12.0, 9.0, 3.2], [3.0, 9.0, 3.2], [3.0, 0.0, 6.0], [12.0, 0.0, 6.0], [12.0, 9.0, 6.0], [3.0, 9.0, 6.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+01-869A", "base": "IND280145987621", "domain": "A", "floor": 1, "unit": "FLAT-102", "token": "f45ff5adbe4cd13b"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_park_b101', 'flr00000-0000-0000-0000-000000000009', 'Basement Parking Bay #01', 'PARKING', '{"unit_id": "PARK-B101", "owner": "Rajesh Kumar (Flat 101 Link)", "carpet_area_m2": 30.0, "volume_m3": 99.0, "is_watertight": true, "ulpin_3d": "IND280145987621-U-01-39F1", "domain": "U", "deed_token": "1ad6751837063f6c6213160f00aaa8358b6215d54e406d303e2825804f5f4aa8", "spatial_hash": "39F1", "color": "#00D084"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_park_b101_v1', 'ast_park_b101', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-U-01-39F1", "base_ulpin": "IND280145987621", "z_min": -3.5, "z_max": -0.2, "poly_2d": [[-11.5, 3.5], [-5.5, 3.5], [-5.5, 8.5], [-11.5, 8.5], [-11.5, 3.5]], "centroid_local": [-8.5, 6.0, -1.85], "bbox_local": [-11.5, 3.5, -3.5, -5.5, 8.5, -0.2], "centroid_wgs84": [77.0601131, 28.5823541, 213.15], "vertices_local": [[-11.5, 3.5, -3.5], [-5.5, 3.5, -3.5], [-5.5, 8.5, -3.5], [-11.5, 8.5, -3.5], [-11.5, 3.5, -0.2], [-5.5, 3.5, -0.2], [-5.5, 8.5, -0.2], [-11.5, 8.5, -0.2]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-U-01-39F1", "base": "IND280145987621", "domain": "U", "floor": -1, "unit": "PARK-B101", "token": "1ad6751837063f6c"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_park_b102', 'flr00000-0000-0000-0000-000000000009', 'Basement Parking Bay #02', 'PARKING', '{"unit_id": "PARK-B102", "owner": "Priya Sharma (Flat 102 Link)", "carpet_area_m2": 30.0, "volume_m3": 99.0, "is_watertight": true, "ulpin_3d": "IND280145987621-U-01-0004", "domain": "U", "deed_token": "fd86ae3fca874d8dbf699f3068f0b2ec4a0b43a61914cfc0f72cff6346f57633", "spatial_hash": "0004", "color": "#00D084"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_park_b102_v1', 'ast_park_b102', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-U-01-0004", "base_ulpin": "IND280145987621", "z_min": -3.5, "z_max": -0.2, "poly_2d": [[-5.5, 3.5], [0.5, 3.5], [0.5, 8.5], [-5.5, 8.5], [-5.5, 3.5]], "centroid_local": [-2.5, 6.0, -1.85], "bbox_local": [-5.5, 3.5, -3.5, 0.5, 8.5, -0.2], "centroid_wgs84": [77.0601744, 28.5823541, 213.15], "vertices_local": [[-5.5, 3.5, -3.5], [0.5, 3.5, -3.5], [0.5, 8.5, -3.5], [-5.5, 8.5, -3.5], [-5.5, 3.5, -0.2], [0.5, 3.5, -0.2], [0.5, 8.5, -0.2], [-5.5, 8.5, -0.2]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-U-01-0004", "base": "IND280145987621", "domain": "U", "floor": -1, "unit": "PARK-B102", "token": "fd86ae3fca874d8d"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_park_b103', 'flr00000-0000-0000-0000-000000000009', 'Basement Parking Bay #03', 'PARKING', '{"unit_id": "PARK-B103", "owner": "Amitabh Verma (Flat 201 Link)", "carpet_area_m2": 30.0, "volume_m3": 99.0, "is_watertight": true, "ulpin_3d": "IND280145987621-U-01-161F", "domain": "U", "deed_token": "e0462a7283d93264f837cad7617becfa67b16f62586c453adf0d54db36d368cb", "spatial_hash": "161F", "color": "#00D084"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_park_b103_v1', 'ast_park_b103', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-U-01-161F", "base_ulpin": "IND280145987621", "z_min": -3.5, "z_max": -0.2, "poly_2d": [[0.5, 3.5], [6.5, 3.5], [6.5, 8.5], [0.5, 8.5], [0.5, 3.5]], "centroid_local": [3.5, 6.0, -1.85], "bbox_local": [0.5, 3.5, -3.5, 6.5, 8.5, -0.2], "centroid_wgs84": [77.0602358, 28.5823541, 213.15], "vertices_local": [[0.5, 3.5, -3.5], [6.5, 3.5, -3.5], [6.5, 8.5, -3.5], [0.5, 8.5, -3.5], [0.5, 3.5, -0.2], [6.5, 3.5, -0.2], [6.5, 8.5, -0.2], [0.5, 8.5, -0.2]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-U-01-161F", "base": "IND280145987621", "domain": "U", "floor": -1, "unit": "PARK-B103", "token": "e0462a7283d93264"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_park_b104', 'flr00000-0000-0000-0000-000000000009', 'Basement Parking Bay #04', 'PARKING', '{"unit_id": "PARK-B104", "owner": "Sunita Rao (Flat 202 Link)", "carpet_area_m2": 30.0, "volume_m3": 99.0, "is_watertight": true, "ulpin_3d": "IND280145987621-U-01-E59D", "domain": "U", "deed_token": "559fa1a79b4b6504b403577f68784ffc4ccad1ebe1d63fbec46ca391df42bf3c", "spatial_hash": "E59D", "color": "#00D084"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_park_b104_v1', 'ast_park_b104', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-U-01-E59D", "base_ulpin": "IND280145987621", "z_min": -3.5, "z_max": -0.2, "poly_2d": [[-11.5, -8.5], [-5.5, -8.5], [-5.5, -3.5], [-11.5, -3.5], [-11.5, -8.5]], "centroid_local": [-8.5, -6.0, -1.85], "bbox_local": [-11.5, -8.5, -3.5, -5.5, -3.5, -0.2], "centroid_wgs84": [77.0601131, 28.5822459, 213.15], "vertices_local": [[-11.5, -8.5, -3.5], [-5.5, -8.5, -3.5], [-5.5, -3.5, -3.5], [-11.5, -3.5, -3.5], [-11.5, -8.5, -0.2], [-5.5, -8.5, -0.2], [-5.5, -3.5, -0.2], [-11.5, -3.5, -0.2]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-U-01-E59D", "base": "IND280145987621", "domain": "U", "floor": -1, "unit": "PARK-B104", "token": "559fa1a79b4b6504"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_park_b105', 'flr00000-0000-0000-0000-000000000009', 'Basement Parking Bay #05', 'PARKING', '{"unit_id": "PARK-B105", "owner": "Vikram Malhotra (Flat 301 Link)", "carpet_area_m2": 30.0, "volume_m3": 99.0, "is_watertight": true, "ulpin_3d": "IND280145987621-U-01-9FA1", "domain": "U", "deed_token": "4c971e8115d518cd9d29dc7a7ba7a832d34d9cb5625592b5ad60a010b49ba15a", "spatial_hash": "9FA1", "color": "#00D084"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_park_b105_v1', 'ast_park_b105', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-U-01-9FA1", "base_ulpin": "IND280145987621", "z_min": -3.5, "z_max": -0.2, "poly_2d": [[-5.5, -8.5], [0.5, -8.5], [0.5, -3.5], [-5.5, -3.5], [-5.5, -8.5]], "centroid_local": [-2.5, -6.0, -1.85], "bbox_local": [-5.5, -8.5, -3.5, 0.5, -3.5, -0.2], "centroid_wgs84": [77.0601744, 28.5822459, 213.15], "vertices_local": [[-5.5, -8.5, -3.5], [0.5, -8.5, -3.5], [0.5, -3.5, -3.5], [-5.5, -3.5, -3.5], [-5.5, -8.5, -0.2], [0.5, -8.5, -0.2], [0.5, -3.5, -0.2], [-5.5, -3.5, -0.2]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-U-01-9FA1", "base": "IND280145987621", "domain": "U", "floor": -1, "unit": "PARK-B105", "token": "4c971e8115d518cd"}}')
        ON CONFLICT ("id") DO NOTHING;
        

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
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_103', 'flr00000-0000-0000-0000-000000000011', 'Apartment 103 (2BHK Premium)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-103", "owner": "Karan Kapoor", "carpet_area_m2": 81.0, "volume_m3": 226.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+01-AF18", "domain": "A", "deed_token": "aa43fc100eac833a9a0e5d07f04ea4d51e461c07a93809ecc43ae6a166163d36", "spatial_hash": "AF18", "color": "#3b82f6"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_103_v1', 'ast_flat_103', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+01-AF18", "base_ulpin": "IND280145987621", "z_min": 3.2, "z_max": 6.0, "poly_2d": [[-12.0, -9.0], [-3.0, -9.0], [-3.0, 0.0], [-12.0, 0.0], [-12.0, -9.0]], "centroid_local": [-7.5, -4.5, 4.6], "bbox_local": [-12.0, -9.0, 3.2, -3.0, 0.0, 6.0], "centroid_wgs84": [77.0601233, 28.5822594, 219.6], "vertices_local": [[-12.0, -9.0, 3.2], [-3.0, -9.0, 3.2], [-3.0, 0.0, 3.2], [-12.0, 0.0, 3.2], [-12.0, -9.0, 6.0], [-3.0, -9.0, 6.0], [-3.0, 0.0, 6.0], [-12.0, 0.0, 6.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+01-AF18", "base": "IND280145987621", "domain": "A", "floor": 1, "unit": "FLAT-103", "token": "aa43fc100eac833a"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_104', 'flr00000-0000-0000-0000-000000000011', 'Apartment 104 (2BHK Premium)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-104", "owner": "Deepak Joshi", "carpet_area_m2": 81.0, "volume_m3": 226.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+01-4DAC", "domain": "A", "deed_token": "de78d87b4bafb38334a0843c480204a330022efa841f696a67a389deddbbe3f3", "spatial_hash": "4DAC", "color": "#3b82f6"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_104_v1', 'ast_flat_104', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+01-4DAC", "base_ulpin": "IND280145987621", "z_min": 3.2, "z_max": 6.0, "poly_2d": [[3.0, -9.0], [12.0, -9.0], [12.0, 0.0], [3.0, 0.0], [3.0, -9.0]], "centroid_local": [7.5, -4.5, 4.6], "bbox_local": [3.0, -9.0, 3.2, 12.0, 0.0, 6.0], "centroid_wgs84": [77.0602767, 28.5822594, 219.6], "vertices_local": [[3.0, -9.0, 3.2], [12.0, -9.0, 3.2], [12.0, 0.0, 3.2], [3.0, 0.0, 3.2], [3.0, -9.0, 6.0], [12.0, -9.0, 6.0], [12.0, 0.0, 6.0], [3.0, 0.0, 6.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+01-4DAC", "base": "IND280145987621", "domain": "A", "floor": 1, "unit": "FLAT-104", "token": "de78d87b4bafb383"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_lobby_200', 'flr00000-0000-0000-0000-000000000012', 'Floor 2 Elevator Lobby & Fire Corridor', 'PROPERTY_UNIT', '{"unit_id": "LOBBY-200", "owner": "Aura Residency RWA", "carpet_area_m2": 36.0, "volume_m3": 100.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+02-2759", "domain": "A", "deed_token": "5d6f1aa6b81fb9ac7daef4c93b73a1ae02df8c6afd9b2852a993aa7155a8f88e", "spatial_hash": "2759", "color": "#94a3b8"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_lobby_200_v1', 'ast_lobby_200', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+02-2759", "base_ulpin": "IND280145987621", "z_min": 6.2, "z_max": 9.0, "poly_2d": [[-3.0, -3.0], [3.0, -3.0], [3.0, 3.0], [-3.0, 3.0], [-3.0, -3.0]], "centroid_local": [0.0, 0.0, 7.6], "bbox_local": [-3.0, -3.0, 6.2, 3.0, 3.0, 9.0], "centroid_wgs84": [77.0602, 28.5823, 222.6], "vertices_local": [[-3.0, -3.0, 6.2], [3.0, -3.0, 6.2], [3.0, 3.0, 6.2], [-3.0, 3.0, 6.2], [-3.0, -3.0, 9.0], [3.0, -3.0, 9.0], [3.0, 3.0, 9.0], [-3.0, 3.0, 9.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+02-2759", "base": "IND280145987621", "domain": "A", "floor": 2, "unit": "LOBBY-200", "token": "5d6f1aa6b81fb9ac"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_201', 'flr00000-0000-0000-0000-000000000012', 'Apartment 201 (3BHK Executive)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-201", "owner": "Amitabh Verma", "carpet_area_m2": 81.0, "volume_m3": 226.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+02-811E", "domain": "A", "deed_token": "610df58ecb92ae8deb8d494a9999b78dfa8a65bc1424153abc58e3c915a78ea5", "spatial_hash": "811E", "color": "#6366f1"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_201_v1', 'ast_flat_201', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+02-811E", "base_ulpin": "IND280145987621", "z_min": 6.2, "z_max": 9.0, "poly_2d": [[-12.0, 0.0], [-3.0, 0.0], [-3.0, 9.0], [-12.0, 9.0], [-12.0, 0.0]], "centroid_local": [-7.5, 4.5, 7.6], "bbox_local": [-12.0, 0.0, 6.2, -3.0, 9.0, 9.0], "centroid_wgs84": [77.0601233, 28.5823406, 222.6], "vertices_local": [[-12.0, 0.0, 6.2], [-3.0, 0.0, 6.2], [-3.0, 9.0, 6.2], [-12.0, 9.0, 6.2], [-12.0, 0.0, 9.0], [-3.0, 0.0, 9.0], [-3.0, 9.0, 9.0], [-12.0, 9.0, 9.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+02-811E", "base": "IND280145987621", "domain": "A", "floor": 2, "unit": "FLAT-201", "token": "610df58ecb92ae8d"}}')
        ON CONFLICT ("id") DO NOTHING;
        
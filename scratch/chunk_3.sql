
        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_204', 'flr00000-0000-0000-0000-000000000012', 'Apartment 204 (2BHK Premium)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-204", "owner": "Harish Mehta", "carpet_area_m2": 81.0, "volume_m3": 226.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+02-AAF7", "domain": "A", "deed_token": "758a522c91ad32dba5a9bdf3a4d2d82bb75ae73919d2e66e1a737d740f143535", "spatial_hash": "AAF7", "color": "#3b82f6"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_204_v1', 'ast_flat_204', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+02-AAF7", "base_ulpin": "IND280145987621", "z_min": 6.2, "z_max": 9.0, "poly_2d": [[3.0, -9.0], [12.0, -9.0], [12.0, 0.0], [3.0, 0.0], [3.0, -9.0]], "centroid_local": [7.5, -4.5, 7.6], "bbox_local": [3.0, -9.0, 6.2, 12.0, 0.0, 9.0], "centroid_wgs84": [77.0602767, 28.5822594, 222.6], "vertices_local": [[3.0, -9.0, 6.2], [12.0, -9.0, 6.2], [12.0, 0.0, 6.2], [3.0, 0.0, 6.2], [3.0, -9.0, 9.0], [12.0, -9.0, 9.0], [12.0, 0.0, 9.0], [3.0, 0.0, 9.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+02-AAF7", "base": "IND280145987621", "domain": "A", "floor": 2, "unit": "FLAT-204", "token": "758a522c91ad32db"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_lobby_300', 'flr00000-0000-0000-0000-000000000013', 'Floor 3 Elevator Lobby & Fire Corridor', 'PROPERTY_UNIT', '{"unit_id": "LOBBY-300", "owner": "Aura Residency RWA", "carpet_area_m2": 36.0, "volume_m3": 100.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+03-5F17", "domain": "A", "deed_token": "cc5f1d0ceef68a45cd6b130a84066c0744dea64db3c241b19b8161944c455af2", "spatial_hash": "5F17", "color": "#94a3b8"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_lobby_300_v1', 'ast_lobby_300', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+03-5F17", "base_ulpin": "IND280145987621", "z_min": 9.2, "z_max": 12.0, "poly_2d": [[-3.0, -3.0], [3.0, -3.0], [3.0, 3.0], [-3.0, 3.0], [-3.0, -3.0]], "centroid_local": [0.0, -0.0, 10.6], "bbox_local": [-3.0, -3.0, 9.2, 3.0, 3.0, 12.0], "centroid_wgs84": [77.0602, 28.5823, 225.6], "vertices_local": [[-3.0, -3.0, 9.2], [3.0, -3.0, 9.2], [3.0, 3.0, 9.2], [-3.0, 3.0, 9.2], [-3.0, -3.0, 12.0], [3.0, -3.0, 12.0], [3.0, 3.0, 12.0], [-3.0, 3.0, 12.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+03-5F17", "base": "IND280145987621", "domain": "A", "floor": 3, "unit": "LOBBY-300", "token": "cc5f1d0ceef68a45"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_301', 'flr00000-0000-0000-0000-000000000013', 'Apartment 301 (3BHK Executive)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-301", "owner": "Vikram Malhotra", "carpet_area_m2": 81.0, "volume_m3": 226.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+03-3BD9", "domain": "A", "deed_token": "5827884f00632f143038565901235b6aaa1cf6c073421e25d38b7b4f7ae776e7", "spatial_hash": "3BD9", "color": "#6366f1"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_301_v1', 'ast_flat_301', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+03-3BD9", "base_ulpin": "IND280145987621", "z_min": 9.2, "z_max": 12.0, "poly_2d": [[-12.0, 0.0], [-3.0, 0.0], [-3.0, 9.0], [-12.0, 9.0], [-12.0, 0.0]], "centroid_local": [-7.5, 4.5, 10.6], "bbox_local": [-12.0, 0.0, 9.2, -3.0, 9.0, 12.0], "centroid_wgs84": [77.0601233, 28.5823406, 225.6], "vertices_local": [[-12.0, 0.0, 9.2], [-3.0, 0.0, 9.2], [-3.0, 9.0, 9.2], [-12.0, 9.0, 9.2], [-12.0, 0.0, 12.0], [-3.0, 0.0, 12.0], [-3.0, 9.0, 12.0], [-12.0, 9.0, 12.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+03-3BD9", "base": "IND280145987621", "domain": "A", "floor": 3, "unit": "FLAT-301", "token": "5827884f00632f14"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_302', 'flr00000-0000-0000-0000-000000000013', 'Apartment 302 (3BHK Executive)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-302", "owner": "Suresh Raina", "carpet_area_m2": 81.0, "volume_m3": 226.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+03-8460", "domain": "A", "deed_token": "52ffd0838ddc3b09c6cf32ab4e79b1f63fc4f5df3c867e4e3680e1a6b91f7e65", "spatial_hash": "8460", "color": "#6366f1"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_302_v1', 'ast_flat_302', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+03-8460", "base_ulpin": "IND280145987621", "z_min": 9.2, "z_max": 12.0, "poly_2d": [[3.0, 0.0], [12.0, 0.0], [12.0, 9.0], [3.0, 9.0], [3.0, 0.0]], "centroid_local": [7.5, 4.5, 10.6], "bbox_local": [3.0, 0.0, 9.2, 12.0, 9.0, 12.0], "centroid_wgs84": [77.0602767, 28.5823406, 225.6], "vertices_local": [[3.0, 0.0, 9.2], [12.0, 0.0, 9.2], [12.0, 9.0, 9.2], [3.0, 9.0, 9.2], [3.0, 0.0, 12.0], [12.0, 0.0, 12.0], [12.0, 9.0, 12.0], [3.0, 9.0, 12.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+03-8460", "base": "IND280145987621", "domain": "A", "floor": 3, "unit": "FLAT-302", "token": "52ffd0838ddc3b09"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_303', 'flr00000-0000-0000-0000-000000000013', 'Apartment 303 (2BHK Premium)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-303", "owner": "Pooja Hegde", "carpet_area_m2": 81.0, "volume_m3": 226.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+03-89BC", "domain": "A", "deed_token": "9014d8958176ea39587e2eac6765a8fc848676c4910c5b33a2e89e94a5a81ba0", "spatial_hash": "89BC", "color": "#3b82f6"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_303_v1', 'ast_flat_303', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+03-89BC", "base_ulpin": "IND280145987621", "z_min": 9.2, "z_max": 12.0, "poly_2d": [[-12.0, -9.0], [-3.0, -9.0], [-3.0, 0.0], [-12.0, 0.0], [-12.0, -9.0]], "centroid_local": [-7.5, -4.5, 10.6], "bbox_local": [-12.0, -9.0, 9.2, -3.0, 0.0, 12.0], "centroid_wgs84": [77.0601233, 28.5822594, 225.6], "vertices_local": [[-12.0, -9.0, 9.2], [-3.0, -9.0, 9.2], [-3.0, 0.0, 9.2], [-12.0, 0.0, 9.2], [-12.0, -9.0, 12.0], [-3.0, -9.0, 12.0], [-3.0, 0.0, 12.0], [-12.0, 0.0, 12.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+03-89BC", "base": "IND280145987621", "domain": "A", "floor": 3, "unit": "FLAT-303", "token": "9014d8958176ea39"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_304', 'flr00000-0000-0000-0000-000000000013', 'Apartment 304 (2BHK Premium)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-304", "owner": "Naveen Jindal", "carpet_area_m2": 81.0, "volume_m3": 226.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+03-983A", "domain": "A", "deed_token": "59560e8d7c5be0df85c1ccdf211d0357e6511f4f95fb1eccc0fa9a98bc7d3e9f", "spatial_hash": "983A", "color": "#3b82f6"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_304_v1', 'ast_flat_304', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+03-983A", "base_ulpin": "IND280145987621", "z_min": 9.2, "z_max": 12.0, "poly_2d": [[3.0, -9.0], [12.0, -9.0], [12.0, 0.0], [3.0, 0.0], [3.0, -9.0]], "centroid_local": [7.5, -4.5, 10.6], "bbox_local": [3.0, -9.0, 9.2, 12.0, 0.0, 12.0], "centroid_wgs84": [77.0602767, 28.5822594, 225.6], "vertices_local": [[3.0, -9.0, 9.2], [12.0, -9.0, 9.2], [12.0, 0.0, 9.2], [3.0, 0.0, 9.2], [3.0, -9.0, 12.0], [12.0, -9.0, 12.0], [12.0, 0.0, 12.0], [3.0, 0.0, 12.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+03-983A", "base": "IND280145987621", "domain": "A", "floor": 3, "unit": "FLAT-304", "token": "59560e8d7c5be0df"}}')
        ON CONFLICT ("id") DO NOTHING;
        
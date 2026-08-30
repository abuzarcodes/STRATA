
        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_202', 'flr00000-0000-0000-0000-000000000012', 'Apartment 202 (3BHK Deluxe Encroached)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-202", "owner": "Sunita Rao (Cantilever Balcony)", "carpet_area_m2": 95.0, "volume_m3": 266.0, "is_watertight": true, "ulpin_3d": "IND280145987621-A+02-244A", "domain": "A", "deed_token": "289dca9aad9de0f2cd7e58c7455e51f75bfdb02e780cc48511ec7e93100a74f9", "spatial_hash": "244A", "color": "#ef4444"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_202_v1', 'ast_flat_202', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+02-244A", "base_ulpin": "IND280145987621", "z_min": 6.2, "z_max": 9.0, "poly_2d": [[3.0, 0.0], [12.0, 0.0], [12.0, 9.0], [11.0, 9.0], [11.0, 11.0], [4.0, 11.0], [4.0, 9.0], [3.0, 9.0], [3.0, 0.0]], "centroid_local": [7.5, 5.344, 7.6], "bbox_local": [3.0, 0.0, 6.2, 12.0, 11.0, 9.0], "centroid_wgs84": [77.0602767, 28.5823482, 222.6], "vertices_local": [[3.0, 0.0, 6.2], [12.0, 0.0, 6.2], [12.0, 9.0, 6.2], [11.0, 9.0, 6.2], [11.0, 11.0, 6.2], [4.0, 11.0, 6.2], [4.0, 9.0, 6.2], [3.0, 9.0, 6.2], [3.0, 0.0, 9.0], [12.0, 0.0, 9.0], [12.0, 9.0, 9.0], [11.0, 9.0, 9.0], [11.0, 11.0, 9.0], [4.0, 11.0, 9.0], [4.0, 9.0, 9.0], [3.0, 9.0, 9.0]], "faces": [[6, 0, 7], [0, 2, 1], [3, 5, 4], [0, 3, 2], [3, 6, 5], [6, 3, 0], [14, 15, 8], [8, 9, 10], [11, 12, 13], [8, 10, 11], [11, 13, 14], [14, 8, 11], [0, 1, 9], [0, 9, 8], [1, 2, 10], [1, 10, 9], [2, 3, 11], [2, 11, 10], [3, 4, 12], [3, 12, 11], [4, 5, 13], [4, 13, 12], [5, 6, 14], [5, 14, 13], [6, 7, 15], [6, 15, 14], [7, 0, 8], [7, 8, 15]], "qr_payload": {"id": "IND280145987621-A+02-244A", "base": "IND280145987621", "domain": "A", "floor": 2, "unit": "FLAT-202", "token": "289dca9aad9de0f2"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_203', 'flr00000-0000-0000-0000-000000000012', 'Apartment 203 (2BHK Premium)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-203", "owner": "Ananya Sen", "carpet_area_m2": 81.0, "volume_m3": 226.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+02-0D80", "domain": "A", "deed_token": "cd8093fecd767bd5216c2a902bc6e9af6264b8547c1841ceb98fb8576ae4fd6f", "spatial_hash": "0D80", "color": "#3b82f6"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_203_v1', 'ast_flat_203', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+02-0D80", "base_ulpin": "IND280145987621", "z_min": 6.2, "z_max": 9.0, "poly_2d": [[-12.0, -9.0], [-3.0, -9.0], [-3.0, 0.0], [-12.0, 0.0], [-12.0, -9.0]], "centroid_local": [-7.5, -4.5, 7.6], "bbox_local": [-12.0, -9.0, 6.2, -3.0, 0.0, 9.0], "centroid_wgs84": [77.0601233, 28.5822594, 222.6], "vertices_local": [[-12.0, -9.0, 6.2], [-3.0, -9.0, 6.2], [-3.0, 0.0, 6.2], [-12.0, 0.0, 6.2], [-12.0, -9.0, 9.0], [-3.0, -9.0, 9.0], [-3.0, 0.0, 9.0], [-12.0, 0.0, 9.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+02-0D80", "base": "IND280145987621", "domain": "A", "floor": 2, "unit": "FLAT-203", "token": "cd8093fecd767bd5"}}')
        ON CONFLICT ("id") DO NOTHING;
        

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
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_lobby_400', 'flr00000-0000-0000-0000-000000000014', 'Floor 4 Elevator Lobby & Fire Corridor', 'PROPERTY_UNIT', '{"unit_id": "LOBBY-400", "owner": "Aura Residency RWA", "carpet_area_m2": 36.0, "volume_m3": 100.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+04-757C", "domain": "A", "deed_token": "3e6a2118e4487056001b94883208a45f48b937b1264644c310d2e8f79962df58", "spatial_hash": "757C", "color": "#94a3b8"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_lobby_400_v1', 'ast_lobby_400', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+04-757C", "base_ulpin": "IND280145987621", "z_min": 12.2, "z_max": 15.0, "poly_2d": [[-3.0, -3.0], [3.0, -3.0], [3.0, 3.0], [-3.0, 3.0], [-3.0, -3.0]], "centroid_local": [0.0, -0.0, 13.6], "bbox_local": [-3.0, -3.0, 12.2, 3.0, 3.0, 15.0], "centroid_wgs84": [77.0602, 28.5823, 228.6], "vertices_local": [[-3.0, -3.0, 12.2], [3.0, -3.0, 12.2], [3.0, 3.0, 12.2], [-3.0, 3.0, 12.2], [-3.0, -3.0, 15.0], [3.0, -3.0, 15.0], [3.0, 3.0, 15.0], [-3.0, 3.0, 15.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+04-757C", "base": "IND280145987621", "domain": "A", "floor": 4, "unit": "LOBBY-400", "token": "3e6a2118e4487056"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_401', 'flr00000-0000-0000-0000-000000000014', 'Apartment 401 (Penthouse North-A)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-401", "owner": "Rohan Singhania", "carpet_area_m2": 81.0, "volume_m3": 226.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+04-0ABB", "domain": "A", "deed_token": "89e658e1005abbe91cc462959488330611480db87329ce7331bf2e99fa0bb592", "spatial_hash": "0ABB", "color": "#6366f1"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_401_v1', 'ast_flat_401', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+04-0ABB", "base_ulpin": "IND280145987621", "z_min": 12.2, "z_max": 15.0, "poly_2d": [[-12.0, 0.0], [-3.0, 0.0], [-3.0, 9.0], [-12.0, 9.0], [-12.0, 0.0]], "centroid_local": [-7.5, 4.5, 13.6], "bbox_local": [-12.0, 0.0, 12.2, -3.0, 9.0, 15.0], "centroid_wgs84": [77.0601233, 28.5823406, 228.6], "vertices_local": [[-12.0, 0.0, 12.2], [-3.0, 0.0, 12.2], [-3.0, 9.0, 12.2], [-12.0, 9.0, 12.2], [-12.0, 0.0, 15.0], [-3.0, 0.0, 15.0], [-3.0, 9.0, 15.0], [-12.0, 9.0, 15.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+04-0ABB", "base": "IND280145987621", "domain": "A", "floor": 4, "unit": "FLAT-401", "token": "89e658e1005abbe9"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_402', 'flr00000-0000-0000-0000-000000000014', 'Apartment 402 (Penthouse North-B)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-402", "owner": "Manish Goel", "carpet_area_m2": 81.0, "volume_m3": 226.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+04-3CCA", "domain": "A", "deed_token": "82d3be3c32e32427705965d819ad07c4afb9ee33b0b72d8bc0a3941461f55b20", "spatial_hash": "3CCA", "color": "#6366f1"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_402_v1', 'ast_flat_402', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+04-3CCA", "base_ulpin": "IND280145987621", "z_min": 12.2, "z_max": 15.0, "poly_2d": [[3.0, 0.0], [12.0, 0.0], [12.0, 9.0], [3.0, 9.0], [3.0, 0.0]], "centroid_local": [7.5, 4.5, 13.6], "bbox_local": [3.0, 0.0, 12.2, 12.0, 9.0, 15.0], "centroid_wgs84": [77.0602767, 28.5823406, 228.6], "vertices_local": [[3.0, 0.0, 12.2], [12.0, 0.0, 12.2], [12.0, 9.0, 12.2], [3.0, 9.0, 12.2], [3.0, 0.0, 15.0], [12.0, 0.0, 15.0], [12.0, 9.0, 15.0], [3.0, 9.0, 15.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+04-3CCA", "base": "IND280145987621", "domain": "A", "floor": 4, "unit": "FLAT-402", "token": "82d3be3c32e32427"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_403', 'flr00000-0000-0000-0000-000000000014', 'Apartment 403 (Penthouse South-A)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-403", "owner": "Sanjay Dutt", "carpet_area_m2": 81.0, "volume_m3": 226.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+04-95CE", "domain": "A", "deed_token": "5e3024c0786d4c99699850a17a4c696609687dc6b049cc8c06ff88c95f1b1e30", "spatial_hash": "95CE", "color": "#6366f1"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_403_v1', 'ast_flat_403', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+04-95CE", "base_ulpin": "IND280145987621", "z_min": 12.2, "z_max": 15.0, "poly_2d": [[-12.0, -9.0], [-3.0, -9.0], [-3.0, 0.0], [-12.0, 0.0], [-12.0, -9.0]], "centroid_local": [-7.5, -4.5, 13.6], "bbox_local": [-12.0, -9.0, 12.2, -3.0, 0.0, 15.0], "centroid_wgs84": [77.0601233, 28.5822594, 228.6], "vertices_local": [[-12.0, -9.0, 12.2], [-3.0, -9.0, 12.2], [-3.0, 0.0, 12.2], [-12.0, 0.0, 12.2], [-12.0, -9.0, 15.0], [-3.0, -9.0, 15.0], [-3.0, 0.0, 15.0], [-12.0, 0.0, 15.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+04-95CE", "base": "IND280145987621", "domain": "A", "floor": 4, "unit": "FLAT-403", "token": "5e3024c0786d4c99"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_flat_404', 'flr00000-0000-0000-0000-000000000014', 'Apartment 404 (Penthouse South-B)', 'PROPERTY_UNIT', '{"unit_id": "FLAT-404", "owner": "Alok Nath", "carpet_area_m2": 81.0, "volume_m3": 226.8, "is_watertight": true, "ulpin_3d": "IND280145987621-A+04-5281", "domain": "A", "deed_token": "07d8e1d8c031004da9cec603f4f2d3d15dd21e14f506aee7922204f6c8671618", "spatial_hash": "5281", "color": "#6366f1"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_flat_404_v1', 'ast_flat_404', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+04-5281", "base_ulpin": "IND280145987621", "z_min": 12.2, "z_max": 15.0, "poly_2d": [[3.0, -9.0], [12.0, -9.0], [12.0, 0.0], [3.0, 0.0], [3.0, -9.0]], "centroid_local": [7.5, -4.5, 13.6], "bbox_local": [3.0, -9.0, 12.2, 12.0, 0.0, 15.0], "centroid_wgs84": [77.0602767, 28.5822594, 228.6], "vertices_local": [[3.0, -9.0, 12.2], [12.0, -9.0, 12.2], [12.0, 0.0, 12.2], [3.0, 0.0, 12.2], [3.0, -9.0, 15.0], [12.0, -9.0, 15.0], [12.0, 0.0, 15.0], [3.0, 0.0, 15.0]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+04-5281", "base": "IND280145987621", "domain": "A", "floor": 4, "unit": "FLAT-404", "token": "07d8e1d8c031004d"}}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "spatial_assets" ("id", "floorId", "name", "type", "metadata")
        VALUES ('ast_roof_501', 'flr00000-0000-0000-0000-000000000015', 'Terrace Solar Array & Overhead Water Storage', 'PROPERTY_UNIT', '{"unit_id": "ROOF-501", "owner": "Aura Residency RWA", "carpet_area_m2": 432.0, "volume_m3": 993.6, "is_watertight": true, "ulpin_3d": "IND280145987621-A+05-A049", "domain": "A", "deed_token": "f5c6ecb6956652bb7427d4439e4848c6176b4cf4556290d65ddf9e0e05953cad", "spatial_hash": "A049", "color": "#0ea5e9"}')
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "geometry_versions" ("id", "spatialAssetId", "version", "source", "status", "geometryData")
        VALUES ('gm_roof_501_v1', 'ast_roof_501', 1, '3d_cadastre_survey', 'active', '{"ulpin_3d": "IND280145987621-A+05-A049", "base_ulpin": "IND280145987621", "z_min": 15.2, "z_max": 17.5, "poly_2d": [[-12.0, -9.0], [12.0, -9.0], [12.0, 9.0], [-12.0, 9.0], [-12.0, -9.0]], "centroid_local": [0.0, 0.0, 16.35], "bbox_local": [-12.0, -9.0, 15.2, 12.0, 9.0, 17.5], "centroid_wgs84": [77.0602, 28.5823, 231.35], "vertices_local": [[-12.0, -9.0, 15.2], [12.0, -9.0, 15.2], [12.0, 9.0, 15.2], [-12.0, 9.0, 15.2], [-12.0, -9.0, 17.5], [12.0, -9.0, 17.5], [12.0, 9.0, 17.5], [-12.0, 9.0, 17.5]], "faces": [[2, 0, 3], [0, 2, 1], [6, 7, 4], [4, 5, 6], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]], "qr_payload": {"id": "IND280145987621-A+05-A049", "base": "IND280145987621", "domain": "A", "floor": 5, "unit": "ROOF-501", "token": "f5c6ecb6956652bb"}}')
        ON CONFLICT ("id") DO NOTHING;
        
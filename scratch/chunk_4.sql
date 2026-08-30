
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
        
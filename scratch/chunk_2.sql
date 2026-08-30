
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
        
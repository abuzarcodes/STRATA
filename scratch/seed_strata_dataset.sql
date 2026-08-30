-- Seeding STRATA Dwarka 3D Society Dataset
BEGIN;

    INSERT INTO "strata_users" ("id", "email", "passwordHash", "name", "role", "isActive")
    VALUES 
      ('u0000000-0000-0000-0000-000000000001', 'admin@strata.cadastre.gov.in', '$2b$10$1WbMhXfVbFwD2C6Q7T8.reZbL8q9o4V2kC6e6tJ2G7qM7m9Y2y1i2', 'National Cadastre Administrator', 'ADMIN', true),
      ('u0000000-0000-0000-0000-000000000002', 'rajesh.verma@surveyor.gov.in', '$2b$10$1WbMhXfVbFwD2C6Q7T8.reZbL8q9o4V2kC6e6tJ2G7qM7m9Y2y1i2', 'Rajesh Verma (Senior Cadastral Surveyor)', 'SURVEYOR', true),
      ('u0000000-0000-0000-0000-000000000003', 'priya.sharma@cadastre.gov.in', '$2b$10$1WbMhXfVbFwD2C6Q7T8.reZbL8q9o4V2kC6e6tJ2G7qM7m9Y2y1i2', 'Priya Sharma (Verification Officer)', 'REVIEWER', true),
      ('u0000000-0000-0000-0000-000000000004', 'sunita.rao@auragroup.in', '$2b$10$1WbMhXfVbFwD2C6Q7T8.reZbL8q9o4V2kC6e6tJ2G7qM7m9Y2y1i2', 'Sunita Rao (Society Secretary)', 'PROPERTY_OWNER', true)
    ON CONFLICT ("id") DO NOTHING;
    

    INSERT INTO "projects" ("id", "name", "description", "ownerId", "status")
    VALUES ('p0000000-0000-0000-0000-000000000001', 'Aura Residency 3D Cadastral Survey & 3D-ULPIN Pilot', '3D Cadastral registration and air-rights verification for Aura Residency CGHS, Sector 10 Dwarka', 'u0000000-0000-0000-0000-000000000004', 'ACTIVE')
    ON CONFLICT ("id") DO NOTHING;
    

    INSERT INTO "project_assignments" ("id", "projectId", "userId", "assignmentRole", "assignedById")
    VALUES ('pa000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000002', 'SURVEYOR', 'u0000000-0000-0000-0000-000000000001')
    ON CONFLICT ("userId", "projectId") DO NOTHING;
    

    INSERT INTO "property_applications" (
      "id", "applicationNumber", "ownerId", "propertyName", "propertyType", "description",
      "addressLine1", "locality", "district", "state", "postalCode", "latitude", "longitude",
      "declaredArea", "declaredBuildingCount", "declaredFloorCount", "status", "projectId"
    ) VALUES (
      'app00000-0000-0000-0000-000000000001', 'APP-2026-DLR-0012', 'u0000000-0000-0000-0000-000000000004', 'Aura Residency CGHS', 'RESIDENTIAL',
      'High-density vertical residential complex with basement parking and rooftop utility rights.',
      'Plot 12, Sector 10', 'Dwarka', 'South West Delhi', '07 (Delhi NCT)', '110075',
      28.5823, 77.0602,
      2533.0, 1, 8, 'APPROVED', 'p0000000-0000-0000-0000-000000000001'
    ) ON CONFLICT ("id") DO NOTHING;
    

    INSERT INTO "parcels" ("id", "projectId", "name", "parcelNumber", "area", "metadata")
    VALUES ('parc0000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Aura Residency CGHS', 'IND280145987621', 3200.0, '{"local_coordinates": [[-18.0, -14.0], [18.0, -14.0], [18.0, 14.0], [-18.0, 14.0], [-18.0, -14.0]], "wgs84_coordinates": [[77.060016, 28.5821737, 215.0], [77.060384, 28.5821737, 215.0], [77.060384, 28.5824263, 215.0], [77.060016, 28.5824263, 215.0], [77.060016, 28.5821737, 215.0]]}')
    ON CONFLICT ("id") DO NOTHING;
    

    INSERT INTO "buildings" ("id", "parcelId", "name", "numberOfFloors", "metadata")
    VALUES ('bldg0000-0000-0000-0000-000000000001', 'parc0000-0000-0000-0000-000000000001', 'Tower A (Residential & Stilt/Basement)', 8, '{"base_ulpin": "IND280145987621", "elevation_msl": 215.0}')
    ON CONFLICT ("id") DO NOTHING;
    

        INSERT INTO "floors" ("id", "buildingId", "level", "elevation", "height")
        VALUES ('flr00000-0000-0000-0000-000000000009', 'bldg0000-0000-0000-0000-000000000001', -1, -3.0, 3.0)
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "floors" ("id", "buildingId", "level", "elevation", "height")
        VALUES ('flr00000-0000-0000-0000-000000000010', 'bldg0000-0000-0000-0000-000000000001', 0, 0.0, 3.0)
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "floors" ("id", "buildingId", "level", "elevation", "height")
        VALUES ('flr00000-0000-0000-0000-000000000011', 'bldg0000-0000-0000-0000-000000000001', 1, 3.0, 3.0)
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "floors" ("id", "buildingId", "level", "elevation", "height")
        VALUES ('flr00000-0000-0000-0000-000000000012', 'bldg0000-0000-0000-0000-000000000001', 2, 6.0, 3.0)
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "floors" ("id", "buildingId", "level", "elevation", "height")
        VALUES ('flr00000-0000-0000-0000-000000000013', 'bldg0000-0000-0000-0000-000000000001', 3, 9.0, 3.0)
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "floors" ("id", "buildingId", "level", "elevation", "height")
        VALUES ('flr00000-0000-0000-0000-000000000014', 'bldg0000-0000-0000-0000-000000000001', 4, 12.0, 3.0)
        ON CONFLICT ("id") DO NOTHING;
        

        INSERT INTO "floors" ("id", "buildingId", "level", "elevation", "height")
        VALUES ('flr00000-0000-0000-0000-000000000015', 'bldg0000-0000-0000-0000-000000000001', 5, 15.0, 3.0)
        ON CONFLICT ("id") DO NOTHING;
        

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
        

    INSERT INTO "violations" ("id", "spatialAssetId", "type", "severity", "description", "resolved", "details")
    VALUES (
      'viol0000-0000-0000-0000-000000000001',
      'ast_flat_202',
      'ENCROACHMENT',
      'HIGH',
      'Apartment 202 (3BHK Deluxe Encroached) cantilevered extension exceeds approved setback envelope by 14.0 m² (39.2 m³).',
      false,
      '{"violation_type": "AIR_RIGHTS_SETBACK_ENCROACHMENT", "encroachment_area_m2": 14.0, "encroachment_volume_m3": 39.2, "domain": "A", "floor_level": 2}'
    ) ON CONFLICT ("id") DO NOTHING;
    

    INSERT INTO "violations" ("id", "spatialAssetId", "type", "severity", "description", "resolved", "details")
    VALUES (
      'viol0000-0000-0000-0000-000000000002',
      'ast_park_b106',
      'BOUNDARY_CONFLICT',
      'CRITICAL',
      'Basement Parking Bay #06 (Unapproved Extension) breaches the outer parcel boundary by 7.5 m² (24.75 m³).',
      false,
      '{"violation_type": "SUBSURFACE_BOUNDARY_BREACH", "encroachment_area_m2": 7.5, "encroachment_volume_m3": 24.75, "domain": "U", "floor_level": -1}'
    ) ON CONFLICT ("id") DO NOTHING;
    
COMMIT;
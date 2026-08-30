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

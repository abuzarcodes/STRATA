import json

with open("scratch/indian_colony_analysis.json", "r", encoding="utf-8") as f:
    data = json.load(f)

hierarchy = data["hierarchy"]
summary = hierarchy["summary"]
candidates = hierarchy.get("building_candidates", [])

run_id = "run_indian_colony_2026_01"
scene_id = "INDIAN_COLONY_DWARKA_01"

sql_lines = []
sql_lines.append(f"""
INSERT INTO "ai_processing_runs" (
  "run_id", "scene_id", "source_crs", "total_detected_buildings",
  "accepted_building_candidates", "rejected_building_candidates",
  "pipeline_version", "metadata"
) VALUES (
  '{run_id}', '{scene_id}', 'EPSG:3857', {summary.get('total_detected_buildings', len(candidates))},
  {summary.get('accepted_building_candidates', len(candidates))}, {summary.get('rejected_building_candidates', 0)},
  'SIH-2026-v6.0-FINAL', '{{"density_pts_sqm": 35.0, "scene_type": "Dense Indian Urban Settlement"}}'
) ON CONFLICT ("run_id") DO NOTHING;
""")

for idx, b in enumerate(candidates):
    b_id = f"b_cand_{run_id}_{idx+1:03d}"
    geom = b.get("geometry", {})
    height_info = b.get("height", {})
    floors = b.get("floors", {})
    
    footprint_json = json.dumps(geom.get("footprint_polygon", [])).replace("'", "''")
    h = height_info.get("height_m", 0.0)
    base_z = height_info.get("base_z_m", 0.0)
    roof_z = height_info.get("roof_z_m", 0.0)
    area = geom.get("footprint_area_sqm", 0.0)
    pts_count = b.get("point_count", 0)
    floor_count = floors.get("candidate_floor_count", 1)

    sql_lines.append(f"""
    INSERT INTO "ai_candidate_buildings" (
      "building_id", "run_id", "scene_id", "status", "point_count",
      "footprint_area_sqm", "height_m", "base_z_m", "roof_z_m",
      "candidate_floor_count", "is_legal_boundary", "requires_surveyor_validation",
      "legal_disclaimer", "footprint_geojson"
    ) VALUES (
      '{b_id}', '{run_id}', '{scene_id}', '{b.get('status', 'GEOMETRICALLY_VALIDATED')}', {pts_count},
      {area}, {h}, {base_z}, {roof_z},
      {floor_count}, false, true,
      'AI PREDICTION ONLY. Candidate evidence generated for surveyor review.', '{footprint_json}'
    ) ON CONFLICT ("building_id") DO NOTHING;
    """)

# Candidate Property Record
prop_id = f"prop_cand_{run_id}"
sql_lines.append(f"""
INSERT INTO "ai_candidate_properties" (
  "property_candidate_id", "run_id", "scene_id", "parcel_association_status",
  "building_candidates_count", "verification_status", "legal_disclaimer", "candidate_ulpin_id"
) VALUES (
  '{prop_id}', '{run_id}', '{scene_id}', 'SYNTHETIC_SIMULATED_PARCEL',
  {len(candidates)}, 'CANDIDATE',
  'AI PREDICTION ONLY. Candidate evidence generated for surveyor review.', 'ULPIN-CAND-2026-IND-001'
) ON CONFLICT ("property_candidate_id") DO NOTHING;
""")

with open("scratch/store_ai_run.sql", "w", encoding="utf-8") as out:
    out.write("\n".join(sql_lines))

print("SQL for storing AI Run generated successfully.")


INSERT INTO "ai_processing_runs" (
  "run_id", "scene_id", "source_crs", "total_detected_buildings",
  "accepted_building_candidates", "rejected_building_candidates",
  "pipeline_version", "metadata"
) VALUES (
  'run_indian_colony_2026_01', 'INDIAN_COLONY_DWARKA_01', 'EPSG:3857', 11,
  11, 0,
  'SIH-2026-v6.0-FINAL', '{"density_pts_sqm": 35.0, "scene_type": "Dense Indian Urban Settlement"}'
) ON CONFLICT ("run_id") DO NOTHING;


    INSERT INTO "ai_candidate_buildings" (
      "building_id", "run_id", "scene_id", "status", "point_count",
      "footprint_area_sqm", "height_m", "base_z_m", "roof_z_m",
      "candidate_floor_count", "is_legal_boundary", "requires_surveyor_validation",
      "legal_disclaimer", "footprint_geojson"
    ) VALUES (
      'b_cand_run_indian_colony_2026_01_001', 'run_indian_colony_2026_01', 'INDIAN_COLONY_DWARKA_01', 'GEOMETRICALLY_VALIDATED', 118,
      21.9, 6.527, -0.014, 6.512,
      2, false, true,
      'AI PREDICTION ONLY. Candidate evidence generated for surveyor review.', '[[28.597804120854313, 18.0], [31.186481703439178, 10.854679063153029], [31.77797755425494, 10.0], [32.73974103238207, 10.0], [32.8, 10.106164376794263], [32.8, 12.507151073458711], [32.8, 14.175653200282195], [32.8, 14.537747820645837], [32.8, 16.586695491244615], [32.8, 17.026093940691617], [32.8, 17.683953496890673], [32.8, 17.795971087918367], [32.8, 17.963241751601345], [32.700933030281604, 18.0], [32.27422653444877, 18.0], [29.260997738345566, 18.0], [29.259672230467554, 18.0], [28.597804120854313, 18.0]]'
    ) ON CONFLICT ("building_id") DO NOTHING;
    

    INSERT INTO "ai_candidate_buildings" (
      "building_id", "run_id", "scene_id", "status", "point_count",
      "footprint_area_sqm", "height_m", "base_z_m", "roof_z_m",
      "candidate_floor_count", "is_legal_boundary", "requires_surveyor_validation",
      "legal_disclaimer", "footprint_geojson"
    ) VALUES (
      'b_cand_run_indian_colony_2026_01_002', 'run_indian_colony_2026_01', 'INDIAN_COLONY_DWARKA_01', 'GEOMETRICALLY_VALIDATED', 1490,
      207.19, 13.514, -0.014, 13.5,
      5, false, true,
      'AI PREDICTION ONLY. Candidate evidence generated for surveyor review.', '[[9.664429530201343, 10.872483221476509], [10.0, 10.235483207185029], [10.135314458959947, 10.0], [11.0, 8.683169361791528], [11.326274916364657, 8.5], [15.347482866708443, 8.5], [19.783257277120263, 8.5], [20.250624146086686, 8.5], [20.73622292010365, 8.5], [20.92235960907249, 8.5], [30.320547880397307, 10.0], [30.637098347957867, 10.072237167143872], [31.897429044488984, 12.902556495724461], [31.76926485174269, 13.629749549949453], [29.42910324385994, 18.0], [21.99963907214537, 19.0], [10.945052054585517, 19.0], [10.181948999556715, 19.0], [10.077574193944365, 19.0], [10.0, 18.864151353265797], [9.664429530201343, 10.872483221476509]]'
    ) ON CONFLICT ("building_id") DO NOTHING;
    

    INSERT INTO "ai_candidate_buildings" (
      "building_id", "run_id", "scene_id", "status", "point_count",
      "footprint_area_sqm", "height_m", "base_z_m", "roof_z_m",
      "candidate_floor_count", "is_legal_boundary", "requires_surveyor_validation",
      "legal_disclaimer", "footprint_geojson"
    ) VALUES (
      'b_cand_run_indian_colony_2026_01_003', 'run_indian_colony_2026_01', 'INDIAN_COLONY_DWARKA_01', 'GEOMETRICALLY_VALIDATED', 25,
      5.3, 2.992, -0.014, 2.978,
      1, false, true,
      'AI PREDICTION ONLY. Candidate evidence generated for surveyor review.', '[[24.387109354147, 10.0], [29.340284380840366, 10.0], [29.396338375616164, 10.0], [28.00601253540263, 11.935151344671166], [27.6174441458558, 11.976581958647596], [24.387109354147, 10.0]]'
    ) ON CONFLICT ("building_id") DO NOTHING;
    

    INSERT INTO "ai_candidate_buildings" (
      "building_id", "run_id", "scene_id", "status", "point_count",
      "footprint_area_sqm", "height_m", "base_z_m", "roof_z_m",
      "candidate_floor_count", "is_legal_boundary", "requires_surveyor_validation",
      "legal_disclaimer", "footprint_geojson"
    ) VALUES (
      'b_cand_run_indian_colony_2026_01_004', 'run_indian_colony_2026_01', 'INDIAN_COLONY_DWARKA_01', 'GEOMETRICALLY_VALIDATED', 52,
      17.96, 6.573, -0.014, 6.558,
      2, false, true,
      'AI PREDICTION ONLY. Candidate evidence generated for surveyor review.', '[[15.0, 33.315286894443574], [15.0, 31.79004797106238], [15.0, 28.210417514359555], [15.0, 25.491821553911226], [16.481878724458443, 25.0], [16.484851595151962, 25.0], [16.70816786030154, 25.0], [17.963621129316273, 29.918055833564022], [15.0, 34.53363650307015], [15.0, 33.315286894443574]]'
    ) ON CONFLICT ("building_id") DO NOTHING;
    

    INSERT INTO "ai_candidate_buildings" (
      "building_id", "run_id", "scene_id", "status", "point_count",
      "footprint_area_sqm", "height_m", "base_z_m", "roof_z_m",
      "candidate_floor_count", "is_legal_boundary", "requires_surveyor_validation",
      "legal_disclaimer", "footprint_geojson"
    ) VALUES (
      'b_cand_run_indian_colony_2026_01_005', 'run_indian_colony_2026_01', 'INDIAN_COLONY_DWARKA_01', 'GEOMETRICALLY_VALIDATED', 49,
      11.32, 5.961, -0.014, 5.946,
      2, false, true,
      'AI PREDICTION ONLY. Candidate evidence generated for surveyor review.', '[[21.527048290787036, 25.0], [24.851572218534066, 25.0], [24.96301753587862, 25.0], [25.249761580588, 25.0], [25.582454777910343, 25.52669008666011], [23.89211202767945, 30.271520967857036], [23.33794996467678, 29.163011580548115], [21.8897096857513, 25.967601769668455], [21.527048290787036, 25.0]]'
    ) ON CONFLICT ("building_id") DO NOTHING;
    

    INSERT INTO "ai_candidate_buildings" (
      "building_id", "run_id", "scene_id", "status", "point_count",
      "footprint_area_sqm", "height_m", "base_z_m", "roof_z_m",
      "candidate_floor_count", "is_legal_boundary", "requires_surveyor_validation",
      "legal_disclaimer", "footprint_geojson"
    ) VALUES (
      'b_cand_run_indian_colony_2026_01_006', 'run_indian_colony_2026_01', 'INDIAN_COLONY_DWARKA_01', 'GEOMETRICALLY_VALIDATED', 30,
      40.99, 10.208, -0.014, 10.193,
      3, false, true,
      'AI PREDICTION ONLY. Candidate evidence generated for surveyor review.', '[[15.0, 30.769999015337273], [15.0, 30.569492648147193], [21.033536698286927, 29.508610802075914], [22.504675356885084, 31.372268030188035], [22.89603728311811, 32.0], [19.288928701381792, 38.802303631518285], [18.869872924110133, 39.000142240383184], [18.60416215637006, 38.649117074308634], [15.0, 30.769999015337273]]'
    ) ON CONFLICT ("building_id") DO NOTHING;
    

    INSERT INTO "ai_candidate_buildings" (
      "building_id", "run_id", "scene_id", "status", "point_count",
      "footprint_area_sqm", "height_m", "base_z_m", "roof_z_m",
      "candidate_floor_count", "is_legal_boundary", "requires_surveyor_validation",
      "legal_disclaimer", "footprint_geojson"
    ) VALUES (
      'b_cand_run_indian_colony_2026_01_007', 'run_indian_colony_2026_01', 'INDIAN_COLONY_DWARKA_01', 'GEOMETRICALLY_VALIDATED', 501,
      79.62, 10.2, -0.014, 10.185,
      3, false, true,
      'AI PREDICTION ONLY. Candidate evidence generated for surveyor review.', '[[15.0, 38.6626682951708], [15.0, 37.60969821702065], [15.0, 32.55856999329636], [15.126049872634905, 32.0], [19.211876787479568, 30.45350071607384], [21.045765476226002, 31.1029787314455], [22.706614714165823, 32.0], [22.0, 41.94173775368225], [21.949067669745254, 42.0], [19.483458484684668, 42.0], [17.27731717763607, 42.0], [16.872725550150356, 42.0], [15.435054476568457, 42.0], [15.057387379365323, 42.0], [15.0, 41.99823295548875], [15.0, 38.6626682951708]]'
    ) ON CONFLICT ("building_id") DO NOTHING;
    

    INSERT INTO "ai_candidate_buildings" (
      "building_id", "run_id", "scene_id", "status", "point_count",
      "footprint_area_sqm", "height_m", "base_z_m", "roof_z_m",
      "candidate_floor_count", "is_legal_boundary", "requires_surveyor_validation",
      "legal_disclaimer", "footprint_geojson"
    ) VALUES (
      'b_cand_run_indian_colony_2026_01_008', 'run_indian_colony_2026_01', 'INDIAN_COLONY_DWARKA_01', 'GEOMETRICALLY_VALIDATED', 89,
      18.72, 10.235, -0.014, 10.22,
      3, false, true,
      'AI PREDICTION ONLY. Candidate evidence generated for surveyor review.', '[[15.0, 25.46579178167268], [16.905249422322058, 25.0], [17.24166369284601, 25.0], [20.2374897806743, 28.080531777558214], [20.266036971216657, 29.720654713335346], [19.61800223334529, 30.35665065085564], [17.410930750767093, 30.103549102387245], [16.22611750266226, 29.79032528807084], [15.0, 25.46579178167268]]'
    ) ON CONFLICT ("building_id") DO NOTHING;
    

    INSERT INTO "ai_candidate_buildings" (
      "building_id", "run_id", "scene_id", "status", "point_count",
      "footprint_area_sqm", "height_m", "base_z_m", "roof_z_m",
      "candidate_floor_count", "is_legal_boundary", "requires_surveyor_validation",
      "legal_disclaimer", "footprint_geojson"
    ) VALUES (
      'b_cand_run_indian_colony_2026_01_009', 'run_indian_colony_2026_01', 'INDIAN_COLONY_DWARKA_01', 'GEOMETRICALLY_VALIDATED', 44,
      54.66, 10.226, -0.014, 10.211,
      3, false, true,
      'AI PREDICTION ONLY. Candidate evidence generated for surveyor review.', '[[15.0, 25.6280178631883], [15.0, 25.06124957456899], [15.638900578455248, 25.0], [16.24130321353337, 25.0], [19.43518833494146, 25.0], [19.789561379743496, 25.0], [19.908028530527723, 25.0], [21.49593585689653, 25.15232956292087], [15.0, 28.91404677429986], [15.0, 25.072902628713557], [15.0, 25.06124957456899], [15.638900578455248, 25.0], [16.24130321353337, 25.0], [19.43518833494146, 25.0], [19.789561379743496, 25.0], [19.908028530527723, 25.0], [21.49593585689653, 25.15232956292087], [15.0, 28.91404677429986], [15.0, 25.072902628713557], [15.0, 25.06124957456899], [15.638900578455248, 25.0], [16.24130321353337, 25.0], [19.43518833494146, 25.0], [19.789561379743496, 25.0], [19.908028530527723, 25.0], [21.49593585689653, 25.15232956292087], [15.0, 28.91404677429986], [15.0, 25.072902628713557], [15.0, 25.06124957456899], [15.638900578455248, 25.0], [16.24130321353337, 25.0], [19.43518833494146, 25.0], [19.789561379743496, 25.0], [19.908028530527723, 25.0], [21.49593585689653, 25.15232956292087], [15.0, 28.91404677429986], [15.0, 25.072902628713557], [15.0, 25.06124957456899], [15.638900578455248, 25.0], [16.24130321353337, 25.0], [19.43518833494146, 25.0], [19.789561379743496, 25.0], [19.908028530527723, 25.0], [21.49593585689653, 25.15232956292087], [15.0, 25.6280178631883]]'
    ) ON CONFLICT ("building_id") DO NOTHING;
    

    INSERT INTO "ai_candidate_buildings" (
      "building_id", "run_id", "scene_id", "status", "point_count",
      "footprint_area_sqm", "height_m", "base_z_m", "roof_z_m",
      "candidate_floor_count", "is_legal_boundary", "requires_surveyor_validation",
      "legal_disclaimer", "footprint_geojson"
    ) VALUES (
      'b_cand_run_indian_colony_2026_01_010', 'run_indian_colony_2026_01', 'INDIAN_COLONY_DWARKA_01', 'GEOMETRICALLY_VALIDATED', 96,
      27.6, 6.031, -0.014, 6.017,
      2, false, true,
      'AI PREDICTION ONLY. Candidate evidence generated for surveyor review.', '[[26.31165324432684, 32.0], [29.51640539861036, 25.0], [31.862289496734988, 25.0], [32.0, 25.101830021583524], [32.0, 28.83482322010606], [32.0, 28.966607858720284], [31.346944513711342, 32.0], [27.133618709785658, 32.0], [26.31165324432684, 32.0]]'
    ) ON CONFLICT ("building_id") DO NOTHING;
    

    INSERT INTO "ai_candidate_buildings" (
      "building_id", "run_id", "scene_id", "status", "point_count",
      "footprint_area_sqm", "height_m", "base_z_m", "roof_z_m",
      "candidate_floor_count", "is_legal_boundary", "requires_surveyor_validation",
      "legal_disclaimer", "footprint_geojson"
    ) VALUES (
      'b_cand_run_indian_colony_2026_01_011', 'run_indian_colony_2026_01', 'INDIAN_COLONY_DWARKA_01', 'GEOMETRICALLY_VALIDATED', 33,
      11.53, 10.235, -0.014, 10.22,
      3, false, true,
      'AI PREDICTION ONLY. Candidate evidence generated for surveyor review.', '[[24.07690042043551, 25.123250346638613], [25.1483172696812, 25.0], [26.187413045484227, 25.0], [27.358957692542987, 25.117880338888146], [28.207595684175672, 25.70249500910844], [29.08097368931024, 27.460404961113383], [29.089361052778727, 28.12505556731021], [28.03762692918646, 28.44134233685109], [25.141530185961138, 27.43142540384514], [24.92455874367443, 27.144056644534494], [24.07690042043551, 25.123250346638613]]'
    ) ON CONFLICT ("building_id") DO NOTHING;
    

INSERT INTO "ai_candidate_properties" (
  "property_candidate_id", "run_id", "scene_id", "parcel_association_status",
  "building_candidates_count", "verification_status", "legal_disclaimer", "candidate_ulpin_id"
) VALUES (
  'prop_cand_run_indian_colony_2026_01', 'run_indian_colony_2026_01', 'INDIAN_COLONY_DWARKA_01', 'SYNTHETIC_SIMULATED_PARCEL',
  11, 'CANDIDATE',
  'AI PREDICTION ONLY. Candidate evidence generated for surveyor review.', 'ULPIN-CAND-2026-IND-001'
) ON CONFLICT ("property_candidate_id") DO NOTHING;

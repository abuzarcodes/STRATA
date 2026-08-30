# 3D ULPIN AI/ML Engine — Finalized Technical Architecture & Evaluation-Driven Implementation Plan

> [!IMPORTANT]
> **Core Cadastral Principle:** AI predictions are candidate evidence only. The AI system does **NOT** establish legal ownership or authoritative cadastral boundaries. Legal authority and human verification strictly dictate official 3D ULPIN / property recording.

> [!NOTE]
> **Core Philosophy:** *Don't build an AI system that happens to have metrics. Build an evaluation system around which the AI is developed.*

---

## 1. Core Development Principle & Execution Order

The AI/ML module is governed by an evaluation-driven, baseline-first engineering workflow. We DO NOT select models blindly. We establish the ground truth and evaluation framework first:

```
  SYNTHETIC GENERATOR (Phase A)
               ↓
     AUTOMATIC GROUND TRUTH
               ↓
    EVALUATION INFRASTRUCTURE
               ↓
         SIMPLE BASELINE
               ↓
        BASELINE RESULTS
               ↓
      INSPECT & SELECT ML MODEL (If justified)
               ↓
        BASELINE VS ML COMPARISON
```

---

## 2. AI Contribution Matrix (Geometric Baseline vs. ML Necessity)

Before selecting any machine learning model, we evaluate whether ML is actually necessary for each task:

| Task Name | Conventional / Geometric Approach | ML Approach | Is ML Necessary? | Expected Advantage of ML | Primary Evaluation Metric |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Building Extraction** | Height-above-ground (HAG) + Cloth Simulation Filter (CSF) + Planarity thresholding | Point-cloud classifier (Selected after baseline analysis) | **Yes (in dense urban / heavy canopy scenes)** | Distinguishes roof structures from dense tree canopy overhangs and powerlines | Precision, Recall, F1, IoU, Inference Time |
| **Robust Roof Height Estimation** | Percentile-based (e.g. 95th/98th Z) & RANSAC roof plane fitting | N/A (Geometric estimation is sufficient) | **No** | Geometric RANSAC isolators handle rooftop HVAC / water tanks cleanly without ML overhead | MAE (m), RMSE (m), Relative Error (%) |
| **Candidate Floor Inference** | Vertical Z-density histogram peak analysis & slab RANSAC | 1D Facade/Slab Density Network | **Conditional** | Handles non-uniform floor heights and complex architectural facade rhythms | Floor Count Accuracy, Level Z-MAE (m) |
| **Floor-Plan Segmentation** | Adaptive thresholding + Contour polygon extraction | SegFormer-B0 / U-Net | **Yes** | Handles noisy scans, faint lines, wall gaps, and text overlap in 2D plans | IoU, Dice, Precision, Recall |
| **Unit Detection** | Spatial bounding box containment heuristic | Mask R-CNN / SAM2 | **Yes** | Extracts irregular unit boundaries and shared corridors from 2D plans | 2D/3D IoU, Precision, Recall |
| **OCR Text Extraction** | Tesseract / EasyOCR + Regex parser | LayoutLM / PaddleOCR | **Yes (for non-standard layouts)** | Parses context-aware text fields from unstructured property deeds | Character Error Rate (CER), Field Accuracy |
| **MVP Geometric Hierarchy** | Deterministic spatial containment (Parcel → Building → Candidate Floor) | N/A (Deterministic rules used) | **No** | Geometric containment is 100% verifiable and deterministic for 3D envelopes | Hierarchy Precision, Recall, F1 |

---

## 3. Feature Classification: MVP vs Secondary vs Advanced

All proposed system capabilities are classified into three strict priorities to focus development on the core 3D vertical property problem:

| Category | Priority | Capability | Rationale / Focus |
| :--- | :--- | :--- | :--- |
| **Category A** | **MUST HAVE (MVP)** | 1. Modular Point-cloud ingestion (LAS / LAZ / XYZ) | Core 3D data pipeline foundation |
| | | 2. Modular Synthetic Generator (Phase A) | Modular geometry, point cloud, GT, and noise engines (6 archetypes + 9 failure scenarios) |
| | | 3. Automatic Ground-Truth Generator | Deterministic JSON/GeoJSON GT generation from synthetic 3D scenes |
| | | 4. Independent Evaluation Framework | Decoupled metric suite (3D IoU, RMSE, Acc, Baseline vs ML comparison engine) |
| | | 5. Vegetation & Noise-Robust Preprocessing | Ground filtering (CSF), planarity/eigenvalue analysis & return/intensity filtering |
| | | 6. Robust Building Extraction | Geometric baseline + 1 empirical ML model (selected after baseline data analysis) |
| | | 7. Robust Roof Elevation Estimator | Percentile & RANSAC-based height estimation (replacing naive Z-max) |
| | | 8. Candidate Floor-Level Inference | Candidate floor levels inferred from vertical/geometric evidence (`verification_required` state) |
| | | 9. MVP Geometric Hierarchy Extraction | Geometric Parcel → Building → Candidate Floor Level structural tree (LiDAR-derived) |
| | | 10. Structured Candidate Property Schema | Standardized machine-readable JSON output with legal disclaimers |
| | | 11. Experiment Manifests & Metadata | Every run saves `manifest.json` (model, dataset, preproc, and synthetic generator versions) |
| **Category B** | **SHOULD HAVE (Secondary)** | 12. Synthetic generator (Phase B & C: Floor plan & aerial) | Multi-modal synthetic generation expansion |
| | | 13. Floor-plan segmentation (Walls, rooms, units) | 2D footprint & room boundary extraction |
| | | 14. OCR & document understanding | Extracted unit/floor text from floor plans & property deeds |
| | | 15. Aerial image building footprint segmentation | 2D building segmentation from orthophotos |
| | | 16. Full Property Hierarchy Extraction | Full Parcel → Building → Floor → Unit → Room tree |
| | | 17. End-to-End Candidate Property Recovery Metric | Measure complete multi-modal pipeline entity recovery (when Phase E exists) |
| **Category C** | **NICE TO HAVE (Advanced)**| 18. Deterministic geometric multimodal fusion | Cross-modal spatial containment (Point Cloud + Plan + OCR) |
| | | 19. Synthetic generator (Phase D & E: Full multimodal) | Complete multimodal dataset generation |
| | | 20. Learned spatial-semantic graph fusion | Advanced graph neural network cross-modal alignment |
| | | 21. Calibrated Probability Scaling | Temperature scaling / Isotonic regression for confidence scores |
| | | 22. Cross-City Domain Adaptation | Pretraining on synthetic data and fine-tuning on real AOIs |

---

## 4. Modular Synthetic Dataset Generator Architecture (Phase A)

The synthetic generator is modularized into four decoupled packages:

```
                      [ SYNTHETIC SCENE SPECIFICATION ]
                                      │
                                      ▼
                        [ 1. GEOMETRY GENERATOR ]
             • 6 Indian Urban Archetypes (Independent, Apartment, Row, Mixed, L-shaped, Stilt)
             • Parametric CAD Polygons & Height Slab Boundaries
                                      │
                                      ▼
                        [ 2. POINT CLOUD ENGINE ]
             • Surface Point Sampling (Roof, Facades, Ground)
             • Synthetic LAS / LAZ / XYZ Exporter
                                      │
                                      ▼
                         [ 3. NOISE & SCENARIO ENGINE ]
             • Negative Scenarios: Attached buildings, boundary walls, sheds, cars, utility poles
             • Degradation: Low density, partial/missing scans, non-uniform density, irregular roofs
             • Vegetation: Tree canopy overhang & roof appurtenances (HVAC, water tanks)
                                      │
                                      ▼
                       [ 4. GROUND TRUTH GENERATOR ]
             • Uncorrupted JSON & GeoJSON GT Exporter (Ground truth isolated from predictions)
```

---

## 5. Robust Roof Elevation Estimator (Replacing Naive Z-max)

Naive maximum Z calculation (`Z_max`) is heavily skewed by antennas, water tanks, elevator headrooms, and tree branches. We implement a **Robust Roof Elevation Estimator**:

```python
def estimate_robust_roof_height(building_points: np.ndarray, ground_elevation: float) -> dict:
    """
    Estimates roof height using RANSAC plane fitting and 95th percentile filtering
    rather than uncalibrated maximum Z.
    """
    normalized_z = building_points[:, 2] - ground_elevation
    
    # 1. Percentile-based estimate (suppresses sparse top outliers)
    percentile_95_height = np.percentile(normalized_z, 95)
    percentile_98_height = np.percentile(normalized_z, 98)
    
    # 2. RANSAC horizontal roof plane detection
    roof_plane_height = ransac_find_dominant_horizontal_plane(building_points[:, 2]) - ground_elevation
    
    return {
        "robust_height_m": float(roof_plane_height if roof_plane_height > 0 else percentile_95_height),
        "percentile_95_m": float(percentile_95_height),
        "percentile_98_m": float(percentile_98_height),
        "raw_z_max_m": float(np.max(normalized_z))
    }
```

---

## 6. Physical Observability vs. Inference Boundaries (LiDAR Capabilities)

```
                       [ RAW SENSOR DATA ]
                                |
         +----------------------+----------------------+
         |                                             |
  Airborne LiDAR / Photogrammetry               Floor Plans & Deeds
         |                                             |
         v                                             v
  [ DIRECT OBSERVATION ]                        [ DOCUMENT EVIDENCE ]
  • Roof & Facade Geometry                       • Interior Unit Boundaries
  • Ground Elevation & Footprint                 • Unit / Apartment Numbers
  • Total Building Height                        • Room Classifications
  • Surface Structure & Vegetation               • Ownership / Deed Text
         |                                             |
         v                                             v
  [ GEOMETRIC INFERENCE ]                       [ AI OCR & SEGMENTATION ]
  • Candidate Floor Levels (Vertical evidence)   • Parsed Unit Geometry & Text
  • Estimated Floor Count                        • Spatial Bounding Polygons
         |                                             |
         +----------------------+----------------------+
                                |
                                v
              [ DETERMINISTIC SPATIAL FUSION ]
              • Parcel → Building → Candidate Floor (MVP)
              • Parcel → Building → Floor → Unit → Room (Secondary)
                                |
                                v
             [ HUMAN / AUTHORITY VERIFICATION ]
              • Review Flagging (`verification_required: true`, `uncertain` state)
              • Final Legal Cadastral Recording
```

---

## 7. Dataset Usage Strategy

| Dataset | Type | Primary Purpose | Key Rule |
| :--- | :--- | :--- | :--- |
| **SensatUrban** | Photogrammetric Point Cloud (UK) | Semantic segmentation, urban scene understanding, building vs non-building classification | **Do NOT call LiDAR.** Photogrammetric point cloud. |
| **São Paulo 2017** | Real Airborne LiDAR (Brazil) | Building extraction, ground filtering, height estimation on dense urban LiDAR | Use small representative AOIs (~500m x 500m). Do NOT download full dataset. |
| **Auckland 2013** | Real Airborne LiDAR (NZ) | Independent cross-city geographic generalization test | Held-out validation dataset evaluated separately. |
| **Synthetic India** | Multimodal Synthetic Benchmark | 3D vertical property evaluation, floor detection, unit detection, floor plans, OCR | Primary benchmark for SIH vertical property problem. |

---

## 8. Experiment Manifest & Reproducibility System

Every evaluation run automatically outputs `experiment_manifest.json`:

```json
{
  "manifest_id": "EXP_20260829_162000",
  "timestamp": "2026-08-29T16:20:00Z",
  "versions": {
    "model_version": "1.0.0-baseline",
    "dataset_version": "synthetic_india_v1",
    "preprocessing_version": "csf_v1.2",
    "synthetic_generator_version": "phase_a_v1.0"
  },
  "reproducibility": {
    "git_commit": "a1b2c3d4",
    "random_seed": 42,
    "environment": "Python 3.11.9 (Windows-10)"
  },
  "pipeline_hyperparameters": {
    "voxel_size_m": 0.2,
    "csf_cloth_resolution": 0.5,
    "hag_threshold_m": 2.5,
    "ransac_threshold_m": 0.15
  },
  "metrics": {
    "building_extraction_precision": 0.934,
    "building_extraction_recall": 0.912,
    "building_extraction_iou": 0.858,
    "height_mae_m": 0.32,
    "inference_time_ms": 142.5
  }
}
```

---

## 9. Working Directory Structure (`ai_ml/`)

```
ai_ml/
├── configs/                          # Config files (data, pipeline, model settings)
│   └── data_configs.yaml
├── schemas/                          # Pydantic schemas (Candidate, GT, Input)
│   ├── candidate_property_schema.py
│   ├── input_schema.py
│   └── ground_truth_schema.py
├── datasets/                         # Dataset loaders (SensatUrban, São Paulo AOIs, Synthetic)
│   ├── sensaturban_loader.py
│   ├── sao_paulo_loader.py
│   └── synthetic_loader.py
├── synthetic/                        # Modular Synthetic Indian generator
│   ├── geometry_builder.py           # 6 Indian building archetypes geometry
│   ├── pointcloud_sampler.py         # Point cloud generation & LAZ/XYZ export
│   ├── noise_scenario_engine.py      # 9 failure scenarios (trees, poles, cars, sheds, density drop)
│   └── ground_truth_exporter.py      # Isolated GT JSON/GeoJSON exporter
├── preprocessing/                    # Raw data cleansers
│   ├── pointcloud_preprocessor.py    # CSF ground filter, planarity/eigenvalue filter, HAG norm
│   └── image_preprocessor.py         # Resizing, deskewing, normalization
├── models/                           # AI / Heuristic models
│   ├── building_extractor_baseline.py# Vegetation-robust footprint baseline
│   ├── roof_height_estimator.py      # Robust RANSAC & percentile height estimator
│   ├── candidate_floor_detector.py   # Vertical/geometric evidence candidate floor detector
│   └── ocr_extractor.py              # OCR wrapper & regex parser
├── fusion/                           # Multimodal fusion engine
│   └── deterministic_fusion.py       # Spatial containment hierarchy builder
├── confidence/                       # Confidence & uncertainty engine
│   └── uncertainty_engine.py         # Heuristic confidence calculator & `verification_required` flagger
├── pipelines/                        # Pipeline orchestrators
│   ├── pointcloud_pipeline.py        # Point cloud MVP pipeline
│   └── multimodal_pipeline.py        # End-to-end multimodal execution
├── evaluation/                       # Independent evaluation suite
│   ├── metrics.py                    # IoU, RMSE, CER/WER, Precision/Recall/F1
│   ├── baseline_vs_ml.py             # Baseline vs ML comparative benchmark runner
│   ├── manifest_logger.py            # Reproducibility manifest generator (`manifest.json`)
│   └── benchmark_runner.py           # Real & synthetic benchmark evaluator
├── docs/                             # Documentation
│   ├── revised_architecture_plan.md
│   └── Indian_LiDAR_PlugIn_Guide.md
└── main.py                           # CLI entrypoint for running benchmarks & pipelines
```

---

## 10. Sequential Milestone Roadmap

```
Synthetic Generator (Phase A)
       ↓
Automatic Ground Truth
       ↓
Evaluation Framework & Metrics
       ↓
Simple Baseline Implementation
       ↓
Baseline Results & Performance Report (MILESTONE 1)
       ↓
Inspect & Select 1 ML Model (If justified)
       ↓
Baseline vs ML Comparative Benchmark
```

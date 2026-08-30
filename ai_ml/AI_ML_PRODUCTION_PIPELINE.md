# AI/ML Production Pipeline Data Flow & Architecture

```
Raw LiDAR Point Cloud (X, Y, Z, Intensity)
        │
        ▼
CRS Manager & Metric Coordinate Normalization [ai_ml/integration/crs_manager.py]
        │
        ▼
Spatial Inference Tiler (40m x 40m tile / 10m overlap) [ai_ml/tiling/spatial_tiler.py]
        │
        ▼
PointNet2_MSG_DualHead_v1 (FROZEN - SHA256: eb167abd...) [ai_ml/models/pointnet2/model.py]
        │
        ▼
Multi-Task Predictions (Semantic Logits, 3D Offset Vectors, 16D Embeddings)
        │
        ▼
HDBSCAN Production Decoder (cs=20, ms=5, alpha=1.0, beta=0.5) [ai_ml/decoding/instance_decoder.py]
        │
        ▼
Cross-Tile Instance Reconciler [ai_ml/integration/cross_tile_reconciler.py]
        │
        ▼
Instance Quality Filter (DETECTED / QUALITY_REVIEW / REJECTED) [ai_ml/property/instance_filter.py]
        │
        ▼
3D Geometry Extractor (Footprint, Centroid, OBB, AABB, Area, Perimeter) [ai_ml/property/geometry_extractor.py]
        │
        ▼
Roof Height Estimator (Robust RANSAC plane fitting) [ai_ml/models/roof_height_estimator.py]
        │
        ▼
Candidate Floor Detector (Z-density peaks & slab levels) [ai_ml/models/candidate_floor_detector.py]
        │
        ▼
Multi-Indicator Confidence System (8 separate indicators) [ai_ml/property/confidence.py]
        │
        ▼
Property Candidate & ULPIN Candidate Record Generator [ai_ml/property/ulpin_candidate.py]
        │
        ▼
Exporters (JSON, GeoJSON, CSV) [ai_ml/export/]
```

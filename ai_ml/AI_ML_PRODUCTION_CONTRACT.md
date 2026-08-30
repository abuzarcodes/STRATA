# AI/ML Production API & Handoff Contract

**Project:** 3D ULPIN Generation and Vertical Property Mapping System — SIH 2026  
**Module:** AI/ML Production Contract Specification  

---

## 1. Frozen Neural & Decoder Model Specification

| Component | Identifier / Specification | Freeze Status |
| :--- | :--- | :--- |
| **Neural Model** | `PointNet2_MSG_DualHead_v1` | **FROZEN** |
| **Checkpoint Path** | `ai_ml/models/best_pointnet2_msg_dualhead.pt` | **FROZEN** |
| **Checkpoint SHA256** | `eb167abd93cde6462b66d1e45fc658585be44776daf59fbb105a6a5ec2665586` | **BYTE-FOR-BYTE IMMUTABLE** |
| **Parameter Count** | 643,617 parameters | **VERIFIED** |
| **Production Decoder** | `HDBSCANInstanceDecoder` | **FROZEN** |
| **Decoder Parameters** | `min_cluster_size=20, min_samples=5, alpha=1.0, beta=0.5` | **FROZEN** |
| **Neural Feature Channels** | $[X_{	ext{norm}}, Y_{	ext{norm}}, Z_{	ext{norm}}, 	ext{Intensity}]$ (4D) | **STRICT ENFORCEMENT** |

---

## 2. Production Entry Point

**Python Import:**
```python
from ai_ml.integration.production_pipeline import ProductionPipeline

pipeline = ProductionPipeline(device="cuda", source_crs="EPSG:2193")
result = pipeline.run_inference(points_xyz, intensity=intensity, scene_id="SCENE_001")
```

**FastAPI Endpoint:**
- `POST /api/property/analyze`

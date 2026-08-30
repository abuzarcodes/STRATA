# Repository Script Classification: Production vs Research

| Module / Script Path | Classification | Usage Description |
| :--- | :--- | :--- |
| `ai_ml/integration/production_pipeline.py` | **PRODUCTION** | Primary entry point for application integration |
| `ai_ml/integration/property_api.py` | **PRODUCTION** | FastAPI backend endpoint implementation |
| `ai_ml/models/pointnet2/model.py` | **PRODUCTION** | Frozen neural network model architecture |
| `ai_ml/decoding/instance_decoder.py` | **PRODUCTION** | Frozen production HDBSCAN instance decoder |
| `ai_ml/models/building_extractor_baseline.py` | **REFERENCE ONLY** | Frozen baseline (Do NOT use in ML path) |
| `ai_ml/evaluation/generalization/` | **VALIDATION ONLY** | Generalization evaluation suite |
| `ai_ml/evaluation/decoder_validation/` | **VALIDATION ONLY** | Milestone 4.5 decoder experiment suite |

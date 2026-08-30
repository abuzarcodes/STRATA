# AI/ML Application Integration Guide

**Project:** 3D ULPIN Generation and Vertical Property Mapping System — SIH 2026  
**Scope:** Integration Guide for Backend and Frontend Application Developers  

---

## 1. Production Architecture Overview

The frozen AI/ML module is exposed to the application through `ProductionPipeline` and the `AIMLServiceAdapter`:

```
Frontend UI (Upload LiDAR .laz/.las/.npz)
    │
    ▼ POST /api/property/analyze
FastAPI Backend Router (backend/api/router.py)
    │
    ▼
AIMLServiceAdapter (backend/services/ai_ml_service.py)
    │
    ▼
ProductionPipeline (ai_ml/integration/production_pipeline.py)
    │
    ▼
Frozen PointNet2 ML + Frozen HDBSCAN Decoder
    │
    ▼
Candidate Property Hierarchy Output (JSON / GeoJSON / CSV)
```

---

## 2. API Contract Specification

- **Endpoint:** `POST /api/property/analyze`
- **Request Body:** JSON or Multipart File Upload (`.laz`, `.las`, `.npz`)
- **Response Format:** `AnalyzeResponse` containing GeoJSON candidate building footprints, 3D heights, floor levels, confidence indicators, provenance, and legal disclaimers.

---

## 3. Mandatory Legal Disclaimer Notice

Every UI component and API response MUST preserve:

`"AI predictions represent candidate evidence only. AI outputs do not establish legal ownership, legal property boundaries, or official 3D ULPIN cadastral recording. Surveyor/authoritative validation is required."`

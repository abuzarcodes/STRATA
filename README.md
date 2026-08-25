# 🌐 AuraCadastre 3D
### Automated Volumetric ULPIN Generation & 3D Cadastral Digital Twin Platform
> **Smart India Hackathon (SIH 2026)** | **Problem Statement:** PS-011  
> **Ministry / Organization:** Ministry of Rural Development & Land Resources (DILRMP / Bhu-Aadhaar)  
> **Theme:** Space Technology / Smart Urban Governance  

---

## 📌 Executive Overview
Conventional land administration systems represent properties as **2D surface polygons $(X, Y)$**. In modern vertical urban environments, this model creates critical blindspots for multi-storey apartments, underground infrastructure, elevated transport corridors, and air-rights.

**AuraCadastre 3D** extends India's **14-digit Bhu-Aadhaar (ULPIN)** into the 3rd dimension:
$$\text{3D-ULPIN} = \underbrace{\text{Base-ULPIN}}_{\text{14 Digits (Surface Parcel)}} - \underbrace{\text{Domain Flag}}_{\text{S: Surface / A: Above / U: Under}} + \underbrace{\text{Level Index}}_{\pm\text{Floor Number}} - \underbrace{\text{Spatial Hash}}_{\text{4-Char Cryptographic Centroid Token}}$$

Anchored in real Delhi open geospatial data (**Dwarka Sector 10, New Delhi: `28.5823° N, 77.0602° E`**), AuraCadastre 3D delivers automated 3D mesh extrusion, watertight geometry certification, real-time topological clash and air-rights encroachment auditing under **ISO 19152 LADM Part 2**.

---

## 👥 Conflict-Free Team Work Breakdown (WBS)

To ensure smooth collaborative development without Git merge conflicts, the codebase is modularized into 4 independent domains:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             AURACADASTRE 3D WORKSPACE                            │
├──────────────────────┬──────────────────────┬───────────────────┬────────────────┤
│ 🎨 Frontend (UI/3D)   │ 📐 Geometry & AI     │ ⚡ API & Database │ 📑 Docs & Pitch │
│   [frontend/]        │   [backend/]         │   [api/]          │   [docs/]      │
│                      │                      │                   │                │
│ • Three.js 3D Twin   │ • 3D Mesh Extrusion  │ • FastAPI Server  │ • SIH Slides   │
│ • Floor Slicer       │ • Watertight Checks  │ • Supabase / DB   │ • System Arch  │
│ • Property Deeds     │ • 3D ULPIN Hashing   │ • REST Endpoints  │ • Video Demo   │
│ • Role Portals       │ • Topology Audits    │ • Auth & Tokens   │ • Legal Specs  │
└──────────────────────┴──────────────────────┴───────────────────┴────────────────┘
```

| Member / Role | Focus Directory | Core Deliverables | Git Branch |
| :--- | :--- | :--- | :--- |
| **Member 1 (Frontend & 3D WebGIS Lead)** | `frontend/src/` | 3D Three.js digital twin, floor isolation sliders, deed inspector, role dashboards. | `feature/frontend-3d` |
| **Member 2 (Python Geometry & AI Lead)** | `backend/` | 2D-to-3D extrusion math (`trimesh`/`shapely`), geodetic CRS conversion, 3D ULPIN spatial hasher. | `feature/ai-geometry` |
| **Member 3 (Backend & Cloud API Lead)** | `api/` | FastAPI REST services, Supabase / PostgreSQL schemas, user authentication. | `feature/fastapi-backend` |
| **Member 4 (Documentation & Pitch Lead)** | `docs/` | SIH presentation deck, architecture diagrams, ISO 19152 compliance report. | `feature/docs-pitch` |

---

## 📂 Repository Directory Structure

```bash
sih-auracadastre-3d/
├── .gitignore                      # Git exclusion rules
├── README.md                       # Master project overview & setup guide
├── CONTRIBUTING.md                 # Git collaboration & branch guidelines
│
├── backend/                        # 📐 Module 1: Python Spatial Math & Extrusion Engine
│   ├── requirements.txt            # Python dependencies (Shapely, Trimesh, PyProj, Pytest)
│   ├── coordinates.py              # WGS84 (EPSG:4326) & UTM 43N (EPSG:32643) CRS transforms
│   ├── generate_delhi_society_data.py # Dwarka Sector 10 society cadastral dataset
│   ├── extrusion_engine.py         # 3D polyhedral extrusion & watertightness validator
│   ├── ulpin_generator.py          # Deterministic 3D-ULPIN spatial hashing formula
│   ├── topology_validator.py       # 3D collision & air-rights setback auditor
│   ├── pipeline.py                 # Master pipeline generating 3D GeoJSON and JSON datasets
│   ├── data/                       # Master 3D Cadastral Registries & GeoJSON assets
│   └── tests/                      # Automated pytest unit tests (100% pass)
│
├── frontend/                       # 🎨 Module 2: React + Three.js 3D WebGIS Application
│   ├── package.json                # React 18, Three.js, React-Three-Fiber, Tailwind CSS
│   ├── vite.config.js              # Network host (0.0.0.0:3000) & port configuration
│   ├── tailwind.config.js          # Custom glassmorphism and cadastre color tokens
│   └── src/
│       ├── components/
│       │   ├── Viewer3D.jsx        # Three.js 3D viewport, roads, trees, elevation gauge
│       │   ├── Navbar.jsx          # Role switcher, 3D ULPIN search, system telemetry
│       │   ├── LayerControls.jsx   # Floor Slicer, Exploded 3D view slider, theme toggle
│       │   ├── PropertyDeedCard.jsx# Pop-up 3D deed card with RERA volume & QR verification
│       │   ├── GovtAdminDashboard.jsx # Revenue officer compliance center & violation logs
│       │   ├── CitizenLocker.jsx   # Authenticated property owner 3D vault
│       │   ├── SurveyorUploadModal.jsx # CAD/BIM/LiDAR upload & auto-extrusion preview
│       │   ├── ParcelSplitModal.jsx# Interactive 3D parcel subdivision simulator
│       │   └── MutationModal.jsx   # Accessible ownership transfer & title mutation modal
│       ├── data/                   # Bundled demo datasets (synced from backend)
│       └── App.jsx                 # Master application controller & state
│
├── api/                            # ⚡ Module 3: FastAPI REST Microservice Layer
│   └── main.py                     # Endpoints for live mesh extrusion, ULPIN minting, and audit
│
└── docs/                           # 📑 Module 4: Architecture & Presentation Materials
    ├── SIH_PS011_ARCHITECTURE.md   # Deep-dive technical system design
    └── PITCH_DECK_OUTLINE.md       # SIH presentation slides and pitch script
```

---

## 🚀 Quickstart Guide

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>.git
cd sih-auracadastre-3d
```

### 2. Run the Python Geometric Engine & Tests
```bash
# Set up Python environment
cd backend
pip install -r requirements.txt

# Run automated tests
python -m pytest tests/ -v

# Execute master 3D cadastral pipeline
python pipeline.py
```

### 3. Launch the 3D WebGIS Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:3000/](http://localhost:3000/) in your browser.

### 4. (Optional) Run the FastAPI REST Server
```bash
cd ../api
pip install -r ../backend/requirements.txt
python main.py
```
API Documentation available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🌿 Git Branching Strategy (No Merge Conflicts)

1. **Never commit directly to `main`**.
2. Create a branch for your assigned module:
   ```bash
   git checkout -b feature/frontend-3d    # Frontend Developer
   git checkout -b feature/ai-geometry    # Geometry / AI Developer
   git checkout -b feature/fastapi-backend# Backend / API Developer
   git checkout -b feature/docs-pitch     # Presentation / Docs
   ```
3. Push your branch and open a Pull Request:
   ```bash
   git push origin feature/<your-branch-name>
   ```

---

## 📜 International Standards Compliance
* **ISO 19152:2024 LADM Part 2:** Land Administration Domain Model for 3D Land Registration & Rights, Restrictions, and Responsibilities (RRRs).
* **OGC CityGML 3.0:** Standards for volumetric buildings (LoD2/LoD3).
* **Bhu-Aadhaar 3D Specification:** Backward-compatible deterministic extension of India's 14-digit ULPIN scheme.

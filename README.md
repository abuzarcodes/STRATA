# 🌐 STRATA
### Spatial Topology & Registration Administration for Three-dimensional Assets
> **Smart India Hackathon (SIH 2026)** | **Problem Statement:** PS-011  
> **Ministry / Organization:** Ministry of Rural Development & Land Resources (DILRMP / Bhu-Aadhaar)  
> **Theme:** Space Technology / Smart Urban Governance  

[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.170-black?logo=threedotjs)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js / Express](https://img.shields.io/badge/Express-4.21-lightgrey?logo=express)](https://expressjs.com/)
[![PostgreSQL + PostGIS](https://img.shields.io/badge/PostgreSQL-16%20%2B%20PostGIS%203.4-336791?logo=postgresql)](https://postgis.net/)
[![Prisma](https://img.shields.io/badge/Prisma-6.9-2D3748?logo=prisma)](https://www.prisma.io/)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-3776AB?logo=python)](https://python.org/)
[![ISO 19152 LADM](https://img.shields.io/badge/Standard-ISO%2019152%20LADM%20Part%202-00D084)](https://www.iso.org/standard/74242.html)

---

## 📌 Executive Overview
Conventional land administration systems represent land and property titles as **flat 2D surface polygons $(X, Y)$**. In modern dense vertical urban environments, this planar paradigm creates critical blind spots:
1. **Multi-Storey Apartments:** Stacked units share the exact same $(X, Y)$ ground footprint, causing ambiguity regarding individual airspace ownership.
2. **Subsurface Utilities & Metro Infrastructure:** Subterranean rail corridors, utilities, and underground parking risk unrecorded collisions and structural strikes.
3. **Cantilevered Air-Rights & Setbacks:** Municipalities lack automated tools to detect 3D overhangs, unauthorized floor extensions, and setback encroachments.

**STRATA (Bhu-Aadhaar 3D)** extends India's **14-digit Bhu-Aadhaar (ULPIN)** into the 3rd dimension:

$$\text{3D-ULPIN} = \underbrace{\text{Base-ULPIN}}_{\text{14 Digits (Surface Parcel)}} - \underbrace{\text{Domain Flag}}_{\text{S: Surface / A: Above / U: Under}} + \underbrace{\text{Level Index}}_{\pm\text{Floor Number}} - \underbrace{\text{Spatial Hash}}_{\text{4-Char Cryptographic Centroid Token}}$$

Anchored in real Delhi open geospatial datasets (**Dwarka Sector 10, New Delhi: `28.5823° N, 77.0602° E`**), STRATA delivers automated 3D mesh extrusion, watertight geometry certification ($\chi = V - E + F = 2$), real-time topological clash and air-rights encroachment auditing under **ISO 19152:2024 LADM Part 2**.

---

## 🏗️ System Architecture & Data Flow

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                 STRATA PLATFORM                                  │
├──────────────────────┬──────────────────────┬───────────────────┬────────────────┤
│ 🎨 Frontend (WebGIS)  │ 📐 Spatial & Math    │ ⚡ Backend Service │ 📑 Standards    │
│   [frontend/]        │   [backend/]         │   [backend/src/]  │   [docs/]      │
│                      │                      │                   │                │
│ • Three.js 3D Twin   │ • 3D Mesh Extrusion  │ • Express + TS    │ • ISO 19152    │
│ • Floor Slicer       │ • Watertight Checks  │ • Prisma + PostGIS│ • SIH Pitch    │
│ • Role Workspaces    │ • 3D-ULPIN Hashing   │ • Role Perms / RBAC│ • API Specs   │
│ • Dual Theme Engine  │ • Topology Audits    │ • Swagger / Docs  │ • LADM Models  │
└──────────────────────┴──────────────────────┴───────────────────┴────────────────┘
```

```text
[ Architectural CAD / BIM (IFC/DXF) / LiDAR (LAS) / GIS 2.5D GeoJSON ]
                               │
                               ▼
     [ Python Spatial Engine: WGS84 EPSG:4326 & UTM 43N Transformation ]
                               │
                               ▼
        [ 3D Watertight Polyhedral Mesh Extrusion (Euler χ = 2) ]
                               │
                               ▼
      [ 3D-ULPIN Spatial Hashing & ISO 19152 Topology Collision Engine ]
                               │
                               ▼
     [ Node.js/Express REST API: RBAC, Application Workflows & PostGIS ]
                               │
                               ▼
    [ STRATA 3D WebGIS Frontend: Dual Theme, Role Workspaces & Floor Slicer ]
```

---

## 👥 Role-Based Portals & Stakeholder Workspaces

| Stakeholder Role | Dedicated Workspace | Features & Capabilities |
| :--- | :--- | :--- |
| **🌐 Public Citizen (`CITIZEN`)** | **Public 3D WebGIS Explorer** | • Hierarchical public search (State $\rightarrow$ District $\rightarrow$ Society)<br>• 3D property deed inspection & QR code verification<br>• Multi-level floor slicer (`ALL`, `B1`, `G`, `L1`, `L2`, `L3`, `R`)<br>• Download verified public 3D deed JSON |
| **🔐 Property Owner (`OWNER`)** | **Citizen Property Vault (`CitizenLocker.jsx`)** | • Authenticated DigiLocker/Aadhaar property locker<br>• Download official signed **Encumbrance Certificate (EC Form 15)**<br>• Live tracking of title mutation applications<br>• Initiate Title Mutation transfer for owned property |
| **📐 Licensed Surveyor (`SURVEYOR`)** | **Surveyor Ingestion Studio (`SurveyorUploadModal.jsx`)** | • Multi-format file gateways: BIM/CAD (IFC/DXF), LiDAR (LAS), 2.5D Footprints<br>• 3D Boundary Vertex Calibration Canvas with real-time rotation<br>• Execute **3D Parcel Subdivision (`ParcelSplitModal.jsx`)** with volume conservation |
| **🏛️ Revenue Admin (`GOVT`)** | **Compliance Dashboard (`GovtAdminDashboard.jsx`)** | • Executive encroachment radar & live 3D violation stream<br>• **AI Cadastre Reviewer (`AIReviewModal.jsx`)** with Z-elevation tuning<br>• Approve/Reject pending title mutation queue<br>• Granular permission-based access control |

---

## 🎨 Dual Theme System
- 🌿 **Light Cadastre Mode**: Forest Green (`#1B5E20`), Emerald (`#2E7D32`), Mint (`#E8F5E9`), Slate typography, and crisp government-standard card styling.
- ⚡ **Dark Cyber HUD Mode**: Obsidian (`#060B12`), glowing Emerald HUD reticles (`#00D084`), deep navy telemetry containers (`#0B131E`).

---

## 📂 Project Structure

```bash
sih-strata-3d/
├── .gitignore                      # Git exclusion rules
├── README.md                       # Master project documentation
├── CONTRIBUTING.md                 # Collaboration & branch guidelines
│
├── backend/                        # 🏛️ Node.js / Express Backend + Spatial Engine
│   ├── prisma/
│   │   ├── schema.prisma           # Master PostgreSQL + PostGIS database schema
│   │   └── migrations/             # PostGIS migrations & spatial extensions
│   ├── src/
│   │   ├── app.ts                  # Express app, security middleware & Swagger UI
│   │   ├── server.ts               # HTTP server listener (Port 3001)
│   │   ├── common/
│   │   │   └── authorization/      # Granular RBAC permissions & role mappings
│   │   ├── middleware/             # requirePermission, requireProjectAccess
│   │   ├── modules/
│   │   │   ├── applications/       # Title mutation & parcel subdivision workflows
│   │   │   ├── assignments/        # Surveyor / Officer task assignment engine
│   │   │   ├── auth/               # JWT authentication & session management
│   │   │   ├── buildings/          # Building metadata & footprint management
│   │   │   ├── floors/             # Floor levels & elevation indexing
│   │   │   ├── parcels/            # 2D base parcels & boundary polygons
│   │   │   ├── projects/           # Development schemes & housing society projects
│   │   │   ├── spatial-assets/     # 3D spatial units, volumes, and 3D-ULPIN records
│   │   │   ├── users/              # User profiles, stakeholder roles & status
│   │   │   └── violations/         # Encroachment detection & conflict audits
│   │   └── routes/                 # Aggregated API route dispatcher
│   ├── tests/                      # Unit & integration test suites
│   ├── coordinates.py              # Python CRS converter (WGS84 EPSG:4326 <-> UTM 43N)
│   ├── extrusion_engine.py         # Python 3D polyhedral extrusion & Euler validator
│   ├── ulpin_generator.py          # Python 3D-ULPIN deterministic spatial hasher
│   ├── topology_validator.py       # Python 3D collision & air-rights clash engine
│   └── pipeline.py                 # Pipeline generating Society 3D GeoJSON records
│
├── frontend/                       # 🎨 React 18 + Three.js 3D WebGIS Application
│   ├── package.json                # React, Three.js, R3F, Lucide, Tailwind CSS
│   ├── vite.config.js              # Dev server config (Port 3000)
│   └── src/
│       ├── components/
│       │   ├── Viewer3D.jsx        # Three.js 3D digital twin viewport & HUD frame
│       │   ├── Navbar.jsx          # Omnibar search, role switcher, theme toggle
│       │   ├── LayerControls.jsx   # Floor slicer, 3D exploded view, coordinate grid
│       │   ├── PropertyDeedCard.jsx# Volumetric 3D deed card & download certificate
│       │   ├── GovtAdminDashboard.jsx # Revenue officer compliance & violation audit
│       │   ├── CitizenLocker.jsx   # Property owner vault & signed EC download
│       │   ├── SurveyorUploadModal.jsx # CAD/BIM/LiDAR ingestion & calibration canvas
│       │   ├── ParcelSplitModal.jsx# 3D parcel subdivision simulator
│       │   ├── MutationModal.jsx   # Title mutation transfer modal
│       │   ├── AIReviewModal.jsx   # AI cadastre review & minting studio
│       │   ├── AboutPage.jsx       # Platform specifications & problem comparison
│       │   ├── DocumentationPage.jsx # Technical documentation with auto scroll-spy
│       │   ├── APIModal.jsx        # REST API & Swagger explorer modal
│       │   └── StrataLogo.jsx      # Vector logo component
│       ├── data/
│       │   └── societyData.json    # Dwarka Sector 10 3D cadastral registry dataset
│       └── App.jsx                 # Master state machine & layout controller
│
├── api/                            # ⚡ FastAPI microservice layer
│   └── main.py                     # Python FastAPI endpoints
│
└── docs/                           # 📑 SIH Presentation & Technical Documentation
    └── PITCH_DECK_OUTLINE.md       # SIH presentation slides and pitch narrative
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18.0+ or v20.0+
- **npm**: v9.0+
- **Python**: v3.10+ (for geometric scripts)
- **PostgreSQL**: v16+ with PostGIS 3.4 (for database services)

---

### 2. Frontend Setup & Launch (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000/](http://localhost:3000/)** in your browser.

To verify the production build:
```bash
npm run build
```

---

### 3. Backend Setup & Launch (Port 3001)
```bash
cd backend
npm install

# Generate Prisma Client & Run Migrations
npx prisma generate
npx prisma migrate dev

# Run in development mode
npm run dev
```
- **REST API Base URL**: `http://localhost:3001/api/v1`
- **Interactive Swagger UI**: `http://localhost:3001/api-docs`

---

### 4. Run Backend Tests
```bash
cd backend
npm test
```

---

### 5. (Optional) Run Python Spatial Math Engine
```bash
cd backend
pip install -r requirements.txt
python -m pytest tests/ -v
python pipeline.py
```

---

## 📜 International Standards & Legal Frameworks
- **ISO 19152:2024 LADM Part 2:** 3D Land Administration Domain Model for volumetric spatial units and Rights, Restrictions, and Responsibilities (RRRs).
- **OGC CityGML 3.0:** Levels of Detail (LoD1/LoD2/LoD3) for building interiors, slab boundaries, and underground spaces.
- **RERA Compliance (India):** Strict carpet area and enclosure volume computation.
- **Digital India Land Records Modernization Programme (DILRMP):** Native compatibility with existing 14-digit Bhu-Aadhaar ULPIN infrastructure.

---

## 📄 License
This project is licensed under the MIT License for Smart India Hackathon (SIH 2026).

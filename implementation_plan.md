# Implementation Plan: AuraCadastre 3D (SIH PS-011)

An end-to-end 3D Cadastral Framework and WebGIS Digital Twin platform that extends India's 14-digit Bhu-Aadhaar (ULPIN) into the 3rd dimension, featuring automated 3D volumetric extrusion, deterministic spatial hashing, topological clash/encroachment auditing, and an interactive 3D society digital twin.

---

## User Review Required

> [!IMPORTANT]
> **Key Architecture Decisions:**
> 1. **Default Geographic Anchor:** Delhi NCR (Dwarka Sector 10 / Rohini coordinates: `28.5823° N, 77.0602° E`), aligning with open Delhi GSDL/AMRUT geodata.
> 2. **Base 14-digit ULPIN Format:** `IND280145987621` (Delhi NCT code prefix).
> 3. **Demo Society Configuration:** 
>    - Basement Parking ($Z = -3.5\text{m}$ to $0.0\text{m}$)
>    - Ground Lobby & Common Areas ($Z = 0.0\text{m}$ to $+3.0\text{m}$)
>    - 4 Residential Floors ($Z = +3.0\text{m}$ to $+15.0\text{m}$, 4 units per floor: Flats 101–104, 201–204, etc.)
>    - Intentional Encroachment: Unit 202 cantilevered balcony (+1.5m air-rights violation over municipal setback) and basement extension into utility zone.
> 4. **Tech Stack:**
>    - **Geometry & Math Engine (Python):** `geopandas`, `shapely`, `trimesh`, `numpy`, `pyproj`
>    - **Frontend & 3D WebGIS:** `React 18` + `Vite` + `Three.js` / `@react-three/fiber` + `Lucide Icons` + `Tailwind CSS`

---

## Proposed Changes

### 1. Mathematical & Spatial Backend Pipeline (`/backend`)

#### [NEW] [coordinates.py](file:///d:/sih/backend/coordinates.py)
- Geodetic coordinate transformations (WGS84 EPSG:4326, UTM 43N EPSG:32643, and local CAD metric projection).
- Affine transformation normalizer mapping relative CAD/vector drawings onto georeferenced cadastral parcels.

#### [NEW] [generate_delhi_society_data.py](file:///d:/sih/backend/generate_delhi_society_data.py)
- Generates ground-truth 2D cadastral polygons for the Delhi society parcel, surrounding road network, and neighboring context buildings.
- Generates interior floor plan vector polygons:
  - Basement parking slots (`Slot B1-01` to `Slot B1-06`, utility room).
  - Ground floor (Entrance lobby, security room, shared garden).
  - Floors 1 to 4 (4 residential apartments per floor with private rooms + common corridors and lift shafts).
  - Intentional encroachment features for audit testing.

#### [NEW] [extrusion_engine.py](file:///d:/sih/backend/extrusion_engine.py)
- Extrudes 2D vectors into 3D polyhedrons along the $Z$-axis with configurable floor-to-floor heights ($3.0\text{m}$) and structural slab offsets ($0.2\text{m}$).
- Executes `trimesh` watertight verification (`is_watertight == True`) and normal repair.
- Computes exact carpet area ($m^2$) and volumetric enclosure ($m^3$).
- Exports to 3D GeoJSON and web-ready 3D data formats (`.glb` / JSON mesh bundles).

#### [NEW] [ulpin_generator.py](file:///d:/sih/backend/ulpin_generator.py)
- Implements deterministic 3D-ULPIN generation formula:
  $$\text{3D-ULPIN} = [\text{Base-14-ULPIN}]-[\text{Domain S/A/U}]+[\text{Floor Level}]-[\text{4-Char SHA-256 Hash}]$$
- Generates cryptographic verification tokens and QR payloads based on 3D bounding vertices and centroid coordinates.

#### [NEW] [topology_validator.py](file:///d:/sih/backend/topology_validator.py)
- 3D Boolean collision detection between private units (ensuring zero illegal overlap).
- Setback and Air-rights violation checks against vertical surface parcel projections.
- Subsurface utility buffer clash detection.
- Generates ISO 19152 LADM compliant JSON registry (`cadastre_3d_registry.json`).

---

### 2. Interactive WebGIS 3D Digital Twin Application (`/frontend`)

#### [NEW] [App.jsx](file:///d:/sih/frontend/src/App.jsx) & Component Hierarchy
- Scaffolds full React + Vite application with Tailwind styling.
- **Top Navigation Bar:**
  - Role switcher: **Public Citizen**, **Property Owner**, **Surveyor/Builder**, **Govt Revenue Officer**.
  - Search bar: Real-time search by 3D-ULPIN, Flat number, or Owner name with camera auto-focus.
  - Global stats: Total Units, Registered Volume ($m^3$), Total Land Area ($m^2$), Encroachments Flagged.

#### [NEW] [Viewer3D.jsx](file:///d:/sih/frontend/src/components/Viewer3D.jsx)
- Interactive 3D scene built with Three.js / Canvas:
  - Delhi urban terrain ground plane, roads, and surrounding LoD1 context buildings.
  - High-precision 3D volumetric society model (basement, ground, floors 1–4, roof).
  - Raycasting hover/click selection for individual units.
  - Smooth camera presets: Orbit, Top-Down Cadastral, Street View, Underground Basement View.

#### [NEW] [LayerControls.jsx](file:///d:/sih/frontend/src/components/LayerControls.jsx)
- **Floor Isolation Slider:** Step through `All Floors`, `Basement (-3.5m)`, `Ground (0m)`, `Floor 1 (+3m)`, `Floor 2 (+6m)`, `Floor 3 (+9m)`, `Floor 4 (+12m)`, `Roof (+15m)`.
- **View Mode Toggles:**
  - *Ownership Mode:* Color-coded private units with distinct opacities.
  - *X-Ray Mode:* Transparent wireframe showing internal structural slabs & corridors.
  - *Encroachment Alert Mode:* Highlights violating polyhedrons in glowing red with warning badges.

#### [NEW] [PropertyDeedCard.jsx](file:///d:/sih/frontend/src/components/PropertyDeedCard.jsx)
- Pop-up inspector on unit click displaying:
  - 3D ULPIN badge (e.g., `IND280145987621-A+02-4C1F`).
  - Unit type (Residential 2BHK/3BHK / Basement Parking / Common Shaft).
  - RERA Carpet Area ($m^2$) & Enclosed Volume ($m^3$).
  - Elevation MSL Range (e.g., $+6.20\text{m}$ to $+9.00\text{m}$).
  - Owner details, Title Status, Bank Lien status, and QR verification code.
  - Action buttons: "Download 3D Deed PDF", "Initiate Mutation", "Simulate 3D Split".

#### [NEW] [GovtAdminDashboard.jsx](file:///d:/sih/frontend/src/components/GovtAdminDashboard.jsx)
- Revenue Officer dashboard tab:
  - Live **Encroachment & Topology Audit Log** (showing exact violation volume in $m^3$).
  - Interactive **3D Parcel Split (Subdivision)** tool: Slices a unit into 2 child ULPINs and updates registry in real-time.
  - Interactive **3D Parcel Merge (Amalgamation)** tool.
  - Approval queue for pending 3D property registrations.

---

## Verification Plan

### Automated Verification
1. **Python Geometry & Extrusion Tests:**
   ```bash
   python -m pytest backend/tests/ -v
   ```
   - Verify `trimesh.is_watertight == True` for all 20+ units.
   - Verify non-zero positive volume for all polyhedrons.
   - Verify exact collision detection flags Unit 202 and Basement violation correctly.
2. **Deterministic Hashing Tests:**
   - Verify identical 3D-ULPIN is generated given same vertex coordinates.

### Manual Verification in Web Browser
1. Launch local dev server: `npm run dev` in `/frontend`.
2. Inspect the 3D Digital Twin scene:
   - Rotate, pan, zoom around the Delhi society.
   - Move the Floor Slider to isolate each floor.
   - Click on various flats (e.g. Unit 101, 202, Basement B1-03) and check the Deed Card details.
   - Toggle **Encroachment Alert Mode** and verify Unit 202's balcony lights up red with the violation warning.
   - Switch to **Govt Officer** role, trigger a **3D Parcel Split**, and verify two new child 3D-ULPINs appear in the 3D viewer.

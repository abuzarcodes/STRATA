# 🏛️ STRATA — Node.js Backend Engine
### Spatial Topology, Registration and Administration of Three-dimensional Assets

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey?logo=express)](https://expressjs.com/)
[![PostgreSQL + PostGIS](https://img.shields.io/badge/PostgreSQL-16%20%2B%20PostGIS%203.4-336791?logo=postgresql)](https://postgis.net/)
[![Prisma](https://img.shields.io/badge/Prisma-6.9-2D3748?logo=prisma)](https://www.prisma.io/)
[![OpenAPI/Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?logo=swagger)](http://localhost:3001/api/docs)

---

## 📌 1. Project Overview

**STRATA** is a 3D spatial asset and cadastral property management platform engineered for the management, registration, visualization, and topological analysis of vertical and volumetric spatial entities.

The system addresses the limitations of legacy 2D cadastres $(X, Y)$ by introducing volumetric parcels $(X, Y, Z)$, independent geometry versioning, topological clash detection, and air-rights encroachment auditing under **ISO 19152 LADM Part 2**.

---

## 🏗️ 2. System Architecture

```text
                    ┌─────────────────────────┐
                    │        FRONTEND         │
                    │                         │
                    │ React 18 / Vite         │
                    │ Three.js / WebGIS       │
                    └────────────┬────────────┘
                                 │
                                 │ HTTP REST API (/api/v1)
                                 ▼
                    ┌─────────────────────────┐
                    │     NODE.JS BACKEND     │
                    │    (Express + TS)       │
                    │                         │
                    │ • Authentication & JWT  │
                    │ • Role Authorization    │
                    │ • Spatial Hierarchies   │
                    │ • Geometry Versioning   │
                    │ • Job Orchestration     │
                    │ • Audit Trails          │
                    └───────────┬─────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
                 ▼                             ▼
      ┌─────────────────────┐       ┌─────────────────────┐
      │ PostgreSQL+PostGIS  │       │   Python/FastAPI    │
      │                     │       │   (api/ directory)  │
      │ Relational State    │       │                     │
      │ Spatial Queries     │       │ • 3D Mesh Extrusion │
      │ PostGIS Geometries  │       │ • Watertight Checks │
      │ Version Records     │       │ • 3D-ULPIN Hashing  │
      └─────────────────────┘       │ • Spatial Topology  │
                                    └─────────────────────┘
```

### Responsibility Matrix

| Feature Domain | Node.js Backend | Python / FastAPI (`api/`) |
| :--- | :--- | :--- |
| **Role** | Main application backend & orchestrator | Heavy spatial math & computational engine |
| **Data Management** | Relational state, CRUD, users, projects | Stateless processing algorithms |
| **Geometry** | Metadata storage, versioning, links | 2D-to-3D extrusion, mesh repairs, slicing |
| **AI / OCR / CV** | Job dispatching, status tracking | Model inference, deed parsing |
| **PostGIS** | CRUD through Prisma + Raw SQL extensions | Native GeoPandas / Shapely / Trimesh algorithms |

---

## 📂 3. Modular Directory Structure

```text
backend/
├── prisma/
│   ├── schema.prisma                 # Master relational & spatial entity schema
│   └── migrations/                   # PostGIS extension & versioned SQL migrations
│
├── src/
│   ├── app.ts                        # Express factory, security middleware, Swagger
│   ├── server.ts                     # HTTP listener, graceful shutdown lifecycle
│   │
│   ├── config/                       # Centralized configuration (Validated with Zod)
│   │   ├── env.ts                    # Zod schema enforcing typed process.env
│   │   ├── database.ts               # Database configuration
│   │   ├── auth.ts                   # JWT secret and expiration policies
│   │   ├── python-service.ts         # Python FastAPI service endpoint settings
│   │   └── swagger.ts                # OpenAPI 3.0 specification generator
│   │
│   ├── database/
│   │   └── prisma/
│   │       └── client.ts             # Reusable singleton Prisma Client
│   │
│   ├── middleware/                   # Cross-cutting HTTP middleware
│   │   ├── auth.middleware.ts        # Bearer JWT verification & req.user injection
│   │   ├── role.middleware.ts        # Role-based access control (RBAC) guard
│   │   ├── validate.middleware.ts    # Generic Zod validation for body/query/params
│   │   ├── error.middleware.ts       # Global error translator (AppError, Zod, Prisma)
│   │   └── not-found.middleware.ts   # 404 handler for unmatched routes
│   │
│   ├── common/                       # Shared utilities, enums, response helpers
│   │   ├── errors/                   # AppError and ErrorCodes
│   │   ├── responses/                # sendSuccess, sendPaginated, sendCreated, sendError
│   │   ├── enums/                    # Role, AssetType, ProcessingJobStatus, ViolationType
│   │   ├── types/                    # Express augmentation, pagination interfaces
│   │   └── utils/                    # Pagination math and helper utilities
│   │
│   ├── modules/                      # Domain Feature Modules (Modular Monolith)
│   │   ├── health/                   # System and database diagnostics
│   │   ├── auth/                     # Register, Login, JWT issuing, Profile
│   │   ├── users/                    # User management and directory
│   │   ├── projects/                 # Cadastral workspace projects & hierarchy
│   │   ├── parcels/                  # Land parcel boundaries & metadata
│   │   ├── buildings/                # Multi-storey volumetric structures
│   │   ├── floors/                   # Level indices, elevation gauges, heights
│   │   ├── spatial-assets/           # Property units, common areas, parking
│   │   ├── geometries/               # Independent GeometryVersion manager
│   │   ├── processing/               # Asynchronous processing job state machine
│   │   ├── violations/               # 3D clash, overlap & encroachment management
│   │   └── audit/                    # Non-blocking audit trail logging service
│   │
│   ├── integrations/                 # External service communication boundaries
│   │   └── python-processing/        # Typed Axios client for Python FastAPI engine
│   │
│   └── routes/
│       └── index.ts                  # Master route aggregator (/api/v1/*)
│
├── tests/
│   ├── unit/                         # Unit tests (Errors, Responses, Schemas)
│   └── integration/                  # Integration tests (App bootstrapping, Endpoints)
│
├── Dockerfile                        # Multi-stage production container build
├── docker-compose.yml                # Express + PostGIS multi-container environment
├── .env.example                      # Environment configuration template
├── package.json                      # Scripts & dependencies
└── tsconfig.json                     # Strict TypeScript compiler options
```

---

## 🚀 4. Quickstart Guide

### Prerequisites
- **Node.js**: >= 18.0.0
- **PostgreSQL with PostGIS**: >= 16 (or run with Docker)
- **npm** or **pnpm**

### Step 1: Clone and Configure Environment

```bash
cd backend
cp .env.example .env
```

Review `.env`:
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://strata:strata@localhost:5432/strata_db
JWT_SECRET=your-secure-jwt-secret-key-min-16-chars
JWT_EXPIRES_IN=7d
PYTHON_PROCESSING_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
```

### Step 2: Install Dependencies & Generate Prisma Client

```bash
npm install
npm run prisma:generate
```

### Step 3: Run Database Migrations (PostGIS Enabled)

```bash
# If using a local PostgreSQL instance:
npm run prisma:migrate
```

### Step 4: Launch in Development Mode

```bash
npm run dev
```

Server will start on: **`http://localhost:3001`**  
OpenAPI / Swagger documentation: **`http://localhost:3001/api/docs`**

---

## 🐳 5. Docker Compose Setup

Run both the Node.js Express backend and the PostgreSQL + PostGIS database in isolated containers:

```bash
docker compose up --build
```

Services started:
- **`strata_backend`**: Node.js app on `http://localhost:3001`
- **`strata_spatial_db`**: PostGIS 16 on `localhost:5432` with automatic PostGIS extension initialization

---

## 🧪 6. Testing & Code Quality

```bash
# Run unit & integration tests
npm test

# Run linter
npm run lint

# Run code formatter
npm run format

# Compile TypeScript production bundle
npm run build
```

---

## 🛡️ 7. Key Architecture Principles

### 1. Spatial Asset Identity $\neq$ Geometry
In STRATA, an asset's identity (e.g., *Apartment 402, Floor 4, Tower B*) is decoupled from its geometry. A spatial asset points to versioned geometry records (`GeometryVersion 1`, `GeometryVersion 2`), allowing revisions, updates from LiDAR/CAD, and temporal audit logs without breaking ownership references.

### 2. PostGIS + Prisma Compatibility
Prisma manages all standard relational models. Geometry operations that require spatial calculations (e.g., `ST_3DIntersects`, `ST_Volume`, `ST_Centroid`) are cleanly executed via raw SQL queries (`prisma.$queryRaw`) or delegated to the Python geometry engine.

### 3. Asynchronous Job State Machine
Long-running AI extractions, volumetric mesh extrusions, and clash audits use the `ProcessingJob` model. Lifecycle states (`PENDING` $\to$ `QUEUED` $\to$ `PROCESSING` $\to$ `COMPLETED` / `FAILED` / `REQUIRES_REVIEW`) allow plugging in BullMQ/Redis in the future without changing route interfaces.

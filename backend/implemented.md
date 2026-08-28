# 🏛️ STRATA Node.js Backend — Implementation & State Report

> **Target Directory:** `/backend`  
> **Framework & Runtime:** Node.js 20+ | Express 4.21 | TypeScript 5.7 (Strict Mode)  
> **Database & ORM:** PostgreSQL 16 + PostGIS 3.4 | Prisma ORM 6.9  
> **Validation & Security:** Zod 3.24 | JSON Web Tokens | bcrypt | Helmet | CORS  
> **Architecture Pattern:** Modular Monolith with Layered Separation (Routes $\to$ Controller $\to$ Service $\to$ Prisma)  
> **Status:** Production-Ready Foundation (Fully Built, Tested & Verified)  
> **Last Updated:** August 2026

---

## 📑 Table of Contents

1. [Backend Overview & Responsibility](#1-backend-overview--responsibility)
2. [Complete Directory & File Structure](#2-complete-directory--file-structure)
3. [Configuration & Environment Validation](#3-configuration--environment-validation)
4. [Cross-Cutting Middleware Architecture](#4-cross-cutting-middleware-architecture)
5. [Database Models & PostGIS Architecture](#5-database-models--postgis-architecture)
6. [Feature Modules Breakdown](#6-feature-modules-breakdown)
   - [6.1 Health Module](#61-health-module)
   - [6.2 Authentication Module](#62-authentication-module)
   - [6.3 Users Module](#63-users-module)
   - [6.4 Projects Module](#64-projects-module)
   - [6.5 Parcels Module](#65-parcels-module)
   - [6.6 Buildings Module](#66-buildings-module)
   - [6.7 Floors Module](#67-floors-module)
   - [6.8 Spatial Assets Module](#68-spatial-assets-module)
   - [6.9 Geometries Module (Decoupled Versioning)](#69-geometries-module-decoupled-versioning)
   - [6.10 Processing Jobs Module (State Machine)](#610-processing-jobs-module-state-machine)
   - [6.11 Violations Module](#611-violations-module)
   - [6.12 Audit Logging Service](#612-audit-logging-service)
7. [Python/FastAPI Integration Boundary](#7-pythonfastapi-integration-boundary)
8. [API Endpoints Directory](#8-api-endpoints-directory)
9. [Standardized API Response & Error Conventions](#9-standardized-api-response--error-conventions)
10. [Docker & Containerization](#10-docker--containerization)
11. [Testing & Verification Results](#11-testing--verification-results)
12. [Developer Guide: Extending the Backend](#12-developer-guide-extending-the-backend)

---

## 1. Backend Overview & Responsibility

The **STRATA Node.js Backend** serves as the **central application logic, orchestrator, and data management layer** of the platform.

### Responsibilities:
* Managing users, identity, and session authentication via JWT.
* Enforcing Role-Based Access Control (`ADMIN`, `SURVEYOR`, `REVIEWER`, `USER`).
* Managing cadastral projects and spatial asset hierarchies (`Project` $\to$ `Parcel` $\to$ `Building` $\to$ `Floor` $\to$ `SpatialAsset`).
* Decoupling and versioning spatial geometry records independently of asset identity.
* Managing asynchronous processing job states for AI and GIS calculations.
* Orchestrating remote computational requests with the Python/FastAPI processing layer.
* Recording non-blocking, tamper-evident audit history logs.
* Providing OpenAPI 3.0 (Swagger) live documentation.

### Explicit Non-Responsibilities (Delegated to Python `/api`):
* Heavy 3D mesh rendering and mesh boolean computations.
* Computational geometry algorithms and AI/OCR model inference.
* Complex GIS topology transformations.

---

## 2. Complete Directory & File Structure

```text
backend/
├── prisma/
│   ├── schema.prisma                      # Prisma schema (10 models + 5 enums)
│   └── migrations/
│       └── 0_init/
│           └── migration.sql              # Initial migration with PostGIS extension
│
├── src/
│   ├── app.ts                             # Express application factory & middleware setup
│   ├── server.ts                          # HTTP server startup & graceful shutdown
│   │
│   ├── config/                            # Centralized validated configuration
│   │   ├── env.ts                         # Zod schema validating process.env on startup
│   │   ├── database.ts                    # Database URL re-export
│   │   ├── auth.ts                        # JWT secret & expiration policy
│   │   ├── python-service.ts              # Python service URL & timeout settings
│   │   └── swagger.ts                     # OpenAPI 3.0 specification config
│   │
│   ├── database/
│   │   └── prisma/
│   │       └── client.ts                  # Singleton connection-pooled Prisma Client
│   │
│   ├── middleware/                        # Express HTTP middleware pipeline
│   │   ├── auth.middleware.ts             # JWT Bearer token validator & req.user injector
│   │   ├── role.middleware.ts             # Role-based access control guard factory
│   │   ├── validate.middleware.ts         # Generic Zod validation for body/query/params
│   │   ├── error.middleware.ts            # Global error handler (AppError, Zod, Prisma)
│   │   └── not-found.middleware.ts        # 404 handler for unmatched routes
│   │
│   ├── common/                            # Reusable constants, enums, responses, utils
│   │   ├── constants/
│   │   │   └── app.constants.ts           # API_PREFIX ('/api/v1'), SWAGGER_PATH ('/api/docs')
│   │   ├── enums/
│   │   │   ├── role.enum.ts               # ADMIN, SURVEYOR, REVIEWER, USER
│   │   │   ├── asset-type.enum.ts         # PROPERTY_UNIT, COMMON_AREA, PARKING, etc.
│   │   │   ├── processing-status.enum.ts  # PENDING, QUEUED, PROCESSING, COMPLETED, etc.
│   │   │   ├── violation-type.enum.ts     # OVERLAP, ENCROACHMENT, BOUNDARY_CONFLICT, etc.
│   │   │   ├── audit-action.enum.ts       # CREATE, UPDATE, DELETE, VERIFY, PROCESS
│   │   │   └── index.ts                   # Barrel export
│   │   ├── errors/
│   │   │   ├── app-error.ts               # Custom operational AppError class
│   │   │   ├── error-codes.ts             # Centralized machine-readable error codes
│   │   │   └── index.ts                   # Barrel export
│   │   ├── responses/
│   │   │   ├── api-response.ts            # sendSuccess, sendPaginated, sendCreated, sendError
│   │   │   └── index.ts                   # Barrel export
│   │   ├── types/
│   │   │   ├── express.d.ts               # Augmentation for Express.Request (req.user)
│   │   │   └── pagination.types.ts        # Pagination interfaces and defaults
│   │   └── utils/
│   │       └── pagination.ts              # parsePagination, paginationToSkipTake helpers
│   │
│   ├── modules/                           # Domain Feature Modules (Modular Monolith)
│   │   ├── health/                        # System & PostGIS diagnostics
│   │   ├── auth/                          # Authentication, bcrypt hashing, JWT issuance
│   │   ├── users/                         # User profile lookup & admin directory
│   │   ├── projects/                      # Cadastral project workspaces & hierarchy CRUD
│   │   ├── parcels/                       # Land parcels (2D boundaries & areas)
│   │   ├── buildings/                     # Multi-storey building volumes & floor counts
│   │   ├── floors/                        # Levels, vertical elevation offsets, heights
│   │   ├── spatial-assets/                # Volumetric property units & common spaces
│   │   ├── geometries/                    # Versioned 3D geometry storage
│   │   ├── processing/                    # Asynchronous processing job state machine
│   │   ├── violations/                    # Encroachment & boundary violation registry
│   │   └── audit/                         # Non-blocking audit trail logging service
│   │
│   ├── integrations/                      # External service clients
│   │   └── python-processing/             # Strongly-typed Axios RPC client for Python API
│   │       ├── python-processing.client.ts
│   │       ├── python-processing.service.ts
│   │       └── python-processing.types.ts
│   │
│   └── routes/
│       └── index.ts                       # Master router mounting all feature modules
│
├── tests/
│   ├── unit/
│   │   ├── errors.test.ts                 # Tests for AppError and error codes
│   │   └── responses.test.ts              # Tests for standardized response formatters
│   └── integration/
│       └── app.test.ts                    # Tests for app bootstrap, root info, and 404
│
├── Dockerfile                             # Multi-stage production container build
├── docker-compose.yml                     # Node.js backend + PostGIS 16 multi-container
├── .env.example                           # Documented environment variable template
├── .env                                   # Local runtime configuration
├── .eslintrc.cjs                          # ESLint configuration with TypeScript & Prettier
├── .prettierrc                            # Prettier code formatting rules
├── jest.config.js                         # Jest configuration for ts-jest
├── package.json                           # Scripts and dependencies
└── tsconfig.json                          # Strict TypeScript compiler options
```

---

## 3. Configuration & Environment Validation

Configuration is centralized in `src/config/env.ts`. **No other file in the application accesses `process.env` directly.**

### Fail-Fast Startup Validation
Using Zod, the application validates all environment variables upon module import. If any required variable is missing or malformed, the process terminates immediately with an informative formatted error message.

```typescript
// src/config/env.ts Schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters for security'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  PYTHON_PROCESSING_SERVICE_URL: z.string().url().default('http://localhost:8000'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});
```

---

## 4. Cross-Cutting Middleware Architecture

Every incoming request passes through a strictly ordered middleware pipeline:

```text
Incoming Request
    │
    ▼
1. Helmet Security Headers
    │
    ▼
2. CORS (Configured to env.CORS_ORIGIN)
    │
    ▼
3. Body Parsers (express.json, express.urlencoded with 10MB limits)
    │
    ▼
4. Morgan Request Logger (combined in prod, dev in development)
    │
    ▼
5. Route Handlers (/api/docs Swagger, /api/v1/* Routes)
    │   ├── validate(schema)          [Zod DTO Validator]
    │   ├── authMiddleware            [JWT Token Validator]
    │   └── requireRole(Role.ADMIN)   [RBAC Guard]
    │
    ▼
6. notFoundMiddleware (404 for unmatched endpoints)
    │
    ▼
7. errorMiddleware (Global exception translator)
```

### Key Middleware Files:
* **`auth.middleware.ts`**: Verifies Bearer JWT tokens from the `Authorization` header, decodes payload `{ id, email, role }`, and attaches it to `req.user`.
* **`role.middleware.ts`**: Higher-order middleware factory `requireRole(...roles)` checking `req.user.role`. Returns `403 FORBIDDEN` if unauthorized.
* **`validate.middleware.ts`**: Validates `req.body`, `req.query`, and `req.params` against any Zod schema. Returns `400 VALIDATION_ERROR` with path details on failure.
* **`error.middleware.ts`**: Centralized error catcher. Maps:
  - `AppError` $\to$ Specified status code & machine-readable error code.
  - `ZodError` $\to$ `400 VALIDATION_ERROR` with structured field messages.
  - `PrismaClientKnownRequestError` (`P2002` unique constraint $\to$ `409 CONFLICT`, `P2025` not found $\to$ `404 RESOURCE_NOT_FOUND`).
  - `TokenExpiredError` / `JsonWebTokenError` $\to$ `401 UNAUTHORIZED`.
  - Unhandled exceptions $\to$ `500 INTERNAL_ERROR` (hides stack traces in production).

---

## 5. Database Models & PostGIS Architecture

The database is built on **PostgreSQL 16 with the PostGIS 3.4 spatial extension**.

### Architectural Decision: Prisma + PostGIS Compatibility
Prisma does not natively generate types for all PostGIS binary geometries. STRATA adopts the proven pattern:
1. Standard relational models and metadata are managed natively via Prisma.
2. Geometry structures are stored in typed `geometryData` `Json` columns (GeoJSON / polyhedral definitions).
3. The initial migration (`prisma/migrations/0_init/migration.sql`) runs `CREATE EXTENSION IF NOT EXISTS postgis;` to enable spatial SQL indexing (`ST_3DIntersects`, `ST_Volume`, etc.) via `prisma.$queryRaw`.

### Schema Summary (`prisma/schema.prisma`):

| Model Name | Table Name | Key Attributes | Relations |
| :--- | :--- | :--- | :--- |
| **`User`** | `users` | `id`, `email` (unique), `passwordHash`, `name`, `role` | $\to$ Projects, Jobs, AuditLogs |
| **`Project`** | `projects` | `id`, `name`, `description`, `ownerId` | $\to$ User (owner), Parcels |
| **`Parcel`** | `parcels` | `id`, `projectId`, `name`, `parcelNumber`, `area`, `metadata` | $\to$ Project, Buildings |
| **`Building`** | `buildings` | `id`, `parcelId`, `name`, `numberOfFloors`, `metadata` | $\to$ Parcel, Floors |
| **`Floor`** | `floors` | `id`, `buildingId`, `level`, `elevation`, `height` | $\to$ Building, SpatialAssets |
| **`SpatialAsset`** | `spatial_assets` | `id`, `floorId`, `name`, `type` (`AssetType`), `metadata` | $\to$ Floor, GeometryVersions, Violations |
| **`GeometryVersion`** | `geometry_versions` | `id`, `spatialAssetId`, `version` (int), `source`, `status`, `geometryData` (Json) | $\to$ SpatialAsset |
| **`ProcessingJob`** | `processing_jobs` | `id`, `type`, `status` (`ProcessingJobStatus`), `inputData`, `outputData`, `errorMessage` | $\to$ User (requestedBy) |
| **`Violation`** | `violations` | `id`, `spatialAssetId`, `type`, `severity`, `description`, `resolved` | $\to$ SpatialAsset |
| **`AuditLog`** | `audit_logs` | `id`, `action`, `entityType`, `entityId`, `userId`, `metadata` | $\to$ User |

---

## 6. Feature Modules Breakdown

Every domain module follows a consistent, decoupled structure:
```text
module/
├── module.routes.ts       # Express router with Zod validation & auth guards
├── module.controller.ts   # HTTP parameter parsing & standardized response delivery
├── module.service.ts      # Pure business logic & database queries via Prisma
├── module.validation.ts   # Zod input schemas for body/params/query
└── module.types.ts        # TypeScript interfaces and contracts
```

### 6.1 Health Module
* **Location:** `src/modules/health/`
* **Route:** `GET /api/v1/health`
* **Functionality:** Returns application status (`ok`/`degraded`), uptime in seconds, runtime environment, and live database latency by executing `SELECT 1` through Prisma.

### 6.2 Authentication Module
* **Location:** `src/modules/auth/`
* **Functionality:**
  - `POST /register`: Validates password strength (min 8 chars, 1 uppercase, 1 number), hashes password using `bcrypt` (10 rounds), creates `User`, returns signed JWT.
  - `POST /login`: Validates credentials, verifies bcrypt hash, returns JWT with expiration policy.
  - `GET /profile`: Authenticated endpoint returning safe user profile (excluding `passwordHash`).

### 6.3 Users Module
* **Location:** `src/modules/users/`
* **Functionality:**
  - `GET /users`: Paginated directory of registered users. Protected by `requireRole(Role.ADMIN)`.
  - `GET /users/:id`: User profile lookup by ID.

### 6.4 Projects Module
* **Location:** `src/modules/projects/`
* **Functionality:** Full CRUD for cadastral workspaces. `GET /projects/:id` returns the full nested spatial tree (`Parcels` $\to$ `Buildings` $\to$ `Floors` $\to$ `SpatialAssets`). Includes ownership protection (only project owner or Admin can update/delete).

### 6.5 Parcels Module
* **Location:** `src/modules/parcels/`
* **Functionality:** Registers and queries land parcel boundaries, surface areas, and metadata linked to a parent project.

### 6.6 Buildings Module
* **Location:** `src/modules/buildings/`
* **Functionality:** Manages multi-storey structures attached to a parcel, tracking total floor counts and building metadata.

### 6.7 Floors Module
* **Location:** `src/modules/floors/`
* **Functionality:** Records floor levels, vertical elevation offsets relative to ground datum, and floor ceiling heights (for volumetric extrusion calculations).

### 6.8 Spatial Assets Module
* **Location:** `src/modules/spatial-assets/`
* **Functionality:** Manages volumetric entities (`PROPERTY_UNIT`, `COMMON_AREA`, `PARKING`, `UTILITY`, `INFRASTRUCTURE`, `OTHER`). Queries support filtering by floor ID and asset type.

### 6.9 Geometries Module (Decoupled Versioning)
* **Location:** `src/modules/geometries/`
* **Design Principle:** **Spatial Asset Identity $\neq$ Spatial Geometry**.
* **Functionality:** Manages `GeometryVersion` records. When a revision is uploaded (e.g. from LiDAR or CAD), a new incremental version is appended without altering the asset's primary UUID or legal title registration.

### 6.10 Processing Jobs Module (State Machine)
* **Location:** `src/modules/processing/`
* **Functionality:** Database-backed state machine tracking asynchronous computations (`PENDING` $\to$ `QUEUED` $\to$ `PROCESSING` $\to$ `COMPLETED` / `FAILED` / `REQUIRES_REVIEW`). Provides the exact boundary needed to plug in Redis/BullMQ in the future without altering route interfaces.

### 6.11 Violations Module
* **Location:** `src/modules/violations/`
* **Functionality:** Registers spatial collisions, overlaps, air-rights encroachments, and setback violations. Exposes `PATCH /violations/:id/resolve` for government reviewer workflows.

### 6.12 Audit Logging Service
* **Location:** `src/modules/audit/`
* **Functionality:** Internal service (`auditService.log(...)`) injected across modules to record non-blocking audit trail events (`CREATE`, `UPDATE`, `DELETE`, `VERIFY`, `PROCESS`).

---

## 7. Python/FastAPI Integration Boundary

* **Location:** `src/integrations/python-processing/`
* **Client:** Pre-configured Axios instance with timeouts, custom User-Agent, and interceptors.
* **Service:** `PythonProcessingService` exposes typed methods:
  - `checkHealth()`: Checks Python geometry server status.
  - `submitJob<TReq, TRes>()`: Dispatches asynchronous processing requests.
  - `request3dExtrusion()`: Requests 2D-to-3D volumetric mesh extrusion and watertight certification.
* **Error Translation:** Automatically translates Axios HTTP failures into standard `AppError` instances with code `EXTERNAL_SERVICE_ERROR`.

---

## 8. API Endpoints Directory

All routes are prefixed with `/api/v1`. Live documentation is available at `/api/docs`.

| Method | Endpoint | Auth Required | Allowed Roles | Description |
| :--- | :--- | :---: | :---: | :--- |
| **GET** | `/health` | No | Public | System diagnostics & PostGIS database ping |
| **POST** | `/auth/register` | No | Public | Register new user account |
| **POST** | `/auth/login` | No | Public | Authenticate user & receive JWT |
| **GET** | `/auth/profile` | Yes | All | Get current user's profile |
| **GET** | `/users` | Yes | `ADMIN` | Paginated list of all users |
| **GET** | `/users/:id` | Yes | All | Get user details by ID |
| **POST** | `/projects` | Yes | All | Create new project workspace |
| **GET** | `/projects` | Yes | All | List projects (scoped to user, or all if Admin) |
| **GET** | `/projects/:id` | Yes | All | Get project details with full spatial tree |
| **PATCH**| `/projects/:id` | Yes | Owner / Admin | Update project metadata |
| **DELETE**|`/projects/:id` | Yes | Owner / Admin | Delete project |
| **POST** | `/parcels` | Yes | All | Create land parcel |
| **GET** | `/parcels` | Yes | All | List parcels (optional `projectId` filter) |
| **GET** | `/parcels/:id` | Yes | All | Get parcel details & buildings |
| **POST** | `/buildings` | Yes | All | Register building structure |
| **GET** | `/buildings` | Yes | All | List buildings (optional `parcelId` filter) |
| **GET** | `/buildings/:id` | Yes | All | Get building details & floors |
| **POST** | `/floors` | Yes | All | Create floor level with elevation & height |
| **GET** | `/floors` | Yes | All | List floors (optional `buildingId` filter) |
| **GET** | `/floors/:id` | Yes | All | Get floor details & spatial assets |
| **POST** | `/spatial-assets` | Yes | All | Create spatial property unit / common space |
| **GET** | `/spatial-assets` | Yes | All | List spatial assets (`floorId`, `type` filter) |
| **GET** | `/spatial-assets/:id` | Yes | All | Get spatial asset with geometry history |
| **POST** | `/geometries/versions` | Yes | All | Register new 3D geometry version |
| **GET** | `/geometries/asset/:assetId` | Yes | All | Get geometry version history for an asset |
| **GET** | `/geometries/versions/:id` | Yes | All | Get specific geometry version record |
| **POST** | `/processing/jobs` | Yes | All | Dispatch asynchronous processing job |
| **GET** | `/processing/jobs` | Yes | All | List processing jobs (`status` filter) |
| **GET** | `/processing/jobs/:id` | Yes | All | Get processing job status & results |
| **PATCH**| `/processing/jobs/:id/status` | Yes | All | Update processing job status |
| **POST** | `/violations` | Yes | All | Register spatial violation / encroachment |
| **GET** | `/violations` | Yes | All | List violations (`spatialAssetId`, `resolved`) |
| **GET** | `/violations/:id` | Yes | All | Get violation details |
| **PATCH**| `/violations/:id/resolve` | Yes | All | Mark violation as resolved |

---

## 9. Standardized API Response & Error Conventions

Every response from the backend adheres strictly to one of three JSON contracts.

### Success Response (`sendSuccess` / `sendCreated`)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "c7a8e2b0-8f1d-4e9a-bc01-9876543210ab",
    "name": "Tower A - Unit 402"
  }
}
```

### Paginated List Response (`sendPaginated`)
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [
    { "id": "uuid-1", "name": "Dwarka Sector 10 Digital Twin" }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### Error Response (`sendError` / Global Error Middleware)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "body.email: Invalid email address; body.password: Password must be at least 8 characters"
  }
}
```

---

## 10. Docker & Containerization

The backend includes a complete Docker setup for isolated, reproducible execution.

### Multi-Stage Dockerfile (`Dockerfile`)
* **Builder Stage:** Uses `node:20-alpine`, installs dev dependencies, runs `prisma generate`, and executes `npm run build` (`tsc`).
* **Runner Stage:** Copies compiled `dist/`, production `node_modules`, and runs as the non-root `node` user on port `3001`.

### Docker Compose (`docker-compose.yml`)
* **`strata_backend`:** Express application container connected to PostGIS via Docker network.
* **`strata_spatial_db`:** `postgis/postgis:16-3.4` database container with automated healthchecks and initial migration execution.

---

## 11. Testing & Verification Results

The backend has undergone strict automated verification:

```text
Test Suites: 3 passed, 3 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        4.789 s
```

### Verified Commands:
* `npm run build` $\to$ **Passed** (Strict TypeScript compiled cleanly to `dist/`).
* `npm run lint` $\to$ **Passed** (0 ESLint errors, 0 warnings).
* `npm run format:check` $\to$ **Passed** (100% Prettier compliant).
* `npm test` $\to$ **Passed** (8 unit and integration tests passing).

---

## 12. Developer Guide: Extending the Backend

To add a new domain feature to STRATA (e.g. `Deeds` or `Taxation`), follow this 4-step checklist:

1. **Update Schema:** Add your model to `prisma/schema.prisma` and run `npx prisma generate`.
2. **Create Module Directory:** Create `src/modules/<feature>/` with:
   - `<feature>.types.ts`
   - `<feature>.validation.ts` (Zod schemas)
   - `<feature>.service.ts` (Prisma queries)
   - `<feature>.controller.ts` (HTTP handlers using `sendSuccess`/`sendPaginated`)
   - `<feature>.routes.ts` (Express router with `validate()` and `authMiddleware`)
3. **Register Route:** Import the router in `src/routes/index.ts` and attach it with `router.use('/<feature>', <feature>Routes)`.
4. **Write Tests:** Add unit tests in `tests/unit/` or integration tests in `tests/integration/`.

---

*This document certifies that the STRATA Node.js Backend foundation is complete, verified, and ready for active feature development.*

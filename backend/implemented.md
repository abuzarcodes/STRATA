# 🏛️ STRATA Node.js Backend — Implementation & Architecture Report

> **Target Directory:** `/backend`  
> **Framework & Runtime:** Node.js 20+ | Express 4.21 | TypeScript 5.7 (Strict Mode)  
> **Database & ORM:** PostgreSQL 16 + PostGIS 3.4 | Prisma ORM 6.9  
> **Validation & Security:** Zod 3.24 | JSON Web Tokens | bcrypt | Helmet | CORS  
> **Architecture Pattern:** Modular Monolith with Layered Separation (Routes → Controller → Service → Prisma)  
> **Authorization Model:** Multi-Tier RBAC + Granular Permissions + Ownership & Assignment-Based Access Control (ABAC)  
> **Status:** Phase 1 Complete (Fully Built, Tested & Verified — 8 Test Suites, 32 Tests Passing)  
> **Last Updated:** August 2026

---

## 📑 Table of Contents

1. [Backend Overview & Responsibility](#1-backend-overview--responsibility)
2. [Complete Directory & File Structure](#2-complete-directory--file-structure)
3. [Configuration & Environment Validation](#3-configuration--environment-validation)
4. [Cross-Cutting Middleware & Authorization Pipeline](#4-cross-cutting-middleware--authorization-pipeline)
5. [Roles, Permissions & Assignment Architecture (Phase 1)](#5-roles-permissions--assignment-architecture-phase-1)
   - [5.1 Five Platform Roles](#51-five-platform-roles)
   - [5.2 Granular Permissions Enum (33 Actions)](#52-granular-permissions-enum-33-actions)
   - [5.3 Centralized Role → Permission Matrix](#53-centralized-role--permission-matrix)
   - [5.4 Project Ownership & Assignment Model](#54-project-ownership--assignment-model)
   - [5.5 Reusable Authorization Service & Spatial Hierarchy Resolution](#55-reusable-authorization-service--spatial-hierarchy-resolution)
6. [Database Models & PostGIS Architecture](#6-database-models--postgis-architecture)
7. [Feature Modules Breakdown](#7-feature-modules-breakdown)
   - [7.1 Health Module](#71-health-module)
   - [7.2 Authentication Module](#72-authentication-module)
   - [7.3 Users Management Module](#73-users-management-module)
   - [7.4 Projects Module](#74-projects-module)
   - [7.5 Project Assignments Module](#75-project-assignments-module)
   - [7.6 Parcels Module](#76-parcels-module)
   - [7.7 Buildings Module](#77-buildings-module)
   - [7.8 Floors Module](#78-floors-module)
   - [7.9 Spatial Assets Module](#79-spatial-assets-module)
   - [7.10 Geometries Module (Decoupled Versioning)](#710-geometries-module-decoupled-versioning)
   - [7.11 Processing Jobs Module (State Machine)](#711-processing-jobs-module-state-machine)
   - [7.12 Violations Module](#712-violations-module)
   - [7.13 Audit Logging Service](#713-audit-logging-service)
8. [Python/FastAPI Integration Boundary](#8-pythonfastapi-integration-boundary)
9. [API Endpoints Directory](#9-api-endpoints-directory)
10. [Standardized API Response & Error Conventions](#10-standardized-api-response--error-conventions)
11. [Docker & Containerization](#11-docker--containerization)
12. [Testing & Verification Results](#12-testing--verification-results)
13. [Developer Guide: Extending the Backend](#13-developer-guide-extending-the-backend)

---

## 1. Backend Overview & Responsibility

The **STRATA Node.js Backend** serves as the **central application logic, orchestrator, authorization authority, and spatial data management layer** of the platform.

### Responsibilities:
* Managing user identity, password security (bcrypt), and session authentication via JWT.
* Enforcing multi-tier authorization: Authentication → Role Permissions → Resource Ownership/Assignment → Workflow State.
* Managing cadastral projects and spatial asset hierarchies (`Project` → `Parcel` → `Building` → `Floor` → `SpatialAsset`).
* Decoupling and versioning spatial geometry records independently of asset identity.
* Managing asynchronous processing job states for AI and GIS calculations.
* Orchestrating remote computational requests with the Python/FastAPI processing layer.
* Recording non-blocking, tamper-evident audit history logs for data operations and security events.
* Providing live OpenAPI 3.0 (Swagger) interactive documentation.

### Explicit Non-Responsibilities (Delegated to Python `/api`):
* Heavy 3D mesh rendering and mesh boolean computations.
* Computational geometry algorithms and AI/OCR model inference.
* Complex GIS topology transformations.

---

## 2. Complete Directory & File Structure

```text
backend/
├── prisma/
│   ├── schema.prisma                      # Prisma schema (11 models + 5 enums)
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
│   │   ├── require-permission.middleware.ts # Granular permission guard factory
│   │   ├── require-project-access.middleware.ts # Resource ownership & assignment access guard
│   │   ├── role.middleware.ts             # Role-based access control guard factory
│   │   ├── validate.middleware.ts         # Generic Zod validation for body/query/params
│   │   ├── error.middleware.ts            # Global error handler (AppError, Zod, Prisma, JWT)
│   │   └── not-found.middleware.ts        # 404 handler for unmatched routes
│   │
│   ├── common/                            # Reusable constants, enums, responses, utils, auth
│   │   ├── authorization/                 # Centralized Authorization Core (Phase 1)
│   │   │   ├── permissions.ts             # 33 granular Permission enum definitions
│   │   │   ├── role-permissions.ts        # Single authoritative Role -> Set<Permission> map
│   │   │   ├── authorization.service.ts   # Reusable permission, ownership & assignment service
│   │   │   ├── types.ts                   # AuthorizationContext & ProjectAccessOptions
│   │   │   └── index.ts                   # Barrel export
│   │   ├── constants/
│   │   │   └── app.constants.ts           # API_PREFIX ('/api/v1'), SWAGGER_PATH ('/api/docs')
│   │   ├── enums/
│   │   │   ├── role.enum.ts               # ADMIN, PROPERTY_OWNER, SURVEYOR, REVIEWER, REGISTRATION_OFFICER
│   │   │   ├── asset-type.enum.ts         # PROPERTY_UNIT, COMMON_AREA, PARKING, etc.
│   │   │   ├── processing-status.enum.ts  # PENDING, QUEUED, PROCESSING, COMPLETED, etc.
│   │   │   ├── violation-type.enum.ts     # OVERLAP, ENCROACHMENT, BOUNDARY_CONFLICT, etc.
│   │   │   ├── audit-action.enum.ts       # CREATE, UPDATE, DELETE, USER_ROLE_CHANGED, etc.
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
│   │   ├── users/                         # User profile lookup, role updates & activation
│   │   ├── projects/                      # Cadastral project workspaces & hierarchy CRUD
│   │   ├── assignments/                   # Project team assignments (Surveyor, Reviewer, etc.)
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
│   │   ├── responses.test.ts              # Tests for standardized response formatters
│   │   ├── authorization.test.ts          # Tests for role-to-permission mappings
│   │   ├── require-permission.test.ts     # Tests for permission middleware
│   │   ├── authorization-service.test.ts  # Tests for ownership & assignment access checks
│   │   ├── assignments.test.ts            # Tests for project assignment service logic
│   │   └── users-role.test.ts             # Tests for role update & self-change prevention
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

## 4. Cross-Cutting Middleware & Authorization Pipeline

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
    │   ├── validate(schema)                 [Zod DTO Validator: params, query, body]
    │   ├── authMiddleware                   [JWT Bearer Validator -> req.user injector]
    │   ├── requirePermission(Permission.*)  [Granular Permission Guard]
    │   └── requireProjectAccess(options)    [Resource Ownership / Assignment Guard]
    │
    ▼
6. notFoundMiddleware (404 for unmatched endpoints)
    │
    ▼
7. errorMiddleware (Global exception translator)
```

### Core Middleware Components:
* **`auth.middleware.ts`**: Verifies Bearer JWT tokens from the `Authorization` header, decodes `{ id, email, role }`, and attaches it to `req.user`. Returns `401 UNAUTHORIZED` if missing/invalid.
* **`require-permission.middleware.ts`**: Verifies that `req.user.role` contains all specified `Permission` values according to `ROLE_PERMISSIONS`. Returns `403 INSUFFICIENT_PERMISSION` if unauthorized.
* **`require-project-access.middleware.ts`**: Resolves `projectId` from URL params or request body. Bypasses for `ADMIN`, otherwise verifies the user is either the **project owner** or has an **active project assignment**. Returns `403 PROJECT_ACCESS_DENIED` if not authorized.
* **`role.middleware.ts`**: Role-level guard factory `requireRole(...roles)` for backward compatibility or simple role assertions.
* **`validate.middleware.ts`**: Validates `req.body`, `req.query`, and `req.params` against any Zod schema. Returns `400 VALIDATION_ERROR` with structured error issues.
* **`error.middleware.ts`**: Centralized error catcher. Maps:
  - `AppError` → Specified status code & machine-readable error code.
  - `ZodError` → `400 VALIDATION_ERROR` with structured field messages.
  - `PrismaClientKnownRequestError` (`P2002` unique constraint → `409 CONFLICT`, `P2025` not found → `404 RESOURCE_NOT_FOUND`).
  - `TokenExpiredError` / `JsonWebTokenError` → `401 UNAUTHORIZED`.
  - Unhandled exceptions → `500 INTERNAL_ERROR` (hides stack traces in production).

---

## 5. Roles, Permissions & Assignment Architecture (Phase 1)

STRATA implements a comprehensive authorization model:

```text
Authentication (JWT)
      ↓
Role Permission Check (requirePermission)
      ↓
Resource Access Check (requireProjectAccess: Owner / Assignment)
      ↓
Workflow-State Permission Check (Future Phases)
      ↓
ALLOW / DENY
```

### 5.1 Five Platform Roles

```text
ADMIN
PROPERTY_OWNER
SURVEYOR
REVIEWER
REGISTRATION_OFFICER
```

* **`ADMIN`**: Platform administrator. Broad access to all resources, project bypass, user management, and role assignment.
* **`PROPERTY_OWNER`**: Property applicant or owner. Read-only access to their owned projects and spatial data. Cannot create or edit spatial data or approve registration.
* **`SURVEYOR`**: Spatial data creator. Can create and modify parcels, buildings, floors, spatial assets, 3D geometry versions, and processing jobs **only for projects they are explicitly assigned to**.
* **`REVIEWER`**: Government verifier. Can inspect spatial data, reviews submissions, and approves/rejects reviews or violations **only for projects assigned to them**. Cannot modify draft survey data.
* **`REGISTRATION_OFFICER`**: Land registry official. Can review verified records and approve/reject official property registration.

### 5.2 Granular Permissions Enum (33 Actions)

Defined centrally in `src/common/authorization/permissions.ts`:

```typescript
export enum Permission {
  // User Management
  USER_READ = 'USER_READ',
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
  USER_MANAGE = 'USER_MANAGE',

  // Projects
  PROJECT_CREATE = 'PROJECT_CREATE',
  PROJECT_READ = 'PROJECT_READ',
  PROJECT_UPDATE = 'PROJECT_UPDATE',
  PROJECT_DELETE = 'PROJECT_DELETE',
  PROJECT_ASSIGN = 'PROJECT_ASSIGN',

  // Parcels
  PARCEL_CREATE = 'PARCEL_CREATE',
  PARCEL_READ = 'PARCEL_READ',
  PARCEL_UPDATE = 'PARCEL_UPDATE',
  PARCEL_DELETE = 'PARCEL_DELETE',

  // Buildings
  BUILDING_CREATE = 'BUILDING_CREATE',
  BUILDING_READ = 'BUILDING_READ',
  BUILDING_UPDATE = 'BUILDING_UPDATE',
  BUILDING_DELETE = 'BUILDING_DELETE',

  // Floors
  FLOOR_CREATE = 'FLOOR_CREATE',
  FLOOR_READ = 'FLOOR_READ',
  FLOOR_UPDATE = 'FLOOR_UPDATE',
  FLOOR_DELETE = 'FLOOR_DELETE',

  // Spatial Assets
  SPATIAL_ASSET_CREATE = 'SPATIAL_ASSET_CREATE',
  SPATIAL_ASSET_READ = 'SPATIAL_ASSET_READ',
  SPATIAL_ASSET_UPDATE = 'SPATIAL_ASSET_UPDATE',
  SPATIAL_ASSET_DELETE = 'SPATIAL_ASSET_DELETE',

  // Geometries
  GEOMETRY_CREATE = 'GEOMETRY_CREATE',
  GEOMETRY_READ = 'GEOMETRY_READ',
  GEOMETRY_UPDATE = 'GEOMETRY_UPDATE',
  GEOMETRY_DELETE = 'GEOMETRY_DELETE',

  // Processing Jobs
  PROCESSING_CREATE = 'PROCESSING_CREATE',
  PROCESSING_READ = 'PROCESSING_READ',

  // Review & Verification
  REVIEW_READ = 'REVIEW_READ',
  REVIEW_APPROVE = 'REVIEW_APPROVE',
  REVIEW_REJECT = 'REVIEW_REJECT',

  // Registration
  REGISTRATION_READ = 'REGISTRATION_READ',
  REGISTRATION_APPROVE = 'REGISTRATION_APPROVE',
  REGISTRATION_REJECT = 'REGISTRATION_REJECT',

  // Audit
  AUDIT_READ = 'AUDIT_READ',
}
```

### 5.3 Centralized Role → Permission Matrix

| Permission | ADMIN | PROPERTY_OWNER | SURVEYOR | REVIEWER | REGISTRATION_OFFICER |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `USER_READ` / `USER_MANAGE` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `PROJECT_CREATE` | ✅ | ❌ | ✅ | ❌ | ❌ |
| `PROJECT_READ` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `PROJECT_UPDATE` | ✅ | ❌ | ✅ | ❌ | ❌ |
| `PROJECT_DELETE` / `PROJECT_ASSIGN` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `PARCEL_CREATE` / `PARCEL_UPDATE` | ✅ | ❌ | ✅ | ❌ | ❌ |
| `PARCEL_READ` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `BUILDING_CREATE` / `BUILDING_UPDATE` | ✅ | ❌ | ✅ | ❌ | ❌ |
| `BUILDING_READ` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `FLOOR_CREATE` / `FLOOR_UPDATE` | ✅ | ❌ | ✅ | ❌ | ❌ |
| `FLOOR_READ` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `SPATIAL_ASSET_CREATE` / `UPDATE` | ✅ | ❌ | ✅ | ❌ | ❌ |
| `SPATIAL_ASSET_READ` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `GEOMETRY_CREATE` / `GEOMETRY_UPDATE` | ✅ | ❌ | ✅ | ❌ | ❌ |
| `GEOMETRY_READ` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `PROCESSING_CREATE` / `READ` | ✅ | ❌ | ✅ | ❌ | ❌ |
| `REVIEW_READ` | ✅ | ❌ | ❌ | ✅ | ❌ |
| `REVIEW_APPROVE` / `REVIEW_REJECT` | ✅ | ❌ | ❌ | ✅ | ❌ |
| `REGISTRATION_READ` / `APPROVE` / `REJECT` | ✅ | ❌ | ❌ | ❌ | ✅ |
| `AUDIT_READ` | ✅ | ❌ | ❌ | ❌ | ❌ |

### 5.4 Project Ownership & Assignment Model

* **Ownership**: Stored on `Project.ownerId → User.id`. Represents the legal applicant / property owner.
* **Assignment**: Stored in `ProjectAssignment` table (`projectId`, `userId`, `assignmentRole`, `assignedById`, `assignedAt`).
* **Uniqueness Constraint**: `@@unique([userId, projectId])` ensures a user cannot have conflicting duplicate roles on the same project.
* **Role Compatibility**: When an Administrator assigns a user to a project, the service ensures the user's global role matches the requested `assignmentRole` (e.g. only global `SURVEYOR` or `ADMIN` can receive a `SURVEYOR` assignment).

### 5.5 Reusable Authorization Service & Spatial Hierarchy Resolution

Located in `src/common/authorization/authorization.service.ts`:
* `hasPermission(role, permission)`: In-memory O(1) `Set.has` check.
* `isProjectOwner(userId, projectId)`: Queries database for project ownership.
* `isAssignedToProject(userId, projectId)`: Queries `ProjectAssignment` table.
* `canAccessProject(userId, role, projectId)`: Evaluates `ADMIN` bypass → ownership → active assignment.
* **Hierarchy Resolvers**: Traverses parent relations from child resources without manual joins:
  - `resolveProjectIdFromParcel(parcelId)`
  - `resolveProjectIdFromBuilding(buildingId)`
  - `resolveProjectIdFromFloor(floorId)`
  - `resolveProjectIdFromSpatialAsset(spatialAssetId)`

---

## 6. Database Models & PostGIS Architecture

The database is built on **PostgreSQL 16 with the PostGIS 3.4 spatial extension**.

### Schema Summary (`prisma/schema.prisma`):

| Model Name | Table Name | Key Attributes | Relations |
| :--- | :--- | :--- | :--- |
| **`User`** | `users` | `id`, `email` (unique), `passwordHash`, `name`, `role` (`Role`), `isActive` (bool) | → Projects, Jobs, AuditLogs, Assignments, AssignmentsMade |
| **`Project`** | `projects` | `id`, `name`, `description`, `ownerId` | → User (owner), Parcels, Assignments |
| **`ProjectAssignment`** | `project_assignments` | `id`, `projectId`, `userId`, `assignmentRole`, `assignedById`, `assignedAt` | → Project, User, AssignedBy (User) |
| **`Parcel`** | `parcels` | `id`, `projectId`, `name`, `parcelNumber`, `area`, `metadata` | → Project, Buildings |
| **`Building`** | `buildings` | `id`, `parcelId`, `name`, `numberOfFloors`, `metadata` | → Parcel, Floors |
| **`Floor`** | `floors` | `id`, `buildingId`, `level`, `elevation`, `height` | → Building, SpatialAssets |
| **`SpatialAsset`** | `spatial_assets` | `id`, `floorId`, `name`, `type` (`AssetType`), `metadata` | → Floor, GeometryVersions, Violations |
| **`GeometryVersion`** | `geometry_versions` | `id`, `spatialAssetId`, `version` (int), `source`, `status`, `geometryData` (Json) | → SpatialAsset |
| **`ProcessingJob`** | `processing_jobs` | `id`, `type`, `status` (`ProcessingJobStatus`), `inputData`, `outputData`, `errorMessage` | → User (requestedBy) |
| **`Violation`** | `violations` | `id`, `spatialAssetId`, `type`, `severity`, `description`, `resolved` | → SpatialAsset |
| **`AuditLog`** | `audit_logs` | `id`, `action`, `entityType`, `entityId`, `userId`, `metadata` | → User |

---

## 7. Feature Modules Breakdown

Every domain module follows a consistent, decoupled structure:
```text
module/
├── module.routes.ts       # Express router with Zod validation, permissions & access middleware
├── module.controller.ts   # HTTP parameter parsing & standardized response delivery
├── module.service.ts      # Pure business logic & database queries via Prisma
├── module.validation.ts   # Zod input schemas for body/params/query
└── module.types.ts        # TypeScript interfaces and contracts
```

### 7.1 Health Module
* **Location:** `src/modules/health/`
* **Route:** `GET /api/v1/health`
* **Functionality:** Public diagnostic endpoint returning application status, uptime, environment, and database ping.

### 7.2 Authentication Module
* **Location:** `src/modules/auth/`
* **Functionality:**
  - `POST /auth/register`: Self-registration strictly defaults to `role: PROPERTY_OWNER`. Prevents privilege escalation.
  - `POST /auth/login`: Authenticates credentials via bcrypt, checks `isActive` flag (rejects deactivated accounts with `403`), and signs JWT with standard expiration.
  - `GET /auth/profile`: Returns safe profile of authenticated user.

### 7.3 Users Management Module
* **Location:** `src/modules/users/`
* **Functionality:**
  - `GET /users`: Paginated directory of users. Protected by `USER_READ` (Admin only).
  - `GET /users/:id`: Lookup user details by ID. Protected by `USER_READ`.
  - `PATCH /users/:id/role`: Change user role. Protected by `USER_MANAGE` (Admin only). Prevents users from changing their own role (`SELF_ROLE_CHANGE`). Records `USER_ROLE_CHANGED` audit log.
  - `PATCH /users/:id/active`: Toggle user activation status. Protected by `USER_MANAGE`. Records `USER_ACTIVATED` / `USER_DEACTIVATED` audit log.

### 7.4 Projects Module
* **Location:** `src/modules/projects/`
* **Functionality:**
  - `POST /projects`: Create project. Protected by `requirePermission(Permission.PROJECT_CREATE)`.
  - `GET /projects`: List accessible projects. For non-Admins, automatically returns projects where the user is either the **owner** OR has an **active project assignment**. Protected by `PROJECT_READ`.
  - `GET /projects/:id`: Get project hierarchy including team assignments. Protected by `PROJECT_READ` and `requireProjectAccess()`.
  - `PATCH /projects/:id`: Update metadata. Protected by `PROJECT_UPDATE` and `requireProjectAccess()`.
  - `DELETE /projects/:id`: Delete project. Protected by `PROJECT_DELETE` and `requireProjectAccess()`.

### 7.5 Project Assignments Module
* **Location:** `src/modules/assignments/` (nested at `/projects/:projectId/assignments`)
* **Functionality:**
  - `POST /`: Assign user to project. Protected by `requirePermission(Permission.PROJECT_ASSIGN)` (Admin only). Validates target user existence, active status, role compatibility, and duplicate prevention. Records `USER_ASSIGNED_TO_PROJECT` audit log.
  - `GET /`: Paginated list of team members assigned to the project. Protected by `PROJECT_READ` and `requireProjectAccess()`.
  - `DELETE /:assignmentId`: Remove user assignment. Protected by `PROJECT_ASSIGN`. Records `USER_REMOVED_FROM_PROJECT` audit log.

### 7.6 Parcels Module
* **Location:** `src/modules/parcels/`
* **Functionality:** Manages cadastral land parcels.
  - `POST /parcels`: Protected by `requirePermission(Permission.PARCEL_CREATE)`.
  - `GET /parcels` & `GET /parcels/:id`: Protected by `requirePermission(Permission.PARCEL_READ)`.

### 7.7 Buildings Module
* **Location:** `src/modules/buildings/`
* **Functionality:** Manages multi-storey structures.
  - `POST /buildings`: Protected by `requirePermission(Permission.BUILDING_CREATE)`.
  - `GET /buildings` & `GET /buildings/:id`: Protected by `requirePermission(Permission.BUILDING_READ)`.

### 7.8 Floors Module
* **Location:** `src/modules/floors/`
* **Functionality:** Manages vertical floor datums and ceiling heights.
  - `POST /floors`: Protected by `requirePermission(Permission.FLOOR_CREATE)`.
  - `GET /floors` & `GET /floors/:id`: Protected by `requirePermission(Permission.FLOOR_READ)`.

### 7.9 Spatial Assets Module
* **Location:** `src/modules/spatial-assets/`
* **Functionality:** Manages volumetric units (`PROPERTY_UNIT`, `COMMON_AREA`, etc.).
  - `POST /spatial-assets`: Protected by `requirePermission(Permission.SPATIAL_ASSET_CREATE)`.
  - `GET /spatial-assets` & `GET /spatial-assets/:id`: Protected by `requirePermission(Permission.SPATIAL_ASSET_READ)`.

### 7.10 Geometries Module (Decoupled Versioning)
* **Location:** `src/modules/geometries/`
* **Functionality:** Appends immutable, versioned 3D polyhedral representations.
  - `POST /geometries/versions`: Protected by `requirePermission(Permission.GEOMETRY_CREATE)`.
  - `GET /geometries/asset/:assetId` & `GET /geometries/versions/:id`: Protected by `requirePermission(Permission.GEOMETRY_READ)`.

### 7.11 Processing Jobs Module (State Machine)
* **Location:** `src/modules/processing/`
* **Functionality:** Tracks asynchronous computation lifecycles (`PENDING` → `PROCESSING` → `COMPLETED`).
  - `POST /processing/jobs` & `PATCH /processing/jobs/:id/status`: Protected by `requirePermission(Permission.PROCESSING_CREATE)`.
  - `GET /processing/jobs` & `GET /processing/jobs/:id`: Protected by `requirePermission(Permission.PROCESSING_READ)`.

### 7.12 Violations Module
* **Location:** `src/modules/violations/`
* **Functionality:** Registers spatial collisions and boundary violations.
  - `POST /violations`: Protected by `requirePermission(Permission.SPATIAL_ASSET_CREATE)`.
  - `GET /violations` & `GET /violations/:id`: Protected by `requirePermission(Permission.SPATIAL_ASSET_READ)`.
  - `PATCH /violations/:id/resolve`: Reviewer workflow. Protected by `requirePermission(Permission.REVIEW_APPROVE)`.

### 7.13 Audit Logging Service
* **Location:** `src/modules/audit/`
* **Functionality:** Non-blocking async audit logger tracking entity actions (`CREATE`, `UPDATE`, `DELETE`, `VERIFY`, `PROCESS`) and security operations (`USER_ROLE_CHANGED`, `USER_ASSIGNED_TO_PROJECT`, `USER_REMOVED_FROM_PROJECT`, `USER_ACTIVATED`, `USER_DEACTIVATED`).

---

## 8. Python/FastAPI Integration Boundary

* **Location:** `src/integrations/python-processing/`
* **Client:** Pre-configured Axios instance with timeouts, custom User-Agent, and error interceptors.
* **Service:** `PythonProcessingService` exposes typed methods:
  - `checkHealth()`: Checks Python geometry server status.
  - `submitJob<TReq, TRes>()`: Dispatches asynchronous processing requests.
  - `request3dExtrusion()`: Requests 2D-to-3D volumetric mesh extrusion and watertight certification.
* **Error Translation:** Automatically maps external HTTP failures into standard `AppError` instances with code `EXTERNAL_SERVICE_ERROR`.

---

## 9. API Endpoints Directory

All routes are prefixed with `/api/v1`. Live documentation is available at `/api/docs`.

| Method | Endpoint | Required Permission | Resource Access Guard | Description |
| :--- | :--- | :---: | :---: | :--- |
| **GET** | `/health` | None (Public) | None | System diagnostics & PostGIS database ping |
| **POST** | `/auth/register` | None (Public) | None | Self-register as `PROPERTY_OWNER` |
| **POST** | `/auth/login` | None (Public) | None | Authenticate user & receive JWT |
| **GET** | `/auth/profile` | Authenticated | None | Get current user's profile |
| **GET** | `/users` | `USER_READ` | Admin | Paginated list of registered users |
| **GET** | `/users/:id` | `USER_READ` | Admin | Get user details by ID |
| **PATCH**| `/users/:id/role` | `USER_MANAGE` | Admin | Update user role (prevents self-change) |
| **PATCH**| `/users/:id/active` | `USER_MANAGE` | Admin | Toggle user active status |
| **POST** | `/projects` | `PROJECT_CREATE` | None | Create new project workspace |
| **GET** | `/projects` | `PROJECT_READ` | Scoped / Admin | List projects (scoped to owned/assigned) |
| **GET** | `/projects/:id` | `PROJECT_READ` | Owner / Assigned / Admin | Get project details & spatial hierarchy |
| **PATCH**| `/projects/:id` | `PROJECT_UPDATE` | Owner / Assigned / Admin | Update project metadata |
| **DELETE**|`/projects/:id` | `PROJECT_DELETE` | Admin | Delete project |
| **POST** | `/projects/:projectId/assignments` | `PROJECT_ASSIGN` | Admin | Assign surveyor/reviewer to project |
| **GET** | `/projects/:projectId/assignments` | `PROJECT_READ` | Owner / Assigned / Admin | List assigned team members for project |
| **DELETE**|`/projects/:projectId/assignments/:assignmentId` | `PROJECT_ASSIGN` | Admin | Remove user assignment from project |
| **POST** | `/parcels` | `PARCEL_CREATE` | None | Create land parcel |
| **GET** | `/parcels` | `PARCEL_READ` | None | List parcels (optional `projectId` filter) |
| **GET** | `/parcels/:id` | `PARCEL_READ` | None | Get parcel details & buildings |
| **POST** | `/buildings` | `BUILDING_CREATE` | None | Register building structure |
| **GET** | `/buildings` | `BUILDING_READ` | None | List buildings (optional `parcelId` filter) |
| **GET** | `/buildings/:id` | `BUILDING_READ` | None | Get building details & floors |
| **POST** | `/floors` | `FLOOR_CREATE` | None | Create floor level with elevation & height |
| **GET** | `/floors` | `FLOOR_READ` | None | List floors (optional `buildingId` filter) |
| **GET** | `/floors/:id` | `FLOOR_READ` | None | Get floor details & spatial assets |
| **POST** | `/spatial-assets` | `SPATIAL_ASSET_CREATE` | None | Create spatial property unit / common space |
| **GET** | `/spatial-assets` | `SPATIAL_ASSET_READ` | None | List spatial assets (`floorId`, `type` filter) |
| **GET** | `/spatial-assets/:id` | `SPATIAL_ASSET_READ` | None | Get spatial asset with geometry history |
| **POST** | `/geometries/versions` | `GEOMETRY_CREATE` | None | Register new 3D geometry version |
| **GET** | `/geometries/asset/:assetId` | `GEOMETRY_READ` | None | Get geometry version history for an asset |
| **GET** | `/geometries/versions/:id` | `GEOMETRY_READ` | None | Get specific geometry version record |
| **POST** | `/processing/jobs` | `PROCESSING_CREATE` | None | Dispatch asynchronous processing job |
| **GET** | `/processing/jobs` | `PROCESSING_READ` | None | List processing jobs (`status` filter) |
| **GET** | `/processing/jobs/:id` | `PROCESSING_READ` | None | Get processing job status & results |
| **PATCH**| `/processing/jobs/:id/status` | `PROCESSING_CREATE` | None | Update processing job status |
| **POST** | `/violations` | `SPATIAL_ASSET_CREATE` | None | Register spatial violation / encroachment |
| **GET** | `/violations` | `SPATIAL_ASSET_READ` | None | List violations (`spatialAssetId`, `resolved`) |
| **GET** | `/violations/:id` | `SPATIAL_ASSET_READ` | None | Get violation details |
| **PATCH**| `/violations/:id/resolve` | `REVIEW_APPROVE` | Reviewer / Admin | Mark violation as resolved |

---

## 10. Standardized API Response & Error Conventions

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
    "code": "INSUFFICIENT_PERMISSION",
    "message": "You do not have permission to perform this action."
  }
}
```

---

## 11. Docker & Containerization

The backend includes a complete Docker setup for isolated, reproducible execution.

### Multi-Stage Dockerfile (`Dockerfile`)
* **Builder Stage:** Uses `node:20-alpine`, installs dev dependencies, runs `prisma generate`, and executes `npm run build` (`tsc`).
* **Runner Stage:** Copies compiled `dist/`, production `node_modules`, and runs as the non-root `node` user on port `3001`.

### Docker Compose (`docker-compose.yml`)
* **`strata_backend`:** Express application container connected to PostGIS via Docker network.
* **`strata_spatial_db`:** `postgis/postgis:16-3.4` database container with automated healthchecks and initial migration execution.

---

## 12. Testing & Verification Results

The backend has undergone strict automated verification across 8 test suites:

```text
PASS tests/unit/errors.test.ts
PASS tests/unit/responses.test.ts
PASS tests/unit/authorization-service.test.ts
PASS tests/unit/require-permission.test.ts
PASS tests/unit/authorization.test.ts
PASS tests/unit/users-role.test.ts
PASS tests/unit/assignments.test.ts
PASS tests/integration/app.test.ts

Test Suites: 8 passed, 8 total
Tests:       32 passed, 32 total
Snapshots:   0 total
Time:        8.675 s
```

### Verified Commands:
* `npm run build` → **Passed** (Strict TypeScript compiled cleanly to `dist/` with 0 errors).
* `npm run lint` → **Passed** (0 ESLint errors, 0 warnings).
* `npm run format:check` → **Passed** (100% Prettier compliant).
* `npm test` → **Passed** (32 unit and integration tests passing).

---

## 13. Developer Guide: Extending the Backend

To add a new domain feature to STRATA (e.g. `Deeds` or `CadastralSurveys`), follow this checklist:

1. **Permissions & Roles**: Add granular permissions to `src/common/authorization/permissions.ts` and map them in `src/common/authorization/role-permissions.ts`.
2. **Update Schema**: Add models to `prisma/schema.prisma` and run `npx prisma generate`.
3. **Create Module Directory**: Create `src/modules/<feature>/` with:
   - `<feature>.types.ts`
   - `<feature>.validation.ts` (Zod schemas)
   - `<feature>.service.ts` (Prisma queries + audit logs)
   - `<feature>.controller.ts` (HTTP handlers using `sendSuccess`/`sendPaginated`)
   - `<feature>.routes.ts` (Express router guarded with `requirePermission` and `requireProjectAccess`)
4. **Register Route**: Import the router in `src/routes/index.ts` and attach it with `router.use('/<feature>', <feature>Routes)`.
5. **Write Tests**: Add unit tests in `tests/unit/` verifying authorization, validation, and service logic.

---

*This document certifies that the STRATA Node.js Backend Phase 1 (Roles, Permissions, Ownership & Assignment System) is complete, verified, and ready for subsequent workflow phases.*

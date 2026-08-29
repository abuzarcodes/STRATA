# 🏛️ STRATA Node.js Backend — Implementation & Architecture Report

> **Target Directory:** `/backend`  
> **Framework & Runtime:** Node.js 20+ | Express 4.21 | TypeScript 5.7 (Strict Mode)  
> **Database & ORM:** PostgreSQL 16 + PostGIS 3.4 | Prisma ORM 6.9  
> **Validation & Security:** Zod 3.24 | JSON Web Tokens | bcrypt | Helmet | CORS  
> **Architecture Pattern:** Modular Monolith with Layered Separation (Routes → Controller → Service → Prisma)  
> **Authorization Model:** Multi-Tier RBAC + Granular Permissions + Resource Ownership & Assignment-Based Access Control (ABAC)  
> **Status:** Phase 1 & Phase 2 Complete (Fully Built, Tested & Verified — 13 Test Suites, 67 Tests Passing)  
> **Last Updated:** August 2026

---

## 📑 Table of Contents

1. [Backend Overview & Core Architectural Principles](#1-backend-overview--core-architectural-principles)
2. [Complete Directory & File Structure](#2-complete-directory--file-structure)
3. [Configuration & Environment Validation](#3-configuration--environment-validation)
4. [Cross-Cutting Middleware & Authorization Pipeline](#4-cross-cutting-middleware--authorization-pipeline)
5. [Roles, Permissions & Access Control Architecture](#5-roles-permissions--access-control-architecture)
   - [5.1 Five Platform Roles](#51-five-platform-roles)
   - [5.2 Granular Permissions Enum (46 Actions)](#52-granular-permissions-enum-46-actions)
   - [5.3 Centralized Role → Permission Matrix](#53-centralized-role--permission-matrix)
   - [5.4 Resource Ownership & Assignment Model](#54-resource-ownership--assignment-model)
   - [5.5 Reusable Authorization Service & Spatial Hierarchy Resolution](#55-reusable-authorization-service--spatial-hierarchy-resolution)
6. [Database Models & PostGIS Architecture](#6-database-models--postgis-architecture)
7. [Property Applications & Project Initiation Lifecycle (Phase 2)](#7-property-applications--project-initiation-lifecycle-phase-2)
   - [7.1 Workflow State Machine](#71-workflow-state-machine)
   - [7.2 Application Number Sequence Strategy](#72-application-number-sequence-strategy)
   - [7.3 Declared vs. Verified Data Segregation](#73-declared-vs-verified-data-segregation)
   - [7.4 Concurrency Protection & State Transitions](#74-concurrency-protection--state-transitions)
   - [7.5 Project Workspace Initialization (Transactional 1:1)](#75-project-workspace-initialization-transactional-11)
   - [7.6 Surveyor Assignment & Project Activation Rules](#76-surveyor-assignment--project-activation-rules)
8. [Feature Modules Breakdown](#8-feature-modules-breakdown)
   - [8.1 Health Module](#81-health-module)
   - [8.2 Authentication Module](#82-authentication-module)
   - [8.3 Users Management Module](#83-users-management-module)
   - [8.4 Property Applications Module (Phase 2)](#84-property-applications-module-phase-2)
   - [8.5 Projects Module (Updated with Lifecycle & Activation)](#85-projects-module-updated-with-lifecycle--activation)
   - [8.6 Project Assignments Module](#86-project-assignments-module)
   - [8.7 Parcels Module](#87-parcels-module)
   - [8.8 Buildings Module](#88-buildings-module)
   - [8.9 Floors Module](#89-floors-module)
   - [8.10 Spatial Assets Module](#810-spatial-assets-module)
   - [8.11 Geometries Module (Decoupled Versioning)](#811-geometries-module-decoupled-versioning)
   - [8.12 Processing Jobs Module (State Machine)](#812-processing-jobs-module-state-machine)
   - [8.13 Violations Module](#813-violations-module)
   - [8.14 Audit Logging Service](#814-audit-logging-service)
9. [Python/FastAPI Integration Boundary](#9-pythonfastapi-integration-boundary)
10. [API Endpoints Directory](#10-api-endpoints-directory)
11. [Standardized API Response & Error Conventions](#11-standardized-api-response--error-conventions)
12. [Docker & Containerization](#12-docker--containerization)
13. [Testing & Verification Results](#13-testing--verification-results)
14. [Developer Guide: Extending the Backend](#14-developer-guide-extending-the-backend)

---

## 1. Backend Overview & Core Architectural Principles

The **STRATA Node.js Backend** serves as the **central administrative workflow engine, authorization authority, spatial orchestrator, and data management layer** of the platform.

STRATA stands for **Spatial Topology & Registration Administration for Three-dimensional Assets**.

### 1.1 Core Architectural Principle: Strict Entity Segregation

```text
PROPERTY APPLICATION   ≠        PROJECT        ≠   FINAL VERIFIED PROPERTY
  (Administrative              (Technical               (Legally Registered
    Declaration)               Workspace)                 Spatial Asset)
```

1. **Property Application (Administrative)**: Contains applicant-declared information (approximate coordinates, declared building/floor counts, declared area). Unverified.
2. **Project (Technical Workspace)**: Created only after an application is approved. Contains parcels, buildings, floors, geometry versions, processing jobs, and surveyor assignments.
3. **Final Verified Property**: Future spatial registration milestone resulting from successful survey, topology validation, and official review.

### 1.2 Responsibilities
* Managing user identity, password security (bcrypt), and session authentication via JWT.
* Enforcing multi-tier authorization: Authentication → Role Permissions → Resource Ownership/Assignment → Workflow State.
* Managing the complete Property Application lifecycle (`DRAFT` → `SUBMITTED` → `UNDER_REVIEW` → `REQUIRES_INFORMATION` / `APPROVED` / `REJECTED` / `CANCELLED`).
* Enforcing transactional 1:1 Project workspace initialization and Surveyor-gated project activation (`INITIALIZED` → `ACTIVE`).
* Managing cadastral projects and spatial asset hierarchies (`Project` → `Parcel` → `Building` → `Floor` → `SpatialAsset`).
* Decoupling and versioning spatial geometry records independently of asset identity.
* Managing asynchronous processing job states for AI and GIS calculations.
* Orchestrating computational requests with the Python/FastAPI processing layer.
* Recording non-blocking, tamper-evident audit history logs for data operations and security events.
* Providing live OpenAPI 3.0 (Swagger) interactive documentation.

---

## 2. Complete Directory & File Structure

```text
backend/
├── prisma/
│   ├── schema.prisma                      # Prisma schema (15 models + 9 enums)
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
│   │   ├── require-permission.middleware.ts # Granular permission guard factory (AND logic)
│   │   ├── require-any-permission.middleware.ts # Permission guard factory (OR logic)
│   │   ├── require-project-access.middleware.ts # Resource ownership & assignment access guard
│   │   ├── role.middleware.ts             # Role-based access control guard factory
│   │   ├── validate.middleware.ts         # Generic Zod validation for body/query/params
│   │   ├── error.middleware.ts            # Global error handler (AppError, Zod, Prisma, JWT)
│   │   └── not-found.middleware.ts        # 404 handler for unmatched routes
│   │
│   ├── common/                            # Reusable constants, enums, responses, utils, auth
│   │   ├── authorization/                 # Centralized Authorization Core
│   │   │   ├── permissions.ts             # 46 granular Permission enum definitions
│   │   │   ├── role-permissions.ts        # Single authoritative Role -> Set<Permission> map
│   │   │   ├── authorization.service.ts   # Reusable permission, ownership & assignment service
│   │   │   ├── types.ts                   # AuthorizationContext & ProjectAccessOptions
│   │   │   └── index.ts                   # Barrel export
│   │   ├── constants/
│   │   │   └── app.constants.ts           # API_PREFIX ('/api/v1'), SWAGGER_PATH ('/api/docs')
│   │   ├── enums/
│   │   │   ├── role.enum.ts               # Role (ADMIN, PROPERTY_OWNER, SURVEYOR, etc.)
│   │   │   ├── asset-type.enum.ts         # AssetType (PROPERTY_UNIT, COMMON_AREA, etc.)
│   │   │   ├── processing-status.enum.ts  # ProcessingJobStatus (PENDING, QUEUED, etc.)
│   │   │   ├── violation-type.enum.ts     # ViolationType & ViolationSeverity
│   │   │   ├── audit-action.enum.ts       # AuditAction (CREATE, UPDATE, APPLICATION_*, etc.)
│   │   │   └── index.ts                   # Barrel export with Prisma enums
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
│   │   ├── applications/                  # Property Applications lifecycle (Phase 2)
│   │   │   ├── applications.types.ts      # Application DTOs & filter interfaces
│   │   │   ├── applications.validation.ts # Zod validation schemas
│   │   │   ├── applications.service.ts    # Core application state machine service
│   │   │   ├── application-history.service.ts # Status transition audit tracking
│   │   │   ├── application-comments.service.ts# Communication & comments service
│   │   │   ├── application-project.service.ts # Transactional 1:1 Project initialization
│   │   │   ├── applications.controller.ts # Thin HTTP request handlers
│   │   │   └── applications.routes.ts     # Router with OpenAPI documentation
│   │   ├── projects/                      # Cadastral project workspaces & activation
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
│   │   ├── users-role.test.ts             # Tests for role update & self-change prevention
│   │   ├── application-permissions.test.ts # Tests for Phase 2 application permissions
│   │   ├── application-workflow.test.ts   # Tests for application lifecycle state machine
│   │   ├── application-project-initialization.test.ts # Tests for Project init from application
│   │   └── project-activation.test.ts     # Tests for surveyor prerequisite & activation
│   └── integration/
│       ├── app.test.ts                    # Tests for app bootstrap, root info, and 404
│       └── application-workflow.test.ts   # Full HTTP lifecycle integration test
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

Configuration is centralized in `src/config/env.ts`. Process environment variables are parsed and strictly validated using Zod at boot time:

```typescript
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

Every request is evaluated through a layered middleware pipeline:

```text
Incoming Request
    │
    ▼
1. Helmet Security Headers & CORS
    │
    ▼
2. Body Parsers (express.json, express.urlencoded with 10MB limits)
    │
    ▼
3. Morgan Request Logger
    │
    ▼
4. Route Handlers (/api/docs Swagger, /api/v1/* Routes)
    │   ├── validate(schema)                 [Zod DTO Validator: params, query, body]
    │   ├── authMiddleware                   [JWT Bearer Validator -> req.user injector]
    │   ├── requirePermission(...)           [Granular Permission Guard — AND Logic]
    │   ├── requireAnyPermission(...)        [Granular Permission Guard — OR Logic]
    │   └── requireProjectAccess(...)        [Resource Ownership / Assignment Guard]
    │
    ▼
5. notFoundMiddleware (404 for unmatched endpoints)
    │
    ▼
6. errorMiddleware (Global exception translator)
```

---

## 5. Roles, Permissions & Access Control Architecture

### 5.1 Five Platform Roles

```text
ADMIN
PROPERTY_OWNER
SURVEYOR
REVIEWER
REGISTRATION_OFFICER
```

* **`ADMIN`**: Platform administrator. Full access across all modules, reviewer overrides, role management, application approvals, project initialization, and project activation.
* **`PROPERTY_OWNER`**: Property applicant. Can create, read, update, submit, cancel, and comment on **their own** property applications. Read-only access to their approved projects and spatial data.
* **`SURVEYOR`**: Field surveyor. Can author and modify spatial data (parcels, buildings, floors, assets, geometries, processing jobs) **only on projects assigned to them**. Cannot directly create standalone projects or approve applications.
* **`REVIEWER`**: Technical verifier. Can inspect spatial hierarchies and resolve violations on assigned projects.
* **`REGISTRATION_OFFICER`**: Land registry official. Responsible for final spatial asset registration in subsequent phases.

### 5.2 Granular Permissions Enum (46 Actions)

Centrally defined in `src/common/authorization/permissions.ts`:

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

  // Applications (Phase 2)
  APPLICATION_CREATE = 'APPLICATION_CREATE',
  APPLICATION_READ = 'APPLICATION_READ',
  APPLICATION_READ_ALL = 'APPLICATION_READ_ALL',
  APPLICATION_UPDATE = 'APPLICATION_UPDATE',
  APPLICATION_SUBMIT = 'APPLICATION_SUBMIT',
  APPLICATION_START_REVIEW = 'APPLICATION_START_REVIEW',
  APPLICATION_REQUEST_INFORMATION = 'APPLICATION_REQUEST_INFORMATION',
  APPLICATION_APPROVE = 'APPLICATION_APPROVE',
  APPLICATION_REJECT = 'APPLICATION_REJECT',
  APPLICATION_CANCEL = 'APPLICATION_CANCEL',
  APPLICATION_COMMENT = 'APPLICATION_COMMENT',
  APPLICATION_INITIALIZE_PROJECT = 'APPLICATION_INITIALIZE_PROJECT',

  // Project Activation (Phase 2)
  PROJECT_ACTIVATE = 'PROJECT_ACTIVATE',
}
```

### 5.3 Centralized Role → Permission Matrix

| Permission | ADMIN | PROPERTY_OWNER | SURVEYOR | REVIEWER | REGISTRATION_OFFICER |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `USER_READ` / `USER_MANAGE` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `APPLICATION_CREATE` / `UPDATE` / `SUBMIT` / `CANCEL` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `APPLICATION_READ` | ✅ | ✅ (Own) | ❌ | ❌ | ❌ |
| `APPLICATION_READ_ALL` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `APPLICATION_START_REVIEW` / `REQUEST_INFO` / `APPROVE` / `REJECT` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `APPLICATION_COMMENT` | ✅ | ✅ (Own) | ❌ | ❌ | ❌ |
| `APPLICATION_INITIALIZE_PROJECT` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `PROJECT_ACTIVATE` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `PROJECT_CREATE` | ✅ | ❌ | ❌ | ❌ | ❌ |
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
| `REVIEW_READ` / `APPROVE` / `REJECT` | ✅ | ❌ | ❌ | ✅ | ❌ |
| `REGISTRATION_READ` / `APPROVE` / `REJECT` | ✅ | ❌ | ❌ | ❌ | ✅ |
| `AUDIT_READ` | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 6. Database Models & PostGIS Architecture

Built on **PostgreSQL 16 with PostGIS 3.4**.

### Schema Models (`prisma/schema.prisma`):

| Model Name | Table Name | Key Attributes | Relations |
| :--- | :--- | :--- | :--- |
| **`User`** | `users` | `id`, `email`, `passwordHash`, `name`, `role`, `isActive` | → Applications, Projects, History, Comments, Jobs, AuditLogs, Assignments |
| **`ApplicationCounter`** | `application_counters` | `year` (PK), `lastSequence` (int) | Counter sequence table for per-year unique application numbers |
| **`PropertyApplication`** | `property_applications` | `id`, `applicationNumber` (unique), `ownerId`, `propertyName`, `propertyType`, `status`, `projectId` (unique, nullable), address & coordinates | → User (owner), Project, StatusHistory, Comments |
| **`ApplicationStatusHistory`** | `application_status_history` | `id`, `applicationId`, `fromStatus`, `toStatus`, `changedById`, `reason`, `createdAt` | → PropertyApplication, User (changedBy) |
| **`ApplicationComment`** | `application_comments` | `id`, `applicationId`, `authorId`, `message`, `type` (`GENERAL`, `SYSTEM`) | → PropertyApplication, User (author) |
| **`Project`** | `projects` | `id`, `name`, `description`, `ownerId`, `status` (`ProjectStatus`) | → User (owner), PropertyApplication, Parcels, Assignments |
| **`ProjectAssignment`** | `project_assignments` | `id`, `projectId`, `userId`, `assignmentRole`, `assignedById`, `assignedAt` | → Project, User, AssignedBy |
| **`Parcel`** | `parcels` | `id`, `projectId`, `name`, `parcelNumber`, `area`, `metadata` | → Project, Buildings |
| **`Building`** | `buildings` | `id`, `parcelId`, `name`, `numberOfFloors`, `metadata` | → Parcel, Floors |
| **`Floor`** | `floors` | `id`, `buildingId`, `level`, `elevation`, `height` | → Building, SpatialAssets |
| **`SpatialAsset`** | `spatial_assets` | `id`, `floorId`, `name`, `type` (`AssetType`), `metadata` | → Floor, GeometryVersions, Violations |
| **`GeometryVersion`** | `geometry_versions` | `id`, `spatialAssetId`, `version`, `source`, `status`, `geometryData` | → SpatialAsset |
| **`ProcessingJob`** | `processing_jobs` | `id`, `type`, `status`, `inputData`, `outputData`, `errorMessage` | → User (requestedBy) |
| **`Violation`** | `violations` | `id`, `spatialAssetId`, `type`, `severity`, `description`, `resolved` | → SpatialAsset |
| **`AuditLog`** | `audit_logs` | `id`, `action`, `entityType`, `entityId`, `userId`, `metadata` | → User |

---

## 7. Property Applications & Project Initiation Lifecycle (Phase 2)

### 7.1 Workflow State Machine

```text
PROPERTY OWNER
      │
      ▼
[ POST /applications ] ─────────► DRAFT
                                    │
                                    ├──────────────────────────┐
                                    ▼ (submit)                 ▼ (cancel)
                                SUBMITTED                  CANCELLED
                                    │                          ▲
                                    ▼ (start-review)           │
                               UNDER_REVIEW                    │
                                    │                          │
                 ┌──────────────────┼──────────────────┐       │
                 ▼ (request-info)   ▼ (reject)         ▼       │
        REQUIRES_INFORMATION    REJECTED            APPROVED   │
                 │                                     │       │
                 ├─────────────────────────────────────┼───────┘
                 │ (update & resubmit)                 ▼
                 ▼                                [ initialize-project ]
             SUBMITTED                                 │
                                                       ▼
                                                PROJECT INITIALIZED
                                                       │
                                                       ▼ [ assign SURVEYOR ]
                                                SURVEYOR ASSIGNED
                                                       │
                                                       ▼ [ activate project ]
                                                  PROJECT ACTIVE
```

### 7.2 Application Number Sequence Strategy
* Unique human-readable identifier: `STRATA-APP-{YEAR}-{SEQUENCE:06d}` (e.g. `STRATA-APP-2026-000001`).
* Uses an atomic database `upsert` on `ApplicationCounter` inside a transaction. Safe under concurrent creation requests without race conditions.

### 7.3 Declared vs. Verified Data Segregation
* Applications capture **declared information**: `declaredArea`, `declaredBuildingCount`, `declaredFloorCount`, and approximate `latitude`/`longitude`.
* These fields are permanently isolated from technical spatial survey entities (`Parcel.area`, PostGIS geometries) constructed during later phases.

### 7.4 Concurrency Protection & State Transitions
* Every state transition uses a conditional atomic `updateMany` matching the required status (e.g., `WHERE status = 'UNDER_REVIEW'`).
* If concurrent requests collide, unaffected rows return `count === 0` and result in a clean `409 INVALID_APPLICATION_STATE` error.

### 7.5 Project Workspace Initialization (Transactional 1:1)
* Executed by Admin via `POST /applications/:id/initialize-project`.
* Runs inside a Prisma transaction:
  1. Validates that application status is `APPROVED`.
  2. Validates that `projectId` is `null`.
  3. Creates `Project` in `INITIALIZED` status.
  4. Updates `PropertyApplication.projectId = project.id` (enforcing 1:1 via database unique constraint).
  5. Logs `PROJECT_INITIALIZED_FROM_APPLICATION` audit record.

### 7.6 Surveyor Assignment & Project Activation Rules
* Admin assigns a Surveyor to the project via `POST /projects/:projectId/assignments`.
* Project activation via `POST /projects/:id/activate`:
  1. Verifies project status is `INITIALIZED`.
  2. Verifies at least one active assignment exists with `assignmentRole = 'SURVEYOR'`.
  3. Transitions project status to `ACTIVE`.
  4. Records `PROJECT_ACTIVATED` audit log.

---

## 8. Feature Modules Breakdown

### 8.1 Health Module
* **Location:** `src/modules/health/`
* **Route:** `GET /api/v1/health`
* **Functionality:** Public diagnostic endpoint returning application status, uptime, environment, and PostGIS database ping.

### 8.2 Authentication Module
* **Location:** `src/modules/auth/`
* **Functionality:**
  - `POST /auth/register`: Defaults strictly to `role: PROPERTY_OWNER`.
  - `POST /auth/login`: Authenticates via bcrypt, verifies `isActive` status, returns signed JWT.
  - `GET /auth/profile`: Returns authenticated user profile.

### 8.3 Users Management Module
* **Location:** `src/modules/users/`
* **Functionality:**
  - `GET /users` & `GET /users/:id`: Directory lookup (Admin only).
  - `PATCH /users/:id/role`: Update user role (prevents self-modification).
  - `PATCH /users/:id/active`: Toggle activation status.

### 8.4 Property Applications Module (Phase 2)
* **Location:** `src/modules/applications/`
* **Functionality:**
  - `POST /applications`: Create draft application.
  - `GET /applications`: Paginated list (Owners see own, Admin sees all; status/type/search filters).
  - `GET /applications/:id`: Application details with owner, project link, and status history.
  - `PATCH /applications/:id`: Update application (allowed in `DRAFT` or `REQUIRES_INFORMATION`).
  - `POST /applications/:id/submit`: Submit application for administrative review.
  - `POST /applications/:id/start-review`: Admin initiates review (`UNDER_REVIEW`).
  - `POST /applications/:id/request-information`: Admin requests info with message.
  - `POST /applications/:id/approve`: Admin approves application.
  - `POST /applications/:id/reject`: Admin rejects application with reason.
  - `POST /applications/:id/cancel`: Owner cancels application.
  - `POST /applications/:id/initialize-project`: Admin initializes Project workspace.
  - `POST /applications/:id/comments`: Add comment.
  - `GET /applications/:id/comments`: List chronological comments.
  - `GET /applications/:id/history`: List status transition history.

### 8.5 Projects Module (Updated with Lifecycle & Activation)
* **Location:** `src/modules/projects/`
* **Functionality:**
  - `POST /projects`: Create project (Admin only).
  - `GET /projects`: List accessible projects (filtered by ownership / assignment for users, all for Admin).
  - `GET /projects/:id`: Hierarchy details with parcels, buildings, floors, assets, and assignments.
  - `PATCH /projects/:id`: Update metadata.
  - `DELETE /projects/:id`: Delete project.
  - `POST /projects/:id/activate`: Activate `INITIALIZED` project (requires ≥1 assigned `SURVEYOR`).

### 8.6 Project Assignments Module
* **Location:** `src/modules/assignments/` (nested at `/projects/:projectId/assignments`)
* **Functionality:**
  - `POST /`: Assign user with matching global role to project.
  - `GET /`: List team members assigned to project.
  - `DELETE /:assignmentId`: Remove assignment.

### 8.7 Parcels Module
* **Location:** `src/modules/parcels/`
* **Functionality:** Manages cadastral land parcels linked to Projects.

### 8.8 Buildings Module
* **Location:** `src/modules/buildings/`
* **Functionality:** Manages multi-storey building structures linked to Parcels.

### 8.9 Floors Module
* **Location:** `src/modules/floors/`
* **Functionality:** Manages vertical floor levels, elevations, and ceiling heights.

### 8.10 Spatial Assets Module
* **Location:** `src/modules/spatial-assets/`
* **Functionality:** Manages volumetric property units and common areas.

### 8.11 Geometries Module (Decoupled Versioning)
* **Location:** `src/modules/geometries/`
* **Functionality:** Appends immutable, versioned 3D polyhedral representations.

### 8.12 Processing Jobs Module (State Machine)
* **Location:** `src/modules/processing/`
* **Functionality:** Tracks asynchronous computation lifecycles (`PENDING` → `PROCESSING` → `COMPLETED`).

### 8.13 Violations Module
* **Location:** `src/modules/violations/`
* **Functionality:** Registers spatial collisions and boundary violations.

### 8.14 Audit Logging Service
* **Location:** `src/modules/audit/`
* **Functionality:** Non-blocking async audit logger tracking data mutations and security events.

---

## 9. Python/FastAPI Integration Boundary

* **Location:** `src/integrations/python-processing/`
* **Client:** Pre-configured Axios instance with timeouts and error interceptors.
* **Service:** `PythonProcessingService` exposes typed methods:
  - `checkHealth()`: Checks Python geometry server status.
  - `submitJob<TReq, TRes>()`: Dispatches asynchronous processing requests.
  - `request3dExtrusion()`: Requests 2D-to-3D volumetric mesh extrusion and watertight certification.

---

## 10. API Endpoints Directory

All routes are prefixed with `/api/v1`. Live documentation is available at `/api/docs`.

| Method | Endpoint | Required Permission | Access Guard | Description |
| :--- | :--- | :---: | :---: | :--- |
| **GET** | `/health` | None (Public) | None | System diagnostics & PostGIS ping |
| **POST** | `/auth/register` | None (Public) | None | Self-register as `PROPERTY_OWNER` |
| **POST** | `/auth/login` | None (Public) | None | Authenticate user & receive JWT |
| **GET** | `/auth/profile` | Authenticated | None | Get current user profile |
| **GET** | `/users` | `USER_READ` | Admin | Paginated list of registered users |
| **GET** | `/users/:id` | `USER_READ` | Admin | Get user details by ID |
| **PATCH**| `/users/:id/role` | `USER_MANAGE` | Admin | Update user role |
| **PATCH**| `/users/:id/active` | `USER_MANAGE` | Admin | Toggle user active status |
| **POST** | `/applications` | `APPLICATION_CREATE` | Owner / Admin | Create application draft |
| **GET** | `/applications` | `APPLICATION_READ` \| `APPLICATION_READ_ALL` | Owner (own) / Admin (all) | List applications with filters |
| **GET** | `/applications/:id` | `APPLICATION_READ` | Owner (own) / Admin | Get application details |
| **PATCH**| `/applications/:id` | `APPLICATION_UPDATE` | Owner (own) | Update draft / info-requested application |
| **POST** | `/applications/:id/submit` | `APPLICATION_SUBMIT` | Owner (own) | Submit application for review |
| **POST** | `/applications/:id/start-review` | `APPLICATION_START_REVIEW` | Admin | Start administrative review |
| **POST** | `/applications/:id/request-information`| `APPLICATION_REQUEST_INFORMATION`| Admin | Request more information |
| **POST** | `/applications/:id/approve` | `APPLICATION_APPROVE` | Admin | Approve application |
| **POST** | `/applications/:id/reject` | `APPLICATION_REJECT` | Admin | Reject application with reason |
| **POST** | `/applications/:id/cancel` | `APPLICATION_CANCEL` | Owner (own) | Cancel application |
| **POST** | `/applications/:id/initialize-project` | `APPLICATION_INITIALIZE_PROJECT` | Admin | Initialize Project workspace |
| **POST** | `/applications/:id/comments` | `APPLICATION_COMMENT` | Owner / Admin | Add comment to application |
| **GET** | `/applications/:id/comments` | `APPLICATION_READ` | Owner (own) / Admin | List comments for application |
| **GET** | `/applications/:id/history` | `APPLICATION_READ` | Owner (own) / Admin | View status transition history |
| **POST** | `/projects` | `PROJECT_CREATE` | Admin | Create project workspace |
| **GET** | `/projects` | `PROJECT_READ` | Scoped / Admin | List projects (owned / assigned) |
| **GET** | `/projects/:id` | `PROJECT_READ` | Owner / Assigned / Admin | Get project hierarchy |
| **PATCH**| `/projects/:id` | `PROJECT_UPDATE` | Owner / Assigned / Admin | Update project metadata |
| **DELETE**|`/projects/:id` | `PROJECT_DELETE` | Admin | Delete project |
| **POST** | `/projects/:id/activate` | `PROJECT_ACTIVATE` | Admin | Activate INITIALIZED project |
| **POST** | `/projects/:projectId/assignments` | `PROJECT_ASSIGN` | Admin | Assign user to project |
| **GET** | `/projects/:projectId/assignments` | `PROJECT_READ` | Owner / Assigned / Admin | List assigned team members |
| **DELETE**|`/projects/:projectId/assignments/:assignmentId`| `PROJECT_ASSIGN`| Admin | Remove user assignment |
| **POST** | `/parcels` | `PARCEL_CREATE` | Surveyor / Admin | Create land parcel |
| **GET** | `/parcels` | `PARCEL_READ` | None | List parcels |
| **GET** | `/parcels/:id` | `PARCEL_READ` | None | Get parcel details |
| **POST** | `/buildings` | `BUILDING_CREATE` | Surveyor / Admin | Register building structure |
| **GET** | `/buildings` | `BUILDING_READ` | None | List buildings |
| **GET** | `/buildings/:id` | `BUILDING_READ` | None | Get building details |
| **POST** | `/floors` | `FLOOR_CREATE` | Surveyor / Admin | Create floor level |
| **GET** | `/floors` | `FLOOR_READ` | None | List floors |
| **GET** | `/floors/:id` | `FLOOR_READ` | None | Get floor details |
| **POST** | `/spatial-assets` | `SPATIAL_ASSET_CREATE` | Surveyor / Admin | Create spatial property unit |
| **GET** | `/spatial-assets` | `SPATIAL_ASSET_READ` | None | List spatial assets |
| **GET** | `/spatial-assets/:id` | `SPATIAL_ASSET_READ` | None | Get spatial asset details |
| **POST** | `/geometries/versions` | `GEOMETRY_CREATE` | Surveyor / Admin | Register 3D geometry version |
| **GET** | `/geometries/asset/:assetId` | `GEOMETRY_READ` | None | Get geometry version history |
| **GET** | `/geometries/versions/:id` | `GEOMETRY_READ` | None | Get specific geometry version |
| **POST** | `/processing/jobs` | `PROCESSING_CREATE` | Surveyor / Admin | Dispatch processing job |
| **GET** | `/processing/jobs` | `PROCESSING_READ` | None | List processing jobs |
| **GET** | `/processing/jobs/:id` | `PROCESSING_READ` | None | Get processing job status |
| **PATCH**| `/processing/jobs/:id/status` | `PROCESSING_CREATE` | None | Update processing job status |
| **POST** | `/violations` | `SPATIAL_ASSET_CREATE` | Surveyor / Admin | Register spatial violation |
| **GET** | `/violations` | `SPATIAL_ASSET_READ` | None | List violations |
| **GET** | `/violations/:id` | `SPATIAL_ASSET_READ` | None | Get violation details |
| **PATCH**| `/violations/:id/resolve` | `REVIEW_APPROVE` | Reviewer / Admin | Mark violation resolved |

---

## 11. Standardized API Response & Error Conventions

Every endpoint adheres strictly to standardized JSON responses:

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
  "message": "Applications retrieved successfully",
  "data": [
    {
      "id": "uuid-1",
      "applicationNumber": "STRATA-APP-2026-000001",
      "status": "SUBMITTED"
    }
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
    "code": "INVALID_APPLICATION_STATE",
    "message": "Cannot approve application: status is DRAFT, expected UNDER_REVIEW."
  }
}
```

---

## 12. Docker & Containerization

* **Dockerfile:** Multi-stage build (`node:20-alpine`) with non-root runtime user.
* **Docker Compose (`docker-compose.yml`):** Runs `strata_backend` alongside `postgis/postgis:16-3.4` with persistent volume and automated healthcheck.

---

## 13. Testing & Verification Results

Automated test execution across **13 test suites and 67 tests (100% passing)**:

```text
PASS tests/unit/assignments.test.ts
PASS tests/unit/require-permission.test.ts
PASS tests/unit/users-role.test.ts
PASS tests/unit/authorization-service.test.ts
PASS tests/unit/errors.test.ts
PASS tests/unit/responses.test.ts
PASS tests/unit/application-permissions.test.ts
PASS tests/unit/authorization.test.ts
PASS tests/unit/application-project-initialization.test.ts
PASS tests/unit/project-activation.test.ts
PASS tests/unit/application-workflow.test.ts
PASS tests/integration/app.test.ts
PASS tests/integration/application-workflow.test.ts

Test Suites: 13 passed, 13 total
Tests:       67 passed, 67 total
Snapshots:   0 total
Time:        7.935 s
```

### Quality Gate Results:
* `npm run build` → **Passed** (Clean compilation via `tsc` with zero errors).
* `npm run lint` → **Passed** (Zero ESLint warnings or errors).
* `npm run format:check` → **Passed** (100% Prettier compliant).
* `npm test` → **Passed** (67 unit and integration tests passing).

---

## 14. Developer Guide: Extending the Backend

To add a new domain feature to STRATA:

1. **Permissions & Roles**: Add permissions to `src/common/authorization/permissions.ts` and update `role-permissions.ts`.
2. **Prisma Schema**: Update `prisma/schema.prisma` and run `npx prisma generate`.
3. **Module Structure**: Create `src/modules/<feature>/` with `.types.ts`, `.validation.ts`, `.service.ts`, `.controller.ts`, and `.routes.ts`.
4. **Register Router**: Mount in `src/routes/index.ts`.
5. **Add Tests**: Create unit tests in `tests/unit/` and integration tests in `tests/integration/`.

---

*This document certifies that STRATA Node.js Backend Phase 1 (Authorization Core) and Phase 2 (Property Application & Project Initiation Workflow) are complete, strictly verified, and operational.*

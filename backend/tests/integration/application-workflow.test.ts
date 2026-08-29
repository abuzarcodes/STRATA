import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../src/app';
import { authConfig } from '../../src/config/auth';
import { Role, ApplicationStatus, PropertyType, ProjectStatus } from '../../src/common/enums';
import { prisma } from '../../src/database/prisma/client';

// Mock Prisma for integration controller-to-service-to-route pipeline
jest.mock('../../src/database/prisma/client', () => {
  const mockPrisma: Record<string, unknown> = {
    applicationCounter: {
      upsert: jest.fn(),
    },
    propertyApplication: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    applicationStatusHistory: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    applicationComment: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    project: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    projectAssignment: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    auditLog: {
      create: jest.fn().mockResolvedValue({}),
    },
    $transaction: jest.fn(async (cb: (tx: unknown) => unknown) => cb(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

describe('Phase 2 Application & Project Initiation HTTP Integration Pipeline', () => {
  const ownerUser = {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'owner@strata.gov',
    role: Role.PROPERTY_OWNER,
  };

  const adminUser = {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'admin@strata.gov',
    role: Role.ADMIN,
  };

  const surveyorUser = {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'surveyor@strata.gov',
    role: Role.SURVEYOR,
  };

  const ownerToken = jwt.sign(ownerUser, authConfig.jwtSecret, { expiresIn: '1h' });
  const adminToken = jwt.sign(adminUser, authConfig.jwtSecret, { expiresIn: '1h' });
  const surveyorToken = jwt.sign(surveyorUser, authConfig.jwtSecret, { expiresIn: '1h' });

  const mockAppId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const mockProjectId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1. Owner creates DRAFT application via POST /api/v1/applications', async () => {
    (prisma.applicationCounter.upsert as jest.Mock).mockResolvedValue({
      year: 2026,
      lastSequence: 10,
    });

    (prisma.propertyApplication.create as jest.Mock).mockResolvedValue({
      id: mockAppId,
      applicationNumber: 'STRATA-APP-2026-000010',
      ownerId: ownerUser.id,
      propertyName: 'Horizon Heights',
      propertyType: PropertyType.MIXED_USE,
      city: 'Delhi',
      status: ApplicationStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    (prisma.applicationStatusHistory.create as jest.Mock).mockResolvedValue({
      id: 'h-1',
      applicationId: mockAppId,
      fromStatus: ApplicationStatus.DRAFT,
      toStatus: ApplicationStatus.DRAFT,
      changedById: ownerUser.id,
    });

    const res = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        propertyName: 'Horizon Heights',
        propertyType: PropertyType.MIXED_USE,
        city: 'Delhi',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(ApplicationStatus.DRAFT);
    expect(res.body.data.applicationNumber).toBe('STRATA-APP-2026-000010');
  });

  it('2. Owner submits application via POST /api/v1/applications/:id/submit', async () => {
    (prisma.propertyApplication.findUnique as jest.Mock).mockResolvedValue({
      id: mockAppId,
      ownerId: ownerUser.id,
      propertyName: 'Horizon Heights',
      propertyType: PropertyType.MIXED_USE,
      city: 'Delhi',
      status: ApplicationStatus.DRAFT,
      latitude: null,
      longitude: null,
    });

    (prisma.propertyApplication.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
    (prisma.propertyApplication.findUniqueOrThrow as jest.Mock).mockResolvedValue({
      id: mockAppId,
      applicationNumber: 'STRATA-APP-2026-000010',
      ownerId: ownerUser.id,
      propertyName: 'Horizon Heights',
      status: ApplicationStatus.SUBMITTED,
      submittedAt: new Date(),
    });

    const res = await request(app)
      .post(`/api/v1/applications/${mockAppId}/submit`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(ApplicationStatus.SUBMITTED);
  });

  it('3. Admin starts review via POST /api/v1/applications/:id/start-review', async () => {
    (prisma.propertyApplication.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
    (prisma.propertyApplication.findUniqueOrThrow as jest.Mock).mockResolvedValue({
      id: mockAppId,
      status: ApplicationStatus.UNDER_REVIEW,
      reviewStartedAt: new Date(),
    });

    const res = await request(app)
      .post(`/api/v1/applications/${mockAppId}/start-review`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(ApplicationStatus.UNDER_REVIEW);
  });

  it('4. Surveyor cannot approve applications (Forbidden 403)', async () => {
    const res = await request(app)
      .post(`/api/v1/applications/${mockAppId}/approve`)
      .set('Authorization', `Bearer ${surveyorToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('5. Admin approves application via POST /api/v1/applications/:id/approve', async () => {
    (prisma.propertyApplication.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
    (prisma.propertyApplication.findUniqueOrThrow as jest.Mock).mockResolvedValue({
      id: mockAppId,
      status: ApplicationStatus.APPROVED,
      approvedAt: new Date(),
    });

    const res = await request(app)
      .post(`/api/v1/applications/${mockAppId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(ApplicationStatus.APPROVED);
  });

  it('6. Admin initializes Project via POST /api/v1/applications/:id/initialize-project', async () => {
    (prisma.propertyApplication.findUnique as jest.Mock).mockResolvedValue({
      id: mockAppId,
      applicationNumber: 'STRATA-APP-2026-000010',
      propertyName: 'Horizon Heights',
      description: 'Mixed use project',
      ownerId: ownerUser.id,
      status: ApplicationStatus.APPROVED,
      projectId: null,
    });

    (prisma.project.create as jest.Mock).mockResolvedValue({
      id: mockProjectId,
      name: 'Horizon Heights',
      description: 'Mixed use project',
      ownerId: ownerUser.id,
      status: ProjectStatus.INITIALIZED,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    (prisma.propertyApplication.update as jest.Mock).mockResolvedValue({
      id: mockAppId,
      projectId: mockProjectId,
    });

    const res = await request(app)
      .post(`/api/v1/applications/${mockAppId}/initialize-project`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(mockProjectId);
    expect(res.body.data.status).toBe(ProjectStatus.INITIALIZED);
  });

  it('7. Admin activates Project via POST /api/v1/projects/:id/activate after surveyor assignment', async () => {
    (prisma.project.findUnique as jest.Mock).mockResolvedValue({
      id: mockProjectId,
      name: 'Horizon Heights',
      ownerId: ownerUser.id,
      status: ProjectStatus.INITIALIZED,
    });

    (prisma.projectAssignment.findFirst as jest.Mock).mockResolvedValue({
      id: 'assignment-1',
      projectId: mockProjectId,
      userId: surveyorUser.id,
      assignmentRole: Role.SURVEYOR,
    });

    (prisma.project.update as jest.Mock).mockResolvedValue({
      id: mockProjectId,
      name: 'Horizon Heights',
      ownerId: ownerUser.id,
      status: ProjectStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app)
      .post(`/api/v1/projects/${mockProjectId}/activate`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(ProjectStatus.ACTIVE);
  });
});

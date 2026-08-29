import { applicationProjectService } from '../../src/modules/applications/application-project.service';
import { prisma } from '../../src/database/prisma/client';
import { ApplicationStatus, ProjectStatus } from '../../src/common/enums';
import { AppError } from '../../src/common/errors/app-error';

// Mock Prisma
jest.mock('../../src/database/prisma/client', () => {
  const mockPrisma: Record<string, unknown> = {
    propertyApplication: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    project: {
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn().mockResolvedValue({}),
    },
    $transaction: jest.fn(async (cb: (tx: unknown) => unknown) => cb(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

describe('Application Project Initialization Service', () => {
  const mockAppId = 'app-uuid-1';
  const mockOwnerId = 'owner-uuid-1';
  const mockAdminId = 'admin-uuid-1';
  const mockProjectId = 'project-uuid-1';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('successfully initializes a Project in INITIALIZED status from an APPROVED application', async () => {
    (prisma.propertyApplication.findUnique as jest.Mock).mockResolvedValue({
      id: mockAppId,
      applicationNumber: 'STRATA-APP-2026-000001',
      propertyName: 'Palm Residency',
      description: 'Residential Complex',
      ownerId: mockOwnerId,
      status: ApplicationStatus.APPROVED,
      projectId: null,
    });

    (prisma.project.create as jest.Mock).mockResolvedValue({
      id: mockProjectId,
      name: 'Palm Residency',
      description: 'Residential Complex',
      ownerId: mockOwnerId,
      status: ProjectStatus.INITIALIZED,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    (prisma.propertyApplication.update as jest.Mock).mockResolvedValue({
      id: mockAppId,
      projectId: mockProjectId,
    });

    const project = await applicationProjectService.initializeProject(mockAppId, mockAdminId);

    expect(project.id).toBe(mockProjectId);
    expect(project.status).toBe(ProjectStatus.INITIALIZED);
    expect(project.ownerId).toBe(mockOwnerId);
    expect(prisma.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'Palm Residency',
          ownerId: mockOwnerId,
          status: ProjectStatus.INITIALIZED,
        }),
      }),
    );
    expect(prisma.propertyApplication.update).toHaveBeenCalledWith({
      where: { id: mockAppId },
      data: { projectId: mockProjectId },
    });
  });

  it('rejects project initialization if application is not APPROVED (e.g. UNDER_REVIEW)', async () => {
    (prisma.propertyApplication.findUnique as jest.Mock).mockResolvedValue({
      id: mockAppId,
      applicationNumber: 'STRATA-APP-2026-000001',
      propertyName: 'Palm Residency',
      ownerId: mockOwnerId,
      status: ApplicationStatus.UNDER_REVIEW,
      projectId: null,
    });

    await expect(
      applicationProjectService.initializeProject(mockAppId, mockAdminId),
    ).rejects.toThrow(AppError);
  });

  it('rejects project initialization if application already has an existing Project', async () => {
    (prisma.propertyApplication.findUnique as jest.Mock).mockResolvedValue({
      id: mockAppId,
      applicationNumber: 'STRATA-APP-2026-000001',
      propertyName: 'Palm Residency',
      ownerId: mockOwnerId,
      status: ApplicationStatus.APPROVED,
      projectId: 'existing-project-uuid',
    });

    await expect(
      applicationProjectService.initializeProject(mockAppId, mockAdminId),
    ).rejects.toThrow(AppError);
  });
});

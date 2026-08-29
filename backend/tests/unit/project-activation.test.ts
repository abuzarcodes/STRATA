import { projectsService } from '../../src/modules/projects/projects.service';
import { prisma } from '../../src/database/prisma/client';
import { ProjectStatus, Role } from '../../src/common/enums';
import { AppError } from '../../src/common/errors/app-error';

// Mock Prisma
jest.mock('../../src/database/prisma/client', () => {
  const mockPrisma: Record<string, unknown> = {
    project: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    projectAssignment: {
      findFirst: jest.fn(),
    },
    auditLog: {
      create: jest.fn().mockResolvedValue({}),
    },
    $transaction: jest.fn(async (cb: (tx: unknown) => unknown) => cb(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

describe('Project Activation Service', () => {
  const mockProjectId = 'project-uuid-1';
  const mockAdminId = 'admin-uuid-1';
  const mockSurveyorId = 'surveyor-uuid-1';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('rejects activation if project is not in INITIALIZED status (e.g. already ACTIVE)', async () => {
    (prisma.project.findUnique as jest.Mock).mockResolvedValue({
      id: mockProjectId,
      status: ProjectStatus.ACTIVE,
    });

    await expect(projectsService.activate(mockProjectId, mockAdminId)).rejects.toThrow(AppError);
  });

  it('rejects activation if no SURVEYOR is assigned to the project', async () => {
    (prisma.project.findUnique as jest.Mock).mockResolvedValue({
      id: mockProjectId,
      status: ProjectStatus.INITIALIZED,
    });

    // No surveyor assignment found
    (prisma.projectAssignment.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(projectsService.activate(mockProjectId, mockAdminId)).rejects.toThrow(AppError);
  });

  it('successfully activates project when at least one SURVEYOR assignment exists', async () => {
    (prisma.project.findUnique as jest.Mock).mockResolvedValue({
      id: mockProjectId,
      name: 'Palm Residency',
      description: null,
      ownerId: 'owner-uuid',
      status: ProjectStatus.INITIALIZED,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    (prisma.projectAssignment.findFirst as jest.Mock).mockResolvedValue({
      id: 'assign-1',
      projectId: mockProjectId,
      userId: mockSurveyorId,
      assignmentRole: Role.SURVEYOR,
    });

    (prisma.project.update as jest.Mock).mockResolvedValue({
      id: mockProjectId,
      name: 'Palm Residency',
      description: null,
      ownerId: 'owner-uuid',
      status: ProjectStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const project = await projectsService.activate(mockProjectId, mockAdminId);

    expect(project.status).toBe(ProjectStatus.ACTIVE);
    expect(prisma.project.update).toHaveBeenCalledWith({
      where: { id: mockProjectId },
      data: { status: 'ACTIVE' },
    });
  });
});

import { assignmentsService } from '../../src/modules/assignments/assignments.service';
import { prisma } from '../../src/database/prisma/client';
import { Role } from '../../src/common/enums';
import { AppError } from '../../src/common/errors/app-error';

// Mock Prisma
jest.mock('../../src/database/prisma/client', () => ({
  prisma: {
    project: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    projectAssignment: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
    },
    auditLog: {
      create: jest.fn().mockResolvedValue({}),
    },
  },
}));

describe('AssignmentsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create assignment', () => {
    it('successfully creates an assignment when valid', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({ id: 'proj-1' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'surveyor-1',
        role: Role.SURVEYOR,
        isActive: true,
      });
      (prisma.projectAssignment.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.projectAssignment.create as jest.Mock).mockResolvedValue({
        id: 'assignment-1',
        projectId: 'proj-1',
        userId: 'surveyor-1',
        assignmentRole: Role.SURVEYOR,
        assignedById: 'admin-1',
        assignedAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await assignmentsService.create(
        'proj-1',
        { userId: 'surveyor-1', assignmentRole: Role.SURVEYOR },
        'admin-1',
      );

      expect(result.id).toBe('assignment-1');
      expect(prisma.projectAssignment.create).toHaveBeenCalled();
    });

    it('rejects assignment if project does not exist', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        assignmentsService.create(
          'non-existent-proj',
          { userId: 'surveyor-1', assignmentRole: Role.SURVEYOR },
          'admin-1',
        ),
      ).rejects.toThrow(AppError);
    });

    it('rejects assignment if user role is incompatible (e.g. PROPERTY_OWNER assigned as SURVEYOR)', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({ id: 'proj-1' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'owner-1',
        role: Role.PROPERTY_OWNER,
        isActive: true,
      });

      await expect(
        assignmentsService.create(
          'proj-1',
          { userId: 'owner-1', assignmentRole: Role.SURVEYOR },
          'admin-1',
        ),
      ).rejects.toThrow(AppError);
    });

    it('rejects assignment if user is inactive', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({ id: 'proj-1' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'surveyor-1',
        role: Role.SURVEYOR,
        isActive: false,
      });

      await expect(
        assignmentsService.create(
          'proj-1',
          { userId: 'surveyor-1', assignmentRole: Role.SURVEYOR },
          'admin-1',
        ),
      ).rejects.toThrow(AppError);
    });

    it('rejects duplicate assignment for the same user and project', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({ id: 'proj-1' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'surveyor-1',
        role: Role.SURVEYOR,
        isActive: true,
      });
      (prisma.projectAssignment.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-assignment',
      });

      await expect(
        assignmentsService.create(
          'proj-1',
          { userId: 'surveyor-1', assignmentRole: Role.SURVEYOR },
          'admin-1',
        ),
      ).rejects.toThrow(AppError);
    });
  });
});

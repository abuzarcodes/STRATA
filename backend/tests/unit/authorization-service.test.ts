import { authorizationService } from '../../src/common/authorization';
import { Role } from '../../src/common/enums';
import { prisma } from '../../src/database/prisma/client';

// Mock Prisma client
jest.mock('../../src/database/prisma/client', () => ({
  prisma: {
    project: {
      findUnique: jest.fn(),
    },
    projectAssignment: {
      findUnique: jest.fn(),
    },
  },
}));

describe('AuthorizationService - Project Access', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canAccessProject', () => {
    it('ADMIN always has access without checking DB', async () => {
      const result = await authorizationService.canAccessProject(
        'admin-user-id',
        Role.ADMIN,
        'any-project-id',
      );

      expect(result).toBe(true);
      expect(prisma.project.findUnique).not.toHaveBeenCalled();
      expect(prisma.projectAssignment.findUnique).not.toHaveBeenCalled();
    });

    it('Project owner has access', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({
        ownerId: 'owner-user-id',
      });
      (prisma.projectAssignment.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await authorizationService.canAccessProject(
        'owner-user-id',
        Role.PROPERTY_OWNER,
        'project-1',
      );

      expect(result).toBe(true);
    });

    it('Assigned user (surveyor/reviewer) has access even if not owner', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({
        ownerId: 'different-owner-id',
      });
      (prisma.projectAssignment.findUnique as jest.Mock).mockResolvedValue({
        id: 'assignment-1',
      });

      const result = await authorizationService.canAccessProject(
        'surveyor-user-id',
        Role.SURVEYOR,
        'project-1',
      );

      expect(result).toBe(true);
    });

    it('User who is neither owner nor assigned is denied access', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({
        ownerId: 'different-owner-id',
      });
      (prisma.projectAssignment.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await authorizationService.canAccessProject(
        'unassigned-user-id',
        Role.SURVEYOR,
        'project-1',
      );

      expect(result).toBe(false);
    });
  });
});

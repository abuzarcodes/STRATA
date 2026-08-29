import { usersService } from '../../src/modules/users/users.service';
import { prisma } from '../../src/database/prisma/client';
import { Role } from '../../src/common/enums';
import { AppError } from '../../src/common/errors/app-error';

// Mock Prisma
jest.mock('../../src/database/prisma/client', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    auditLog: {
      create: jest.fn().mockResolvedValue({}),
    },
  },
}));

describe('UsersService - Role Management & Activation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateRole', () => {
    it('successfully updates user role when performed by an admin', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'target-user-id',
        role: Role.PROPERTY_OWNER,
        isActive: true,
      });
      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: 'target-user-id',
        email: 'user@example.com',
        name: 'Target User',
        role: Role.SURVEYOR,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await usersService.updateRole(
        'target-user-id',
        Role.SURVEYOR,
        'admin-user-id',
      );

      expect(result.role).toBe(Role.SURVEYOR);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'target-user-id' },
        data: { role: Role.SURVEYOR },
        select: expect.any(Object),
      });
    });

    it('prevents a user from changing their own role', async () => {
      await expect(
        usersService.updateRole('admin-1', Role.ADMIN, 'admin-1'),
      ).rejects.toThrow(AppError);
    });

    it('throws 404 if target user is not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        usersService.updateRole('non-existent-user', Role.SURVEYOR, 'admin-1'),
      ).rejects.toThrow(AppError);
    });
  });

  describe('toggleActive', () => {
    it('successfully deactivates/activates a user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        isActive: true,
      });
      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        name: 'User One',
        role: Role.PROPERTY_OWNER,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await usersService.toggleActive('user-1', false, 'admin-1');

      expect(result.isActive).toBe(false);
    });
  });
});

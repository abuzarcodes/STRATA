import { prisma } from '../../database/prisma/client';
import { AppError } from '../../common/errors/app-error';
import { ErrorCodes } from '../../common/errors/error-codes';
import { Role, AuditAction } from '../../common/enums';
import { UserSummary } from './users.types';
import { PaginationQuery } from '../../common/types/pagination.types';
import { paginationToSkipTake } from '../../common/utils/pagination';
import { auditService } from '../audit/audit.service';

export class UsersService {
  async findAll(pagination: PaginationQuery): Promise<{ users: UserSummary[]; total: number }> {
    const { skip, take } = paginationToSkipTake(pagination);

    const [total, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return {
      users: users.map((u) => ({ ...u, role: u.role as Role })),
      total,
    };
  }

  async findById(id: string): Promise<UserSummary> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'User with specified ID not found.');
    }

    return { ...user, role: user.role as Role };
  }

  async updateRole(
    targetUserId: string,
    newRole: Role,
    performedByUserId: string,
  ): Promise<UserSummary> {
    if (targetUserId === performedByUserId) {
      throw new AppError(400, ErrorCodes.SELF_ROLE_CHANGE, 'Users cannot change their own role.');
    }

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'User with specified ID not found.');
    }

    const oldRole = user.role;

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Record audit log
    await auditService.log({
      action: AuditAction.USER_ROLE_CHANGED,
      entityType: 'User',
      entityId: targetUserId,
      userId: performedByUserId,
      metadata: {
        oldRole,
        newRole,
      },
    });

    return { ...updated, role: updated.role as Role };
  }

  async toggleActive(
    targetUserId: string,
    isActive: boolean,
    performedByUserId: string,
  ): Promise<UserSummary> {
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'User with specified ID not found.');
    }

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { isActive },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Record audit log
    await auditService.log({
      action: isActive ? AuditAction.USER_ACTIVATED : AuditAction.USER_DEACTIVATED,
      entityType: 'User',
      entityId: targetUserId,
      userId: performedByUserId,
      metadata: {
        isActive,
      },
    });

    return { ...updated, role: updated.role as Role };
  }
}

export const usersService = new UsersService();

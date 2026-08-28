import { prisma } from '../../database/prisma/client';
import { AppError } from '../../common/errors/app-error';
import { ErrorCodes } from '../../common/errors/error-codes';
import { Role } from '../../common/enums';
import { UserSummary } from './users.types';
import { PaginationQuery } from '../../common/types/pagination.types';
import { paginationToSkipTake } from '../../common/utils/pagination';

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
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'User with specified ID not found.');
    }

    return { ...user, role: user.role as Role };
  }
}

export const usersService = new UsersService();

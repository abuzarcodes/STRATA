import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service';
import { sendPaginated, sendSuccess } from '../../common/responses/api-response';
import { parsePagination, buildPaginationMeta } from '../../common/utils/pagination';
import { AppError } from '../../common/errors/app-error';
import { ErrorCodes } from '../../common/errors/error-codes';
import { Role } from '../../common/enums';

export class UsersController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req);
      const { users, total } = await usersService.findAll(pagination);
      const meta = buildPaginationMeta(pagination, total);
      sendPaginated(res, users, meta, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await usersService.findById(id as string);
      sendSuccess(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { id } = req.params;
      const { role } = req.body as { role: Role };
      const updatedUser = await usersService.updateRole(id as string, role, req.user.id);
      sendSuccess(res, updatedUser, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async toggleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { id } = req.params;
      const { isActive } = req.body as { isActive: boolean };
      const updatedUser = await usersService.toggleActive(id as string, isActive, req.user.id);
      sendSuccess(res, updatedUser, `User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();

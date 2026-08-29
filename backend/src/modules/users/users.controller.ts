import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service';
import { sendPaginated, sendSuccess } from '../../common/responses/api-response';
import { parsePagination, buildPaginationMeta } from '../../common/utils/pagination';

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
}

export const usersController = new UsersController();

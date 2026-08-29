import { Request, Response, NextFunction } from 'express';
import { projectsService } from './projects.service';
import { sendCreated, sendPaginated, sendSuccess } from '../../common/responses/api-response';
import { parsePagination, buildPaginationMeta } from '../../common/utils/pagination';
import { AppError } from '../../common/errors/app-error';
import { ErrorCodes } from '../../common/errors/error-codes';
import { Role } from '../../common/enums';

export class ProjectsController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const project = await projectsService.create(req.body, req.user.id);
      sendCreated(res, project, 'Project created successfully');
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req);
      const userId = req.user?.role === Role.ADMIN ? undefined : req.user?.id;
      const { projects, total } = await projectsService.findAll(pagination, userId);
      const meta = buildPaginationMeta(pagination, total);
      sendPaginated(res, projects, meta, 'Projects retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const project = await projectsService.findById(id as string);
      sendSuccess(res, project, 'Project details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const project = await projectsService.update(id as string, req.body);
      sendSuccess(res, project, 'Project updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await projectsService.delete(id as string);
      sendSuccess(res, { id }, 'Project deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const projectsController = new ProjectsController();

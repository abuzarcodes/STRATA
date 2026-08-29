import { Request, Response, NextFunction } from 'express';
import { assignmentsService } from './assignments.service';
import { sendCreated, sendPaginated, sendSuccess } from '../../common/responses/api-response';
import { parsePagination, buildPaginationMeta } from '../../common/utils/pagination';
import { AppError } from '../../common/errors/app-error';
import { ErrorCodes } from '../../common/errors/error-codes';

export class AssignmentsController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { projectId } = req.params;
      const assignment = await assignmentsService.create(
        projectId as string,
        req.body,
        req.user.id,
      );
      sendCreated(res, assignment, 'User assigned to project successfully');
    } catch (error) {
      next(error);
    }
  }

  async findByProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const pagination = parsePagination(req);
      const { assignments, total } = await assignmentsService.findByProject(
        projectId as string,
        pagination,
      );
      const meta = buildPaginationMeta(pagination, total);
      sendPaginated(res, assignments, meta, 'Project assignments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { projectId, assignmentId } = req.params;
      await assignmentsService.delete(projectId as string, assignmentId as string, req.user.id);
      sendSuccess(res, { id: assignmentId }, 'Project assignment removed successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const assignmentsController = new AssignmentsController();

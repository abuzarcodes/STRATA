import { Request, Response, NextFunction } from 'express';
import { applicationsService } from './applications.service';
import { applicationCommentsService } from './application-comments.service';
import { applicationHistoryService } from './application-history.service';
import { applicationProjectService } from './application-project.service';
import { sendCreated, sendPaginated, sendSuccess } from '../../common/responses/api-response';
import { parsePagination, buildPaginationMeta } from '../../common/utils/pagination';
import { AppError } from '../../common/errors/app-error';
import { ErrorCodes } from '../../common/errors/error-codes';
import { ApplicationStatus, PropertyType, Role } from '../../common/enums';
import { ApplicationFilterQuery } from './applications.types';

export class ApplicationsController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const application = await applicationsService.create(req.body, req.user.id);
      sendCreated(res, application, 'Property application created successfully');
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const pagination = parsePagination(req);
      const filters: ApplicationFilterQuery = {
        status: req.query['status'] as ApplicationStatus | undefined,
        propertyType: req.query['propertyType'] as PropertyType | undefined,
        search: req.query['search'] as string | undefined,
      };

      // PROPERTY_OWNER can only view their own applications
      const userId = req.user.role === Role.ADMIN ? undefined : req.user.id;

      const { applications, total } = await applicationsService.findAll(
        pagination,
        filters,
        userId,
      );
      const meta = buildPaginationMeta(pagination, total);
      sendPaginated(res, applications, meta, 'Applications retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { id } = req.params;
      const userId = req.user.role === Role.ADMIN ? undefined : req.user.id;
      const application = await applicationsService.findById(id as string, userId);
      sendSuccess(res, application, 'Application details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { id } = req.params;
      const application = await applicationsService.update(
        id as string,
        req.body,
        req.user.id,
        req.user.role,
      );
      sendSuccess(res, application, 'Application updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { id } = req.params;
      const application = await applicationsService.submit(
        id as string,
        req.user.id,
        req.user.role,
      );
      sendSuccess(res, application, 'Application submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  async startReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { id } = req.params;
      const application = await applicationsService.startReview(id as string, req.user.id);
      sendSuccess(res, application, 'Application review started');
    } catch (error) {
      next(error);
    }
  }

  async requestInformation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { id } = req.params;
      const application = await applicationsService.requestInformation(
        id as string,
        req.body,
        req.user.id,
      );
      sendSuccess(res, application, 'Information requested from applicant');
    } catch (error) {
      next(error);
    }
  }

  async approve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { id } = req.params;
      const application = await applicationsService.approve(id as string, req.user.id);
      sendSuccess(res, application, 'Application approved successfully');
    } catch (error) {
      next(error);
    }
  }

  async reject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { id } = req.params;
      const application = await applicationsService.reject(id as string, req.body, req.user.id);
      sendSuccess(res, application, 'Application rejected');
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { id } = req.params;
      const application = await applicationsService.cancel(
        id as string,
        req.user.id,
        req.user.role,
      );
      sendSuccess(res, application, 'Application cancelled');
    } catch (error) {
      next(error);
    }
  }

  async initializeProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { id } = req.params;
      const project = await applicationProjectService.initializeProject(id as string, req.user.id);
      sendCreated(res, project, 'Project workspace initialized from approved application');
    } catch (error) {
      next(error);
    }
  }

  async createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { id } = req.params;
      const comment = await applicationCommentsService.create(
        id as string,
        req.user.id,
        req.user.role,
        req.body.message,
      );
      sendCreated(res, comment, 'Comment added successfully');
    } catch (error) {
      next(error);
    }
  }

  async findComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { id } = req.params;
      const comments = await applicationCommentsService.findByApplication(
        id as string,
        req.user.id,
        req.user.role,
      );
      sendSuccess(res, comments, 'Comments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async findHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
      }
      const { id } = req.params;
      // First verify access to application
      const userId = req.user.role === Role.ADMIN ? undefined : req.user.id;
      await applicationsService.findById(id as string, userId);

      const history = await applicationHistoryService.findByApplication(id as string);
      sendSuccess(res, history, 'Application status history retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const applicationsController = new ApplicationsController();

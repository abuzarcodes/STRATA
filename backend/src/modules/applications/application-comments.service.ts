import { prisma } from '../../database/prisma/client';
import { AppError } from '../../common/errors/app-error';
import { ErrorCodes } from '../../common/errors/error-codes';
import { AuditAction, ApplicationCommentType, Role } from '../../common/enums';
import { ApplicationCommentSummary } from './applications.types';
import { auditService } from '../audit/audit.service';

export class ApplicationCommentsService {
  /**
   * Add a new comment to an application.
   */
  async create(
    applicationId: string,
    authorId: string,
    userRole: Role,
    message: string,
    type: ApplicationCommentType = ApplicationCommentType.GENERAL,
  ): Promise<ApplicationCommentSummary> {
    const application = await prisma.propertyApplication.findUnique({
      where: { id: applicationId },
      select: { id: true, ownerId: true },
    });

    if (!application) {
      throw new AppError(404, ErrorCodes.APPLICATION_NOT_FOUND, 'Application not found.');
    }

    // Access check: Only owner or admin can add comment
    if (userRole !== Role.ADMIN && application.ownerId !== authorId) {
      throw new AppError(
        403,
        ErrorCodes.APPLICATION_ACCESS_DENIED,
        'You do not have access to this application.',
      );
    }

    const comment = await prisma.applicationComment.create({
      data: {
        applicationId,
        authorId,
        message,
        type,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Record audit log
    await auditService.log({
      action: AuditAction.APPLICATION_COMMENT_ADDED,
      entityType: 'PropertyApplication',
      entityId: applicationId,
      userId: authorId,
      metadata: {
        commentId: comment.id,
        commentType: type,
      },
    });

    return comment as unknown as ApplicationCommentSummary;
  }

  /**
   * List all comments for an application in chronological order.
   */
  async findByApplication(
    applicationId: string,
    userId: string,
    userRole: Role,
  ): Promise<ApplicationCommentSummary[]> {
    const application = await prisma.propertyApplication.findUnique({
      where: { id: applicationId },
      select: { id: true, ownerId: true },
    });

    if (!application) {
      throw new AppError(404, ErrorCodes.APPLICATION_NOT_FOUND, 'Application not found.');
    }

    if (userRole !== Role.ADMIN && application.ownerId !== userId) {
      throw new AppError(
        403,
        ErrorCodes.APPLICATION_ACCESS_DENIED,
        'You do not have access to this application.',
      );
    }

    const comments = await prisma.applicationComment.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return comments as unknown as ApplicationCommentSummary[];
  }
}

export const applicationCommentsService = new ApplicationCommentsService();

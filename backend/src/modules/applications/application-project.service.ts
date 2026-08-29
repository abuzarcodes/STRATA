import { prisma } from '../../database/prisma/client';
import { AppError } from '../../common/errors/app-error';
import { ErrorCodes } from '../../common/errors/error-codes';
import { ApplicationStatus, AuditAction, ProjectStatus } from '../../common/enums';
import { auditService } from '../audit/audit.service';
import { ProjectSummary } from '../projects/projects.types';

export class ApplicationProjectService {
  /**
   * Initialize a new technical workspace (Project) from an APPROVED application.
   * Runs in an atomic transaction to ensure 1:1 integrity.
   */
  async initializeProject(applicationId: string, adminId: string): Promise<ProjectSummary> {
    return prisma.$transaction(async (tx) => {
      const application = await tx.propertyApplication.findUnique({
        where: { id: applicationId },
      });

      if (!application) {
        throw new AppError(404, ErrorCodes.APPLICATION_NOT_FOUND, 'Application not found.');
      }

      if (application.status !== ApplicationStatus.APPROVED) {
        throw new AppError(
          400,
          ErrorCodes.APPLICATION_NOT_APPROVED,
          `Cannot initialize project: application status is ${application.status}. Only APPROVED applications can initialize a project.`,
        );
      }

      if (application.projectId) {
        throw new AppError(
          409,
          ErrorCodes.PROJECT_ALREADY_INITIALIZED,
          'A project has already been initialized for this application.',
        );
      }

      // Create the Project in INITIALIZED status
      const projectName =
        application.propertyName?.trim() || `Project for ${application.applicationNumber}`;

      const project = await tx.project.create({
        data: {
          name: projectName,
          description: application.description ?? null,
          ownerId: application.ownerId,
          status: ProjectStatus.INITIALIZED,
        },
      });

      // Link application to project (enforcing 1:1 via unique constraint)
      await tx.propertyApplication.update({
        where: { id: applicationId },
        data: { projectId: project.id },
      });

      // Record audit log
      await auditService.log({
        action: AuditAction.PROJECT_INITIALIZED_FROM_APPLICATION,
        entityType: 'Project',
        entityId: project.id,
        userId: adminId,
        metadata: {
          applicationId: application.id,
          applicationNumber: application.applicationNumber,
          ownerId: application.ownerId,
          projectStatus: ProjectStatus.INITIALIZED,
        },
      });

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        ownerId: project.ownerId,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };
    });
  }
}

export const applicationProjectService = new ApplicationProjectService();

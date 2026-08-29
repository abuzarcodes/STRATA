import { prisma } from '../../database/prisma/client';
import { AppError } from '../../common/errors/app-error';
import { ErrorCodes } from '../../common/errors/error-codes';
import { AuditAction, Role } from '../../common/enums';
import { CreateAssignmentInput } from './assignments.validation';
import { ProjectAssignmentSummary } from './assignments.types';
import { PaginationQuery } from '../../common/types/pagination.types';
import { paginationToSkipTake } from '../../common/utils/pagination';
import { auditService } from '../audit/audit.service';

export class AssignmentsService {
  async create(
    projectId: string,
    input: CreateAssignmentInput,
    assignedById: string,
  ): Promise<ProjectAssignmentSummary> {
    // 1. Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Project not found.');
    }

    // 2. Verify target user exists and is active
    const targetUser = await prisma.user.findUnique({
      where: { id: input.userId },
    });
    if (!targetUser) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'User to assign was not found.');
    }
    if (!targetUser.isActive) {
      throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Cannot assign an inactive user.');
    }

    // 3. Verify user's global role is compatible with assignment role
    // ADMIN can take any assignment, otherwise global role should match assignment role
    if (targetUser.role !== Role.ADMIN && targetUser.role !== input.assignmentRole) {
      throw new AppError(
        400,
        ErrorCodes.VALIDATION_ERROR,
        `Cannot assign user with role ${targetUser.role} as a ${input.assignmentRole}. User's global role must match.`,
      );
    }

    // 4. Check for duplicate assignment
    const existing = await prisma.projectAssignment.findUnique({
      where: {
        userId_projectId: {
          userId: input.userId,
          projectId,
        },
      },
    });
    if (existing) {
      throw new AppError(
        409,
        ErrorCodes.DUPLICATE_ASSIGNMENT,
        'User is already assigned to this project.',
      );
    }

    // 5. Create assignment
    const assignment = await prisma.projectAssignment.create({
      data: {
        projectId,
        userId: input.userId,
        assignmentRole: input.assignmentRole,
        assignedById,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        assignedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // 6. Record audit log
    await auditService.log({
      action: AuditAction.USER_ASSIGNED_TO_PROJECT,
      entityType: 'ProjectAssignment',
      entityId: assignment.id,
      userId: assignedById,
      metadata: {
        projectId,
        assignedUserId: input.userId,
        assignmentRole: input.assignmentRole,
      },
    });

    return assignment;
  }

  async findByProject(
    projectId: string,
    pagination: PaginationQuery,
  ): Promise<{ assignments: ProjectAssignmentSummary[]; total: number }> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Project not found.');
    }

    const { skip, take } = paginationToSkipTake(pagination);

    const [total, assignments] = await Promise.all([
      prisma.projectAssignment.count({ where: { projectId } }),
      prisma.projectAssignment.findMany({
        where: { projectId },
        skip,
        take,
        orderBy: { assignedAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          assignedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return { assignments, total };
  }

  async delete(projectId: string, assignmentId: string, performedById: string): Promise<void> {
    const assignment = await prisma.projectAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment || assignment.projectId !== projectId) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Project assignment not found.');
    }

    await prisma.projectAssignment.delete({
      where: { id: assignmentId },
    });

    await auditService.log({
      action: AuditAction.USER_REMOVED_FROM_PROJECT,
      entityType: 'ProjectAssignment',
      entityId: assignmentId,
      userId: performedById,
      metadata: {
        projectId,
        removedUserId: assignment.userId,
        assignmentRole: assignment.assignmentRole,
      },
    });
  }
}

export const assignmentsService = new AssignmentsService();

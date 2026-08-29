import { prisma } from '../../database/prisma/client';
import { AppError } from '../../common/errors/app-error';
import { ErrorCodes } from '../../common/errors/error-codes';
import { CreateProjectInput, UpdateProjectInput } from './projects.validation';
import { ProjectSummary } from './projects.types';
import { PaginationQuery } from '../../common/types/pagination.types';
import { paginationToSkipTake } from '../../common/utils/pagination';

export class ProjectsService {
  async create(input: CreateProjectInput, ownerId: string): Promise<ProjectSummary> {
    const project = await prisma.project.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        ownerId,
      },
    });

    return project;
  }

  async findAll(
    pagination: PaginationQuery,
    userId?: string,
  ): Promise<{ projects: ProjectSummary[]; total: number }> {
    const { skip, take } = paginationToSkipTake(pagination);
    const where = userId
      ? {
          OR: [{ ownerId: userId }, { assignments: { some: { userId } } }],
        }
      : {};

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { projects, total };
  }

  async findById(id: string): Promise<ProjectSummary> {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        parcels: {
          include: {
            buildings: {
              include: {
                floors: {
                  include: {
                    spatialAssets: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new AppError(
        404,
        ErrorCodes.RESOURCE_NOT_FOUND,
        'Project with specified ID not found.',
      );
    }

    return project;
  }

  async update(id: string, input: UpdateProjectInput): Promise<ProjectSummary> {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Project not found.');
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(input.name ? { name: input.name } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
      },
    });

    return updated;
  }

  async delete(id: string): Promise<void> {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Project not found.');
    }

    await prisma.project.delete({ where: { id } });
  }

  /**
   * Activate an INITIALIZED project.
   * Requires at least one valid SURVEYOR assignment to exist on the project.
   */
  async activate(id: string, adminId: string): Promise<ProjectSummary> {
    return prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id },
      });

      if (!project) {
        throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Project not found.');
      }

      if (project.status !== 'INITIALIZED') {
        throw new AppError(
          400,
          ErrorCodes.INVALID_APPLICATION_STATE,
          `Cannot activate project with status ${project.status}. Only INITIALIZED projects can be activated.`,
        );
      }

      // Check that at least one SURVEYOR assignment exists
      const surveyorAssignment = await tx.projectAssignment.findFirst({
        where: {
          projectId: id,
          assignmentRole: 'SURVEYOR',
        },
      });

      if (!surveyorAssignment) {
        throw new AppError(
          400,
          ErrorCodes.PROJECT_ACTIVATION_FAILED,
          'Cannot activate project: at least one SURVEYOR must be assigned to the project first.',
        );
      }

      const updated = await tx.project.update({
        where: { id },
        data: { status: 'ACTIVE' },
      });

      await tx.auditLog.create({
        data: {
          action: 'PROJECT_ACTIVATED',
          entityType: 'Project',
          entityId: id,
          userId: adminId,
          metadata: {
            previousStatus: 'INITIALIZED',
            newStatus: 'ACTIVE',
            activatedBy: adminId,
          },
        },
      });

      return updated;
    });
  }
}

export const projectsService = new ProjectsService();

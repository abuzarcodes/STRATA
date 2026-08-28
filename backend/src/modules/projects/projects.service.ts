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
    const where = userId ? { ownerId: userId } : {};

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

  async update(
    id: string,
    input: UpdateProjectInput,
    userId: string,
    isAdmin = false,
  ): Promise<ProjectSummary> {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Project not found.');
    }

    if (!isAdmin && project.ownerId !== userId) {
      throw new AppError(
        403,
        ErrorCodes.FORBIDDEN,
        'You do not have permission to modify this project.',
      );
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

  async delete(id: string, userId: string, isAdmin = false): Promise<void> {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Project not found.');
    }

    if (!isAdmin && project.ownerId !== userId) {
      throw new AppError(
        403,
        ErrorCodes.FORBIDDEN,
        'You do not have permission to delete this project.',
      );
    }

    await prisma.project.delete({ where: { id } });
  }
}

export const projectsService = new ProjectsService();

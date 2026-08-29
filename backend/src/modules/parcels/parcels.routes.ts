import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../database/prisma/client';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { sendCreated, sendPaginated, sendSuccess } from '../../common/responses/api-response';
import {
  parsePagination,
  buildPaginationMeta,
  paginationToSkipTake,
} from '../../common/utils/pagination';
import { AppError } from '../../common/errors/app-error';
import { ErrorCodes } from '../../common/errors/error-codes';

// ── Types ──
export interface ParcelSummary {
  id: string;
  projectId: string;
  name: string;
  parcelNumber: string | null;
  area: number | null;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
}

// ── Validation ──
export const createParcelSchema = z.object({
  body: z.object({
    projectId: z.string().uuid('Project ID must be a valid UUID'),
    name: z.string().min(2, 'Parcel name must be at least 2 characters'),
    parcelNumber: z.string().optional(),
    area: z.number().positive().optional(),
    metadata: z.record(z.unknown()).optional(),
  }),
});

export const getParcelSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

// ── Service ──
export class ParcelsService {
  async create(input: z.infer<typeof createParcelSchema>['body']): Promise<ParcelSummary> {
    const project = await prisma.project.findUnique({ where: { id: input.projectId } });
    if (!project) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Associated project not found.');
    }

    return prisma.parcel.create({
      data: {
        projectId: input.projectId,
        name: input.name,
        parcelNumber: input.parcelNumber ?? null,
        area: input.area ?? null,
        metadata: (input.metadata ?? {}) as object,
      },
    });
  }

  async findAll(pagination = { page: 1, limit: 20 }, projectId?: string) {
    const { skip, take } = paginationToSkipTake(pagination);
    const where = projectId ? { projectId } : {};

    const [total, parcels] = await Promise.all([
      prisma.parcel.count({ where }),
      prisma.parcel.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
    ]);

    return { parcels, total };
  }

  async findById(id: string) {
    const parcel = await prisma.parcel.findUnique({
      where: { id },
      include: { buildings: { include: { floors: true } } },
    });

    if (!parcel) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Parcel not found.');
    }

    return parcel;
  }
}

export const parcelsService = new ParcelsService();

// ── Controller ──
export class ParcelsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parcel = await parcelsService.create(req.body);
      sendCreated(res, parcel, 'Parcel created successfully');
    } catch (err) {
      next(err);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = parsePagination(req);
      const projectId = req.query['projectId'] as string | undefined;
      const { parcels, total } = await parcelsService.findAll(pagination, projectId);
      const meta = buildPaginationMeta(pagination, total);
      sendPaginated(res, parcels, meta, 'Parcels retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const parcel = await parcelsService.findById(req.params['id'] as string);
      sendSuccess(res, parcel, 'Parcel details retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const parcelsController = new ParcelsController();

// ── Routes ──
const router = Router();
router.use(authMiddleware);

router.post('/', validate(createParcelSchema), (req, res, next) =>
  parcelsController.create(req, res, next),
);
router.get('/', (req, res, next) => parcelsController.findAll(req, res, next));
router.get('/:id', validate(getParcelSchema), (req, res, next) =>
  parcelsController.findById(req, res, next),
);

export const parcelRoutes = router;

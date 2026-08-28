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

// ── Validation ──
export const createBuildingSchema = z.object({
  body: z.object({
    parcelId: z.string().uuid('Parcel ID must be a valid UUID'),
    name: z.string().min(2, 'Building name must be at least 2 characters'),
    numberOfFloors: z.number().int().min(1).default(1),
    metadata: z.record(z.unknown()).optional(),
  }),
});

export const getBuildingSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

// ── Service ──
export class BuildingsService {
  async create(input: z.infer<typeof createBuildingSchema>['body']) {
    const parcel = await prisma.parcel.findUnique({ where: { id: input.parcelId } });
    if (!parcel) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Associated parcel not found.');
    }

    return prisma.building.create({
      data: {
        parcelId: input.parcelId,
        name: input.name,
        numberOfFloors: input.numberOfFloors,
        metadata: (input.metadata ?? {}) as object,
      },
    });
  }

  async findAll(pagination = { page: 1, limit: 20 }, parcelId?: string) {
    const { skip, take } = paginationToSkipTake(pagination);
    const where = parcelId ? { parcelId } : {};

    const [total, buildings] = await Promise.all([
      prisma.building.count({ where }),
      prisma.building.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
    ]);

    return { buildings, total };
  }

  async findById(id: string) {
    const building = await prisma.building.findUnique({
      where: { id },
      include: {
        floors: {
          include: {
            spatialAssets: true,
          },
        },
      },
    });

    if (!building) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Building not found.');
    }

    return building;
  }
}

export const buildingsService = new BuildingsService();

// ── Controller ──
export class BuildingsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const building = await buildingsService.create(req.body);
      sendCreated(res, building, 'Building registered successfully');
    } catch (err) {
      next(err);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = parsePagination(req);
      const parcelId = req.query['parcelId'] as string | undefined;
      const { buildings, total } = await buildingsService.findAll(pagination, parcelId);
      const meta = buildPaginationMeta(pagination, total);
      sendPaginated(res, buildings, meta, 'Buildings retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const building = await buildingsService.findById(req.params['id'] as string);
      sendSuccess(res, building, 'Building details retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const buildingsController = new BuildingsController();

// ── Routes ──
const router = Router();
router.use(authMiddleware);

router.post('/', validate(createBuildingSchema), (req, res, next) =>
  buildingsController.create(req, res, next),
);
router.get('/', (req, res, next) => buildingsController.findAll(req, res, next));
router.get('/:id', validate(getBuildingSchema), (req, res, next) =>
  buildingsController.findById(req, res, next),
);

export const buildingRoutes = router;

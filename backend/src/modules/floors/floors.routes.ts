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
export const createFloorSchema = z.object({
  body: z.object({
    buildingId: z.string().uuid('Building ID must be a valid UUID'),
    level: z.number().int(),
    elevation: z.number().default(0.0),
    height: z.number().positive().default(3.0),
  }),
});

// ── Service ──
export class FloorsService {
  async create(input: z.infer<typeof createFloorSchema>['body']) {
    const building = await prisma.building.findUnique({ where: { id: input.buildingId } });
    if (!building) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Associated building not found.');
    }

    return prisma.floor.create({
      data: {
        buildingId: input.buildingId,
        level: input.level,
        elevation: input.elevation,
        height: input.height,
      },
    });
  }

  async findAll(pagination = { page: 1, limit: 20 }, buildingId?: string) {
    const { skip, take } = paginationToSkipTake(pagination);
    const where = buildingId ? { buildingId } : {};

    const [total, floors] = await Promise.all([
      prisma.floor.count({ where }),
      prisma.floor.findMany({ where, skip, take, orderBy: { level: 'asc' } }),
    ]);

    return { floors, total };
  }

  async findById(id: string) {
    const floor = await prisma.floor.findUnique({
      where: { id },
      include: {
        spatialAssets: {
          include: {
            geometryVersions: true,
          },
        },
      },
    });

    if (!floor) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Floor not found.');
    }

    return floor;
  }
}

export const floorsService = new FloorsService();

// ── Controller ──
export class FloorsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const floor = await floorsService.create(req.body);
      sendCreated(res, floor, 'Floor level registered successfully');
    } catch (err) {
      next(err);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = parsePagination(req);
      const buildingId = req.query['buildingId'] as string | undefined;
      const { floors, total } = await floorsService.findAll(pagination, buildingId);
      const meta = buildPaginationMeta(pagination, total);
      sendPaginated(res, floors, meta, 'Floors retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const floor = await floorsService.findById(req.params['id'] as string);
      sendSuccess(res, floor, 'Floor details retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const floorsController = new FloorsController();

// ── Routes ──
const router = Router();
router.use(authMiddleware);

router.post('/', validate(createFloorSchema), (req, res, next) =>
  floorsController.create(req, res, next),
);
router.get('/', (req, res, next) => floorsController.findAll(req, res, next));
router.get('/:id', (req, res, next) => floorsController.findById(req, res, next));

export const floorRoutes = router;

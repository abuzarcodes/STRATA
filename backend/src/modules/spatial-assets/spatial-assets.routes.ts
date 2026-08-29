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
import { AssetType } from '../../common/enums';

// ── Validation ──
export const createSpatialAssetSchema = z.object({
  body: z.object({
    floorId: z.string().uuid('Floor ID must be a valid UUID'),
    name: z.string().min(1, 'Spatial asset name is required'),
    type: z.nativeEnum(AssetType).default(AssetType.PROPERTY_UNIT),
    metadata: z.record(z.unknown()).optional(),
  }),
});

// ── Service ──
export class SpatialAssetsService {
  async create(input: z.infer<typeof createSpatialAssetSchema>['body']) {
    const floor = await prisma.floor.findUnique({ where: { id: input.floorId } });
    if (!floor) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Associated floor not found.');
    }

    return prisma.spatialAsset.create({
      data: {
        floorId: input.floorId,
        name: input.name,
        type: input.type,
        metadata: (input.metadata ?? {}) as object,
      },
    });
  }

  async findAll(pagination = { page: 1, limit: 20 }, floorId?: string, type?: AssetType) {
    const { skip, take } = paginationToSkipTake(pagination);
    const where = {
      ...(floorId ? { floorId } : {}),
      ...(type ? { type } : {}),
    };

    const [total, spatialAssets] = await Promise.all([
      prisma.spatialAsset.count({ where }),
      prisma.spatialAsset.findMany({
        where,
        skip,
        take,
        include: { geometryVersions: { orderBy: { version: 'desc' }, take: 1 } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { spatialAssets, total };
  }

  async findById(id: string) {
    const asset = await prisma.spatialAsset.findUnique({
      where: { id },
      include: {
        geometryVersions: { orderBy: { version: 'desc' } },
        violations: true,
        floor: {
          include: {
            building: {
              include: {
                parcel: true,
              },
            },
          },
        },
      },
    });

    if (!asset) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Spatial asset not found.');
    }

    return asset;
  }
}

export const spatialAssetsService = new SpatialAssetsService();

// ── Controller ──
export class SpatialAssetsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const asset = await spatialAssetsService.create(req.body);
      sendCreated(res, asset, 'Spatial asset created successfully');
    } catch (err) {
      next(err);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = parsePagination(req);
      const floorId = req.query['floorId'] as string | undefined;
      const type = req.query['type'] as AssetType | undefined;
      const { spatialAssets, total } = await spatialAssetsService.findAll(
        pagination,
        floorId,
        type,
      );
      const meta = buildPaginationMeta(pagination, total);
      sendPaginated(res, spatialAssets, meta, 'Spatial assets retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const asset = await spatialAssetsService.findById(req.params['id'] as string);
      sendSuccess(res, asset, 'Spatial asset details retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const spatialAssetsController = new SpatialAssetsController();

import { requirePermission } from '../../middleware/require-permission.middleware';
import { Permission } from '../../common/authorization';

// ── Routes ──
const router = Router();
router.use(authMiddleware);

router.post(
  '/',
  validate(createSpatialAssetSchema),
  requirePermission(Permission.SPATIAL_ASSET_CREATE),
  (req, res, next) => spatialAssetsController.create(req, res, next),
);
router.get('/', requirePermission(Permission.SPATIAL_ASSET_READ), (req, res, next) =>
  spatialAssetsController.findAll(req, res, next),
);
router.get('/:id', requirePermission(Permission.SPATIAL_ASSET_READ), (req, res, next) =>
  spatialAssetsController.findById(req, res, next),
);

export const spatialAssetRoutes = router;

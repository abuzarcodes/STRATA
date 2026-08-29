import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../database/prisma/client';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { sendCreated, sendSuccess } from '../../common/responses/api-response';
import { AppError } from '../../common/errors/app-error';
import { ErrorCodes } from '../../common/errors/error-codes';

// ── Validation ──
export const createGeometryVersionSchema = z.object({
  body: z.object({
    spatialAssetId: z.string().uuid('Spatial Asset ID must be a valid UUID'),
    source: z.string().optional().default('manual'),
    status: z.string().optional().default('active'),
    geometryData: z.record(z.unknown()).optional(), // GeoJSON / 3D polyhedral representation
  }),
});

// ── Service ──
export class GeometriesService {
  async createVersion(input: z.infer<typeof createGeometryVersionSchema>['body']) {
    const asset = await prisma.spatialAsset.findUnique({
      where: { id: input.spatialAssetId },
    });

    if (!asset) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Associated spatial asset not found.');
    }

    // Determine the next sequential version number
    const latestVersion = await prisma.geometryVersion.findFirst({
      where: { spatialAssetId: input.spatialAssetId },
      orderBy: { version: 'desc' },
    });

    const nextVersion = (latestVersion?.version ?? 0) + 1;

    return prisma.geometryVersion.create({
      data: {
        spatialAssetId: input.spatialAssetId,
        version: nextVersion,
        source: input.source ?? 'manual',
        status: input.status ?? 'active',
        geometryData: (input.geometryData ?? {}) as object,
      },
    });
  }

  async getVersionsByAssetId(spatialAssetId: string) {
    return prisma.geometryVersion.findMany({
      where: { spatialAssetId },
      orderBy: { version: 'desc' },
    });
  }

  async getVersionById(id: string) {
    const version = await prisma.geometryVersion.findUnique({
      where: { id },
      include: { spatialAsset: true },
    });

    if (!version) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Geometry version not found.');
    }

    return version;
  }
}

export const geometriesService = new GeometriesService();

// ── Controller ──
export class GeometriesController {
  async createVersion(req: Request, res: Response, next: NextFunction) {
    try {
      const version = await geometriesService.createVersion(req.body);
      sendCreated(res, version, 'New geometry version registered successfully');
    } catch (err) {
      next(err);
    }
  }

  async getVersionsByAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const assetId = req.params['assetId'] as string;
      const versions = await geometriesService.getVersionsByAssetId(assetId);
      sendSuccess(res, versions, 'Geometry version history retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getVersionById(req: Request, res: Response, next: NextFunction) {
    try {
      const version = await geometriesService.getVersionById(req.params['id'] as string);
      sendSuccess(res, version, 'Geometry version details retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const geometriesController = new GeometriesController();

// ── Routes ──
const router = Router();
router.use(authMiddleware);

router.post('/versions', validate(createGeometryVersionSchema), (req, res, next) =>
  geometriesController.createVersion(req, res, next),
);
router.get('/asset/:assetId', (req, res, next) =>
  geometriesController.getVersionsByAsset(req, res, next),
);
router.get('/versions/:id', (req, res, next) =>
  geometriesController.getVersionById(req, res, next),
);

export const geometryRoutes = router;

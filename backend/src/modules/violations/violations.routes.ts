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
import { ViolationType, ViolationSeverity } from '../../common/enums';

// ── Validation ──
export const createViolationSchema = z.object({
  body: z.object({
    spatialAssetId: z.string().uuid('Spatial Asset ID must be a valid UUID'),
    type: z.nativeEnum(ViolationType).default(ViolationType.OTHER),
    severity: z.nativeEnum(ViolationSeverity).default(ViolationSeverity.MEDIUM),
    description: z.string().min(3, 'Description must be at least 3 characters'),
    details: z.record(z.unknown()).optional(),
  }),
});

// ── Service ──
export class ViolationsService {
  async create(input: z.infer<typeof createViolationSchema>['body']) {
    const asset = await prisma.spatialAsset.findUnique({ where: { id: input.spatialAssetId } });
    if (!asset) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Associated spatial asset not found.');
    }

    return prisma.violation.create({
      data: {
        spatialAssetId: input.spatialAssetId,
        type: input.type,
        severity: input.severity,
        description: input.description,
        details: (input.details ?? {}) as object,
      },
    });
  }

  async findAll(pagination = { page: 1, limit: 20 }, spatialAssetId?: string, resolved?: boolean) {
    const { skip, take } = paginationToSkipTake(pagination);
    const where = {
      ...(spatialAssetId ? { spatialAssetId } : {}),
      ...(resolved !== undefined ? { resolved } : {}),
    };

    const [total, violations] = await Promise.all([
      prisma.violation.count({ where }),
      prisma.violation.findMany({
        where,
        skip,
        take,
        include: { spatialAsset: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { violations, total };
  }

  async findById(id: string) {
    const violation = await prisma.violation.findUnique({
      where: { id },
      include: { spatialAsset: true },
    });

    if (!violation) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Violation record not found.');
    }

    return violation;
  }

  async resolve(id: string) {
    const violation = await prisma.violation.findUnique({ where: { id } });
    if (!violation) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Violation not found.');
    }

    return prisma.violation.update({
      where: { id },
      data: { resolved: true },
    });
  }
}

export const violationsService = new ViolationsService();

// ── Controller ──
export class ViolationsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const violation = await violationsService.create(req.body);
      sendCreated(res, violation, 'Spatial violation registered');
    } catch (err) {
      next(err);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = parsePagination(req);
      const assetId = req.query['spatialAssetId'] as string | undefined;
      const resolved = req.query['resolved'] ? req.query['resolved'] === 'true' : undefined;
      const { violations, total } = await violationsService.findAll(pagination, assetId, resolved);
      const meta = buildPaginationMeta(pagination, total);
      sendPaginated(res, violations, meta, 'Violations retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const violation = await violationsService.findById(req.params['id'] as string);
      sendSuccess(res, violation, 'Violation details retrieved');
    } catch (err) {
      next(err);
    }
  }

  async resolve(req: Request, res: Response, next: NextFunction) {
    try {
      const violation = await violationsService.resolve(req.params['id'] as string);
      sendSuccess(res, violation, 'Violation marked as resolved');
    } catch (err) {
      next(err);
    }
  }
}

export const violationsController = new ViolationsController();

import { requirePermission } from '../../middleware/require-permission.middleware';
import { Permission } from '../../common/authorization';

// ── Routes ──
const router = Router();
router.use(authMiddleware);

router.post(
  '/',
  validate(createViolationSchema),
  requirePermission(Permission.SPATIAL_ASSET_CREATE),
  (req, res, next) => violationsController.create(req, res, next),
);
router.get('/', requirePermission(Permission.SPATIAL_ASSET_READ), (req, res, next) =>
  violationsController.findAll(req, res, next),
);
router.get('/:id', requirePermission(Permission.SPATIAL_ASSET_READ), (req, res, next) =>
  violationsController.findById(req, res, next),
);
router.patch('/:id/resolve', requirePermission(Permission.REVIEW_APPROVE), (req, res, next) =>
  violationsController.resolve(req, res, next),
);

export const violationRoutes = router;

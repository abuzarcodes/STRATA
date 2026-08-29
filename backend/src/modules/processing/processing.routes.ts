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
import { ProcessingJobStatus } from '../../common/enums';

// ── Validation ──
export const createJobSchema = z.object({
  body: z.object({
    type: z.string().min(2, 'Job type is required (e.g. ai_extrusion, clash_detection)'),
    inputData: z.record(z.unknown()).optional(),
  }),
});

export const updateJobStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.nativeEnum(ProcessingJobStatus),
    outputData: z.record(z.unknown()).optional(),
    errorMessage: z.string().optional(),
  }),
});

// ── Service ──
export class ProcessingService {
  async createJob(input: z.infer<typeof createJobSchema>['body'], userId?: string) {
    return prisma.processingJob.create({
      data: {
        type: input.type,
        status: ProcessingJobStatus.PENDING,
        inputData: (input.inputData ?? {}) as object,
        requestedById: userId ?? null,
      },
    });
  }

  async findAll(pagination = { page: 1, limit: 20 }, status?: ProcessingJobStatus) {
    const { skip, take } = paginationToSkipTake(pagination);
    const where = status ? { status } : {};

    const [total, jobs] = await Promise.all([
      prisma.processingJob.count({ where }),
      prisma.processingJob.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { jobs, total };
  }

  async findById(id: string) {
    const job = await prisma.processingJob.findUnique({
      where: { id },
      include: { requestedBy: { select: { id: true, name: true, email: true } } },
    });

    if (!job) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Processing job not found.');
    }

    return job;
  }

  async updateJobStatus(id: string, input: z.infer<typeof updateJobStatusSchema>['body']) {
    const job = await prisma.processingJob.findUnique({ where: { id } });
    if (!job) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Processing job not found.');
    }

    return prisma.processingJob.update({
      where: { id },
      data: {
        status: input.status,
        ...(input.outputData ? { outputData: input.outputData as object } : {}),
        ...(input.errorMessage !== undefined ? { errorMessage: input.errorMessage } : {}),
      },
    });
  }
}

export const processingService = new ProcessingService();

// ── Controller ──
export class ProcessingController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await processingService.createJob(req.body, req.user?.id);
      sendCreated(res, job, 'Processing job submitted successfully');
    } catch (err) {
      next(err);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = parsePagination(req);
      const status = req.query['status'] as ProcessingJobStatus | undefined;
      const { jobs, total } = await processingService.findAll(pagination, status);
      const meta = buildPaginationMeta(pagination, total);
      sendPaginated(res, jobs, meta, 'Processing jobs list retrieved');
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await processingService.findById(req.params['id'] as string);
      sendSuccess(res, job, 'Processing job status retrieved');
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await processingService.updateJobStatus(req.params['id'] as string, req.body);
      sendSuccess(res, job, 'Processing job updated');
    } catch (err) {
      next(err);
    }
  }
}

export const processingController = new ProcessingController();

// ── Routes ──
const router = Router();
router.use(authMiddleware);

router.post('/jobs', validate(createJobSchema), (req, res, next) =>
  processingController.create(req, res, next),
);
router.get('/jobs', (req, res, next) => processingController.findAll(req, res, next));
router.get('/jobs/:id', (req, res, next) => processingController.findById(req, res, next));
router.patch('/jobs/:id/status', validate(updateJobStatusSchema), (req, res, next) =>
  processingController.updateStatus(req, res, next),
);

export const processingRoutes = router;

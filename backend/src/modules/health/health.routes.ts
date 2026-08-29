import { Router } from 'express';
import { healthController } from './health.controller';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: System health check
 *     description: Returns runtime status, uptime, and database connectivity.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: System health diagnostics
 */
router.get('/', (req, res, next) => healthController.getHealth(req, res, next));

export const healthRoutes = router;

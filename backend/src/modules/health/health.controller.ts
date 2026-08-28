import { Request, Response, NextFunction } from 'express';
import { healthService } from './health.service';
import { sendSuccess } from '../../common/responses/api-response';

export class HealthController {
  async getHealth(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const health = await healthService.getHealth();
      sendSuccess(res, health, 'STRATA Backend Service Status');
    } catch (error) {
      next(error);
    }
  }
}

export const healthController = new HealthController();

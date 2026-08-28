import { prisma } from '../../database/prisma/client';

export interface HealthCheckResult {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  database: {
    status: 'connected' | 'disconnected' | 'unknown';
    latencyMs?: number;
  };
}

export class HealthService {
  async getHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    let dbStatus: 'connected' | 'disconnected' | 'unknown' = 'unknown';
    let latencyMs: number | undefined;

    try {
      // Execute lightweight query to check PostGIS/PostgreSQL connectivity
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
      latencyMs = Date.now() - startTime;
    } catch {
      dbStatus = 'disconnected';
    }

    const overallStatus: 'ok' | 'degraded' | 'error' = dbStatus === 'connected' ? 'ok' : 'degraded';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env['NODE_ENV'] || 'development',
      database: {
        status: dbStatus,
        ...(latencyMs !== undefined ? { latencyMs } : {}),
      },
    };
  }
}

export const healthService = new HealthService();

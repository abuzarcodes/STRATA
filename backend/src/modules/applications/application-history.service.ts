import { prisma } from '../../database/prisma/client';
import { ApplicationStatus } from '../../common/enums';
import { ApplicationStatusHistorySummary } from './applications.types';

export class ApplicationHistoryService {
  /**
   * Record an application status transition entry in the history table.
   * Can accept a Prisma transaction client if part of a transaction.
   */
  async recordTransition(
    applicationId: string,
    fromStatus: ApplicationStatus,
    toStatus: ApplicationStatus,
    changedById: string,
    reason?: string | null,
    tx: typeof prisma | Parameters<Parameters<typeof prisma.$transaction>[0]>[0] = prisma,
  ): Promise<ApplicationStatusHistorySummary> {
    const entry = await tx.applicationStatusHistory.create({
      data: {
        applicationId,
        fromStatus,
        toStatus,
        changedById,
        reason: reason ?? null,
      },
      include: {
        changedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return entry as unknown as ApplicationStatusHistorySummary;
  }

  /**
   * Get chronological history of transitions for an application.
   */
  async findByApplication(applicationId: string): Promise<ApplicationStatusHistorySummary[]> {
    const history = await prisma.applicationStatusHistory.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'asc' },
      include: {
        changedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return history as unknown as ApplicationStatusHistorySummary[];
  }
}

export const applicationHistoryService = new ApplicationHistoryService();

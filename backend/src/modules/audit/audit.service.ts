import { prisma } from '../../database/prisma/client';
import { AuditAction } from '../../common/enums';

export interface AuditEntry {
  action: AuditAction | string;
  entityType: string;
  entityId: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export class AuditService {
  /**
   * Asynchronously record an audit log entry without blocking the main workflow.
   */
  async log(entry: AuditEntry): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId,
          userId: entry.userId ?? null,
          metadata: (entry.metadata ?? {}) as object,
        },
      });
    } catch (error) {
      // Non-blocking logging failure
      // eslint-disable-next-line no-console
      console.error('Failed to write audit log entry:', error);
    }
  }

  async findByEntity(entityType: string, entityId: string) {
    return prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }
}

export const auditService = new AuditService();

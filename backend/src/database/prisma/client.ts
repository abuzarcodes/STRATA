import { PrismaClient } from '@prisma/client';
import { env } from '../../config/env';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

/**
 * Singleton Prisma Client instance.
 * Reuses the same connection pool in development to avoid exhausting connections on hot-reload.
 */
export const prisma: PrismaClient =
  globalThis.__prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

/**
 * Cleanly disconnect Prisma during application shutdown
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}

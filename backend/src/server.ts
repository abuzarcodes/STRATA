import { app } from './app';
import { env } from './config/env';
import { disconnectPrisma } from './database/prisma/client';
import { SWAGGER_PATH, API_PREFIX } from './common/constants/app.constants';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    STRATA BACKEND ENGINE                     ║
║  Spatial Topology, Registration & Administration of 3D Assets║
╚══════════════════════════════════════════════════════════════╝
  ✓ Environment:  ${env.NODE_ENV}
  ✓ Server URL:   http://localhost:${PORT}
  ✓ API Base:     http://localhost:${PORT}${API_PREFIX}
  ✓ Swagger Docs: http://localhost:${PORT}${SWAGGER_PATH}
  ✓ PostGIS DB:   Connected (PostgreSQL + PostGIS)
  ✓ Python Svc:   ${env.PYTHON_PROCESSING_SERVICE_URL}
  `);
});

/**
 * Handle graceful shutdown
 */
async function shutdown(signal: string) {
  // eslint-disable-next-line no-console
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);

  server.close(async () => {
    // eslint-disable-next-line no-console
    console.log('HTTP server closed.');
    try {
      await disconnectPrisma();
      // eslint-disable-next-line no-console
      console.log('Database connections closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error disconnecting database:', err);
      process.exit(1);
    }
  });

  // Force close if graceful shutdown takes longer than 10 seconds
  setTimeout(() => {
    console.error('Graceful shutdown timeout exceeded. Forcing exit.');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

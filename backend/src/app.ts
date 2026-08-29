import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { API_PREFIX, SWAGGER_PATH } from './common/constants/app.constants';
import { swaggerSpec } from './config/swagger';
import { apiRoutes } from './routes';
import { notFoundMiddleware } from './middleware/not-found.middleware';
import { errorMiddleware } from './middleware/error.middleware';

/**
 * Express application factory and configuration.
 * Separated from server.ts so it can be imported and tested cleanly by Supertest.
 */
export function createApp(): Express {
  const app = express();

  // ── 1. Security Middleware ──
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // ── 2. Request Parsing ──
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ── 3. HTTP Request Logging ──
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  // ── 4. API Documentation (Swagger / OpenAPI) ──
  app.use(SWAGGER_PATH, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // ── 5. Domain API Routes ──
  app.use(API_PREFIX, apiRoutes);

  // ── 6. Root status endpoint ──
  app.get('/', (_req, res) => {
    res.json({
      name: 'STRATA Backend API',
      version: '1.0.0',
      status: 'operational',
      docs: SWAGGER_PATH,
      endpoints: `${API_PREFIX}`,
    });
  });

  // ── 7. 404 & Global Error Handling ──
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

export const app = createApp();

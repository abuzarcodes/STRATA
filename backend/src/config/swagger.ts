import swaggerJsdoc from 'swagger-jsdoc';
import { API_PREFIX } from '../common/constants/app.constants';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'STRATA API',
      version: '1.0.0',
      description:
        'Spatial Topology, Registration and Administration of Three-dimensional Assets — Backend API & Orchestration Layer',
      contact: {
        name: 'STRATA Platform Team',
      },
    },
    servers: [
      {
        url: API_PREFIX,
        description: 'Primary API Version 1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: {
                    type: 'object',
                    properties: {
                      code: { type: 'string', example: 'UNAUTHORIZED' },
                      message: { type: 'string', example: 'Authentication required' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.dto.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

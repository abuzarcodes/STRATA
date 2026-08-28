import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env file in non-production environments
dotenv.config();

/**
 * Environment variable schema.
 * Validated at import time — app crashes immediately if invalid.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  PORT: z.coerce.number().int().positive().default(3001),

  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),

  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters for security'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  PYTHON_PROCESSING_SERVICE_URL: z
    .string()
    .url('PYTHON_PROCESSING_SERVICE_URL must be a valid URL')
    .default('http://localhost:8000'),

  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

/**
 * Validated and typed environment configuration.
 * This is the ONLY place that reads process.env.
 * All other files import from here.
 */
function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  ✗ ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    // eslint-disable-next-line no-console
    console.error('╔══════════════════════════════════════════════════╗');
    // eslint-disable-next-line no-console
    console.error('║   ENVIRONMENT VALIDATION FAILED                  ║');
    // eslint-disable-next-line no-console
    console.error('╚══════════════════════════════════════════════════╝');
    // eslint-disable-next-line no-console
    console.error('\nMissing or invalid environment variables:\n');
    // eslint-disable-next-line no-console
    console.error(formatted);
    // eslint-disable-next-line no-console
    console.error('\nSee .env.example for required configuration.\n');

    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();

export type Env = z.infer<typeof envSchema>;

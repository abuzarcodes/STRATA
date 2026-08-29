import { env } from './env';

export const pythonServiceConfig = {
  /** Base URL of the Python/FastAPI processing service */
  baseUrl: env.PYTHON_PROCESSING_SERVICE_URL,

  /** Default request timeout in milliseconds */
  timeoutMs: 30_000,
} as const;

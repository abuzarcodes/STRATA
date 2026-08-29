import { Request, Response } from 'express';
import { sendError } from '../common/responses/api-response';
import { ErrorCodes } from '../common/errors/error-codes';

/**
 * Catch-all handler for unmatched routes.
 * Must be registered AFTER all route handlers and BEFORE the error middleware.
 */
export function notFoundMiddleware(_req: Request, res: Response): void {
  sendError(
    res,
    404,
    ErrorCodes.NOT_FOUND,
    `The requested endpoint ${_req.method} ${_req.originalUrl} does not exist.`,
  );
}

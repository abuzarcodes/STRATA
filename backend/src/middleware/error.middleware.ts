import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AppError } from '../common/errors/app-error';
import { ErrorCodes } from '../common/errors/error-codes';
import { sendError } from '../common/responses/api-response';
import { env } from '../config/env';

/**
 * Global error handling middleware.
 * Must be registered LAST in the middleware chain.
 *
 * Handles:
 * - AppError (custom operational errors)
 * - ZodError (validation errors)
 * - Prisma known errors (unique constraint, not found)
 * - JWT errors (expired, malformed)
 * - Unknown errors (500 with generic message)
 */
export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // ── Custom Application Error ──
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.code, err.message);
    return;
  }

  // ── Zod Validation Error ──
  if (err instanceof ZodError) {
    const messages = err.issues.map((issue) => {
      const path = issue.path.join('.');
      return path ? `${path}: ${issue.message}` : issue.message;
    });

    sendError(res, 400, ErrorCodes.VALIDATION_ERROR, messages.join('; '));
    return;
  }

  // ── Prisma Errors ──
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        // Unique constraint violation
        const target = (err.meta?.['target'] as string[])?.join(', ') ?? 'field';
        sendError(res, 409, ErrorCodes.CONFLICT, `A record with this ${target} already exists.`);
        return;
      }
      case 'P2025': {
        // Record not found
        sendError(res, 404, ErrorCodes.RESOURCE_NOT_FOUND, 'The requested resource was not found.');
        return;
      }
      default:
        break;
    }
  }

  // ── JWT Errors ──
  if (err instanceof TokenExpiredError) {
    sendError(res, 401, ErrorCodes.UNAUTHORIZED, 'Token has expired. Please log in again.');
    return;
  }

  if (err instanceof JsonWebTokenError) {
    sendError(res, 401, ErrorCodes.UNAUTHORIZED, 'Invalid token. Please log in again.');
    return;
  }

  // ── Unknown / Unexpected Error ──
  // Log full error in all environments for debugging
  console.error('Unhandled error:', err);

  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected internal error occurred.'
      : err.message || 'An unexpected internal error occurred.';

  sendError(res, 500, ErrorCodes.INTERNAL_ERROR, message);
}

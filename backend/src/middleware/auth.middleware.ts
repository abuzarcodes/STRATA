import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';
import { AppError } from '../common/errors/app-error';
import { ErrorCodes } from '../common/errors/error-codes';
import { Role } from '../common/enums';

interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

/**
 * JWT authentication middleware.
 * Verifies the Bearer token from the Authorization header
 * and attaches the decoded user to req.user.
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        401,
        ErrorCodes.UNAUTHORIZED,
        'Authentication required. Please provide a valid token.',
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError(
        401,
        ErrorCodes.UNAUTHORIZED,
        'Authentication required. Please provide a valid token.',
      );
    }

    const decoded = jwt.verify(token, authConfig.jwtSecret) as JwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    // jwt.verify throws JsonWebTokenError or TokenExpiredError
    // These are handled by the global error middleware
    next(error);
  }
}

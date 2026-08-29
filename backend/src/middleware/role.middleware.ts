import { Request, Response, NextFunction } from 'express';
import { Role } from '../common/enums';
import { AppError } from '../common/errors/app-error';
import { ErrorCodes } from '../common/errors/error-codes';

/**
 * Role-based authorization middleware factory.
 *
 * Usage:
 *   router.get('/admin-only', authMiddleware, requireRole(Role.ADMIN), controller);
 *   router.get('/staff', authMiddleware, requireRole(Role.ADMIN, Role.REVIEWER), controller);
 *
 * Must be used AFTER authMiddleware (req.user must exist).
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          ErrorCodes.FORBIDDEN,
          'You do not have permission to perform this action.',
        ),
      );
    }

    next();
  };
}

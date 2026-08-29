import { Request, Response, NextFunction } from 'express';
import { Permission, authorizationService } from '../common/authorization';
import { AppError } from '../common/errors/app-error';
import { ErrorCodes } from '../common/errors/error-codes';

/**
 * Permission-based authorization middleware factory.
 *
 * Checks that the authenticated user's role has ALL of the required permissions.
 * Must be used AFTER authMiddleware (req.user must exist).
 *
 * Usage:
 *   router.post('/parcels', authMiddleware, requirePermission(Permission.PARCEL_CREATE), controller.create);
 *   router.patch('/projects/:id', authMiddleware, requirePermission(Permission.PROJECT_UPDATE), controller.update);
 */
export function requirePermission(...requiredPermissions: Permission[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required.'));
    }

    const { role } = req.user;

    for (const permission of requiredPermissions) {
      if (!authorizationService.hasPermission(role, permission)) {
        return next(
          new AppError(
            403,
            ErrorCodes.INSUFFICIENT_PERMISSION,
            'You do not have permission to perform this action.',
          ),
        );
      }
    }

    next();
  };
}

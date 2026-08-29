import { Request, Response, NextFunction } from 'express';
import { Permission, authorizationService } from '../common/authorization';
import { AppError } from '../common/errors/app-error';
import { ErrorCodes } from '../common/errors/error-codes';

/**
 * Permission-based authorization middleware factory for OR logic.
 *
 * Checks that the authenticated user's role has AT LEAST ONE of the specified permissions.
 * Must be used AFTER authMiddleware (req.user must exist).
 *
 * Usage:
 *   router.get('/applications', authMiddleware, requireAnyPermission(Permission.APPLICATION_READ, Permission.APPLICATION_READ_ALL), controller.findAll);
 */
export function requireAnyPermission(...allowedPermissions: Permission[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required.'));
    }

    const { role } = req.user;

    const hasAny = allowedPermissions.some((permission) =>
      authorizationService.hasPermission(role, permission),
    );

    if (!hasAny) {
      return next(
        new AppError(
          403,
          ErrorCodes.INSUFFICIENT_PERMISSION,
          'You do not have permission to perform this action.',
        ),
      );
    }

    next();
  };
}

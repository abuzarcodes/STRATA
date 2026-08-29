import { Request, Response, NextFunction } from 'express';
import { authorizationService, ProjectAccessOptions } from '../common/authorization';
import { Role } from '../common/enums';
import { AppError } from '../common/errors/app-error';
import { ErrorCodes } from '../common/errors/error-codes';

/**
 * Project access authorization middleware factory.
 *
 * Ensures the authenticated user can access the project referenced in the request.
 * Access is granted if the user is ADMIN, the project owner, or assigned to the project.
 *
 * Must be used AFTER authMiddleware (req.user must exist).
 *
 * The projectId is resolved from (in order):
 *   1. req.params[options.projectIdParam] (defaults to 'projectId')
 *   2. req.params.id (fallback)
 *   3. req.body.projectId (if options.checkBody is true)
 *
 * Usage:
 *   router.patch('/projects/:id', authMiddleware, requirePermission(...), requireProjectAccess(), controller.update);
 *   router.post('/parcels', authMiddleware, requirePermission(...), requireProjectAccess({ checkBody: true }), controller.create);
 */
export function requireProjectAccess(options: ProjectAccessOptions = {}) {
  const { projectIdParam = 'projectId', checkBody = false } = options;

  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Authentication required.');
      }

      // ADMIN bypasses project access checks
      if (req.user.role === Role.ADMIN) {
        return next();
      }

      // Resolve projectId from params or body
      const projectId =
        (req.params[projectIdParam] as string | undefined) ??
        (req.params['id'] as string | undefined) ??
        (checkBody ? (req.body?.projectId as string | undefined) : undefined);

      if (!projectId) {
        throw new AppError(
          400,
          ErrorCodes.VALIDATION_ERROR,
          'Project ID is required for access verification.',
        );
      }

      const canAccess = await authorizationService.canAccessProject(
        req.user.id,
        req.user.role,
        projectId,
      );

      if (!canAccess) {
        throw new AppError(
          403,
          ErrorCodes.PROJECT_ACCESS_DENIED,
          'You do not have access to this project.',
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

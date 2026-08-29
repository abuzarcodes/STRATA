import { Role } from '../enums';

/**
 * Context for authorization checks extracted from request.
 */
export interface AuthorizationContext {
  userId: string;
  role: Role;
}

/**
 * Options for project access checks.
 */
export interface ProjectAccessOptions {
  /** Parameter name to extract projectId from. Defaults to 'projectId', falls back to 'id'. */
  projectIdParam?: string;
  /** If true, also checks req.body.projectId when param is not found. */
  checkBody?: boolean;
}

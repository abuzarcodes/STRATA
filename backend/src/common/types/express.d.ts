/* eslint-disable @typescript-eslint/no-namespace */
import { Role } from '../common/enums';

/**
 * Augment Express Request to include authenticated user payload.
 * After the auth middleware verifies a JWT, req.user is populated.
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}

import { Router } from 'express';
import { usersController } from './users.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/require-permission.middleware';
import { validate } from '../../middleware/validate.middleware';
import { Permission } from '../../common/authorization';
import { updateRoleSchema, toggleActiveSchema, getUserSchema } from './users.validation';

const router = Router();

// All user management routes require authentication
router.use(authMiddleware);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated users list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 */
router.get('/', requirePermission(Permission.USER_READ), (req, res, next) =>
  usersController.findAll(req, res, next),
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 *       404:
 *         description: User not found
 */
router.get(
  '/:id',
  validate(getUserSchema),
  requirePermission(Permission.USER_READ),
  (req, res, next) => usersController.findById(req, res, next),
);

/**
 * @openapi
 * /users/{id}/role:
 *   patch:
 *     summary: Update user role (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, PROPERTY_OWNER, SURVEYOR, REVIEWER, REGISTRATION_OFFICER]
 *     responses:
 *       200:
 *         description: User role updated
 *       400:
 *         description: Validation error or cannot change own role
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 *       404:
 *         description: User not found
 */
router.patch(
  '/:id/role',
  validate(updateRoleSchema),
  requirePermission(Permission.USER_MANAGE),
  (req, res, next) => usersController.updateRole(req, res, next),
);

/**
 * @openapi
 * /users/{id}/active:
 *   patch:
 *     summary: Toggle user active state (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isActive]
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User activation status updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 *       404:
 *         description: User not found
 */
router.patch(
  '/:id/active',
  validate(toggleActiveSchema),
  requirePermission(Permission.USER_MANAGE),
  (req, res, next) => usersController.toggleActive(req, res, next),
);

export const userRoutes = router;

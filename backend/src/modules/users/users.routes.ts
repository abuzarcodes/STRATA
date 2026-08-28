import { Router } from 'express';
import { usersController } from './users.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { Role } from '../../common/enums';

const router = Router();

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
 */
router.get('/', authMiddleware, requireRole(Role.ADMIN), (req, res, next) =>
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
 */
router.get('/:id', authMiddleware, (req, res, next) => usersController.findById(req, res, next));

export const userRoutes = router;

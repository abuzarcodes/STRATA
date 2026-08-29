import { Router } from 'express';
import { assignmentsController } from './assignments.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/require-permission.middleware';
import { requireProjectAccess } from '../../middleware/require-project-access.middleware';
import { validate } from '../../middleware/validate.middleware';
import { Permission } from '../../common/authorization';
import {
  createAssignmentSchema,
  getAssignmentsSchema,
  deleteAssignmentSchema,
} from './assignments.validation';

const router = Router({ mergeParams: true });

// All assignment routes require authentication
router.use(authMiddleware);

/**
 * @openapi
 * /projects/{projectId}/assignments:
 *   post:
 *     summary: Assign a user to a project (Admin only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, assignmentRole]
 *             properties:
 *               userId:
 *                 type: string
 *               assignmentRole:
 *                 type: string
 *                 enum: [SURVEYOR, REVIEWER, REGISTRATION_OFFICER]
 *     responses:
 *       201:
 *         description: User assigned to project
 *       400:
 *         description: Validation error or role mismatch
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 *       404:
 *         description: Project or user not found
 *       409:
 *         description: Duplicate assignment
 */
router.post(
  '/',
  validate(createAssignmentSchema),
  requirePermission(Permission.PROJECT_ASSIGN),
  (req, res, next) => assignmentsController.create(req, res, next),
);

/**
 * @openapi
 * /projects/{projectId}/assignments:
 *   get:
 *     summary: List all user assignments for a project
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Paginated project assignments list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission or project access denied
 *       404:
 *         description: Project not found
 */
router.get(
  '/',
  validate(getAssignmentsSchema),
  requirePermission(Permission.PROJECT_READ),
  requireProjectAccess(),
  (req, res, next) => assignmentsController.findByProject(req, res, next),
);

/**
 * @openapi
 * /projects/{projectId}/assignments/{assignmentId}:
 *   delete:
 *     summary: Remove a user assignment from a project (Admin only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project assignment removed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 *       404:
 *         description: Assignment not found
 */
router.delete(
  '/:assignmentId',
  validate(deleteAssignmentSchema),
  requirePermission(Permission.PROJECT_ASSIGN),
  (req, res, next) => assignmentsController.delete(req, res, next),
);

export const assignmentRoutes = router;

import { Router } from 'express';
import { projectsController } from './projects.controller';
import { assignmentRoutes } from '../assignments/assignments.routes';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/require-permission.middleware';
import { requireProjectAccess } from '../../middleware/require-project-access.middleware';
import { validate } from '../../middleware/validate.middleware';
import { Permission } from '../../common/authorization';
import { createProjectSchema, updateProjectSchema, getProjectSchema } from './projects.validation';

const router = Router();

// All project routes require authentication
router.use(authMiddleware);

// Mount nested assignment sub-routes: /projects/:projectId/assignments
router.use('/:projectId/assignments', assignmentRoutes);

/**
 * @openapi
 * /projects:
 *   post:
 *     summary: Create a new project (Surveyor & Admin)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 */
router.post(
  '/',
  validate(createProjectSchema),
  requirePermission(Permission.PROJECT_CREATE),
  (req, res, next) => projectsController.create(req, res, next),
);

/**
 * @openapi
 * /projects:
 *   get:
 *     summary: List accessible projects (owned/assigned for users, all for Admin)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paginated projects list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 */
router.get('/', requirePermission(Permission.PROJECT_READ), (req, res, next) =>
  projectsController.findAll(req, res, next),
);

/**
 * @openapi
 * /projects/{id}:
 *   get:
 *     summary: Get project by ID with full spatial hierarchy and assignments
 *     tags: [Projects]
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
 *         description: Project hierarchy details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Project access denied or insufficient permission
 *       404:
 *         description: Project not found
 */
router.get(
  '/:id',
  validate(getProjectSchema),
  requirePermission(Permission.PROJECT_READ),
  requireProjectAccess(),
  (req, res, next) => projectsController.findById(req, res, next),
);

/**
 * @openapi
 * /projects/{id}:
 *   patch:
 *     summary: Update project metadata
 *     tags: [Projects]
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
 *         description: Project updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Project access denied or insufficient permission
 *       404:
 *         description: Project not found
 */
router.patch(
  '/:id',
  validate(updateProjectSchema),
  requirePermission(Permission.PROJECT_UPDATE),
  requireProjectAccess(),
  (req, res, next) => projectsController.update(req, res, next),
);

/**
 * @openapi
 * /projects/{id}:
 *   delete:
 *     summary: Delete project (Admin only)
 *     tags: [Projects]
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
 *         description: Project deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 *       404:
 *         description: Project not found
 */
router.delete(
  '/:id',
  validate(getProjectSchema),
  requirePermission(Permission.PROJECT_DELETE),
  requireProjectAccess(),
  (req, res, next) => projectsController.delete(req, res, next),
);

/**
 * @openapi
 * /projects/{id}/activate:
 *   post:
 *     summary: Activate an INITIALIZED project (Admin only; requires >=1 SURVEYOR assigned)
 *     tags: [Projects]
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
 *         description: Project activated successfully
 *       400:
 *         description: Project not in INITIALIZED status or no SURVEYOR assigned
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 *       404:
 *         description: Project not found
 */
router.post(
  '/:id/activate',
  validate(getProjectSchema),
  requirePermission(Permission.PROJECT_ACTIVATE),
  (req, res, next) => projectsController.activate(req, res, next),
);

export const projectRoutes = router;

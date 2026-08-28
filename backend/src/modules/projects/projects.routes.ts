import { Router } from 'express';
import { projectsController } from './projects.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createProjectSchema, updateProjectSchema, getProjectSchema } from './projects.validation';

const router = Router();

// All project routes require authentication
router.use(authMiddleware);

/**
 * @openapi
 * /projects:
 *   post:
 *     summary: Create a new project
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
 */
router.post('/', validate(createProjectSchema), (req, res, next) =>
  projectsController.create(req, res, next),
);

/**
 * @openapi
 * /projects:
 *   get:
 *     summary: List user projects (or all projects if Admin)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paginated projects list
 */
router.get('/', (req, res, next) => projectsController.findAll(req, res, next));

/**
 * @openapi
 * /projects/{id}:
 *   get:
 *     summary: Get project by ID with full spatial hierarchy
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
 */
router.get('/:id', validate(getProjectSchema), (req, res, next) =>
  projectsController.findById(req, res, next),
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
 */
router.patch('/:id', validate(updateProjectSchema), (req, res, next) =>
  projectsController.update(req, res, next),
);

/**
 * @openapi
 * /projects/{id}:
 *   delete:
 *     summary: Delete project
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
 */
router.delete('/:id', validate(getProjectSchema), (req, res, next) =>
  projectsController.delete(req, res, next),
);

export const projectRoutes = router;

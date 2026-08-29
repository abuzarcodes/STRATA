import { Router } from 'express';
import { applicationsController } from './applications.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/require-permission.middleware';
import { requireAnyPermission } from '../../middleware/require-any-permission.middleware';
import { validate } from '../../middleware/validate.middleware';
import { Permission } from '../../common/authorization';
import {
  createApplicationSchema,
  updateApplicationSchema,
  getApplicationSchema,
  requestInfoSchema,
  rejectApplicationSchema,
  createCommentSchema,
  listApplicationsQuerySchema,
} from './applications.validation';

const router = Router();

// All application routes require authentication
router.use(authMiddleware);

/**
 * @openapi
 * /applications:
 *   post:
 *     summary: Create a new Property Application draft
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyName:
 *                 type: string
 *               propertyType:
 *                 type: string
 *                 enum: [RESIDENTIAL, COMMERCIAL, INDUSTRIAL, MIXED_USE, GOVERNMENT, OTHER]
 *               description:
 *                 type: string
 *               addressLine1:
 *                 type: string
 *               locality:
 *                 type: string
 *               city:
 *                 type: string
 *               district:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               declaredArea:
 *                 type: number
 *               declaredBuildingCount:
 *                 type: integer
 *               declaredFloorCount:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Property Application draft created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 */
router.post(
  '/',
  validate(createApplicationSchema),
  requirePermission(Permission.APPLICATION_CREATE),
  (req, res, next) => applicationsController.create(req, res, next),
);

/**
 * @openapi
 * /applications:
 *   get:
 *     summary: List applications (Property Owner sees own; Admin sees all)
 *     tags: [Applications]
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, SUBMITTED, UNDER_REVIEW, REQUIRES_INFORMATION, APPROVED, REJECTED, CANCELLED]
 *       - in: query
 *         name: propertyType
 *         schema:
 *           type: string
 *           enum: [RESIDENTIAL, COMMERCIAL, INDUSTRIAL, MIXED_USE, GOVERNMENT, OTHER]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated applications list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 */
router.get(
  '/',
  validate(listApplicationsQuerySchema),
  requireAnyPermission(Permission.APPLICATION_READ, Permission.APPLICATION_READ_ALL),
  (req, res, next) => applicationsController.findAll(req, res, next),
);

/**
 * @openapi
 * /applications/{id}:
 *   get:
 *     summary: Get single application details
 *     tags: [Applications]
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
 *         description: Application details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied or insufficient permission
 *       404:
 *         description: Application not found
 */
router.get(
  '/:id',
  validate(getApplicationSchema),
  requirePermission(Permission.APPLICATION_READ),
  (req, res, next) => applicationsController.findById(req, res, next),
);

/**
 * @openapi
 * /applications/{id}:
 *   patch:
 *     summary: Update application details (allowed in DRAFT or REQUIRES_INFORMATION)
 *     tags: [Applications]
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
 *     responses:
 *       200:
 *         description: Application updated
 *       400:
 *         description: Invalid state for update or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Application not found
 */
router.patch(
  '/:id',
  validate(updateApplicationSchema),
  requirePermission(Permission.APPLICATION_UPDATE),
  (req, res, next) => applicationsController.update(req, res, next),
);

/**
 * @openapi
 * /applications/{id}/submit:
 *   post:
 *     summary: Submit property application for review (DRAFT/REQUIRES_INFORMATION -> SUBMITTED)
 *     tags: [Applications]
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
 *         description: Application submitted
 *       400:
 *         description: Validation error or invalid application state
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Application not found
 */
router.post(
  '/:id/submit',
  validate(getApplicationSchema),
  requirePermission(Permission.APPLICATION_SUBMIT),
  (req, res, next) => applicationsController.submit(req, res, next),
);

/**
 * @openapi
 * /applications/{id}/start-review:
 *   post:
 *     summary: Start administrative review (Admin only; SUBMITTED -> UNDER_REVIEW)
 *     tags: [Applications]
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
 *         description: Review started
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 *       404:
 *         description: Application not found
 *       409:
 *         description: Invalid application state
 */
router.post(
  '/:id/start-review',
  validate(getApplicationSchema),
  requirePermission(Permission.APPLICATION_START_REVIEW),
  (req, res, next) => applicationsController.startReview(req, res, next),
);

/**
 * @openapi
 * /applications/{id}/request-information:
 *   post:
 *     summary: Request additional information from applicant (Admin only; UNDER_REVIEW -> REQUIRES_INFORMATION)
 *     tags: [Applications]
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
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Information requested
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 *       404:
 *         description: Application not found
 *       409:
 *         description: Invalid application state
 */
router.post(
  '/:id/request-information',
  validate(requestInfoSchema),
  requirePermission(Permission.APPLICATION_REQUEST_INFORMATION),
  (req, res, next) => applicationsController.requestInformation(req, res, next),
);

/**
 * @openapi
 * /applications/{id}/approve:
 *   post:
 *     summary: Approve application (Admin only; UNDER_REVIEW -> APPROVED)
 *     tags: [Applications]
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
 *         description: Application approved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 *       404:
 *         description: Application not found
 *       409:
 *         description: Invalid application state
 */
router.post(
  '/:id/approve',
  validate(getApplicationSchema),
  requirePermission(Permission.APPLICATION_APPROVE),
  (req, res, next) => applicationsController.approve(req, res, next),
);

/**
 * @openapi
 * /applications/{id}/reject:
 *   post:
 *     summary: Reject application (Admin only; UNDER_REVIEW -> REJECTED)
 *     tags: [Applications]
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
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application rejected
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 *       404:
 *         description: Application not found
 *       409:
 *         description: Invalid application state
 */
router.post(
  '/:id/reject',
  validate(rejectApplicationSchema),
  requirePermission(Permission.APPLICATION_REJECT),
  (req, res, next) => applicationsController.reject(req, res, next),
);

/**
 * @openapi
 * /applications/{id}/cancel:
 *   post:
 *     summary: Cancel application (Owner only; DRAFT/SUBMITTED/REQUIRES_INFORMATION -> CANCELLED)
 *     tags: [Applications]
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
 *         description: Application cancelled
 *       400:
 *         description: Invalid application state for cancellation
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Application not found
 */
router.post(
  '/:id/cancel',
  validate(getApplicationSchema),
  requirePermission(Permission.APPLICATION_CANCEL),
  (req, res, next) => applicationsController.cancel(req, res, next),
);

/**
 * @openapi
 * /applications/{id}/initialize-project:
 *   post:
 *     summary: Initialize a technical Project workspace from an approved application (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Project initialized
 *       400:
 *         description: Application not approved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permission
 *       404:
 *         description: Application not found
 *       409:
 *         description: Project already initialized
 */
router.post(
  '/:id/initialize-project',
  validate(getApplicationSchema),
  requirePermission(Permission.APPLICATION_INITIALIZE_PROJECT),
  (req, res, next) => applicationsController.initializeProject(req, res, next),
);

/**
 * @openapi
 * /applications/{id}/comments:
 *   post:
 *     summary: Add a comment to an application
 *     tags: [Applications]
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
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Application not found
 */
router.post(
  '/:id/comments',
  validate(createCommentSchema),
  requirePermission(Permission.APPLICATION_COMMENT),
  (req, res, next) => applicationsController.createComment(req, res, next),
);

/**
 * @openapi
 * /applications/{id}/comments:
 *   get:
 *     summary: List comments for an application
 *     tags: [Applications]
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
 *         description: Application comments list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Application not found
 */
router.get(
  '/:id/comments',
  validate(getApplicationSchema),
  requirePermission(Permission.APPLICATION_READ),
  (req, res, next) => applicationsController.findComments(req, res, next),
);

/**
 * @openapi
 * /applications/{id}/history:
 *   get:
 *     summary: Get status history for an application
 *     tags: [Applications]
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
 *         description: Application status history list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Application not found
 */
router.get(
  '/:id/history',
  validate(getApplicationSchema),
  requirePermission(Permission.APPLICATION_READ),
  (req, res, next) => applicationsController.findHistory(req, res, next),
);

export const applicationRoutes = router;

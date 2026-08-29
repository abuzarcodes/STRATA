import { Router } from 'express';
import { healthRoutes } from '../modules/health/health.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { userRoutes } from '../modules/users/users.routes';
import { projectRoutes } from '../modules/projects/projects.routes';
import { parcelRoutes } from '../modules/parcels/parcels.routes';
import { buildingRoutes } from '../modules/buildings/buildings.routes';
import { floorRoutes } from '../modules/floors/floors.routes';
import { spatialAssetRoutes } from '../modules/spatial-assets/spatial-assets.routes';
import { geometryRoutes } from '../modules/geometries/geometries.routes';
import { processingRoutes } from '../modules/processing/processing.routes';
import { violationRoutes } from '../modules/violations/violations.routes';
import { applicationRoutes } from '../modules/applications/applications.routes';

const router = Router();

// Register all modular domain routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/applications', applicationRoutes);
router.use('/projects', projectRoutes);
router.use('/parcels', parcelRoutes);
router.use('/buildings', buildingRoutes);
router.use('/floors', floorRoutes);
router.use('/spatial-assets', spatialAssetRoutes);
router.use('/geometries', geometryRoutes);
router.use('/processing', processingRoutes);
router.use('/violations', violationRoutes);

export const apiRoutes = router;

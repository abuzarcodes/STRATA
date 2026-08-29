import { prisma } from '../../database/prisma/client';
import { Role } from '../enums';
import { Permission } from './permissions';
import { ROLE_PERMISSIONS } from './role-permissions';

/**
 * Centralized authorization service.
 *
 * Provides reusable methods for permission checks, ownership verification,
 * and project assignment queries. Used by middleware and services — never
 * duplicate this logic in controllers.
 */
export class AuthorizationService {
  /**
   * Check whether a role has a specific permission.
   */
  hasPermission(role: Role, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    return permissions ? permissions.has(permission) : false;
  }

  /**
   * Check whether the user owns the specified project.
   */
  async isProjectOwner(userId: string, projectId: string): Promise<boolean> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    });

    return project?.ownerId === userId;
  }

  /**
   * Check whether the user is explicitly assigned to the specified project.
   */
  async isAssignedToProject(userId: string, projectId: string): Promise<boolean> {
    const assignment = await prisma.projectAssignment.findUnique({
      where: { userId_projectId: { userId, projectId } },
      select: { id: true },
    });

    return assignment !== null;
  }

  /**
   * Check whether the user can access a project.
   *
   * Access is granted if:
   * 1. User is ADMIN (always)
   * 2. User owns the project
   * 3. User is assigned to the project
   */
  async canAccessProject(userId: string, role: Role, projectId: string): Promise<boolean> {
    if (role === Role.ADMIN) {
      return true;
    }

    const [isOwner, isAssigned] = await Promise.all([
      this.isProjectOwner(userId, projectId),
      this.isAssignedToProject(userId, projectId),
    ]);

    return isOwner || isAssigned;
  }

  /**
   * Resolve the project ID from a child resource (e.g., parcel, building).
   * Traverses the hierarchy: Building → Parcel → Project, etc.
   *
   * Returns null if the resource or its parent chain is not found.
   */
  async resolveProjectIdFromParcel(parcelId: string): Promise<string | null> {
    const parcel = await prisma.parcel.findUnique({
      where: { id: parcelId },
      select: { projectId: true },
    });
    return parcel?.projectId ?? null;
  }

  async resolveProjectIdFromBuilding(buildingId: string): Promise<string | null> {
    const building = await prisma.building.findUnique({
      where: { id: buildingId },
      select: { parcel: { select: { projectId: true } } },
    });
    return building?.parcel?.projectId ?? null;
  }

  async resolveProjectIdFromFloor(floorId: string): Promise<string | null> {
    const floor = await prisma.floor.findUnique({
      where: { id: floorId },
      select: { building: { select: { parcel: { select: { projectId: true } } } } },
    });
    return floor?.building?.parcel?.projectId ?? null;
  }

  async resolveProjectIdFromSpatialAsset(spatialAssetId: string): Promise<string | null> {
    const asset = await prisma.spatialAsset.findUnique({
      where: { id: spatialAssetId },
      select: {
        floor: {
          select: { building: { select: { parcel: { select: { projectId: true } } } } },
        },
      },
    });
    return asset?.floor?.building?.parcel?.projectId ?? null;
  }
}

export const authorizationService = new AuthorizationService();

import { Role } from '../enums';
import { Permission } from './permissions';

/**
 * Centralized role-to-permission mapping.
 *
 * This is the SINGLE authoritative source for what each role can do.
 * Do not scatter role checks across controllers — use this mapping
 * via the authorization middleware and service.
 *
 * ADMIN receives all permissions implicitly (handled in hasPermission).
 */
export const ROLE_PERMISSIONS: Record<Role, ReadonlySet<Permission>> = {
  [Role.ADMIN]: new Set(Object.values(Permission)),

  [Role.PROPERTY_OWNER]: new Set([
    Permission.PROJECT_READ,
    Permission.PARCEL_READ,
    Permission.BUILDING_READ,
    Permission.FLOOR_READ,
    Permission.SPATIAL_ASSET_READ,
    Permission.GEOMETRY_READ,
    // Applications
    Permission.APPLICATION_CREATE,
    Permission.APPLICATION_READ,
    Permission.APPLICATION_UPDATE,
    Permission.APPLICATION_SUBMIT,
    Permission.APPLICATION_CANCEL,
    Permission.APPLICATION_COMMENT,
  ]),

  [Role.SURVEYOR]: new Set([
    Permission.PROJECT_READ,
    Permission.PROJECT_UPDATE,
    Permission.PARCEL_CREATE,
    Permission.PARCEL_READ,
    Permission.PARCEL_UPDATE,
    Permission.BUILDING_CREATE,
    Permission.BUILDING_READ,
    Permission.BUILDING_UPDATE,
    Permission.FLOOR_CREATE,
    Permission.FLOOR_READ,
    Permission.FLOOR_UPDATE,
    Permission.SPATIAL_ASSET_CREATE,
    Permission.SPATIAL_ASSET_READ,
    Permission.SPATIAL_ASSET_UPDATE,
    Permission.GEOMETRY_CREATE,
    Permission.GEOMETRY_READ,
    Permission.GEOMETRY_UPDATE,
    Permission.PROCESSING_CREATE,
    Permission.PROCESSING_READ,
  ]),

  [Role.REVIEWER]: new Set([
    Permission.PROJECT_READ,
    Permission.PARCEL_READ,
    Permission.BUILDING_READ,
    Permission.FLOOR_READ,
    Permission.SPATIAL_ASSET_READ,
    Permission.GEOMETRY_READ,
    Permission.REVIEW_READ,
    Permission.REVIEW_APPROVE,
    Permission.REVIEW_REJECT,
  ]),

  [Role.REGISTRATION_OFFICER]: new Set([
    Permission.PROJECT_READ,
    Permission.REGISTRATION_READ,
    Permission.REGISTRATION_APPROVE,
    Permission.REGISTRATION_REJECT,
  ]),
};

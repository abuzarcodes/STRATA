import { Role } from '../../src/common/enums';
import { Permission, ROLE_PERMISSIONS, authorizationService } from '../../src/common/authorization';

describe('Authorization & Permissions System', () => {
  describe('Role-to-Permission Mapping (ROLE_PERMISSIONS)', () => {
    it('ADMIN should have all permissions', () => {
      const allPermissions = Object.values(Permission);
      const adminPermissions = ROLE_PERMISSIONS[Role.ADMIN];

      for (const permission of allPermissions) {
        expect(adminPermissions.has(permission)).toBe(true);
      }
    });

    it('PROPERTY_OWNER should only have read permissions and no creation/modification', () => {
      const ownerPermissions = ROLE_PERMISSIONS[Role.PROPERTY_OWNER];

      expect(ownerPermissions.has(Permission.PROJECT_READ)).toBe(true);
      expect(ownerPermissions.has(Permission.PARCEL_READ)).toBe(true);
      expect(ownerPermissions.has(Permission.BUILDING_READ)).toBe(true);
      expect(ownerPermissions.has(Permission.FLOOR_READ)).toBe(true);
      expect(ownerPermissions.has(Permission.SPATIAL_ASSET_READ)).toBe(true);
      expect(ownerPermissions.has(Permission.GEOMETRY_READ)).toBe(true);

      // Must NOT have creation or administrative rights
      expect(ownerPermissions.has(Permission.PROJECT_CREATE)).toBe(false);
      expect(ownerPermissions.has(Permission.PARCEL_CREATE)).toBe(false);
      expect(ownerPermissions.has(Permission.BUILDING_CREATE)).toBe(false);
      expect(ownerPermissions.has(Permission.USER_MANAGE)).toBe(false);
      expect(ownerPermissions.has(Permission.REVIEW_APPROVE)).toBe(false);
      expect(ownerPermissions.has(Permission.REGISTRATION_APPROVE)).toBe(false);
    });

    it('SURVEYOR should have spatial creation, modification, and processing permissions but not review/registration approval', () => {
      const surveyorPermissions = ROLE_PERMISSIONS[Role.SURVEYOR];

      expect(surveyorPermissions.has(Permission.PROJECT_CREATE)).toBe(true);
      expect(surveyorPermissions.has(Permission.PROJECT_READ)).toBe(true);
      expect(surveyorPermissions.has(Permission.PROJECT_UPDATE)).toBe(true);
      expect(surveyorPermissions.has(Permission.PARCEL_CREATE)).toBe(true);
      expect(surveyorPermissions.has(Permission.PARCEL_UPDATE)).toBe(true);
      expect(surveyorPermissions.has(Permission.BUILDING_CREATE)).toBe(true);
      expect(surveyorPermissions.has(Permission.FLOOR_CREATE)).toBe(true);
      expect(surveyorPermissions.has(Permission.SPATIAL_ASSET_CREATE)).toBe(true);
      expect(surveyorPermissions.has(Permission.GEOMETRY_CREATE)).toBe(true);
      expect(surveyorPermissions.has(Permission.PROCESSING_CREATE)).toBe(true);

      // Must NOT have review, registration or user management rights
      expect(surveyorPermissions.has(Permission.REVIEW_APPROVE)).toBe(false);
      expect(surveyorPermissions.has(Permission.REVIEW_REJECT)).toBe(false);
      expect(surveyorPermissions.has(Permission.REGISTRATION_APPROVE)).toBe(false);
      expect(surveyorPermissions.has(Permission.USER_MANAGE)).toBe(false);
      expect(surveyorPermissions.has(Permission.PROJECT_DELETE)).toBe(false);
    });

    it('REVIEWER should have read and review approval/rejection permissions but not create spatial data', () => {
      const reviewerPermissions = ROLE_PERMISSIONS[Role.REVIEWER];

      expect(reviewerPermissions.has(Permission.PROJECT_READ)).toBe(true);
      expect(reviewerPermissions.has(Permission.PARCEL_READ)).toBe(true);
      expect(reviewerPermissions.has(Permission.GEOMETRY_READ)).toBe(true);
      expect(reviewerPermissions.has(Permission.REVIEW_READ)).toBe(true);
      expect(reviewerPermissions.has(Permission.REVIEW_APPROVE)).toBe(true);
      expect(reviewerPermissions.has(Permission.REVIEW_REJECT)).toBe(true);

      // Must NOT have survey data creation or registration approval
      expect(reviewerPermissions.has(Permission.PARCEL_CREATE)).toBe(false);
      expect(reviewerPermissions.has(Permission.BUILDING_CREATE)).toBe(false);
      expect(reviewerPermissions.has(Permission.REGISTRATION_APPROVE)).toBe(false);
      expect(reviewerPermissions.has(Permission.USER_MANAGE)).toBe(false);
    });

    it('REGISTRATION_OFFICER should have registration review/approval permissions', () => {
      const regPermissions = ROLE_PERMISSIONS[Role.REGISTRATION_OFFICER];

      expect(regPermissions.has(Permission.PROJECT_READ)).toBe(true);
      expect(regPermissions.has(Permission.REGISTRATION_READ)).toBe(true);
      expect(regPermissions.has(Permission.REGISTRATION_APPROVE)).toBe(true);
      expect(regPermissions.has(Permission.REGISTRATION_REJECT)).toBe(true);

      // Must NOT have spatial authoring or user management
      expect(regPermissions.has(Permission.PARCEL_CREATE)).toBe(false);
      expect(regPermissions.has(Permission.REVIEW_APPROVE)).toBe(false);
      expect(regPermissions.has(Permission.USER_MANAGE)).toBe(false);
    });
  });

  describe('AuthorizationService.hasPermission', () => {
    it('returns true when role has permission', () => {
      expect(authorizationService.hasPermission(Role.ADMIN, Permission.USER_MANAGE)).toBe(true);
      expect(authorizationService.hasPermission(Role.SURVEYOR, Permission.PARCEL_CREATE)).toBe(true);
      expect(authorizationService.hasPermission(Role.REVIEWER, Permission.REVIEW_APPROVE)).toBe(true);
    });

    it('returns false when role lacks permission', () => {
      expect(authorizationService.hasPermission(Role.PROPERTY_OWNER, Permission.PARCEL_CREATE)).toBe(false);
      expect(authorizationService.hasPermission(Role.SURVEYOR, Permission.REVIEW_APPROVE)).toBe(false);
      expect(authorizationService.hasPermission(Role.REVIEWER, Permission.GEOMETRY_CREATE)).toBe(false);
      expect(authorizationService.hasPermission(Role.REGISTRATION_OFFICER, Permission.USER_MANAGE)).toBe(false);
    });
  });
});

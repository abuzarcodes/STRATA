import { Role } from '../../src/common/enums';
import { Permission, ROLE_PERMISSIONS, authorizationService } from '../../src/common/authorization';

describe('Application Permissions & RBAC', () => {
  describe('PROPERTY_OWNER Role Permissions', () => {
    const ownerPermissions = ROLE_PERMISSIONS[Role.PROPERTY_OWNER];

    it('should allow property owner to create, read, update, submit, cancel, and comment on applications', () => {
      expect(ownerPermissions.has(Permission.APPLICATION_CREATE)).toBe(true);
      expect(ownerPermissions.has(Permission.APPLICATION_READ)).toBe(true);
      expect(ownerPermissions.has(Permission.APPLICATION_UPDATE)).toBe(true);
      expect(ownerPermissions.has(Permission.APPLICATION_SUBMIT)).toBe(true);
      expect(ownerPermissions.has(Permission.APPLICATION_CANCEL)).toBe(true);
      expect(ownerPermissions.has(Permission.APPLICATION_COMMENT)).toBe(true);
    });

    it('should NOT allow property owner administrative application review/approval actions', () => {
      expect(ownerPermissions.has(Permission.APPLICATION_READ_ALL)).toBe(false);
      expect(ownerPermissions.has(Permission.APPLICATION_START_REVIEW)).toBe(false);
      expect(ownerPermissions.has(Permission.APPLICATION_REQUEST_INFORMATION)).toBe(false);
      expect(ownerPermissions.has(Permission.APPLICATION_APPROVE)).toBe(false);
      expect(ownerPermissions.has(Permission.APPLICATION_REJECT)).toBe(false);
      expect(ownerPermissions.has(Permission.APPLICATION_INITIALIZE_PROJECT)).toBe(false);
      expect(ownerPermissions.has(Permission.PROJECT_ACTIVATE)).toBe(false);
    });
  });

  describe('ADMIN Role Permissions', () => {
    const adminPermissions = ROLE_PERMISSIONS[Role.ADMIN];

    it('should have all Phase 2 application and project activation permissions', () => {
      expect(adminPermissions.has(Permission.APPLICATION_CREATE)).toBe(true);
      expect(adminPermissions.has(Permission.APPLICATION_READ)).toBe(true);
      expect(adminPermissions.has(Permission.APPLICATION_READ_ALL)).toBe(true);
      expect(adminPermissions.has(Permission.APPLICATION_UPDATE)).toBe(true);
      expect(adminPermissions.has(Permission.APPLICATION_SUBMIT)).toBe(true);
      expect(adminPermissions.has(Permission.APPLICATION_START_REVIEW)).toBe(true);
      expect(adminPermissions.has(Permission.APPLICATION_REQUEST_INFORMATION)).toBe(true);
      expect(adminPermissions.has(Permission.APPLICATION_APPROVE)).toBe(true);
      expect(adminPermissions.has(Permission.APPLICATION_REJECT)).toBe(true);
      expect(adminPermissions.has(Permission.APPLICATION_CANCEL)).toBe(true);
      expect(adminPermissions.has(Permission.APPLICATION_COMMENT)).toBe(true);
      expect(adminPermissions.has(Permission.APPLICATION_INITIALIZE_PROJECT)).toBe(true);
      expect(adminPermissions.has(Permission.PROJECT_ACTIVATE)).toBe(true);
    });
  });

  describe('SURVEYOR Role Permissions in Phase 2', () => {
    const surveyorPermissions = ROLE_PERMISSIONS[Role.SURVEYOR];

    it('should NOT have application review, approval, or project initialization permissions', () => {
      expect(surveyorPermissions.has(Permission.APPLICATION_START_REVIEW)).toBe(false);
      expect(surveyorPermissions.has(Permission.APPLICATION_APPROVE)).toBe(false);
      expect(surveyorPermissions.has(Permission.APPLICATION_REJECT)).toBe(false);
      expect(surveyorPermissions.has(Permission.APPLICATION_INITIALIZE_PROJECT)).toBe(false);
      expect(surveyorPermissions.has(Permission.PROJECT_ACTIVATE)).toBe(false);
    });
  });

  describe('REVIEWER & REGISTRATION_OFFICER Roles in Phase 2', () => {
    it('should NOT have application approval or project initialization permissions in Phase 2', () => {
      const reviewerPermissions = ROLE_PERMISSIONS[Role.REVIEWER];
      const regOfficerPermissions = ROLE_PERMISSIONS[Role.REGISTRATION_OFFICER];

      expect(reviewerPermissions.has(Permission.APPLICATION_APPROVE)).toBe(false);
      expect(reviewerPermissions.has(Permission.APPLICATION_INITIALIZE_PROJECT)).toBe(false);
      expect(regOfficerPermissions.has(Permission.APPLICATION_APPROVE)).toBe(false);
      expect(regOfficerPermissions.has(Permission.APPLICATION_INITIALIZE_PROJECT)).toBe(false);
    });
  });

  describe('authorizationService.hasPermission for Application Permissions', () => {
    it('correctly evaluates application permissions for all roles', () => {
      expect(authorizationService.hasPermission(Role.PROPERTY_OWNER, Permission.APPLICATION_CREATE)).toBe(true);
      expect(authorizationService.hasPermission(Role.PROPERTY_OWNER, Permission.APPLICATION_APPROVE)).toBe(false);
      expect(authorizationService.hasPermission(Role.ADMIN, Permission.APPLICATION_APPROVE)).toBe(true);
      expect(authorizationService.hasPermission(Role.SURVEYOR, Permission.APPLICATION_APPROVE)).toBe(false);
    });
  });
});

import { Request, Response, NextFunction } from 'express';
import { requirePermission } from '../../src/middleware/require-permission.middleware';
import { Role } from '../../src/common/enums';
import { Permission } from '../../src/common/authorization';
import { AppError } from '../../src/common/errors/app-error';
import { ErrorCodes } from '../../src/common/errors/error-codes';

describe('requirePermission Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    mockRes = {};
    mockNext = jest.fn();
  });

  it('should call next with 401 AppError when user is not authenticated', () => {
    mockReq.user = undefined;

    const middleware = requirePermission(Permission.PROJECT_READ);
    middleware(mockReq as Request, mockRes as Response, mockNext as NextFunction);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    const error = mockNext.mock.calls[0][0] as AppError;
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe(ErrorCodes.UNAUTHORIZED);
  });

  it('should call next with no args when user has the required permission', () => {
    mockReq.user = {
      id: 'user-123',
      email: 'surveyor@strata.gov',
      role: Role.SURVEYOR,
    };

    const middleware = requirePermission(Permission.PARCEL_CREATE);
    middleware(mockReq as Request, mockRes as Response, mockNext as NextFunction);

    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should call next with 403 AppError when user lacks the required permission', () => {
    mockReq.user = {
      id: 'user-456',
      email: 'owner@example.com',
      role: Role.PROPERTY_OWNER,
    };

    const middleware = requirePermission(Permission.PARCEL_CREATE);
    middleware(mockReq as Request, mockRes as Response, mockNext as NextFunction);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    const error = mockNext.mock.calls[0][0] as AppError;
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe(ErrorCodes.INSUFFICIENT_PERMISSION);
  });

  it('should allow ADMIN for any permission check', () => {
    mockReq.user = {
      id: 'admin-1',
      email: 'admin@strata.gov',
      role: Role.ADMIN,
    };

    const middleware = requirePermission(
      Permission.USER_MANAGE,
      Permission.PROJECT_ASSIGN,
      Permission.REVIEW_APPROVE,
    );
    middleware(mockReq as Request, mockRes as Response, mockNext as NextFunction);

    expect(mockNext).toHaveBeenCalledWith();
  });
});

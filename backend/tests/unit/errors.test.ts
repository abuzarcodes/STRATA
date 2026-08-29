import { AppError } from '../../src/common/errors/app-error';
import { ErrorCodes } from '../../src/common/errors/error-codes';

describe('AppError Unit Tests', () => {
  it('should construct an operational AppError correctly', () => {
    const error = new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Project not found');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('RESOURCE_NOT_FOUND');
    expect(error.message).toBe('Project not found');
    expect(error.isOperational).toBe(true);
  });

  it('should allow overriding isOperational flag', () => {
    const error = new AppError(500, ErrorCodes.INTERNAL_ERROR, 'Fatal DB crash', false);

    expect(error.isOperational).toBe(false);
  });
});

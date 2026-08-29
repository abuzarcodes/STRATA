import { Response } from 'express';
import { sendSuccess, sendCreated, sendPaginated, sendError } from '../../src/common/responses/api-response';

describe('API Response Helpers Unit Tests', () => {
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it('sendSuccess should format standard payload', () => {
    sendSuccess(mockResponse as Response, { id: '123' }, 'All good');

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'All good',
      data: { id: '123' },
    });
  });

  it('sendCreated should return 201 status', () => {
    sendCreated(mockResponse as Response, { id: 'new-id' });

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'Resource created successfully',
      data: { id: 'new-id' },
    });
  });

  it('sendPaginated should attach pagination metadata', () => {
    const meta = { page: 1, limit: 10, total: 25, totalPages: 3 };
    sendPaginated(mockResponse as Response, [{ id: '1' }], meta);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'Resources retrieved successfully',
      data: [{ id: '1' }],
      meta,
    });
  });

  it('sendError should format error payload', () => {
    sendError(mockResponse as Response, 400, 'BAD_REQUEST', 'Invalid fields');

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid fields',
      },
    });
  });
});

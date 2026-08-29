import { Response } from 'express';

/**
 * Standard API response shapes for consistency across all endpoints.
 */

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiPaginatedResponse<T = unknown> {
  success: true;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Send a successful response with data.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Operation completed successfully',
  statusCode = 200,
): void {
  const response: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
}

/**
 * Send a successful response for resource creation.
 */
export function sendCreated<T>(
  res: Response,
  data: T,
  message = 'Resource created successfully',
): void {
  sendSuccess(res, data, message, 201);
}

/**
 * Send a paginated list response.
 */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: PaginationMeta,
  message = 'Resources retrieved successfully',
): void {
  const response: ApiPaginatedResponse<T> = {
    success: true,
    message,
    data,
    meta,
  };
  res.status(200).json(response);
}

/**
 * Send an error response.
 * Typically used by the global error middleware, not individual controllers.
 */
export function sendError(res: Response, statusCode: number, code: string, message: string): void {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
    },
  };
  res.status(statusCode).json(response);
}

import { Request } from 'express';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
  type PaginationQuery,
} from '../types/pagination.types';
import type { PaginationMeta } from '../responses/api-response';

/**
 * Extract pagination parameters from the request query string.
 * Enforces defaults and maximum limits.
 */
export function parsePagination(req: Request): PaginationQuery {
  const page = Math.max(1, parseInt(req.query['page'] as string, 10) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(req.query['limit'] as string, 10) || DEFAULT_LIMIT),
  );
  return { page, limit };
}

/**
 * Calculate Prisma skip/take from pagination params.
 */
export function paginationToSkipTake(pagination: PaginationQuery): {
  skip: number;
  take: number;
} {
  return {
    skip: (pagination.page - 1) * pagination.limit,
    take: pagination.limit,
  };
}

/**
 * Build pagination meta from query and total count.
 */
export function buildPaginationMeta(pagination: PaginationQuery, total: number): PaginationMeta {
  return {
    page: pagination.page,
    limit: pagination.limit,
    total,
    totalPages: Math.ceil(total / pagination.limit),
  };
}

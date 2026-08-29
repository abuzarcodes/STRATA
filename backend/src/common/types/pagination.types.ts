/**
 * Pagination query parameters extracted from request query string.
 */
export interface PaginationQuery {
  page: number;
  limit: number;
}

/**
 * Default pagination values.
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

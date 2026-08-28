import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Generic request validation middleware factory using Zod.
 * Supports validating body, query, and params.
 *
 * Usage:
 *   router.post('/items', validate(createItemSchema), itemController.create);
 */
export function validate(schema: AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Assign parsed/sanitized values back to request
      req.body = parsed['body'] ?? req.body;
      req.query = parsed['query'] ?? req.query;
      req.params = parsed['params'] ?? req.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(error);
    }
  };
}

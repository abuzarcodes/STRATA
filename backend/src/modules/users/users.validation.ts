import { z } from 'zod';
import { Role } from '../../common/enums';

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid('User ID must be a valid UUID'),
  }),
  body: z.object({
    role: z.nativeEnum(Role, {
      errorMap: () => ({ message: 'Invalid role provided' }),
    }),
  }),
});

export const toggleActiveSchema = z.object({
  params: z.object({
    id: z.string().uuid('User ID must be a valid UUID'),
  }),
  body: z.object({
    isActive: z.boolean({
      required_error: 'isActive is required and must be a boolean',
    }),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('User ID must be a valid UUID'),
  }),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>['body'];
export type ToggleActiveInput = z.infer<typeof toggleActiveSchema>['body'];

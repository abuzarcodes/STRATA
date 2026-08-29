import { z } from 'zod';
import { Role } from '../../common/enums';

export const createAssignmentSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Project ID must be a valid UUID'),
  }),
  body: z.object({
    userId: z.string().uuid('User ID must be a valid UUID'),
    assignmentRole: z.enum([Role.SURVEYOR, Role.REVIEWER, Role.REGISTRATION_OFFICER], {
      errorMap: () => ({
        message: 'assignmentRole must be SURVEYOR, REVIEWER, or REGISTRATION_OFFICER',
      }),
    }),
  }),
});

export const getAssignmentsSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Project ID must be a valid UUID'),
  }),
});

export const deleteAssignmentSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Project ID must be a valid UUID'),
    assignmentId: z.string().uuid('Assignment ID must be a valid UUID'),
  }),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>['body'];

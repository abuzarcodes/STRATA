import { z } from 'zod';
import { ApplicationStatus, PropertyType } from '../../common/enums';

const propertyTypeEnum = z.nativeEnum(PropertyType, {
  errorMap: () => ({
    message:
      'propertyType must be one of RESIDENTIAL, COMMERCIAL, INDUSTRIAL, MIXED_USE, GOVERNMENT, OTHER',
  }),
});

const applicationStatusEnum = z.nativeEnum(ApplicationStatus, {
  errorMap: () => ({
    message: 'status must be a valid ApplicationStatus',
  }),
});

const coordinatesValidation = {
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .nullable()
    .optional(),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .nullable()
    .optional(),
};

const declaredInfoValidation = {
  declaredArea: z
    .number()
    .positive('Declared area must be a positive number')
    .nullable()
    .optional(),
  declaredBuildingCount: z
    .number()
    .int('Declared building count must be an integer')
    .min(0, 'Declared building count cannot be negative')
    .nullable()
    .optional(),
  declaredFloorCount: z
    .number()
    .int('Declared floor count must be an integer')
    .min(0, 'Declared floor count cannot be negative')
    .nullable()
    .optional(),
};

export const createApplicationSchema = z.object({
  body: z.object({
    propertyName: z.string().min(2, 'Property name must be at least 2 characters').optional(),
    propertyType: propertyTypeEnum.optional(),
    description: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    locality: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    ...coordinatesValidation,
    ...declaredInfoValidation,
  }),
});

export const updateApplicationSchema = z.object({
  params: z.object({
    id: z.string().uuid('Application ID must be a valid UUID'),
  }),
  body: z.object({
    propertyName: z.string().min(2, 'Property name must be at least 2 characters').optional(),
    propertyType: propertyTypeEnum.optional(),
    description: z.string().nullable().optional(),
    addressLine1: z.string().nullable().optional(),
    addressLine2: z.string().nullable().optional(),
    locality: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    district: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    postalCode: z.string().nullable().optional(),
    ...coordinatesValidation,
    ...declaredInfoValidation,
  }),
});

export const getApplicationSchema = z.object({
  params: z.object({
    id: z.string().uuid('Application ID must be a valid UUID'),
  }),
});

export const requestInfoSchema = z.object({
  params: z.object({
    id: z.string().uuid('Application ID must be a valid UUID'),
  }),
  body: z.object({
    message: z.string().trim().min(1, 'Information request message is required'),
  }),
});

export const rejectApplicationSchema = z.object({
  params: z.object({
    id: z.string().uuid('Application ID must be a valid UUID'),
  }),
  body: z.object({
    reason: z.string().trim().min(1, 'Rejection reason is required'),
  }),
});

export const createCommentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Application ID must be a valid UUID'),
  }),
  body: z.object({
    message: z.string().trim().min(1, 'Comment message is required'),
  }),
});

export const listApplicationsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: applicationStatusEnum.optional(),
    propertyType: propertyTypeEnum.optional(),
    search: z.string().optional(),
  }),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>['body'];
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>['body'];
export type RequestInfoInput = z.infer<typeof requestInfoSchema>['body'];
export type RejectApplicationInput = z.infer<typeof rejectApplicationSchema>['body'];
export type CreateCommentInput = z.infer<typeof createCommentSchema>['body'];

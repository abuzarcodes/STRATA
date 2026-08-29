/**
 * User roles in the STRATA platform.
 * Maps to the Prisma Role enum in schema.prisma.
 */
export enum Role {
  ADMIN = 'ADMIN',
  PROPERTY_OWNER = 'PROPERTY_OWNER',
  SURVEYOR = 'SURVEYOR',
  REVIEWER = 'REVIEWER',
  REGISTRATION_OFFICER = 'REGISTRATION_OFFICER',
}

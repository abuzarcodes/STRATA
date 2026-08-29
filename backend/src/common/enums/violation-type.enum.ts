/**
 * Types of spatial violations detected in the system.
 */
export enum ViolationType {
  OVERLAP = 'OVERLAP',
  ENCROACHMENT = 'ENCROACHMENT',
  BOUNDARY_CONFLICT = 'BOUNDARY_CONFLICT',
  VERTICAL_CONFLICT = 'VERTICAL_CONFLICT',
  OTHER = 'OTHER',
}

/**
 * Severity levels for violations.
 */
export enum ViolationSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

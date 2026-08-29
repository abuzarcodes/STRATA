/**
 * Processing job lifecycle states.
 * Designed to support a future queue system (e.g., BullMQ/Redis)
 * without requiring structural changes.
 */
export enum ProcessingJobStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REQUIRES_REVIEW = 'REQUIRES_REVIEW',
}

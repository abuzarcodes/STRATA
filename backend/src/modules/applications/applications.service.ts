import { prisma } from '../../database/prisma/client';
import { AppError } from '../../common/errors/app-error';
import { ErrorCodes } from '../../common/errors/error-codes';
import { ApplicationStatus, AuditAction, Role } from '../../common/enums';
import { PaginationQuery } from '../../common/types/pagination.types';
import { paginationToSkipTake } from '../../common/utils/pagination';
import { auditService } from '../audit/audit.service';
import { applicationHistoryService } from './application-history.service';
import {
  CreateApplicationInput,
  UpdateApplicationInput,
  RequestInfoInput,
  RejectApplicationInput,
} from './applications.validation';
import { ApplicationFilterQuery, PropertyApplicationSummary } from './applications.types';

export class ApplicationsService {
  /**
   * Concurrency-safe unique application reference generator.
   * Format: STRATA-APP-{YEAR}-{SEQUENCE:06d}
   */
  async generateApplicationNumber(
    tx: typeof prisma | Parameters<Parameters<typeof prisma.$transaction>[0]>[0] = prisma,
  ): Promise<string> {
    const currentYear = new Date().getFullYear();
    const counter = await tx.applicationCounter.upsert({
      where: { year: currentYear },
      create: { year: currentYear, lastSequence: 1 },
      update: { lastSequence: { increment: 1 } },
    });
    const sequenceFormatted = String(counter.lastSequence).padStart(6, '0');
    return `STRATA-APP-${currentYear}-${sequenceFormatted}`;
  }

  /**
   * Create a new Property Application in DRAFT status.
   */
  async create(
    input: CreateApplicationInput,
    ownerId: string,
  ): Promise<PropertyApplicationSummary> {
    return prisma.$transaction(async (tx) => {
      const applicationNumber = await this.generateApplicationNumber(tx);

      const application = await tx.propertyApplication.create({
        data: {
          applicationNumber,
          ownerId,
          propertyName: input.propertyName ?? null,
          propertyType: input.propertyType ?? null,
          description: input.description ?? null,
          addressLine1: input.addressLine1 ?? null,
          addressLine2: input.addressLine2 ?? null,
          locality: input.locality ?? null,
          city: input.city ?? null,
          district: input.district ?? null,
          state: input.state ?? null,
          country: input.country ?? null,
          postalCode: input.postalCode ?? null,
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null,
          declaredArea: input.declaredArea ?? null,
          declaredBuildingCount: input.declaredBuildingCount ?? null,
          declaredFloorCount: input.declaredFloorCount ?? null,
          status: ApplicationStatus.DRAFT,
        },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      await applicationHistoryService.recordTransition(
        application.id,
        ApplicationStatus.DRAFT,
        ApplicationStatus.DRAFT,
        ownerId,
        'Application draft created',
        tx,
      );

      await auditService.log({
        action: AuditAction.APPLICATION_CREATED,
        entityType: 'PropertyApplication',
        entityId: application.id,
        userId: ownerId,
        metadata: {
          applicationNumber: application.applicationNumber,
          status: ApplicationStatus.DRAFT,
        },
      });

      return application as unknown as PropertyApplicationSummary;
    });
  }

  /**
   * Find paginated applications with search and filters.
   * If userId is provided, restricts to that user's owned applications.
   */
  async findAll(
    pagination: PaginationQuery,
    filters: ApplicationFilterQuery,
    userId?: string,
  ): Promise<{ applications: PropertyApplicationSummary[]; total: number }> {
    const { skip, take } = paginationToSkipTake(pagination);

    const where: Record<string, unknown> = {};

    if (userId) {
      where['ownerId'] = userId;
    }

    if (filters.status) {
      where['status'] = filters.status;
    }

    if (filters.propertyType) {
      where['propertyType'] = filters.propertyType;
    }

    if (filters.search) {
      const search = filters.search.trim();
      where['OR'] = [
        { applicationNumber: { contains: search, mode: 'insensitive' } },
        { propertyName: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { district: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, applications] = await Promise.all([
      prisma.propertyApplication.count({ where }),
      prisma.propertyApplication.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
          project: {
            select: { id: true, name: true, status: true },
          },
        },
      }),
    ]);

    return {
      applications: applications as unknown as PropertyApplicationSummary[],
      total,
    };
  }

  /**
   * Get single application by ID with ownership verification.
   */
  async findById(id: string, userId?: string): Promise<PropertyApplicationSummary> {
    const application = await prisma.propertyApplication.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true, status: true },
        },
      },
    });

    if (!application) {
      throw new AppError(404, ErrorCodes.APPLICATION_NOT_FOUND, 'Application not found.');
    }

    if (userId && application.ownerId !== userId) {
      throw new AppError(
        403,
        ErrorCodes.APPLICATION_ACCESS_DENIED,
        'You do not have access to this application.',
      );
    }

    return application as unknown as PropertyApplicationSummary;
  }

  /**
   * Update application metadata (allowed only in DRAFT or REQUIRES_INFORMATION).
   */
  async update(
    id: string,
    input: UpdateApplicationInput,
    userId: string,
    userRole: Role,
  ): Promise<PropertyApplicationSummary> {
    const existing = await prisma.propertyApplication.findUnique({
      where: { id },
      select: { id: true, ownerId: true, status: true },
    });

    if (!existing) {
      throw new AppError(404, ErrorCodes.APPLICATION_NOT_FOUND, 'Application not found.');
    }

    if (userRole !== Role.ADMIN && existing.ownerId !== userId) {
      throw new AppError(
        403,
        ErrorCodes.APPLICATION_ACCESS_DENIED,
        'You do not have access to update this application.',
      );
    }

    if (
      existing.status !== ApplicationStatus.DRAFT &&
      existing.status !== ApplicationStatus.REQUIRES_INFORMATION
    ) {
      throw new AppError(
        400,
        ErrorCodes.INVALID_APPLICATION_STATE,
        `Cannot update application with status ${existing.status}. Updates are only allowed in DRAFT or REQUIRES_INFORMATION state.`,
      );
    }

    const updated = await prisma.propertyApplication.update({
      where: { id },
      data: {
        ...(input.propertyName !== undefined ? { propertyName: input.propertyName } : {}),
        ...(input.propertyType !== undefined ? { propertyType: input.propertyType } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.addressLine1 !== undefined ? { addressLine1: input.addressLine1 } : {}),
        ...(input.addressLine2 !== undefined ? { addressLine2: input.addressLine2 } : {}),
        ...(input.locality !== undefined ? { locality: input.locality } : {}),
        ...(input.city !== undefined ? { city: input.city } : {}),
        ...(input.district !== undefined ? { district: input.district } : {}),
        ...(input.state !== undefined ? { state: input.state } : {}),
        ...(input.country !== undefined ? { country: input.country } : {}),
        ...(input.postalCode !== undefined ? { postalCode: input.postalCode } : {}),
        ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
        ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
        ...(input.declaredArea !== undefined ? { declaredArea: input.declaredArea } : {}),
        ...(input.declaredBuildingCount !== undefined
          ? { declaredBuildingCount: input.declaredBuildingCount }
          : {}),
        ...(input.declaredFloorCount !== undefined
          ? { declaredFloorCount: input.declaredFloorCount }
          : {}),
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    await auditService.log({
      action: AuditAction.APPLICATION_UPDATED,
      entityType: 'PropertyApplication',
      entityId: id,
      userId,
      metadata: {
        status: existing.status,
      },
    });

    return updated as unknown as PropertyApplicationSummary;
  }

  /**
   * Submit an application (DRAFT or REQUIRES_INFORMATION -> SUBMITTED).
   */
  async submit(id: string, userId: string, userRole: Role): Promise<PropertyApplicationSummary> {
    const existing = await prisma.propertyApplication.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError(404, ErrorCodes.APPLICATION_NOT_FOUND, 'Application not found.');
    }

    if (userRole !== Role.ADMIN && existing.ownerId !== userId) {
      throw new AppError(
        403,
        ErrorCodes.APPLICATION_ACCESS_DENIED,
        'You can only submit your own applications.',
      );
    }

    if (
      existing.status !== ApplicationStatus.DRAFT &&
      existing.status !== ApplicationStatus.REQUIRES_INFORMATION
    ) {
      throw new AppError(
        400,
        ErrorCodes.INVALID_APPLICATION_STATE,
        `Cannot submit application with status ${existing.status}. Allowed only from DRAFT or REQUIRES_INFORMATION.`,
      );
    }

    // Minimum field validation for submission
    if (!existing.propertyName || existing.propertyName.trim().length < 2) {
      throw new AppError(
        400,
        ErrorCodes.VALIDATION_ERROR,
        'Property Name is required before submission.',
      );
    }

    if (!existing.propertyType) {
      throw new AppError(
        400,
        ErrorCodes.VALIDATION_ERROR,
        'Property Type is required before submission.',
      );
    }

    const hasAddress = Boolean(
      existing.addressLine1 || existing.city || existing.locality || existing.district,
    );
    const hasCoordinates = existing.latitude !== null && existing.longitude !== null;

    if (!hasAddress && !hasCoordinates) {
      throw new AppError(
        400,
        ErrorCodes.VALIDATION_ERROR,
        'Sufficient location information (address or coordinates) is required before submission.',
      );
    }

    return prisma.$transaction(async (tx) => {
      const fromStatus = existing.status;
      const result = await tx.propertyApplication.updateMany({
        where: {
          id,
          status: { in: [ApplicationStatus.DRAFT, ApplicationStatus.REQUIRES_INFORMATION] },
        },
        data: {
          status: ApplicationStatus.SUBMITTED,
          submittedAt: new Date(),
        },
      });

      if (result.count === 0) {
        throw new AppError(
          409,
          ErrorCodes.INVALID_APPLICATION_STATE,
          'Application state changed concurrently. Please refresh.',
        );
      }

      await applicationHistoryService.recordTransition(
        id,
        fromStatus,
        ApplicationStatus.SUBMITTED,
        userId,
        fromStatus === ApplicationStatus.REQUIRES_INFORMATION
          ? 'Application resubmitted with updated information'
          : 'Application submitted for administrative review',
        tx,
      );

      await auditService.log({
        action: AuditAction.APPLICATION_SUBMITTED,
        entityType: 'PropertyApplication',
        entityId: id,
        userId,
        metadata: {
          fromStatus,
          toStatus: ApplicationStatus.SUBMITTED,
        },
      });

      return tx.propertyApplication.findUniqueOrThrow({
        where: { id },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      }) as unknown as PropertyApplicationSummary;
    });
  }

  /**
   * Start administrative review (SUBMITTED -> UNDER_REVIEW).
   */
  async startReview(id: string, adminId: string): Promise<PropertyApplicationSummary> {
    return prisma.$transaction(async (tx) => {
      const result = await tx.propertyApplication.updateMany({
        where: {
          id,
          status: ApplicationStatus.SUBMITTED,
        },
        data: {
          status: ApplicationStatus.UNDER_REVIEW,
          reviewStartedAt: new Date(),
        },
      });

      if (result.count === 0) {
        const app = await tx.propertyApplication.findUnique({ where: { id } });
        if (!app)
          throw new AppError(404, ErrorCodes.APPLICATION_NOT_FOUND, 'Application not found.');
        throw new AppError(
          409,
          ErrorCodes.INVALID_APPLICATION_STATE,
          `Cannot start review: application status is ${app.status}, expected SUBMITTED.`,
        );
      }

      await applicationHistoryService.recordTransition(
        id,
        ApplicationStatus.SUBMITTED,
        ApplicationStatus.UNDER_REVIEW,
        adminId,
        'Administrative review initiated',
        tx,
      );

      await auditService.log({
        action: AuditAction.APPLICATION_REVIEW_STARTED,
        entityType: 'PropertyApplication',
        entityId: id,
        userId: adminId,
        metadata: {
          fromStatus: ApplicationStatus.SUBMITTED,
          toStatus: ApplicationStatus.UNDER_REVIEW,
        },
      });

      return tx.propertyApplication.findUniqueOrThrow({
        where: { id },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      }) as unknown as PropertyApplicationSummary;
    });
  }

  /**
   * Request additional information from applicant (UNDER_REVIEW -> REQUIRES_INFORMATION).
   */
  async requestInformation(
    id: string,
    input: RequestInfoInput,
    adminId: string,
  ): Promise<PropertyApplicationSummary> {
    return prisma.$transaction(async (tx) => {
      const result = await tx.propertyApplication.updateMany({
        where: {
          id,
          status: ApplicationStatus.UNDER_REVIEW,
        },
        data: {
          status: ApplicationStatus.REQUIRES_INFORMATION,
        },
      });

      if (result.count === 0) {
        const app = await tx.propertyApplication.findUnique({ where: { id } });
        if (!app)
          throw new AppError(404, ErrorCodes.APPLICATION_NOT_FOUND, 'Application not found.');
        throw new AppError(
          409,
          ErrorCodes.INVALID_APPLICATION_STATE,
          `Cannot request information: application status is ${app.status}, expected UNDER_REVIEW.`,
        );
      }

      await applicationHistoryService.recordTransition(
        id,
        ApplicationStatus.UNDER_REVIEW,
        ApplicationStatus.REQUIRES_INFORMATION,
        adminId,
        input.message,
        tx,
      );

      await auditService.log({
        action: AuditAction.APPLICATION_INFORMATION_REQUESTED,
        entityType: 'PropertyApplication',
        entityId: id,
        userId: adminId,
        metadata: {
          fromStatus: ApplicationStatus.UNDER_REVIEW,
          toStatus: ApplicationStatus.REQUIRES_INFORMATION,
          message: input.message,
        },
      });

      return tx.propertyApplication.findUniqueOrThrow({
        where: { id },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      }) as unknown as PropertyApplicationSummary;
    });
  }

  /**
   * Approve an application (UNDER_REVIEW -> APPROVED).
   */
  async approve(id: string, adminId: string): Promise<PropertyApplicationSummary> {
    return prisma.$transaction(async (tx) => {
      const result = await tx.propertyApplication.updateMany({
        where: {
          id,
          status: ApplicationStatus.UNDER_REVIEW,
        },
        data: {
          status: ApplicationStatus.APPROVED,
          approvedAt: new Date(),
        },
      });

      if (result.count === 0) {
        const app = await tx.propertyApplication.findUnique({ where: { id } });
        if (!app)
          throw new AppError(404, ErrorCodes.APPLICATION_NOT_FOUND, 'Application not found.');
        throw new AppError(
          409,
          ErrorCodes.INVALID_APPLICATION_STATE,
          `Cannot approve application: status is ${app.status}, expected UNDER_REVIEW.`,
        );
      }

      await applicationHistoryService.recordTransition(
        id,
        ApplicationStatus.UNDER_REVIEW,
        ApplicationStatus.APPROVED,
        adminId,
        'Application approved by administrator',
        tx,
      );

      await auditService.log({
        action: AuditAction.APPLICATION_APPROVED,
        entityType: 'PropertyApplication',
        entityId: id,
        userId: adminId,
        metadata: {
          fromStatus: ApplicationStatus.UNDER_REVIEW,
          toStatus: ApplicationStatus.APPROVED,
        },
      });

      return tx.propertyApplication.findUniqueOrThrow({
        where: { id },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      }) as unknown as PropertyApplicationSummary;
    });
  }

  /**
   * Reject an application (UNDER_REVIEW -> REJECTED).
   */
  async reject(
    id: string,
    input: RejectApplicationInput,
    adminId: string,
  ): Promise<PropertyApplicationSummary> {
    return prisma.$transaction(async (tx) => {
      const result = await tx.propertyApplication.updateMany({
        where: {
          id,
          status: ApplicationStatus.UNDER_REVIEW,
        },
        data: {
          status: ApplicationStatus.REJECTED,
          rejectionReason: input.reason,
        },
      });

      if (result.count === 0) {
        const app = await tx.propertyApplication.findUnique({ where: { id } });
        if (!app)
          throw new AppError(404, ErrorCodes.APPLICATION_NOT_FOUND, 'Application not found.');
        throw new AppError(
          409,
          ErrorCodes.INVALID_APPLICATION_STATE,
          `Cannot reject application: status is ${app.status}, expected UNDER_REVIEW.`,
        );
      }

      await applicationHistoryService.recordTransition(
        id,
        ApplicationStatus.UNDER_REVIEW,
        ApplicationStatus.REJECTED,
        adminId,
        input.reason,
        tx,
      );

      await auditService.log({
        action: AuditAction.APPLICATION_REJECTED,
        entityType: 'PropertyApplication',
        entityId: id,
        userId: adminId,
        metadata: {
          fromStatus: ApplicationStatus.UNDER_REVIEW,
          toStatus: ApplicationStatus.REJECTED,
          reason: input.reason,
        },
      });

      return tx.propertyApplication.findUniqueOrThrow({
        where: { id },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      }) as unknown as PropertyApplicationSummary;
    });
  }

  /**
   * Cancel an application (allowed only from DRAFT, SUBMITTED, REQUIRES_INFORMATION -> CANCELLED).
   */
  async cancel(id: string, userId: string, userRole: Role): Promise<PropertyApplicationSummary> {
    const existing = await prisma.propertyApplication.findUnique({
      where: { id },
      select: { id: true, ownerId: true, status: true },
    });

    if (!existing) {
      throw new AppError(404, ErrorCodes.APPLICATION_NOT_FOUND, 'Application not found.');
    }

    if (userRole !== Role.ADMIN && existing.ownerId !== userId) {
      throw new AppError(
        403,
        ErrorCodes.APPLICATION_ACCESS_DENIED,
        'You can only cancel your own applications.',
      );
    }

    if (
      existing.status !== ApplicationStatus.DRAFT &&
      existing.status !== ApplicationStatus.SUBMITTED &&
      existing.status !== ApplicationStatus.REQUIRES_INFORMATION
    ) {
      throw new AppError(
        400,
        ErrorCodes.INVALID_APPLICATION_STATE,
        `Cannot cancel application with status ${existing.status}. Cancellation is only allowed for DRAFT, SUBMITTED, or REQUIRES_INFORMATION.`,
      );
    }

    return prisma.$transaction(async (tx) => {
      const fromStatus = existing.status;
      const result = await tx.propertyApplication.updateMany({
        where: {
          id,
          status: {
            in: [
              ApplicationStatus.DRAFT,
              ApplicationStatus.SUBMITTED,
              ApplicationStatus.REQUIRES_INFORMATION,
            ],
          },
        },
        data: {
          status: ApplicationStatus.CANCELLED,
        },
      });

      if (result.count === 0) {
        throw new AppError(
          409,
          ErrorCodes.INVALID_APPLICATION_STATE,
          'Application state changed concurrently. Please refresh.',
        );
      }

      await applicationHistoryService.recordTransition(
        id,
        fromStatus,
        ApplicationStatus.CANCELLED,
        userId,
        'Application cancelled by owner',
        tx,
      );

      await auditService.log({
        action: AuditAction.APPLICATION_CANCELLED,
        entityType: 'PropertyApplication',
        entityId: id,
        userId,
        metadata: {
          fromStatus,
          toStatus: ApplicationStatus.CANCELLED,
        },
      });

      return tx.propertyApplication.findUniqueOrThrow({
        where: { id },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      }) as unknown as PropertyApplicationSummary;
    });
  }
}

export const applicationsService = new ApplicationsService();

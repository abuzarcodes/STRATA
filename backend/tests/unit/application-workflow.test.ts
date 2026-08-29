import { applicationsService } from '../../src/modules/applications/applications.service';
import { applicationCommentsService } from '../../src/modules/applications/application-comments.service';
import { applicationHistoryService } from '../../src/modules/applications/application-history.service';
import { prisma } from '../../src/database/prisma/client';
import { ApplicationStatus, PropertyType, Role } from '../../src/common/enums';
import { AppError } from '../../src/common/errors/app-error';

// Mock Prisma
jest.mock('../../src/database/prisma/client', () => {
  const mockPrisma: Record<string, unknown> = {
    applicationCounter: {
      upsert: jest.fn(),
    },
    propertyApplication: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    applicationStatusHistory: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    applicationComment: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    auditLog: {
      create: jest.fn().mockResolvedValue({}),
    },
    $transaction: jest.fn(async (cb: (tx: unknown) => unknown) => cb(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

describe('Applications Workflow Service', () => {
  const mockOwnerId = 'owner-uuid-1';
  const mockOtherOwnerId = 'owner-uuid-2';
  const mockAdminId = 'admin-uuid-1';
  const mockAppId = 'app-uuid-1';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create application', () => {
    it('creates a DRAFT application with unique human-readable reference number', async () => {
      (prisma.applicationCounter.upsert as jest.Mock).mockResolvedValue({
        year: 2026,
        lastSequence: 1,
      });

      (prisma.propertyApplication.create as jest.Mock).mockResolvedValue({
        id: mockAppId,
        applicationNumber: 'STRATA-APP-2026-000001',
        ownerId: mockOwnerId,
        propertyName: 'Skyline Tower',
        propertyType: PropertyType.COMMERCIAL,
        status: ApplicationStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      (prisma.applicationStatusHistory.create as jest.Mock).mockResolvedValue({
        id: 'hist-1',
        applicationId: mockAppId,
        fromStatus: ApplicationStatus.DRAFT,
        toStatus: ApplicationStatus.DRAFT,
        changedById: mockOwnerId,
      });

      const result = await applicationsService.create(
        {
          propertyName: 'Skyline Tower',
          propertyType: PropertyType.COMMERCIAL,
          city: 'Mumbai',
        },
        mockOwnerId,
      );

      expect(result.id).toBe(mockAppId);
      expect(result.applicationNumber).toBe('STRATA-APP-2026-000001');
      expect(result.status).toBe(ApplicationStatus.DRAFT);
      expect(prisma.propertyApplication.create).toHaveBeenCalled();
    });
  });

  describe('update application', () => {
    it('allows owner to update application in DRAFT status', async () => {
      (prisma.propertyApplication.findUnique as jest.Mock).mockResolvedValue({
        id: mockAppId,
        ownerId: mockOwnerId,
        status: ApplicationStatus.DRAFT,
      });

      (prisma.propertyApplication.update as jest.Mock).mockResolvedValue({
        id: mockAppId,
        ownerId: mockOwnerId,
        propertyName: 'Updated Tower',
        status: ApplicationStatus.DRAFT,
      });

      const result = await applicationsService.update(
        mockAppId,
        { propertyName: 'Updated Tower' },
        mockOwnerId,
        Role.PROPERTY_OWNER,
      );

      expect(result.propertyName).toBe('Updated Tower');
    });

    it('allows owner to update application in REQUIRES_INFORMATION status', async () => {
      (prisma.propertyApplication.findUnique as jest.Mock).mockResolvedValue({
        id: mockAppId,
        ownerId: mockOwnerId,
        status: ApplicationStatus.REQUIRES_INFORMATION,
      });

      (prisma.propertyApplication.update as jest.Mock).mockResolvedValue({
        id: mockAppId,
        ownerId: mockOwnerId,
        addressLine1: '42 Main St',
        status: ApplicationStatus.REQUIRES_INFORMATION,
      });

      const result = await applicationsService.update(
        mockAppId,
        { addressLine1: '42 Main St' },
        mockOwnerId,
        Role.PROPERTY_OWNER,
      );

      expect(result.addressLine1).toBe('42 Main St');
    });

    it('rejects update if another owner attempts to modify', async () => {
      (prisma.propertyApplication.findUnique as jest.Mock).mockResolvedValue({
        id: mockAppId,
        ownerId: mockOwnerId,
        status: ApplicationStatus.DRAFT,
      });

      await expect(
        applicationsService.update(
          mockAppId,
          { propertyName: 'Malicious Update' },
          mockOtherOwnerId,
          Role.PROPERTY_OWNER,
        ),
      ).rejects.toThrow(AppError);
    });

    it('rejects update if application is SUBMITTED or UNDER_REVIEW', async () => {
      (prisma.propertyApplication.findUnique as jest.Mock).mockResolvedValue({
        id: mockAppId,
        ownerId: mockOwnerId,
        status: ApplicationStatus.UNDER_REVIEW,
      });

      await expect(
        applicationsService.update(
          mockAppId,
          { propertyName: 'Locked Property' },
          mockOwnerId,
          Role.PROPERTY_OWNER,
        ),
      ).rejects.toThrow(AppError);
    });
  });

  describe('submit application workflow (DRAFT -> SUBMITTED)', () => {
    it('successfully submits when minimum fields (name, type, location) exist', async () => {
      (prisma.propertyApplication.findUnique as jest.Mock).mockResolvedValue({
        id: mockAppId,
        ownerId: mockOwnerId,
        propertyName: 'Green Valley Villa',
        propertyType: PropertyType.RESIDENTIAL,
        city: 'Bengaluru',
        latitude: null,
        longitude: null,
        status: ApplicationStatus.DRAFT,
      });

      (prisma.propertyApplication.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
      (prisma.propertyApplication.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        id: mockAppId,
        status: ApplicationStatus.SUBMITTED,
        submittedAt: new Date(),
      });

      const result = await applicationsService.submit(mockAppId, mockOwnerId, Role.PROPERTY_OWNER);
      expect(result.status).toBe(ApplicationStatus.SUBMITTED);
    });

    it('rejects submission if required property name is missing', async () => {
      (prisma.propertyApplication.findUnique as jest.Mock).mockResolvedValue({
        id: mockAppId,
        ownerId: mockOwnerId,
        propertyName: '',
        propertyType: PropertyType.RESIDENTIAL,
        city: 'Bengaluru',
        status: ApplicationStatus.DRAFT,
      });

      await expect(
        applicationsService.submit(mockAppId, mockOwnerId, Role.PROPERTY_OWNER),
      ).rejects.toThrow(AppError);
    });

    it('rejects submission if location information is missing', async () => {
      (prisma.propertyApplication.findUnique as jest.Mock).mockResolvedValue({
        id: mockAppId,
        ownerId: mockOwnerId,
        propertyName: 'No Location Building',
        propertyType: PropertyType.COMMERCIAL,
        addressLine1: null,
        city: null,
        locality: null,
        district: null,
        latitude: null,
        longitude: null,
        status: ApplicationStatus.DRAFT,
      });

      await expect(
        applicationsService.submit(mockAppId, mockOwnerId, Role.PROPERTY_OWNER),
      ).rejects.toThrow(AppError);
    });
  });

  describe('admin review actions', () => {
    it('starts review (SUBMITTED -> UNDER_REVIEW)', async () => {
      (prisma.propertyApplication.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
      (prisma.propertyApplication.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        id: mockAppId,
        status: ApplicationStatus.UNDER_REVIEW,
        reviewStartedAt: new Date(),
      });

      const result = await applicationsService.startReview(mockAppId, mockAdminId);
      expect(result.status).toBe(ApplicationStatus.UNDER_REVIEW);
    });

    it('requests information (UNDER_REVIEW -> REQUIRES_INFORMATION)', async () => {
      (prisma.propertyApplication.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
      (prisma.propertyApplication.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        id: mockAppId,
        status: ApplicationStatus.REQUIRES_INFORMATION,
      });

      const result = await applicationsService.requestInformation(
        mockAppId,
        { message: 'Please provide clear postal code and landmark' },
        mockAdminId,
      );

      expect(result.status).toBe(ApplicationStatus.REQUIRES_INFORMATION);
    });

    it('approves application (UNDER_REVIEW -> APPROVED)', async () => {
      (prisma.propertyApplication.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
      (prisma.propertyApplication.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        id: mockAppId,
        status: ApplicationStatus.APPROVED,
        approvedAt: new Date(),
      });

      const result = await applicationsService.approve(mockAppId, mockAdminId);
      expect(result.status).toBe(ApplicationStatus.APPROVED);
    });

    it('rejects application (UNDER_REVIEW -> REJECTED)', async () => {
      (prisma.propertyApplication.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
      (prisma.propertyApplication.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        id: mockAppId,
        status: ApplicationStatus.REJECTED,
        rejectionReason: 'Coordinates fall outside municipal jurisdiction',
      });

      const result = await applicationsService.reject(
        mockAppId,
        { reason: 'Coordinates fall outside municipal jurisdiction' },
        mockAdminId,
      );

      expect(result.status).toBe(ApplicationStatus.REJECTED);
    });
  });

  describe('cancel application', () => {
    it('allows owner to cancel DRAFT application', async () => {
      (prisma.propertyApplication.findUnique as jest.Mock).mockResolvedValue({
        id: mockAppId,
        ownerId: mockOwnerId,
        status: ApplicationStatus.DRAFT,
      });

      (prisma.propertyApplication.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
      (prisma.propertyApplication.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        id: mockAppId,
        status: ApplicationStatus.CANCELLED,
      });

      const result = await applicationsService.cancel(mockAppId, mockOwnerId, Role.PROPERTY_OWNER);
      expect(result.status).toBe(ApplicationStatus.CANCELLED);
    });

    it('disallows cancellation if application is already APPROVED', async () => {
      (prisma.propertyApplication.findUnique as jest.Mock).mockResolvedValue({
        id: mockAppId,
        ownerId: mockOwnerId,
        status: ApplicationStatus.APPROVED,
      });

      await expect(
        applicationsService.cancel(mockAppId, mockOwnerId, Role.PROPERTY_OWNER),
      ).rejects.toThrow(AppError);
    });
  });

  describe('comments & history', () => {
    it('creates comment for application owner', async () => {
      (prisma.propertyApplication.findUnique as jest.Mock).mockResolvedValue({
        id: mockAppId,
        ownerId: mockOwnerId,
      });

      (prisma.applicationComment.create as jest.Mock).mockResolvedValue({
        id: 'comm-1',
        applicationId: mockAppId,
        authorId: mockOwnerId,
        message: 'Updated coordinates as requested',
        type: 'GENERAL',
        createdAt: new Date(),
      });

      const comment = await applicationCommentsService.create(
        mockAppId,
        mockOwnerId,
        Role.PROPERTY_OWNER,
        'Updated coordinates as requested',
      );

      expect(comment.message).toBe('Updated coordinates as requested');
    });

    it('fetches chronological status history', async () => {
      (prisma.applicationStatusHistory.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'h1',
          fromStatus: ApplicationStatus.DRAFT,
          toStatus: ApplicationStatus.SUBMITTED,
          changedById: mockOwnerId,
          createdAt: new Date('2026-01-01'),
        },
        {
          id: 'h2',
          fromStatus: ApplicationStatus.SUBMITTED,
          toStatus: ApplicationStatus.UNDER_REVIEW,
          changedById: mockAdminId,
          createdAt: new Date('2026-01-02'),
        },
      ]);

      const history = await applicationHistoryService.findByApplication(mockAppId);
      expect(history.length).toBe(2);
      expect(history[0]?.fromStatus).toBe(ApplicationStatus.DRAFT);
      expect(history[1]?.toStatus).toBe(ApplicationStatus.UNDER_REVIEW);
    });
  });
});

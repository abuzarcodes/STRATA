import { ApplicationStatus, PropertyType, ApplicationCommentType } from '../../common/enums';

export interface PropertyApplicationSummary {
  id: string;
  applicationNumber: string;
  ownerId: string;
  propertyName: string | null;
  propertyType: PropertyType | null;
  description: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  locality: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  declaredArea: number | null;
  declaredBuildingCount: number | null;
  declaredFloorCount: number | null;
  status: ApplicationStatus;
  rejectionReason: string | null;
  submittedAt: Date | null;
  reviewStartedAt: Date | null;
  approvedAt: Date | null;
  projectId: string | null;
  createdAt: Date;
  updatedAt: Date;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  project?: {
    id: string;
    name: string;
    status: string;
  } | null;
}

export interface ApplicationStatusHistorySummary {
  id: string;
  applicationId: string;
  fromStatus: ApplicationStatus;
  toStatus: ApplicationStatus;
  changedById: string;
  reason: string | null;
  createdAt: Date;
  changedBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ApplicationCommentSummary {
  id: string;
  applicationId: string;
  authorId: string;
  message: string;
  type: ApplicationCommentType;
  createdAt: Date;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ApplicationFilterQuery {
  status?: ApplicationStatus;
  propertyType?: PropertyType;
  search?: string;
}

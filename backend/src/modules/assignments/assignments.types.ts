export interface ProjectAssignmentSummary {
  id: string;
  projectId: string;
  userId: string;
  assignmentRole: string;
  assignedById: string | null;
  assignedAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  assignedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

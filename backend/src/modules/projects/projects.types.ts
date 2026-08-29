import { ProjectStatus } from '../../common/enums';

export interface ProjectSummary {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  status: ProjectStatus | string;
  createdAt: Date;
  updatedAt: Date;
}

import { Role } from '../../common/enums';

export interface UserSummary {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

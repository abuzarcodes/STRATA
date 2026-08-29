import { Role } from '../../common/enums';

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
  expiresIn: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

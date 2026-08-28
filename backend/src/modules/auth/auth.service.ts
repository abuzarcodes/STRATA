import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../database/prisma/client';
import { authConfig } from '../../config/auth';
import { AppError } from '../../common/errors/app-error';
import { ErrorCodes } from '../../common/errors/error-codes';
import { Role } from '../../common/enums';
import { RegisterInput, LoginInput } from './auth.validation';
import { AuthResponse, UserResponse, JwtPayload } from './auth.types';

const SALT_ROUNDS = 10;

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existing) {
      throw new AppError(
        409,
        ErrorCodes.USER_ALREADY_EXISTS,
        'A user with this email address already exists.',
      );
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        name: input.name,
        role: input.role || Role.USER,
      },
    });

    const userResponse = this.toUserResponse(user);
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role as Role,
    });

    return {
      user: userResponse,
      token,
      expiresIn: authConfig.jwtExpiresIn,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw new AppError(401, ErrorCodes.INVALID_CREDENTIALS, 'Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError(401, ErrorCodes.INVALID_CREDENTIALS, 'Invalid email or password.');
    }

    const userResponse = this.toUserResponse(user);
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role as Role,
    });

    return {
      user: userResponse,
      token,
      expiresIn: authConfig.jwtExpiresIn,
    };
  }

  async getProfile(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'User profile not found.');
    }

    return this.toUserResponse(user);
  }

  private generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  private toUserResponse(user: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export const authService = new AuthService();

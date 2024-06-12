import { Request } from "express";
import { Users } from "src/database/entities/user.entity";

export interface AuthenticatedUser extends Users {
  error?: any;
  sub: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  newTokens?: { accessToken: string; refreshToken: string };
}

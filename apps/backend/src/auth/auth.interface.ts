import { Request } from "express";
import { Users } from "src/database/entities/user.entity";

export interface AuthenticatedRequest extends Request {
  user: Users;
}

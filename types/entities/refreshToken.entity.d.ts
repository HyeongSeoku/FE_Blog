import { UsersProps } from "./user.entity";

export interface RefreshTokenProps {
  tokenId: number;
  token: string;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
  users: UsersProps;
}

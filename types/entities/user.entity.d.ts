import { FollowersProps } from "./followers.entity";

export interface UsersProps {
  userId: string;
  username: string;
  password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
  isAdmin: boolean;
  githubId: string;
  githubImgUrl: string;
  githubProfileUrl: string;
  followers: FollowersProps[];
  following: FollowersProps[];
}

export type UserResponseProps = Omit<UsersProps, "password">;

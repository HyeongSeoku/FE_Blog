import { UsersProps } from "./user.entity";

export interface FollowersProps {
  followerId: string;
  followingId: string;
  created_at: Date;
  follower: UsersProps;
  following: UsersProps;
}

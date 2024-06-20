export interface UserProps {
  userId: string;
  username: string;
  email: string;
  createdAt: string | null;
  updatedAt: string | null;
  lastLogin: string | null;
  isAdmin: boolean;
  githubId: string;
  githubImgUrl: string;
  githubProfileUrl: string;
  followers: string[];
  following: string[];
}

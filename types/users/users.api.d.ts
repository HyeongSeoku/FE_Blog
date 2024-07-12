import { UserResponseProps } from "types/entities/user.entity";

export interface FindOrCreateUserByGithubResponse {
  user: UserResponseProps;
  githubAccessToken: string;
  githubRefreshToken: string;
}

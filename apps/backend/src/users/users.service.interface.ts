import { Users } from 'src/database/entities/user.entity';

export interface FindOrCreateUserByGithubResponse {
  user: Users;
  githubAccessToken: string;
  githubRefreshToken: string;
}

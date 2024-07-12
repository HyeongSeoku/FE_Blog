import { Users } from "src/database/entities/user.entity";

export interface FindOrCreateUserByGithubResponseTest {
  user: Users;
  githubAccessToken: string;
  githubRefreshToken: string;
}

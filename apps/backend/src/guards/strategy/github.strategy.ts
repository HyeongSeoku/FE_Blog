import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import axios from "axios";
import { Profile, Strategy } from "passport-github";
import { GithubUserDto } from "src/users/dto/user.dto";
import { UsersService } from "src/users/users.service";
import { FindOrCreateUserByGithubResponse } from "../../../../../types/users/users.api";
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  private readonly logger = new Logger(GithubStrategy.name);

  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BE_BASE_URL}/auth/github/callback`,
      scope: "user:email",
      prompt: "consent",
    });
  }

  async validate(
    githubAccessToken: string,
    githubRefreshToken: string,
    profile: Profile,
    done: (
      error: null,
      user: FindOrCreateUserByGithubResponse | boolean,
    ) => void,
  ) {
    try {
      const { id, emails, photos, profileUrl, username } = profile;
      let email = emails?.[0]?.value;
      if (!email) {
        // 이메일이 없는 경우, GitHub API를 통해 이메일 가져오기
        const GITHUB_EMAIL_API_URL = "https://api.github.com/user/emails";
        const emailResponse = await axios.get(GITHUB_EMAIL_API_URL, {
          headers: {
            Authorization: `token ${githubAccessToken}`,
          },
        });
        const primaryEmail = emailResponse.data.find((email) => email.primary);
        email = primaryEmail?.email ?? "";
      }

      const githubDto: GithubUserDto = {
        email: email, // GitHub 프로필에서 이메일 주소 가져오기
        username,
        githubId: id,
        githubImgUrl: photos?.[0]?.value ?? "",
        githubProfileUrl: profileUrl,
      };

      const user = await this.usersService.findOrCreateUserByGithub(
        githubDto,
        githubAccessToken,
        githubRefreshToken,
      );
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}

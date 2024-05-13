import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github";
import { GithubUserDto } from "src/users/dto/user.dto";
import { UsersService } from "src/users/users.service";
import { FindOrCreateUserByGithubResponse } from "src/users/users.service.interface";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BE_BASE_URL}/auth/github/callback`,
      scope: "user:email",
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
      const githubDto: GithubUserDto = {
        email: emails?.[0]?.value ?? "", // GitHub 프로필에서 이메일 주소 가져오기
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

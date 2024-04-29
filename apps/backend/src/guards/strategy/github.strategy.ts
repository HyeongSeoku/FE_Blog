import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/github/callback`,
      scope: ['user:email'],
    });
  }

  async validate(
    githubAccessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ) {
    try {
      //FIXME: githubAccessToken 저장 필요 (추후 사용자 정보 업데이트를 위해)

      const { id, emails, photos, profileUrl, username } = profile;
      const user = await this.usersService.findOrCreateUserByGithub({
        githubId: id,
        email: emails[0].value, // GitHub 프로필에서 이메일 주소 가져오기
        profileImg: photos[0].value,
        username,
      });
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}

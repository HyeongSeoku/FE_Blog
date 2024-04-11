import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { Users } from 'src/database/entities/user.entity';
import { UserResponseDto } from 'src/users/dto/user.dto';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import {
  ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE_TIME,
} from '../constants/auth.constants';
import { SharedService } from 'src/shared/shared.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private refreshTokenService: RefreshTokenService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private sharedService: SharedService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async generateToken(
    user: Users,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { username: user.username, sub: user.userId };

    const { privateKey } = this.sharedService.getJwtKeys();
    const accessToken = await this.jwtService.signAsync(payload, {
      privateKey: privateKey,
      expiresIn: ACCESS_TOKEN_EXPIRE,
      algorithm: 'RS256',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      privateKey: privateKey,
      expiresIn: REFRESH_TOKEN_EXPIRE,
      algorithm: 'RS256',
    });

    return { accessToken, refreshToken };
  }

  async generateNewAccessTokenByRefreshToken(
    refreshToken: string,
  ): Promise<{ newRefreshToken: string; newAccessToken: string } | null> {
    try {
      const { privateKey } = this.sharedService.getJwtKeys();

      const newAccessToken =
        await this.refreshTokenService.generateNewAccessToken(refreshToken);

      if (!newAccessToken) {
        throw new Error('Unable to generate access token');
      }

      const decoded = this.jwtService.decode(refreshToken);

      const newRefreshToken = this.jwtService.sign(
        { username: decoded.username, sub: decoded.sub },
        {
          privateKey: privateKey,
          expiresIn: REFRESH_TOKEN_EXPIRE,
          algorithm: 'RS256',
        },
      );

      await this.refreshTokenService.saveToken(
        newRefreshToken,
        decoded.sub,
        new Date(Date.now() + REFRESH_TOKEN_EXPIRE_TIME * 24 * 60 * 60 * 1000),
      );

      return { newRefreshToken, newAccessToken };
    } catch (e) {
      return null;
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && compareSync(password, user.password)) {
      return new UserResponseDto(user);
    }
    return null;
  }

  async login(user: Users): Promise<{
    accessToken: string;
    refreshToken: string;
    lastLogin: Date;
  } | null> {
    try {
      const { accessToken, refreshToken } = await this.generateToken(user);

      const lastLogin = new Date();

      await this.usersRepository.update(user.userId, { lastLogin });

      await this.refreshTokenService.deleteTokenForUserId(user.userId);

      // 새 리프레시 토큰을 데이터베이스에 저장
      await this.refreshTokenService.saveToken(
        refreshToken,
        user.userId,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      );

      return { accessToken, refreshToken, lastLogin };
    } catch (e) {
      return null;
    }
  }

  async logout(userId: string): Promise<boolean> {
    try {
      if (!userId) await this.refreshTokenService.deleteTokenForUserId(userId);
      return true;
    } catch (error) {
      return false;
    }
  }
}

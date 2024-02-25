import { Injectable, Logger, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/database/entities/user.entity';
import { AuthenticatedRequest } from './auth.interface';
import { UserResponseDto } from 'src/users/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private refreshTokenService: RefreshTokenService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  getJwtKeys(): { privateKey: string; publicKey: string } {
    const privateKeyPath = this.configService.get<string>('PRIVATE_KEY_PATH');
    const publicKeyPath = this.configService.get<string>('PUBLIC_KEY_PATH');
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

    return {
      privateKey,
      publicKey,
    };
  }

  async generateToken(
    user: Users,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { username: user.username, sub: user.userId };

    const { privateKey } = this.getJwtKeys();
    const accessToken = this.jwtService.sign(payload, {
      privateKey: privateKey,
      expiresIn: '60m',
      algorithm: 'RS256',
    });
    const refreshToken = this.jwtService.sign(payload, {
      privateKey: privateKey,
      expiresIn: '7d',
      algorithm: 'RS256',
    });

    return { accessToken, refreshToken };
  }

  async validateRefreshToken(token: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenService.findToken(token);
    return !!refreshToken;
  }

  async generateNewAccessToken(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const isValidRefreshToken = await this.validateRefreshToken(token);
      if (!isValidRefreshToken) {
        throw new Error('Invalid refreshToken');
      }

      await this.refreshTokenService.deleteToken(token);

      const { privateKey, publicKey } = this.getJwtKeys();

      const decoded = this.jwtService.verify(token, {
        publicKey,
      });
      if (decoded && decoded.username && decoded.sub) {
        const payload = { username: decoded.username, sub: decoded.sub };
        const accessToken = this.jwtService.sign(payload, {
          privateKey: privateKey,
          expiresIn: '60m',
          algorithm: 'RS256',
        });
        const newRefreshToken = this.jwtService.sign(payload, {
          privateKey: privateKey,
          expiresIn: '7d',
          algorithm: 'RS256',
        });

        await this.refreshTokenService.saveToken(
          newRefreshToken,
          decoded.sub,
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        );

        return { accessToken, refreshToken: newRefreshToken };
      } else {
        throw new Error('Invalid refreshToken');
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      return new UserResponseDto(user);
    }
    return null;
  }

  async login(@Req() req: AuthenticatedRequest) {
    if ('userId' in req.user) {
      await this.refreshTokenService.deleteTokenForUserId(req.user.userId);

      const { accessToken, refreshToken } = await this.generateToken(req.user);

      // 새 리프레시 토큰을 데이터베이스에 저장합니다.
      await this.refreshTokenService.saveToken(
        refreshToken,
        req.user.userId,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      );

      return { accessToken, refreshToken };
    }

    throw new UnauthorizedException();
  }
}

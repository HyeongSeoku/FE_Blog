import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/database/entities/user.entity';
import { AuthenticatedRequest } from './auth.interface';
import { UserResponseDto } from 'src/users/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { Request, Response } from 'express';
import {
  ACCESS_TOKEN_EXPIRE,
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE_TIME,
} from './auth.constants';

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

  async validateRefreshToken(token: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenService.findToken(token);
    return !!refreshToken;
  }

  async generateNewAccessToken(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken = req.cookies['refreshToken'];

      const isValidRefreshToken = await this.validateRefreshToken(refreshToken);
      if (!isValidRefreshToken) {
        return res.status(HttpStatus.UNAUTHORIZED).json('Invalid refreshToken');
      }

      await this.refreshTokenService.deleteToken(refreshToken);

      const { privateKey, publicKey } = this.getJwtKeys();

      const decoded = this.jwtService.verify(refreshToken, {
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
          new Date(
            Date.now() + REFRESH_TOKEN_EXPIRE_TIME * 24 * 60 * 60 * 1000,
          ),
        );

        const accessTokenExpires = new Date().setMinutes(
          new Date().getMinutes() + ACCESS_TOKEN_EXPIRE_TIME,
        );
        const refreshTokenExpires = new Date().setDate(
          new Date().getDate() + REFRESH_TOKEN_EXPIRE_TIME,
        );

        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          expires: new Date(accessTokenExpires),
        });

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          expires: new Date(refreshTokenExpires),
        });

        res.status(200).json({ message: 'Token reissue successful' });
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json('Invalid refreshToken');
      }
    } catch (e) {
      return res.status(HttpStatus.UNAUTHORIZED).json('Invalid refreshToken');
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      return new UserResponseDto(user);
    }
    return null;
  }

  async login(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    if ('userId' in req.user) {
      const { accessToken, refreshToken } = await this.generateToken(req.user);

      await this.refreshTokenService.deleteTokenForUserId(req.user.userId);

      // 새 리프레시 토큰을 데이터베이스에 저장
      await this.refreshTokenService.saveToken(
        refreshToken,
        req.user.userId,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      );

      const accessTokenExpires = new Date().setMinutes(
        new Date().getMinutes() + ACCESS_TOKEN_EXPIRE_TIME,
      );
      const refreshTokenExpires = new Date().setDate(
        new Date().getDate() + REFRESH_TOKEN_EXPIRE_TIME,
      );

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        expires: new Date(accessTokenExpires),
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        expires: new Date(refreshTokenExpires),
      });

      res.status(200).json({ message: 'Login successful' });
    }

    throw new UnauthorizedException();
  }
}

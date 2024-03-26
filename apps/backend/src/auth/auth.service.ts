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
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { Request, Response } from 'express';
import {
  ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE_TIME,
} from './auth.constants';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private refreshTokenService: RefreshTokenService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private sharedService: SharedService,
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
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const refreshToken = req.cookies['refreshToken'];
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

      const refreshTokenExpires = new Date().setDate(
        new Date().getDate() + REFRESH_TOKEN_EXPIRE_TIME,
      );

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        expires: new Date(refreshTokenExpires),
      });

      res.status(200).json({ accessToken: newAccessToken });
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

      const refreshTokenExpires = new Date().setDate(
        new Date().getDate() + REFRESH_TOKEN_EXPIRE_TIME,
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        expires: new Date(refreshTokenExpires),
      });

      return res.status(200).json({ accessToken });
    }

    throw new UnauthorizedException();
  }

  async logout(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId)
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'User not authenticated' });

      await this.refreshTokenService.deleteTokenForUserId(userId);
      res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Logged out successfully' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Logged out failed' });
    }
  }
}

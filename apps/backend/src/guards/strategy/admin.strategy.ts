import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as fs from 'fs';
import { Request } from 'express';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(AdminStrategy.name);

  constructor(private configService: ConfigService) {
    const publicKeyPath = configService.get<string>('PUBLIC_KEY_PATH');
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          if (!request || !request?.cookies) {
            return null;
          }
          const token = request.cookies['accessToken'];
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        return done(null, publicKey);
      },
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    this.logger.log('ADMIN strategy');
    if (payload.isAdmin) {
      return {
        userId: payload.sub,
        username: payload.username,
        isAdmin: payload.isAdmin,
      };
    } else {
      throw new ForbiddenException();
    }
  }
}

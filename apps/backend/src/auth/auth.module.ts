import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategy/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';

@Module({
  imports: [
    UsersModule,
    RefreshTokenModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        publicKey: fs.readFileSync(
          configService.get('PUBLIC_KEY_PATH'),
          'utf8',
        ),
        privateKey: fs.readFileSync(
          configService.get('PRIVATE_KEY_PATH'),
          'utf8',
        ),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION_TIME'),
          algorithm: 'RS256',
        },
      }),
    }),
  ],

  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

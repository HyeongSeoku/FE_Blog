import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategy/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    RefreshTokenModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('KEYs LOGGER');

        return {
          secret: fs.readFileSync(
            configService.get('PRIVATE_KEY_PATH'),
            'utf8',
          ),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION_TIME'),
            algorithm: 'RS256',
          },
        };
      },
    }),
  ],

  providers: [AuthService, JwtStrategy, JwtAuthGuard, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

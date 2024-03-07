import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../guards/strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from '../guards/strategy/local.strategy';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import SharedModule from 'src/shared/shared.module';

@Module({
  imports: [UsersModule, RefreshTokenModule, SharedModule],

  providers: [AuthService, JwtStrategy, JwtAuthGuard, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

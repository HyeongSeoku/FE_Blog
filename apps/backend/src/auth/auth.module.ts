import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constants';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn, algorithm: 'RS256' },
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

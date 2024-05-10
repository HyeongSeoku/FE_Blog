import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "../guards/strategy/jwt.strategy";
import { UsersModule } from "src/users/users.module";
import { LocalStrategy } from "../guards/strategy/local.strategy";
import { RefreshTokenModule } from "src/refresh-token/refresh-token.module";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import SharedModule from "src/shared/shared.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/database/entities/user.entity";
import { GithubAuthGuard } from "src/guards/github-auth.guard";
import { GithubStrategy } from "src/guards/strategy/github.strategy";

@Module({
  imports: [
    UsersModule,
    RefreshTokenModule,
    SharedModule,
    TypeOrmModule.forFeature([Users]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    LocalStrategy,
    GithubStrategy,
    GithubAuthGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

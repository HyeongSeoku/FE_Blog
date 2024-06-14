import { Module } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { TagsController } from "./tags.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tags } from "src/database/entities/tags.entity";
import { UsersModule } from "src/users/users.module";
import { AuthService } from "src/auth/auth.service";
import { RefreshToken } from "src/database/entities/refreshToken.entity";
import { RefreshTokenService } from "src/refresh-token/refresh-token.service";
import { Users } from "src/database/entities/user.entity";

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Tags, RefreshToken, Users])],
  providers: [TagsService, AuthService, RefreshTokenService],
  controllers: [TagsController],
})
export class TagsModule {}

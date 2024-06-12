import { Module } from "@nestjs/common";
import { FollowersController } from "./followers.controller";
import { FollowersService } from "./followers.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Followers } from "src/database/entities/followers.entity";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [UsersModule, AuthModule, TypeOrmModule.forFeature([Followers])],
  controllers: [FollowersController],
  providers: [FollowersService],
})
export class FollowersModule {}

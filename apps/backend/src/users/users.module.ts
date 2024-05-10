import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/database/entities/user.entity";
import { RefreshTokenModule } from "src/refresh-token/refresh-token.module";

@Module({
  imports: [TypeOrmModule.forFeature([Users]), RefreshTokenModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

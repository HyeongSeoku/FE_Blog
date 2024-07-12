import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Categories } from "src/database/entities/categories.entity";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { UsersService } from "src/users/users.service";
import { Users } from "src/database/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "src/auth/auth.service";
import { RefreshTokenService } from "src/refresh-token/refresh-token.service";
import { RefreshToken } from "src/database/entities/refreshToken.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Categories, Users, RefreshToken])],
  providers: [
    AdminGuard,
    CategoryService,
    UsersService,
    JwtService,
    AuthService,
    RefreshTokenService,
  ],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Categories } from "src/database/entities/categories.entity";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { UsersService } from "src/users/users.service";
import { Users } from "src/database/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Categories, Users])],
  providers: [AdminGuard, CategoryService, UsersService],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}

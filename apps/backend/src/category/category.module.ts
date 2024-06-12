import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Categories } from "src/database/entities/categories.entity";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Categories])],
  providers: [AdminGuard],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}

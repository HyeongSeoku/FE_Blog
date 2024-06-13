import { Controller, Get, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { AdminGuard } from "src/guards/admin-auth.guard";

@Controller("category")
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(AdminGuard)
  @Get("list")
  async getCategoryList() {
    const categoryList = this.categoryService.getCategoryList();

    return categoryList;
  }
}

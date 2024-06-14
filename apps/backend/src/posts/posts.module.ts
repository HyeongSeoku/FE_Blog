import { Module, forwardRef } from "@nestjs/common";
import SharedModule from "src/shared/shared.module";
import { UsersModule } from "src/users/users.module";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "src/database/entities/posts.entity";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { Categories } from "src/database/entities/categories.entity";
import { Tags } from "src/database/entities/tags.entity";
import { TagsModule } from "src/tags/tags.module";
import { TagsService } from "src/tags/tags.service";
import { PostOwnerGuard } from "src/guards/postOwner.guard";
import { Comments } from "src/database/entities/comments.entity";
import { ViewsModule } from "src/views/views.module";
import { CategoryService } from "src/category/category.service";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "src/auth/auth.service";
import { RefreshToken } from "src/database/entities/refreshToken.entity";
import { RefreshTokenService } from "src/refresh-token/refresh-token.service";
import { Users } from "src/database/entities/user.entity";

@Module({
  imports: [
    UsersModule,
    SharedModule,
    TagsModule,
    forwardRef(() => ViewsModule),
    TypeOrmModule.forFeature([
      Posts,
      Categories,
      Tags,
      Comments,
      Users,
      RefreshToken,
    ]),
  ],
  providers: [
    AdminGuard,
    PostsService,
    TagsService,
    PostOwnerGuard,
    CategoryService,
    AuthService,
    RefreshTokenService,
  ],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}

import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { RefreshTokenModule } from "./refresh-token/refresh-token.module";
import { PostsModule } from "./posts/posts.module";
import { TagsModule } from "./tags/tags.module";
import { CommentsModule } from "./comments/comments.module";
import { FollowersModule } from "./followers/followers.module";
import { ViewsModule } from "./views/views.module";
import { CategoryModule } from "./category/category.module";
import { SchedulerModule } from "./scheduler/scheduler.module";
import { UploadModule } from "./upload/upload.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === "production"
          ? ".env.production"
          : ".env.development",
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    RefreshTokenModule,
    PostsModule,
    TagsModule,
    CommentsModule,
    FollowersModule,
    ViewsModule,
    CategoryModule,
    SchedulerModule,
    UploadModule,
  ],
  providers: [AppService],
})
export class AppModule {}

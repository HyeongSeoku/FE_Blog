import { Module } from '@nestjs/common';
import SharedModule from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/database/entities/posts.entity';
import { AdminGuard } from 'src/guards/admin-auth.guard';
import { Categories } from 'src/database/entities/categories.entity';
import { Tags } from 'src/database/entities/tags.entity';
import { TagsModule } from 'src/tags/tags.module';
import { TagsService } from 'src/tags/tags.service';
import { PostOwnerGuard } from 'src/guards/postOwner.guard';
import { Comments } from 'src/database/entities/comments.entity';

@Module({
  imports: [
    UsersModule,
    SharedModule,
    TagsModule,
    TypeOrmModule.forFeature([Posts, Categories, Tags, Comments]),
  ],
  providers: [AdminGuard, PostsService, TagsService, PostOwnerGuard],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}

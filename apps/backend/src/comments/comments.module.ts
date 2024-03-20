import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PostsModule } from 'src/posts/posts.module';
import SharedModule from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/database/entities/posts.entity';
import { Comments } from 'src/database/entities/comments.entity';

@Module({
  imports: [
    PostsModule,
    SharedModule,
    TypeOrmModule.forFeature([Posts, Comments]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}

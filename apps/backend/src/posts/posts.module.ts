import { Module } from '@nestjs/common';
import SharedModule from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/database/entities/posts.entity';
import { AdminGuard } from 'src/guards/admin-auth.guard';

@Module({
  imports: [UsersModule, SharedModule, TypeOrmModule.forFeature([Posts])],
  providers: [AdminGuard, PostsService],
  controllers: [PostsController],
})
export class PostsModule {}

import { Module, forwardRef } from '@nestjs/common';
import { ViewsService } from './views.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Views } from 'src/database/entities/views.entity';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [forwardRef(() => PostsModule), TypeOrmModule.forFeature([Views])],
  providers: [ViewsService],
  exports: [ViewsService],
})
export class ViewsModule {}

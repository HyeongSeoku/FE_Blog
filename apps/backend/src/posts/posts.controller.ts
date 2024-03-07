import { Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AdminGuard } from 'src/guards/admin-auth.guard';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.findAll();
  }

  //   @UseGuards(AdminGuard)
  @Post()
  createPost() {
    this.logger.log('글 생성');
  }
}

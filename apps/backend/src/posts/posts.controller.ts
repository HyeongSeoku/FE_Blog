import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AdminGuard } from 'src/guards/admin-auth.guard';
import { CreatePostDto } from './dto/post.dto';
import { AuthenticatedRequest } from 'src/auth/auth.interface';
import { Request } from 'express';
import { FindAllPostParams } from './posts.service.interface';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private postsService: PostsService) {}

  @Get()
  getAllPosts(@Query() query: FindAllPostParams) {
    return this.postsService.findAll(query);
  }

  @UseGuards(AdminGuard)
  @Post('create')
  newPost(
    @Req() req: AuthenticatedRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    this.logger.log('TEST', req.user);
    return this.postsService.createPost(req, createPostDto);
  }
}

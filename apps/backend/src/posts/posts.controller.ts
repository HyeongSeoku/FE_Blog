import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AdminGuard } from 'src/guards/admin-auth.guard';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { AuthenticatedRequest } from 'src/auth/auth.interface';
import { FindAllPostParams } from './posts.service.interface';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private postsService: PostsService) {}

  @Get()
  getAllPosts(@Query() query: FindAllPostParams) {
    return this.postsService.findAll(query);
  }

  @Get(':postId')
  getPost(@Param('postId') postId: number) {
    return this.postsService.findOnePost(postId);
  }

  @UseGuards(AdminGuard)
  @Post('create')
  newPost(
    @Req() req: AuthenticatedRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.createPost(req, createPostDto);
  }

  @UseGuards(AdminGuard)
  @Patch('update/:postId')
  updatePost(
    @Req() req: AuthenticatedRequest,
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(postId, updatePostDto);
  }
}

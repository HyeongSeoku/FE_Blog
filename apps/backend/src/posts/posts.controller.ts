import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { CreatePostDto, UpdatePostDto } from "./dto/post.dto";
import { AuthenticatedRequest } from "src/auth/auth.interface";
import { FindAllPostParams } from "./posts.service.interface";
import { PostOwnerGuard } from "src/guards/postOwner.guard";

@Controller("posts")
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private postsService: PostsService) {}

  @Get("list")
  getAllPosts(@Query() query: FindAllPostParams) {
    return this.postsService.findAll(query);
  }

  @Get("detail/:postId")
  async getPost(@Param("postId") postId: string) {
    const targetPost = await this.postsService.findOnePost(postId);

    if (!targetPost) throw new NotFoundException("Post id does not exist!");

    return targetPost;
  }

  @UseGuards(AdminGuard)
  @Post("create")
  newPost(
    @Req() req: AuthenticatedRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.createPost(req, createPostDto);
  }

  @UseGuards(PostOwnerGuard)
  @Patch("update/:postId")
  updatePost(
    @Param("postId") postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(postId, updatePostDto);
  }

  @UseGuards(PostOwnerGuard)
  @Delete("delete/:postId")
  deletePost(@Param("postId") postId: string) {
    return this.postsService.deletePost(postId);
  }

  @UseGuards(AdminGuard)
  @Get("basic-info")
  getBasicInfoPost() {
    return this.postsService.basicInfoCreatePost();
  }
}

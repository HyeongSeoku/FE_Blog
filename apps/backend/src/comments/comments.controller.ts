import {
  Body,
  Controller,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import {
  CreateCommentDto,
  CreateReplyCommentDto,
  UpdateCommentDto,
} from "./comments.dto";
import { AuthenticatedRequest } from "src/auth/auth.interface";
import { OptionalJwtAuthGuard } from "src/guards/optional-jwt-auth.guard";
import { CommentOwnerGuard } from "src/guards/comment-owner.guard";
import { PostCommentOwnerGuard } from "src/guards/post-comment-owner.guard";

@Controller("comments")
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);

  constructor(private commentsService: CommentsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  createComment(
    @Req() req: AuthenticatedRequest,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(req, createCommentDto);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post("reply/:parentCommentId")
  createReplyComment(
    @Req() req: AuthenticatedRequest,
    @Param("parentCommentId", ParseIntPipe) parentCommentId: number,
    @Body() createReplycommentDto: CreateReplyCommentDto,
  ) {
    return this.commentsService.createReplyComment(
      req,
      parentCommentId,
      createReplycommentDto,
    );
  }

  @UseGuards(CommentOwnerGuard)
  @Patch("update/:commentId")
  updateComment(
    @Param("commentId", ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(commentId, updateCommentDto);
  }

  @UseGuards(PostCommentOwnerGuard)
  @Patch("delete/:commentId")
  deleteComment(
    @Req() req: AuthenticatedRequest,
    @Param("commentId", ParseIntPipe) commentId: number,
  ) {
    return this.commentsService.deleteComment(req, commentId);
  }
}

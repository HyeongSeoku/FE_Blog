import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './comments.dto';
import { AuthenticatedRequest } from 'src/auth/auth.interface';
import { OptionalJwtAuthGuard } from 'src/guards/optional-jwt-auth.guard';
import { CommentOwnerGuard } from 'src/guards/comment-owner.guard';

@Controller('comments')
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);

  constructor(private commentsService: CommentsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  createComments(
    @Req() req: AuthenticatedRequest,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(req, createCommentDto);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('reply/:parentCommentId')
  createReplyComments(
    @Req() req: AuthenticatedRequest,
    @Param('parentCommentId', ParseIntPipe) parentCommentId: number,
    @Body() createReplycommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createReplyComment(
      req,
      parentCommentId,
      createReplycommentDto,
    );
  }

  @UseGuards(CommentOwnerGuard)
  @Patch('update/:commentId')
  updateComments(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(commentId, updateCommentDto);
  }
}

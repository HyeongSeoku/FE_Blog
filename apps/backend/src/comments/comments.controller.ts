import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './comments.dto';
import { AuthenticatedRequest } from 'src/auth/auth.interface';
import { OptionalJwtAuthGuard } from 'src/guards/optional-jwt-auth.guard';

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
}

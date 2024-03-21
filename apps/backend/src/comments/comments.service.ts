import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/database/entities/comments.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateCommentDto } from './comments.dto';
import { PostsService } from 'src/posts/posts.service';
import { AuthenticatedRequest } from 'src/auth/auth.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,

    private readonly postsService: PostsService,
  ) {}
  private readonly logger = new Logger(CommentsService.name);

  async createComment(
    req: AuthenticatedRequest,
    createCommentDto: CreateCommentDto,
  ) {
    const { postId, content, isAnonymous, parentCommentId } = createCommentDto;
    await this.postsService.findOnePost(postId);

    const formattedIsAnonymous = isAnonymous === undefined || !req.user;

    const newComment = this.commentsRepository.create({
      post: { postId },
      content,
      parent: parentCommentId ? { commentId: parentCommentId } : null,
      isAnonymous: formattedIsAnonymous,
      user: req.user,
    });

    await this.commentsRepository.save(newComment);

    return newComment;
  }

  async getCommentsWithReplies(postId: number) {
    const comments = await this.commentsRepository.find({
      where: { post: { postId }, parent: IsNull() }, // 최상위 댓글만 조회
      relations: ['replies', 'user', 'post'], // 대댓글 관계를 로드
    });

    const commentsWithReplies = comments.map((comment) => {
      const replies = comment.replies.filter((reply) => !reply.isDeleted);
      return {
        ...comment,
        replyComment: replies,
      };
    });

    return commentsWithReplies;
  }
}

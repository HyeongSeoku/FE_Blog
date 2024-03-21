import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/database/entities/comments.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateCommentDto } from './comments.dto';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,

    private readonly postsService: PostsService,
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    const { postId } = createCommentDto;
    await this.postsService.findOnePost(postId);

    const newComment = await this.commentsRepository.create({
      post: { postId },
    });
  }

  async getCommentsWithReplies(postId: number) {
    const comments = await this.commentsRepository.find({
      where: { post: { postId }, parent: IsNull() }, // 최상위 댓글만 조회
      relations: ['replies', 'user', 'post'], // 대댓글 관계를 로드
    });

    const commentsWithReplies = comments.map((comment) => {
      const replies = comment.replies.filter((reply) => !reply.is_deleted);
      return {
        ...comment,
        replyComment: replies,
      };
    });

    return commentsWithReplies;
  }
}

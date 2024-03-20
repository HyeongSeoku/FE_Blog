import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/database/entities/comments.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
  ) {}

  // 댓글과 대댓글을 조회하는 서비스 메소드 예시
  async getCommentsWithReplies(postId: number) {
    // 게시글의 모든 댓글을 가져옵니다.
    const comments = await this.commentsRepository.find({
      where: { post: { postId }, parent: IsNull() }, // 최상위 댓글만 조회
      relations: ['replies', 'user', 'post'], // 대댓글 관계를 로드
    });

    // 각 댓글에 대해 대댓글을 포함시킵니다.
    const commentsWithReplies = comments.map((comment) => {
      const replies = comment.replies.filter((reply) => !reply.is_deleted);
      return {
        ...comment,
        replyComment: replies,
        // replyComment: replies.map((reply) => ({
        //   ...reply,
        // })),
      };
    });

    return commentsWithReplies;
  }
}

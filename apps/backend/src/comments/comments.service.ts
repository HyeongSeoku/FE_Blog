import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/database/entities/comments.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateCommentDto, UpdateCommentDto } from './comments.dto';
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
    const { postId, content, isAnonymous } = createCommentDto;
    await this.postsService.findOnePost(postId);

    const formattedIsAnonymous = isAnonymous === undefined || !req.user;

    const newComment = this.commentsRepository.create({
      post: { postId },
      content,
      isAnonymous: formattedIsAnonymous,
      user: req.user || null,
    });

    await this.commentsRepository.save(newComment);

    return newComment;
  }

  async createReplyComment(
    req: AuthenticatedRequest,
    parentCommentId: number,
    createReplyCommentDto: CreateCommentDto,
  ) {
    const { postId, isAnonymous, content } = createReplyCommentDto;
    await this.postsService.findOnePost(postId);

    const targetParentComment = await this.commentsRepository.findOne({
      where: { commentId: parentCommentId },
    });

    if (!targetParentComment)
      throw new Error('Parent comment id does not exist!');

    const formattedIsAnonymous = isAnonymous === undefined || !req.user;

    const newReplyComment = this.commentsRepository.create({
      post: { postId },
      content,
      parent: parentCommentId ? { commentId: parentCommentId } : null,
      isAnonymous: formattedIsAnonymous,
      user: req.user || null,
    });

    await this.commentsRepository.save(newReplyComment);

    return newReplyComment;
  }

  async findOneComment(commentId: number) {
    const targetComment = await this.commentsRepository.findOne({
      where: { commentId },
      relations: ['user', 'replies', 'post', 'post.user'],
    });

    if (!targetComment) throw Error('Comment id does not exist!');

    const response = {
      ...targetComment,
    };

    return response;
  }

  async updateComment(commentId: number, updateCommentDto: UpdateCommentDto) {
    const targetComment = await this.findOneComment(commentId);

    targetComment.content = updateCommentDto.content;

    await this.commentsRepository.save(targetComment);

    const updatedComment = await this.findOneComment(commentId);

    const response = {
      ...updatedComment,
    };

    return response;
  }

  async deleteComment(req: AuthenticatedRequest, commentId: number) {
    const targetComment = await this.findOneComment(commentId);
    const userId = req?.user?.userId;

    const deletedBy = targetComment.user?.userId !== userId ? userId : null;

    const deleteCommment: Comments = {
      ...targetComment,
      isDeleted: true,
      deletedBy,
    };

    await this.commentsRepository.save(deleteCommment);

    // TODO: 대댓글에 대한 삭제 처리 batch 로직 추가

    const deletedComment = await this.findOneComment(commentId);

    return { ...deletedComment, content: '' };
  }
}

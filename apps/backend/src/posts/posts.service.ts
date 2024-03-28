import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  Param,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/database/entities/posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDto, ResponsePostDto, UpdatePostDto } from './dto/post.dto';
import { AuthenticatedRequest } from 'src/auth/auth.interface';
import * as sanitizeHtml from 'sanitize-html';
import { Categories } from 'src/database/entities/categories.entity';
import {
  FindAllPostParams,
  FindAllPostResponse,
} from './posts.service.interface';
import { TagsService } from 'src/tags/tags.service';
import { Comments } from 'src/database/entities/comments.entity';
import { COMMENT_DELETE_KEY } from 'src/constants/comment.constants';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    @InjectRepository(Categories)
    private categoryRepository: Repository<Categories>,
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    private readonly tagsService: TagsService,
  ) {}
  private readonly logger = new Logger(PostsService.name);

  async findAll({
    categoryKey,
    tagName,
  }: FindAllPostParams): Promise<FindAllPostResponse> {
    // TODO: Paging 추가
    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .select([
        'post.postId',
        'post.title',
        'post.body',
        'post.createdAt',
        'post.updatedAt',
      ])
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags')
      .leftJoin('post.comments', 'comments')
      .addSelect([
        'comments.commentId',
        'comments.content',
        'comments.isDeleted',
        'comments.isPostOwner',
      ])
      .leftJoinAndSelect('comments.replies', 'replies')
      .leftJoinAndSelect('comments.parent', 'parent')
      .leftJoinAndSelect('replies.user', 'repliesUser');

    if (categoryKey) {
      queryBuilder.andWhere('category.key = :categoryKey', {
        categoryKey,
      });
    }

    if (tagName) {
      queryBuilder.andWhere('tag.name = :tagName', { tagName });
    }

    const posts = await queryBuilder.getMany();

    return {
      list: posts.map((post) => ({
        ...post,
        user: {
          userId: post.user.userId,
          username: post.user.username,
        },
        category: {
          categoryId: post.category.categoryId,
          categoryKey: post.category.key,
        },
        tags: post.tags.map((tag) => ({
          tagId: tag.tagId,
          tagName: tag.name,
        })),
        comments: post.comments
          .filter((comment) => !comment.parent)
          .map((comment) => ({
            commentId: comment.commentId,
            content: comment.isDeleted ? '' : comment.content,
            replies: comment.isDeleted ? [] : comment.replies,
          })),
      })),
      total: posts.length,
    };
  }

  async findOnePost(postId: number): Promise<ResponsePostDto> {
    const targetPost = await this.postsRepository.findOne({
      where: { postId },
      relations: [
        'user',
        'category',
        'tags',
        'comments',
        'comments.replies',
        'comments.user',
        'comments.post',
        'comments.parent',
        'comments.replies.user',
      ],
    });

    if (!targetPost) throw Error('Post id does not exist!');

    const tags = targetPost.tags.map((tag) => ({
      tagId: tag.tagId,
      name: tag.name,
    }));

    const comments = targetPost.comments
      .filter((comment) => !comment.parent)
      .map((comment) => ({
        ...comment,
        content: comment.isDeleted ? '' : comment.content,
        replies: comment.isDeleted ? [] : comment.replies,
      }));

    const response = {
      ...targetPost,
      user: {
        userId: targetPost.user.userId,
        username: targetPost.user.username,
      },
      category: {
        categoryKey: targetPost.category.key,
        categoryName: targetPost.category.name,
      },
      tags,
      comments,
      commentsLength: comments?.length,
    };

    return response;
  }

  async createPost(
    @Req() req: AuthenticatedRequest,
    createPostDto: CreatePostDto,
  ) {
    const sanitizedBody = sanitizeHtml(createPostDto.body);
    const categoryId = createPostDto.categoryId;

    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { categoryId },
      });

      if (!category) throw new Error('Category not found!');
    }

    // 태그 처리
    let tags = [];
    if (createPostDto.tagNames && createPostDto.tagNames.length > 0) {
      tags = await Promise.all(
        createPostDto.tagNames.map((tagName) =>
          this.tagsService.getOrCreateTag({ name: tagName }),
        ),
      );
    }

    const newPost = this.postsRepository.create({
      ...createPostDto,
      body: sanitizedBody,
      user: req.user,
      category: { categoryId: createPostDto.categoryId }, // categoryId를 category 객체로 변환
      tags,
    });

    await this.postsRepository.save(newPost);

    return newPost;
  }

  async updatePost(postId: number, updatePostDto: UpdatePostDto) {
    const targetPost = await this.postsRepository.findOne({
      where: { postId },
      relations: ['category', 'user'],
    });

    if (!targetPost) {
      throw Error('Post id does not exist!');
    }

    if (typeof updatePostDto.title !== 'undefined' && !updatePostDto.title) {
      throw Error('Title cannot contain empty values ');
    }

    if (typeof updatePostDto.body !== 'undefined' && !updatePostDto.body) {
      throw Error('Body cannot contain empty values ');
    }

    if (updatePostDto?.title) {
      targetPost.title = updatePostDto.title;
    }
    if (updatePostDto?.body) {
      targetPost.body = updatePostDto.body;
    }

    if (updatePostDto?.categoryKey) {
      const category = await this.categoryRepository.findOne({
        where: { key: updatePostDto.categoryKey },
      });

      if (!category) throw new Error('Category not found!');
    }

    if (updatePostDto?.tagNames.length) {
      targetPost.tags = await Promise.all(
        updatePostDto.tagNames.map((tagName) =>
          this.tagsService.getOrCreateTag({ name: tagName }),
        ),
      );
    }

    await this.postsRepository.save(targetPost);

    const updatedPost = await this.postsRepository.findOne({
      where: { postId },
      relations: ['category', 'user', 'tags'],
    });

    const response = {
      ...updatedPost,
      user: {
        userId: updatedPost.user.userId,
        username: updatedPost.user.username,
      },
      category: {
        categoryKey: updatedPost.category.key,
        categoryName: updatedPost.category.name,
      },
    };

    return response;
  }

  async deletePost(postId: number) {
    if (!postId) throw Error('Post id is required');
    const targetPost = await this.findOnePost(postId);

    if (!targetPost) throw Error('Post does not exist');

    //hard delete
    await this.commentsRepository.delete({
      post: { postId },
    });
    await this.postsRepository.delete(postId);

    throw new HttpException('Post deleted successfully', HttpStatus.OK);
  }
}

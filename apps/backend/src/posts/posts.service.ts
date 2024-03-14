import { Injectable, Logger, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/database/entities/posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { AuthenticatedRequest } from 'src/auth/auth.interface';
import * as sanitizeHtml from 'sanitize-html';
import { Categories } from 'src/database/entities/categories.entity';
import {
  FindAllPostParams,
  FindAllPostResponse,
} from './posts.service.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    @InjectRepository(Categories)
    private categoryRepository: Repository<Categories>,
  ) {}
  private readonly logger = new Logger(PostsService.name);

  async findAll({
    categoryId,
  }: FindAllPostParams): Promise<FindAllPostResponse> {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .select('post.postId', 'postId')
      .addSelect('post.title', 'title')
      .addSelect('post.body', 'body')
      .addSelect('post.createdAt', 'createdAt')
      .addSelect('post.updatedAt', 'updatedAt')
      .addSelect('user.userId', 'userId') // 외래 키 컬럼만 추가
      .leftJoin('post.user', 'user') // 여기서는 user 엔티티를 조인하지만, select에는 포함하지 않습니다.
      .addSelect('category.categoryId', 'categoryId')
      .leftJoin('post.category', 'category');

    if (categoryId && typeof categoryId !== 'undefined') {
      queryBuilder.andWhere('category.categoryId = :categoryId', {
        categoryId,
      });
    }

    const postList = await queryBuilder.getRawMany();

    return {
      list: postList,
      total: postList.length,
    };
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

    const newPost = this.postsRepository.create({
      ...createPostDto,
      body: sanitizedBody,
      user: req.user,
    });

    await this.postsRepository.save(newPost);

    return newPost;
  }

  async updatePost(postId: number, updatePostDto: UpdatePostDto) {
    const targetPost = await this.postsRepository.findOne({
      where: { postId },
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

    if (updatePostDto.title) {
      targetPost.title = updatePostDto.title;
    }
    if (updatePostDto.body) {
      targetPost.body = updatePostDto.body;
    }

    if (updatePostDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { categoryId: updatePostDto.categoryId },
      });

      if (!category) throw new Error('Category not found!');
    }

    if (updatePostDto.categoryId) {
      targetPost.categoryId = updatePostDto.categoryId;
    }

    return targetPost;
  }
}

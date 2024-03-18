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
import { Tags } from 'src/database/entities/tags.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    @InjectRepository(Categories)
    private categoryRepository: Repository<Categories>,
    @InjectRepository(Tags)
    private tagsRepository: Repository<Tags>,
  ) {}
  private readonly logger = new Logger(PostsService.name);

  async findAll({
    categoryKey,
    tagName,
  }: FindAllPostParams): Promise<FindAllPostResponse> {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .select('post.postId', 'postId')
      .addSelect('post.title', 'title')
      .addSelect('post.body', 'body')
      .addSelect('post.createdAt', 'createdAt')
      .addSelect('post.updatedAt', 'updatedAt')
      .addSelect('user.userId', 'userId') // 외래 키 컬럼만 추가
      .addSelect('user.username', 'username') // 외래 키 컬럼만 추가
      .leftJoin('post.user', 'user') // 여기서는 user 엔티티를 조인하지만, select에는 포함하지 않습니다.
      .addSelect('category.categoryId', 'categoryId')
      .addSelect('category.key', 'categoryKey')
      .leftJoin('post.category', 'category');

    if (categoryKey && typeof categoryKey !== 'undefined') {
      queryBuilder.andWhere('category.key = :categoryKey', {
        categoryKey,
      });
    }

    if (tagName && typeof tagName !== 'undefined') {
      queryBuilder
        .leftJoin('post.tags', 'tag') // post 엔티티와 tag 엔티티를 조인
        .andWhere('tag.name IN (:...tagNames)', { tagNames: tagName });
    }

    const postList = await queryBuilder.getRawMany();

    return {
      list: postList,
      total: postList.length,
    };
  }

  async findOnePost(@Param('postId') postId: number): Promise<ResponsePostDto> {
    const targetPost = await this.postsRepository.findOne({
      where: { postId },
      relations: ['user', 'category', 'tags'],
    });

    if (!targetPost) throw Error('Post id does not exist!');

    const tags = targetPost.tags.map((tag) => ({
      tagId: tag.tagId,
      name: tag.name,
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
      this.logger.log(
        'TEST createPostDto.tagNames',
        createPostDto.tagNames,
        createPostDto.tagNames.length,
      );
      tags = await Promise.all(
        createPostDto.tagNames.map(async (tagName) => {
          let tag = await this.tagsRepository.findOne({
            where: { name: tagName },
          });
          if (!tag) {
            tag = this.tagsRepository.create({ name: tagName });
            await this.tagsRepository.save(tag);
          }
          return tag;
        }),
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

    if (updatePostDto.title) {
      targetPost.title = updatePostDto.title;
    }
    if (updatePostDto.body) {
      targetPost.body = updatePostDto.body;
    }

    if (updatePostDto.categoryKey) {
      const category = await this.categoryRepository.findOne({
        where: { key: updatePostDto.categoryKey },
      });

      if (!category) throw new Error('Category not found!');
    }

    await this.postsRepository.save(targetPost);

    const updatedPost = await this.postsRepository.findOne({
      where: { postId },
      relations: ['category', 'user'],
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

  async deletePost(@Param('postId') postId: number) {
    if (!postId) throw Error('Post id is required');
    const targetPost = this.postsRepository.findOne({ where: { postId } });
    if (!targetPost) throw Error('Post does not exist');

    await this.postsRepository.delete(postId);

    throw new HttpException('Post deleted successfully', HttpStatus.OK);
  }
}

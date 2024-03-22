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

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    @InjectRepository(Categories)
    private categoryRepository: Repository<Categories>,
    private readonly tagsService: TagsService,
  ) {}
  private readonly logger = new Logger(PostsService.name);

  async findAll({
    categoryKey,
    tagName,
  }: FindAllPostParams): Promise<FindAllPostResponse> {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .select([
        'post.postId',
        'post.title',
        'post.body',
        'post.createdAt',
        'post.updatedAt',
        'user.userId',
        'user.username',
        'category.categoryId',
        'category.key',
        'tags.tagId',
        'tags.name',
      ])
      .leftJoin('post.user', 'user')
      .leftJoin('post.category', 'category')
      .leftJoin('post.tags', 'tags');

    if (categoryKey && typeof categoryKey !== 'undefined') {
      queryBuilder.andWhere('category.key = :categoryKey', {
        categoryKey,
      });
    }

    if (tagName && typeof tagName !== 'undefined') {
      queryBuilder
        .leftJoin('post.tags', 'tag')
        .andWhere('tag.name = :tagName', { tagName });
    }

    const rawPosts = await queryBuilder.getRawMany();

    const postsById: { [key: number]: any } = {};

    for (const rawPost of rawPosts) {
      const postId = rawPost.post_post_id;

      if (!postsById[postId]) {
        postsById[postId] = {
          postId: postId,
          title: rawPost.post_title,
          body: rawPost.post_body,
          createdAt: rawPost.post_created_at,
          updatedAt: rawPost.post_updated_at,
          user: {
            userId: rawPost.user_userId,
            username: rawPost.user_username,
          },
          category: {
            categoryId: rawPost.category_category_id,
            categoryKey: rawPost.category_key,
          },
          tags: [],
        };
      }

      if (
        rawPost.tags_tag_id &&
        !postsById[postId].tags.some((tag) => tag.tagId === rawPost.tags_tag_id)
      ) {
        postsById[postId].tags.push({
          tagId: rawPost.tags_tag_id,
          name: rawPost.tags_name,
        });
      }
    }

    const postList = Object.values(postsById);

    return {
      list: postList,
      total: postList.length,
    };
  }

  async findOnePost(@Param('postId') postId: number): Promise<ResponsePostDto> {
    const targetPost = await this.postsRepository.findOne({
      where: { postId },
      relations: [
        'user',
        'category',
        'tags',
        'comments',
        'comments.replies',
        'comments.user',
      ],
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

  async deletePost(@Param('postId') postId: number) {
    if (!postId) throw Error('Post id is required');
    const targetPost = this.postsRepository.findOne({ where: { postId } });
    if (!targetPost) throw Error('Post does not exist');

    await this.postsRepository.delete(postId);

    throw new HttpException('Post deleted successfully', HttpStatus.OK);
  }
}

import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  Req,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "src/database/entities/posts.entity";
import { Repository } from "typeorm";
import { CreatePostDto, ResponsePostDto, UpdatePostDto } from "./dto/post.dto";
import { AuthenticatedRequest } from "src/auth/auth.interface";
import * as sanitizeHtml from "sanitize-html";
import { Categories } from "src/database/entities/categories.entity";
import {
  FindAllPostParams,
  FindAllPostResponse,
} from "./posts.service.interface";
import { TagsService } from "src/tags/tags.service";
import { Comments } from "src/database/entities/comments.entity";
import { ViewsService } from "src/views/views.service";
import { CategoryService } from "src/category/category.service";

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
    @Inject(forwardRef(() => ViewsService))
    private viewsService: ViewsService,
    private categoryService: CategoryService,
  ) {}
  private readonly logger = new Logger(PostsService.name);

  async findAll({
    categoryKey,
    tagName,
  }: FindAllPostParams): Promise<FindAllPostResponse> {
    // TODO: Paging 추가
    const queryBuilder = this.postsRepository
      .createQueryBuilder("post")
      .select([
        "post.postId",
        "post.title",
        "post.body",
        "post.createdAt",
        "post.updatedAt",
      ])
      .leftJoinAndSelect("post.user", "user")
      .leftJoinAndSelect("post.category", "category")
      .leftJoinAndSelect("post.tags", "tags")
      .leftJoin("post.comments", "comments")
      .addSelect([
        "comments.commentId",
        "comments.content",
        "comments.isDeleted",
        "comments.isPostOwner",
        "comments.createdAt",
      ])
      .leftJoinAndSelect("comments.replies", "replies")
      .leftJoinAndSelect("comments.parent", "parent")
      .leftJoinAndSelect("replies.user", "repliesUser")
      .leftJoinAndSelect("post.views", "views")
      .orderBy("post.createdAt", "DESC")
      .addOrderBy("comments.createdAt", "DESC");

    if (categoryKey) {
      queryBuilder.andWhere("category.key = :categoryKey", {
        categoryKey,
      });
    }

    if (tagName) {
      queryBuilder.andWhere("tag.name = :tagName", { tagName });
    }

    const posts = await queryBuilder.getMany();

    return {
      list: posts.map(({ views, ...post }) => ({
        ...post,
        user: {
          userId: post.user.userId,
          username: post.user.username,
        },
        category: {
          categoryId: post.category.categoryId,
          categoryKey: post.category.categoryKey,
        },
        tags: post.tags.map((tag) => ({
          tagId: tag.tagId,
          tagName: tag.name,
        })),
        comments: post.comments
          .filter((comment) => !comment.parent)
          .map((comment) => ({
            commentId: comment.commentId,
            content: comment.isDeleted ? "" : comment.content,
            replies: comment.isDeleted ? [] : comment.replies,
          })),
        viewCount: views?.viewCount,
      })),
      total: posts.length,
    };
  }

  async findOnePost(postId: string): Promise<ResponsePostDto> {
    const targetPost = await this.postsRepository.findOne({
      where: { postId },
      relations: [
        "user",
        "category",
        "tags",
        "comments",
        "comments.replies",
        "comments.user",
        "comments.post",
        "comments.parent",
        "comments.replies.user",
        "views",
      ],
    });

    if (!targetPost) {
      return null;
    }

    const tags = targetPost.tags.map((tag) => ({
      tagId: tag.tagId,
      name: tag.name,
    }));

    const comments = targetPost.comments
      .filter((comment) => !comment.parent)
      .map((comment) => ({
        ...comment,
        content: comment.isDeleted ? "" : comment.content,
        replies: comment.isDeleted ? [] : comment.replies,
      }));

    const {
      viewId,
      postId: viewPostId,
      ...viewResponse
    } = targetPost.views ?? {};

    const { views, ...result } = targetPost;
    const response = {
      ...result,
      user: {
        userId: targetPost.user.userId,
        username: targetPost.user.username,
      },
      category: {
        categoryKey: targetPost.category.categoryKey,
        categoryName: targetPost.category.name,
      },
      tags,
      comments,
      commentsLength: comments?.length,
      ...viewResponse,
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

      if (!category) throw new NotFoundException("Category not found!");
    }

    // 태그 처리
    let tags = [];
    if (createPostDto?.tagNames?.length > 0) {
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

    const newView = await this.viewsService.createPostView(newPost.postId);
    const response = { ...newPost, viewCount: newView.viewCount };

    return response;
  }

  async updatePost(postId: string, updatePostDto: UpdatePostDto) {
    const targetPost = await this.postsRepository.findOne({
      where: { postId },
      relations: ["category", "user"],
    });

    if (!targetPost) {
      throw Error("Post id does not exist!");
    }

    if (typeof updatePostDto.title !== "undefined" && !updatePostDto.title) {
      throw Error("Title cannot contain empty values ");
    }

    if (typeof updatePostDto.body !== "undefined" && !updatePostDto.body) {
      throw Error("Body cannot contain empty values ");
    }

    if (updatePostDto?.title) {
      targetPost.title = updatePostDto.title;
    }
    if (updatePostDto?.body) {
      targetPost.body = updatePostDto.body;
    }

    if (updatePostDto?.categoryKey) {
      const category = await this.categoryRepository.findOne({
        where: { categoryKey: updatePostDto.categoryKey },
      });

      if (!category) throw new Error("Category not found!");
    }

    if (updatePostDto?.tagNames?.length) {
      targetPost.tags = await Promise.all(
        updatePostDto.tagNames.map((tagName) =>
          this.tagsService.getOrCreateTag({ name: tagName }),
        ),
      );
    }

    await this.postsRepository.save(targetPost);

    const updatedPost = await this.postsRepository.findOne({
      where: { postId },
      relations: ["category", "user", "tags"],
    });

    const response = {
      ...updatedPost,
      user: {
        userId: updatedPost.user.userId,
        username: updatedPost.user.username,
      },
      category: {
        categoryKey: updatedPost.category.categoryKey,
        categoryName: updatedPost.category.name,
      },
    };

    return response;
  }

  async deletePost(postId: string) {
    if (!postId) throw Error("Post id is required");
    const targetPost = await this.findOnePost(postId);

    if (!targetPost) throw Error("Post does not exist");

    //hard delete
    await this.commentsRepository.delete({
      post: { postId },
    });
    await this.viewsService.deletePostView(postId);
    await this.postsRepository.delete(postId);

    throw new HttpException("Post deleted successfully", HttpStatus.OK);
  }

  async basicInfoCreatePost() {
    const categoryList = await this.categoryService.getCategoryList();
    const tagList = await this.tagsService.getAllTags();

    //TODO: 추후 임시 저장 데이터 등 추가 예정
    const tempPost = [];

    return { categoryList, tempPost, tagList };
  }
}

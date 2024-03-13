import { Injectable, Logger, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/database/entities/posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/post.dto';
import { AuthenticatedRequest } from 'src/auth/auth.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
  ) {}
  private readonly logger = new Logger(PostsService.name);

  async findAll(): Promise<Posts[]> {
    return this.postsRepository
      .createQueryBuilder('post')
      .select('post.postId', 'postId')
      .addSelect('post.title', 'title')
      .addSelect('post.body', 'body')
      .addSelect('post.createdAt', 'createdAt')
      .addSelect('post.updatedAt', 'updatedAt')
      .addSelect('user.userId', 'userId') // 외래 키 컬럼만 추가
      .leftJoin('post.user', 'user') // 여기서는 user 엔티티를 조인하지만, select에는 포함하지 않습니다.
      .getRawMany();
  }

  async createPost(
    @Req() req: AuthenticatedRequest,
    createPostDto: CreatePostDto,
  ) {
    this.logger.log('CREATE POST', JSON.stringify(req?.user));
    const newPost = this.postsRepository.create({
      ...createPostDto,
      user: req.user,
    });
    await this.postsRepository.save(newPost);

    return newPost;
  }
}

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
      .select([
        'post.postId',
        'post.title',
        'post.body',
        'post.createdAt',
        'post.updatedAt',
        'user.userId',
      ])
      .leftJoin('post.user', 'user')
      .getMany();

    // return this.postsRepository.find({
    //   relations: ['category'],
    // });
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

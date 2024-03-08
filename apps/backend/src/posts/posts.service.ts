import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/database/entities/posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
  ) {}
  private readonly logger = new Logger(PostsService.name);

  async findAll(): Promise<Posts[]> {
    return this.postsRepository.find({
      relations: ['user', 'category'],
    });
  }

  async createPost(createPostDto: CreatePostDto) {
    const newPost = this.postsRepository.create(createPostDto);
    await this.postsRepository.save(newPost);

    return newPost;
  }
}

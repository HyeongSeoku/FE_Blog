import { Posts } from 'src/database/entities/posts.entity';
import { ResponsePostDto } from './dto/post.dto';

export interface FindAllPostParams {
  categoryKey?: string;
}

export interface FindAllPostResponse {
  list: Posts[];
  total: number;
}

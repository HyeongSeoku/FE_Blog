import { Posts } from 'src/database/entities/posts.entity';

export interface FindAllPostParams {
  categoryId?: number;
}

export interface FindAllPostResponse {
  list: Posts[];
  total: number;
}

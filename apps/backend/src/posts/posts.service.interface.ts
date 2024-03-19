import { Posts } from 'src/database/entities/posts.entity';

export interface FindAllPostParams {
  categoryKey?: string;
  tagName?: string;
}

export interface FindAllPostResponse {
  list: Posts[];
  total: number;
}

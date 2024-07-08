import { Comments } from "src/database/entities/comments.entity";
import { Posts } from "src/database/entities/posts.entity";

export interface FindAllPostParams {
  categoryKey?: string;
  tagName?: string;
}

export interface FindAllPostResponse {
  list: PostsResponse[];
  total: number;
}

export interface PostsResponse {
  postId: string;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    userId: string;
    username: string;
    githubImgUrl?: string;
    githubProfileUrl?: string;
  };
  category: {
    categoryId: number;
    categoryKey: string;
  };
  tags: { tagId: number; tagName: string }[];
  comments: { commentId: number; replies: Comments[]; content: string }[];
}

import { PostProps } from "apps/frontend/app/types/posts";
import { TagProps } from "apps/frontend/app/types/tags";
import { CategoriesProps } from "types/entities/categories.entity";

export interface BasicInfoResponse {
  categoryList: CategoriesProps[];
  tempPost: any[]; //임시
  tagList: { list: TagProps[]; total: number };
}

export interface CreatePostRequest {
  title: string;
  body: string;
  categoryId: number;
  tagNames: string[];
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  post?: PostProps;
}

export interface GetPostListRequest {
  categoryId?: string;
  pageNumber?: number;
}

export interface GetPostListResponse {
  list: PostProps[];
  total: number;
}

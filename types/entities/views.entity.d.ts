import { PostsProps } from "./posts.entity";

export interface ViewsProps {
  viewId: number;
  viewCount: number;
  posts: PostsProps;
  postId: string;
}

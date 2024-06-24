import { PostsProps } from "./posts.entity";

export interface TagsProps {
  tagId: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  posts: PostsProps[];
}

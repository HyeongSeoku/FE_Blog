import { PostProps } from "./posts";

export interface TagProps {
  tagId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  posts: PostProps[];
}

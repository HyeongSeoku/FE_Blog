import { CategoryProps } from "./category";
import { TagProps } from "./tags";
import { UserProps } from "./user";

export interface PostProps {
  postId: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  user: UserProps;
  category: CategoryProps;
  tags: Pick<TagProps, "tagId" | "name">[];
  comments: CategoryProps[];
  viewCount: number;
}

export interface PostBaseInfo {
  categoryList: CategoryProps[];
}

import { CategoriesProps } from "./categories.entity";
import { TagsProps } from "./tags.entity";
import { CommentsProps } from "./comments.entity";
import { ViewsProps } from "./views.entity";
import { UsersProps } from "./user.entity";

export interface PostsProps {
  postId: string;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  user: UsersProps;
  category: CategoriesProps;
  tags: TagsProps[];
  comments: CommentsProps[];
  views: ViewsProps;
}

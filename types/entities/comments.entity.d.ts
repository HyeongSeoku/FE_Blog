import { PostsProps } from "./posts.entity";
import { UsersProps } from "./user.entity";

export interface CommentsProps {
  commentId: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  post: PostsProps;
  isDeleted: boolean;
  deletedBy: string | null;
  isAnonymous: boolean;
  isPostOwner: boolean;
  user: UsersProps | null;
  replies: RepliesCommentProps;
  parent: ParentComment;
}

export type RepliesCommentProps = CommentsProps[];
export type ParentComment = CommentsProps;

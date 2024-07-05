import { Link } from "react-router-dom";
import { getDate } from "utils/date";
import { removeMarkdown } from "utils/markdown";
import { PostProps } from "~/types/posts";

export interface PostCardProps
  extends Omit<PostProps, "createdAt" | "viewCount"> {}

const PostCard = ({
  title,
  body,
  category,
  comments,
  postId,
  tags,
  updatedAt,
  user,
}: PostCardProps) => {
  const textBody = removeMarkdown(body);

  return (
    <div>
      <div>
        <a href={user.githubProfileUrl}>
          <div>{user.username}</div>
        </a>
        <div>{getDate("YYYY.MM.DD", updatedAt)}</div>
      </div>
      <Link to={`post/${postId}`}>
        <div>이미지 영역</div>
        <h3>{title}</h3>
        <p>{textBody}</p>
        <div>{category.name}</div>
        <div>{comments.length}개의 댓글</div>
        {tags.map(({ name, tagId }, idx) => (
          <span key={`${tagId}_${idx}`}>{name}</span>
        ))}
      </Link>
    </div>
  );
};

export default PostCard;

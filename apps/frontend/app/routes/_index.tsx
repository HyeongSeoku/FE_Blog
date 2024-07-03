import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPostList } from "server/posts";
import { GetPostListResponse } from "../../../../types/posts/posts.api";
import { PostProps } from "~/types/posts";
import { getDate } from "utils/date";

interface IndexLoaderData {
  postListData: GetPostListResponse;
}

export const loader: LoaderFunction = async ({ request }) => {
  const { data: postListData, error } = await getPostList({}, request);

  if (error || !postListData) {
    // 기본값 제공
    return { postListData: { list: [], total: 0 } };
  }

  return { postListData };
};

const Index = () => {
  const {
    postListData: { list, total },
  } = useLoaderData<IndexLoaderData>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div>HOME</div>

      <h2>게시물</h2>
      <ul>
        {list.map(
          ({
            postId,
            category,
            tags,
            title,
            user,
            viewCount,
            updatedAt,
          }: PostProps) => (
            <li key={postId}>
              <Link to={`post/${postId}`}>
                <div>{title}</div>
                <div>{category.name}</div>
                <div>{user.username}</div>
                <div>{getDate("YYYY.MM.DD", updatedAt)}</div>
                <div>{viewCount}</div>
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
};

export default Index;

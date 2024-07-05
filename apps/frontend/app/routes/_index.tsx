import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPostList } from "server/posts";
import { GetPostListResponse } from "../../../../types/posts/posts.api";
import { PostProps } from "~/types/posts";

import PostCard from "~/components/PostCard";

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
            body,
            user,
            comments,
            updatedAt,
          }: PostProps) => (
            <li key={postId}>
              <PostCard
                postId={postId}
                title={title}
                body={body}
                user={user}
                updatedAt={updatedAt}
                category={category}
                tags={tags}
                comments={comments}
              />
            </li>
          ),
        )}
      </ul>
    </div>
  );
};

export default Index;

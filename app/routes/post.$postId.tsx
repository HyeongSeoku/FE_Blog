import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

interface PostDetailLoaderData {
  postId: string;
}

export const loader: LoaderFunction = async ({ params }) => {
  const postId = params.postId;
  // 데이터베이스 또는 API로부터 게시물 데이터를 가져옵니다.
  //   const post = await getPostById(postId);
  return { postId };
};

const PostDetail = () => {
  const { postId } = useLoaderData<PostDetailLoaderData>();
  return <div>상세 페이지{postId}</div>;
};

export default PostDetail;

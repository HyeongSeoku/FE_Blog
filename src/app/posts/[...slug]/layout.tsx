import { getAllPosts } from "@/utils/post";
import { ReactNode } from "react";

export const dynamicParams = false;

export async function generateStaticParams() {
  const { postList } = await getAllPosts({});
  return postList.map((post) => ({ slug: post.slug.split("/") }));
}

const PostsLayout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default PostsLayout;

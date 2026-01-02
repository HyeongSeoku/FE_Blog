import DefaultLayout from "@/layout/DefaultLayout";
import { getAllPosts } from "@/utils/post";
import { ReactNode } from "react";

export const dynamicParams = false;

export async function generateStaticParams() {
  const { postList } = await getAllPosts({});
  return postList.map((post) => ({ slug: post.slug.split("/") }));
}

const PostsLayout = ({ children }: { children: ReactNode }) => {
  return <DefaultLayout hasHeaderAnimation={true}>{children}</DefaultLayout>;
};

export default PostsLayout;

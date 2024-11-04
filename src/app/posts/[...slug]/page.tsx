import { notFound } from "next/navigation";
import PostPageMainClient from "./pageClient";
import { getPostsDetail } from "@/utils/mdx";

export default async function PostPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const postData = await getPostsDetail(params.slug);

  if (!postData) {
    notFound();
  }

  return (
    <>
      <h1>{postData?.frontMatter.title}</h1>
      <PostPageMainClient source={postData.source} />
    </>
  );
}

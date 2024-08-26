import { notFound } from "next/navigation";
import PostPageClient from "./pageClient";
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
    <PostPageClient
      source={postData.source}
      frontMatter={postData.frontMatter}
    />
  );
}

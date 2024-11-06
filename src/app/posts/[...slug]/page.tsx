import { notFound } from "next/navigation";
import PostPageMainClient from "./pageClient";
import { getPostsDetail } from "@/utils/mdx";
import DefaultLayout from "@/layout/DefaultLayout";

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
    <DefaultLayout>
      <h1 className="text-5xl font-bold">{postData?.frontMatter.title}</h1>
      <PostPageMainClient source={postData.source} />
    </DefaultLayout>
  );
}

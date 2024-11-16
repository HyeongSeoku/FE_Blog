import { notFound } from "next/navigation";
import {
  extractHeadings,
  getAllPosts,
  getPostsDetail,
} from "@/utils/mdxServer";
import MdxDetailTemplate from "@/templates/MdxDetailTemplate/MdxDetailTemplate";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug.split("/") }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const postData = await getPostsDetail(params.slug);

  if (!postData) {
    notFound();
  }

  const { source, frontMatter, readingTime } = postData;
  // const headings = extractHeadings(source.scope?.content || "");
  console.log("TEST headings", source);

  return (
    <MdxDetailTemplate
      source={source}
      readingTime={readingTime}
      frontMatter={frontMatter}
    />
  );
}

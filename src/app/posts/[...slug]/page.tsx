import { notFound } from "next/navigation";
import { getAllPosts, getPostsDetail } from "@/utils/mdx";
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

  const {
    source,
    frontMatter: { title, createdAt },
    readingTime,
  } = postData;

  return (
    <MdxDetailTemplate
      source={source}
      readingTime={readingTime}
      title={title}
      createdAt={createdAt}
    />
  );
}

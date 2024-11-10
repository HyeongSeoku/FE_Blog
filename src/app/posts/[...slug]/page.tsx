import { notFound } from "next/navigation";
import { getPostsDetail } from "@/utils/mdx";
import DefaultLayout from "@/layout/DefaultLayout";
import MdxDetailTemplate from "@/templates/MdxDetailTemplate/MdxDetailTemplate";

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
    <DefaultLayout>
      <MdxDetailTemplate
        source={source}
        readingTime={readingTime}
        title={title}
        createdAt={createdAt}
      />
    </DefaultLayout>
  );
}

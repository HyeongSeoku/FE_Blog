import { getPostsByTag } from "@/utils/mdxServer";

const TagPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const postList = await getPostsByTag(slug);

  return <div>{slug}</div>;
};

export default TagPage;

import { redirect } from "next/navigation";
import { getAllTags } from "@/utils/post";

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

// 기존 /blog/tags/[tag] URL을 /blog/tags?tags=[tag]로 리다이렉트
const TagPage = ({ params }: { params: { tag: string } }) => {
  const { tag } = params;
  redirect(`/blog/tags?tags=${encodeURIComponent(tag)}`);
};

export default TagPage;

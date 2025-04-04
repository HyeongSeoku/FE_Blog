import BlogPostCard from "@/components/BlogPostCard";
import Tag from "@/components/Tag";
import { getTagPath } from "@/utils/path";
import { getPostsByTag } from "@/utils/post";
import { Metadata } from "next";

export function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Metadata {
  const { tag } = params;
  return {
    title: `#${tag} 게시물`,
    description: `${tag} 태그가 포함된 블로그 게시글 목록입니다.`,
    openGraph: {
      title: `#${tag} 게시물`,
      description: `${tag} 태그가 포함된 블로그 게시글 목록입니다.`,
      url: `/tags/${tag}`,
      type: "website",
      images: [],
    },
  };
}

const TagPage = async ({ params }: { params: { tag: string } }) => {
  const { tag } = params;
  const { list: postList, count, tagList } = await getPostsByTag(tag);

  return (
    <div>
      <h3 className="text-4xl font-bold">{tag}</h3>
      <span>총 {count}개의 포스트</span>
      {/* TODO: tag가 일정 갯수 넘어갈때 hide show 버튼 추가 */}
      <ul className="flex flex-wrap gap-2">
        {tagList.map(({ key, value }) => (
          <Tag key={key} href={getTagPath(key)} isSelected={tag === key}>
            <div className="flex gap-[2px] items-center">
              <span>{key}</span>
              <span className="text-sm">({value})</span>
            </div>
          </Tag>
        ))}
      </ul>

      <ul className="flex flex-col gap-3 mt-3">
        {postList.map(
          ({ title, description, slug, tags, createdAt, thumbnail }) => (
            <BlogPostCard
              key={slug}
              title={title}
              description={description}
              slug={slug}
              tagList={tags}
              createdAt={createdAt}
              thumbnail={thumbnail}
            />
          ),
        )}
      </ul>
    </div>
  );
};

export default TagPage;

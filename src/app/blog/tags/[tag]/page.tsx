import BlogPostCard from "@/components/BlogPostCard";
import Tag from "@/components/Tag";
import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { getTagPath } from "@/utils/path";
import { getAllTags, getPostsByTag } from "@/utils/post";
import { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

export function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Metadata {
  const { tag } = params;
  const metaTitle = `${BASE_META_TITLE} #${tag} 게시물`;

  return {
    title: metaTitle,
    description: `${tag} 태그가 포함된 블로그 게시글 목록입니다.`,
    openGraph: {
      title: metaTitle,
      description: `${tag} 태그가 포함된 블로그 게시글 목록입니다.`,
      url: `/blog/tags/${tag}`,
      type: "website",
      images: [],
    },
    alternates: {
      canonical: `/blog/tags/${tag}`,
    },
  };
}

const TagPage = async ({ params }: { params: { tag: string } }) => {
  const { tag } = params;
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tag,
        item: `${BASE_URL}/blog/tags/${tag}`,
      },
    ],
  };

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

      <ul className="mt-6 grid grid-cols-1 gap-6 min-md:grid-cols-2 min-lg:grid-cols-3">
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
              variant="standard"
            />
          ),
        )}
      </ul>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
    </div>
  );
};

export default TagPage;

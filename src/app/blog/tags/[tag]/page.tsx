import BlogPostListItem from "@/components/BlogPostListItem";
import Tag from "@/components/Tag";
import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { formatTagDisplay, getTagPath } from "@/utils/tag";
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
    <div className="w-full max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          #{formatTagDisplay(tag)}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{count}개의 포스트</p>
      </div>

      {/* 태그 목록 */}
      <div className="mb-8">
        <ul className="flex flex-wrap gap-2">
          {tagList.map(({ key, value }) => (
            <Tag key={key} href={getTagPath(key)} isSelected={tag === key}>
              <div className="flex gap-[2px] items-center">
                <span>{formatTagDisplay(key)}</span>
                <span className="text-sm">({value})</span>
              </div>
            </Tag>
          ))}
        </ul>
      </div>

      {/* 게시물 리스트 */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {postList.map((post) => (
          <BlogPostListItem
            key={post.slug}
            title={post.title}
            description={post.description}
            createdAt={post.createdAt}
            slug={post.slug}
            thumbnail={post.thumbnail}
            category={post.category}
            subCategory={post.subCategory}
          />
        ))}
      </div>

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

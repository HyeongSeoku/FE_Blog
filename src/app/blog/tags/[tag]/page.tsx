import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostListItem from "@/components/BlogPostListItem";
import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { getAllTags, getPostsByTag } from "@/utils/post";

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Promise<Metadata> {
  const { tag } = params;
  const { count } = await getPostsByTag(tag);
  const url = `/blog/tags/${tag}`;

  return {
    title: `${BASE_META_TITLE} | #${tag}`,
    description: `#${tag} 태그가 달린 블로그 게시글 ${count}개를 확인하세요.`,
    openGraph: {
      title: `${BASE_META_TITLE} | #${tag}`,
      description: `#${tag} 태그가 달린 블로그 게시글 ${count}개를 확인하세요.`,
      url,
      type: "website",
    },
    alternates: {
      canonical: url,
    },
  };
}

const TagPage = async ({ params }: { params: { tag: string } }) => {
  const { tag } = params;
  const { list: posts, count } = await getPostsByTag(tag);

  if (count === 0) {
    notFound();
  }

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
        name: "태그",
        item: `${BASE_URL}/blog/tags`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `#${tag}`,
        item: `${BASE_URL}/blog/tags/${tag}`,
      },
    ],
  };

  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/blog/tags/${tag}`,
    url: `${BASE_URL}/blog/tags/${tag}`,
    name: `#${tag} 태그`,
    description: `#${tag} 태그가 달린 블로그 게시글 모음입니다.`,
    isPartOf: {
      "@type": "Blog",
      name: BASE_META_TITLE,
      url: BASE_URL,
    },
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            #{tag}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{count}개의 포스트</p>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {posts.map((post) => (
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
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionStructuredData),
        }}
      />
    </>
  );
};

export default TagPage;

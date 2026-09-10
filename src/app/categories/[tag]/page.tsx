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
  const url = `/categories/${tag}`;

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
        item: `${BASE_URL}/categories`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `#${tag}`,
        item: `${BASE_URL}/categories/${tag}`,
      },
    ],
  };

  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/categories/${tag}`,
    url: `${BASE_URL}/categories/${tag}`,
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
      <div className="w-full">
        <header className="mb-sk-section-lg">
          <h1 className="text-sk-h1 font-bold text-theme">#{tag}</h1>
          <p className="mt-2 text-sk-meta text-muted">{count}개의 글</p>
        </header>

        <div className="flex flex-col gap-sk-item">
          {posts.map((post, index) => (
            <BlogPostListItem
              key={post.slug}
              title={post.title}
              createdAt={post.createdAt}
              slug={post.slug}
              index={index}
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

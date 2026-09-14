import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostListItem from "@/components/BlogPostListItem";
import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { getAllTags, getPostsByTag } from "@/utils/post";

// dynamicParams는 기본값(true)을 쓴다. false로 두면 non-ASCII 세그먼트가
// generateStaticParams의 사전 목록과 정적으로 매칭되지 않는 문제가 있었다.
// 어차피 아래 count === 0 체크로 실제 존재하지 않는 태그는 notFound() 처리되므로
// dynamicParams: false는 불필요한 제약이었다.
export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

// Next 14 App Router가 정적 생성 폴백 경로에서 non-ASCII 동적 세그먼트를
// URL 디코딩하지 않고 그대로 params로 넘기는 경우가 있다(한글 태그 등).
// Route Handler는 정상적으로 디코딩된 값을 받는 것과 대조적으로 확인됨.
// 이미 디코딩된 문자열에 다시 적용해도 안전하므로(순수 ASCII/한글은 변화 없음)
// 항상 한 번 더 decodeURIComponent를 걸어 방어한다.
const decodeTagParam = (tag: string): string => {
  try {
    return decodeURIComponent(tag);
  } catch {
    return tag;
  }
};

export async function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Promise<Metadata> {
  const tag = decodeTagParam(params.tag);
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
  const tag = decodeTagParam(params.tag);
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
        <header className="mb-section-lg">
          <h1 className="text-h1 font-bold text-theme">#{tag}</h1>
          <p className="mt-2 text-meta text-muted">{count}개의 글</p>
        </header>

        <div className="flex flex-col gap-item">
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

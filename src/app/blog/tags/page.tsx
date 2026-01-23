import { getAllPosts, getAllTags } from "@/utils/post";
import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { Metadata } from "next";
import TagsPageClient from "./TagsPageClient";

export const metadata: Metadata = {
  title: `${BASE_META_TITLE} 태그 검색`,
  description: "태그로 블로그 게시글을 필터링합니다.",
  openGraph: {
    title: `${BASE_META_TITLE} 태그 검색`,
    description: "태그로 블로그 게시글을 필터링합니다.",
    url: "/blog/tags",
    type: "website",
    images: [],
  },
  alternates: {
    canonical: "/blog/tags",
  },
};

const TagsPage = async () => {
  const { postList } = await getAllPosts({ isSorted: true });
  const allTags = await getAllTags();

  // 태그별 카운트 계산
  const tagCounts: Record<string, number> = {};
  postList.forEach((post) => {
    post.tags.forEach((tag) => {
      const normalizedTag = tag
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      if (normalizedTag) {
        tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
      }
    });
  });

  const tagList = allTags.map((tag) => ({
    key: tag,
    value: tagCounts[tag] || 0,
  }));

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
    ],
  };

  return (
    <>
      <TagsPageClient postList={postList} tagList={tagList} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
    </>
  );
};

export default TagsPage;

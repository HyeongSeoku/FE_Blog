import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import {
  CATEGORY_DESCRIPTION_BIG,
  CATEGORY_MAP,
  DEFAULT_PAGE_SIZE,
} from "@/constants/post.constants";
import BlogPageTemplate from "@/templates/BlogPageTemplate";
import { getAllPosts, getPostsByCategory } from "@/utils/post";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  const { categoryCounts } = await getAllPosts({});
  const categories = Object.keys(CATEGORY_MAP);

  return categories.flatMap((category) => {
    const count = categoryCounts[category] ?? 0;
    const totalPages = Math.ceil(count / DEFAULT_PAGE_SIZE);

    if (totalPages <= 1) return [];

    return Array.from({ length: totalPages - 1 }, (_, index) => ({
      category: category.toLowerCase(),
      page: String(index + 2),
    }));
  });
}

export const generateMetadata = ({
  params,
}: {
  params: { category: string; page: string };
}) => {
  const categoryTitle = `${BASE_META_TITLE} | ${params.category}`;
  const categorySlug = params.category.toLowerCase();
  const page = Number(params.page);
  const pageSuffix = Number.isFinite(page) ? ` (page ${page})` : "";

  return {
    title: `${categoryTitle} 카테고리${pageSuffix}`,
    description: `${params.category} 관련 블로그 글 목록을 확인하세요.`,
    openGraph: {
      title: `${categoryTitle} 카테고리${pageSuffix}`,
      description: `${params.category} 관련 블로그 글 목록을 확인하세요.`,
      url: `/blog/${categorySlug}/page/${params.page}`,
      type: "website",
    },
    alternates: {
      canonical: `/blog/${categorySlug}/page/${params.page}`,
    },
  };
};

const getBreadcrumbStructuredData = (category: string) => {
  const categoryKey = category.toUpperCase() as keyof typeof CATEGORY_MAP;
  const categoryName = CATEGORY_MAP[categoryKey]?.title || categoryKey;
  const categorySlug = category.toLowerCase();

  return {
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
        name: "블로그",
        item: `${BASE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryName,
        item: `${BASE_URL}/blog/${categorySlug}`,
      },
    ],
  };
};

const getCollectionStructuredData = (category: string) => {
  const categoryKey = category.toUpperCase() as keyof typeof CATEGORY_MAP;
  const categoryName = CATEGORY_MAP[categoryKey]?.title || categoryKey;
  const description =
    CATEGORY_DESCRIPTION_BIG[categoryKey] ??
    `${categoryName} 관련 글 모음 페이지입니다.`;
  const categorySlug = category.toLowerCase();

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/blog/${categorySlug}`,
    url: `${BASE_URL}/blog/${categorySlug}`,
    name: `${categoryName} 카테고리`,
    description,
    isPartOf: {
      "@type": "Blog",
      name: BASE_META_TITLE,
      url: BASE_URL,
    },
  };
};

const BlogCategoryPage = async ({
  params,
}: {
  params: { category: string; page: string };
}) => {
  const { category, page } = params;
  const breadcrumbStructuredData = getBreadcrumbStructuredData(category);
  const collectionStructuredData = getCollectionStructuredData(category);
  const pageSize = DEFAULT_PAGE_SIZE;

  const currentPage = Number(page);
  if (!Number.isFinite(currentPage) || currentPage <= 1) {
    notFound();
  }

  const { postList, totalPostCount, categoryCounts, totalCategoryPostCount } =
    await getPostsByCategory({
      page: currentPage,
      pageSize: pageSize,
      categoryKey: category.toUpperCase(),
    });
  const totalPages = Math.ceil(totalCategoryPostCount / pageSize);

  if (totalPages && totalPages < currentPage) {
    notFound();
  }

  return (
    <>
      <BlogPageTemplate
        postList={postList}
        currentPage={currentPage}
        totalPostCount={totalPostCount}
        categoryCounts={categoryCounts}
        totalPages={totalPages}
        category={category}
        basePath={`/blog/${category.toLowerCase()}`}
      />
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

export default BlogCategoryPage;

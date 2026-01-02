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

const parsePageParam = (page?: string[]) => {
  if (!page || page.length === 0) return 1;
  if (page.length !== 2 || page[0] !== "p") return null;
  const current = Number(page[1]);
  if (!Number.isFinite(current) || current < 2) return null;
  return current;
};

export async function generateStaticParams() {
  const { categoryCounts } = await getAllPosts({});
  const categories = Object.keys(CATEGORY_MAP);

  return categories.flatMap((category) => {
    const count = categoryCounts[category as keyof typeof categoryCounts] ?? 0;
    const totalPages = Math.ceil(count / DEFAULT_PAGE_SIZE);
    const params: { category: string; page?: string[] }[] = [
      { category: category.toLowerCase(), page: [] },
    ];

    for (let page = 2; page <= totalPages; page += 1) {
      params.push({
        category: category.toLowerCase(),
        page: ["p", String(page)],
      });
    }

    return params;
  });
}

export const generateMetadata = ({
  params,
}: {
  params: { category: string; page?: string[] };
}) => {
  const categoryTitle = `${BASE_META_TITLE} | ${params.category}`;
  const categorySlug = params.category.toLowerCase();
  const currentPage = parsePageParam(params.page);
  const pageSuffix =
    currentPage && currentPage > 1 ? ` (page ${currentPage})` : "";
  const url =
    currentPage && currentPage > 1
      ? `/blog/${categorySlug}/p/${currentPage}`
      : `/blog/${categorySlug}`;

  return {
    title: `${categoryTitle} 카테고리${pageSuffix}`,
    description: `${params.category} 관련 블로그 글 목록을 확인하세요.`,
    openGraph: {
      title: `${categoryTitle} 카테고리${pageSuffix}`,
      description: `${params.category} 관련 블로그 글 목록을 확인하세요.`,
      url,
      type: "website",
    },
    alternates: {
      canonical: url,
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
  params: { category: string; page?: string[] };
}) => {
  const { category } = params;
  const currentPage = parsePageParam(params.page);
  const pageSize = DEFAULT_PAGE_SIZE;

  const isCategoryKeyAll = category.toLowerCase() === "all";
  const isCategoryValid = Object.keys(CATEGORY_MAP).includes(
    category.toUpperCase(),
  );
  if (isCategoryKeyAll || !isCategoryValid || !currentPage) {
    notFound();
  }

  const breadcrumbStructuredData = getBreadcrumbStructuredData(category);
  const collectionStructuredData = getCollectionStructuredData(category);

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

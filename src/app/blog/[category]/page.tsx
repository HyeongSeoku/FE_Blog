import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import {
  CATEGORY_DESCRIPTION_BIG,
  CATEGORY_MAP,
  DEFAULT_PAGE_SIZE,
} from "@/constants/post.constants";
import BlogPageTemplate from "@/templates/BlogPageTemplate";
import { getPostsByCategory } from "@/utils/post";
import { redirect } from "next/navigation";

interface BlogCategoryPageProps {
  params: { category: string };
  searchParams: { [key: string]: string | undefined };
}

export const generateMetadata = ({
  params,
  searchParams,
}: BlogCategoryPageProps) => {
  const categoryTitle = `${BASE_META_TITLE} | ${params.category}`;

  const pageParam = searchParams.page;
  const isFirstPage = !pageParam || pageParam === "1";

  const metadata = {
    title: `${categoryTitle} 카테고리`,
    description: `${params.category} 관련 블로그 글 목록을 확인하세요.`,
    openGraph: {
      title: `${categoryTitle} 카테고리`,
      description: `${params.category} 관련 블로그 글 목록을 확인하세요.`,
      url: isFirstPage
        ? `${BASE_URL}/blog/${params.category}`
        : `${BASE_URL}/blog/${params.category}?page=${pageParam}`,
      type: "website",
    },
    alternates: {
      canonical: isFirstPage
        ? `${BASE_URL}/blog/${params.category}`
        : `${BASE_URL}/blog/${params.category}?page=${pageParam}`,
    },
  };

  return metadata;
};

export const generateStaticParams = () => {
  const categories = Object.keys(CATEGORY_MAP);

  return categories.map((category) => ({ category }));
};

const getBreadcrumbStructuredData = (category: string) => {
  const categoryKey = category.toUpperCase() as keyof typeof CATEGORY_MAP;
  const categoryName = CATEGORY_MAP[categoryKey]?.title || categoryKey;

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
        item: `${BASE_URL}/blog/${categoryKey}`,
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

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/blog/${categoryKey}`,
    url: `${BASE_URL}/blog/${categoryKey}`,
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
  searchParams,
}: BlogCategoryPageProps) => {
  const { category } = params;
  const breadcrumbStructuredData = getBreadcrumbStructuredData(category);
  const collectionStructuredData = getCollectionStructuredData(category);

  const currentPage = parseInt(searchParams.page || "1", 10);
  const pageSize = DEFAULT_PAGE_SIZE;
  const isCategoryKeyAll = category.toLowerCase() === "all";
  const isCategoryValid = Object.keys(CATEGORY_MAP).includes(
    category.toUpperCase(),
  );
  if (isCategoryKeyAll || !isCategoryValid) {
    redirect("/blog");
  }

  const { postList, totalPostCount, categoryCounts, totalCategoryPostCount } =
    await getPostsByCategory({
      page: currentPage,
      pageSize: pageSize,
      categoryKey: params.category.toUpperCase(),
    });
  const maxPage = Math.ceil(totalCategoryPostCount / pageSize);
  const totalPages = Math.ceil(totalCategoryPostCount / pageSize);

  if (maxPage && maxPage < currentPage) {
    redirect(`/blog/${params.category}`);
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

import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { CATEGORY_MAP, DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
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

const BlogCategoryPage = async ({
  params,
  searchParams,
}: BlogCategoryPageProps) => {
  const breadcrumbStructuredData = getBreadcrumbStructuredData(params.category);
  const currentPage = parseInt(searchParams.page || "1", 10);
  const pageSize = DEFAULT_PAGE_SIZE;
  const isCategoryKeyAll = params.category.toLowerCase() === "all";
  const isCategoryValid = Object.keys(CATEGORY_MAP).includes(
    params.category.toUpperCase(),
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
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
    </>
  );
};

export default BlogCategoryPage;

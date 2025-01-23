import { CATEGORY_MAP, DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogPageTemplate from "@/templates/BlogPageTemplate";
import { getPostsByCategory } from "@/utils/post";
import { redirect } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: { category: string };
}) => {
  const categoryTitle = `블로그 | ${params.category}`;

  const metadata = {
    title: `${categoryTitle} 카테고리`,
    description: `${params.category} 관련 블로그 글 목록을 확인하세요.`,
  };

  return metadata;
};

export const generateStaticParams = async () => {
  const categories = Object.keys(CATEGORY_MAP);

  return categories.map((category) => ({ category }));
};

interface BlogCategoryPageProps {
  params: { category: string };
  searchParams: { [key: string]: string | undefined };
}

const BlogCategoryPage = async ({
  params,
  searchParams,
}: BlogCategoryPageProps) => {
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
    <BlogPageTemplate
      postList={postList}
      currentPage={currentPage}
      totalPostCount={totalPostCount}
      categoryCounts={categoryCounts}
      totalPages={totalPages}
    />
  );
};

export default BlogCategoryPage;

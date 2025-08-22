import { BASE_URL } from "@/constants/basic.constants";
import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogPageTemplate from "@/templates/BlogPageTemplate";
import { getAllPosts } from "@/utils/post";
import { redirect } from "next/navigation";

export const generateMetadata = ({ searchParams }: BlogPageProps) => {
  const pageParam = searchParams.page;

  const isFirstPage = !pageParam || pageParam === "1";

  return {
    title: "블로그 페이지",
    description: "최신 블로그 글 목록을 확인하세요.",
    openGraph: {
      title: "블로그 페이지",
      description: "최신 블로그 글 목록을 확인하세요.",
      url: isFirstPage
        ? `${BASE_URL}/blog`
        : `${BASE_URL}/blog?page=${pageParam}`,
      type: "website",
    },
    alternates: {
      canonical: isFirstPage
        ? `${BASE_URL}/blog`
        : `${BASE_URL}/blog?page=${pageParam}`,
    },
  };
};

export const revalidate = 60;

interface BlogPageProps {
  searchParams: { [key: string]: string | undefined };
}

const BlogPage = async ({ searchParams }: BlogPageProps) => {
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
        name: `블로그`,
        item: `${BASE_URL}/blog`,
      },
    ],
  };
  const pageParam = searchParams.page;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const isInvalidPageParam = isNaN(currentPage) || currentPage <= 0;

  if (isInvalidPageParam) {
    redirect("/blog");
  }

  const { postList, totalPostCount, categoryCounts } = await getAllPosts({
    page: currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const totalPages = Math.ceil(totalPostCount / DEFAULT_PAGE_SIZE);

  if (!!totalPages && totalPages < currentPage) {
    redirect("/blog");
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

export default BlogPage;

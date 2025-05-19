import { BASE_URL } from "@/constants/basic.constants";
import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogDateTemplate from "@/templates/BlogDateTemplate";
import { getPostsByDate } from "@/utils/post";
import { redirect } from "next/navigation";

interface BlogYearPageProps {
  params: { year: string };
  searchParams: { [key: string]: string | undefined };
}

export const generateMetadata = ({
  params,
  searchParams,
}: BlogYearPageProps) => {
  const { year } = params;
  const pageParam = searchParams.page;
  const isFirstPage = !pageParam || pageParam === "1";

  return {
    title: `${year}년도 게시물`,
    description: `${year}년도 작성된 블로그 글 목록을 확인하세요.`,
    openGraph: {
      title: `${year}년도 게시물`,
      description: `${year}년도 작성된 블로그 글 목록을 확인하세요.`,
      url: isFirstPage
        ? `${BASE_URL}/blog/year/${year}`
        : `${BASE_URL}/blog/year/${year}?page=${pageParam}`,
      type: "website",
    },
    alternates: {
      canonical: isFirstPage
        ? `${BASE_URL}/blog/year/${year}`
        : `${BASE_URL}/blog/year/${year}?page=${pageParam}`,
    },
  };
};

const BlogYearPage = async ({ params, searchParams }: BlogYearPageProps) => {
  const { year } = params;

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
      {
        "@type": "ListItem",
        position: 3,
        name: `${year}년`,
        item: `${BASE_URL}/blog/year/${year}`,
      },
    ],
  };
  const pageParam = searchParams.page;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const isInvalidPageParam = isNaN(currentPage) || currentPage <= 0;

  if (isInvalidPageParam) {
    redirect(`/posts/year/${year}`);
  }

  const { postList, totalPostCount } = await getPostsByDate({
    type: "year",
    date: year,
    page: currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const yearText = `${year}년`;
  const totalPages = Math.ceil(totalPostCount / DEFAULT_PAGE_SIZE);

  return (
    <>
      <BlogDateTemplate
        dateText={yearText}
        postList={postList}
        postCount={totalPostCount}
        currentPage={currentPage}
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

export default BlogYearPage;

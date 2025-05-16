import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogDateTemplate from "@/templates/BlogDateTemplate";
import { formatToKoreanMonth } from "@/utils/date";
import { getPostsByDate } from "@/utils/post";
import { redirect } from "next/navigation";

interface BlogMonthPageProps {
  params: { month: string };
  searchParams: { [key: string]: string | undefined };
}

export const generateMetadata = ({
  params,
  searchParams,
}: BlogMonthPageProps) => {
  const { month } = params;
  const pageParam = searchParams.page;
  const isFirstPage = !pageParam || pageParam === "1";

  return {
    title: `${BASE_META_TITLE}|${month}월 게시물`,
    description: `${month}월 작성된 블로그 글 목록을 확인하세요.`,
    openGraph: {
      title: `${month} 게시물`,
      description: `${month} 작성된 블로그 글 목록을 확인하세요.`,
      url: isFirstPage
        ? `${BASE_URL}/blog/month/${month}`
        : `${BASE_URL}/blog/month/${month}?page=${pageParam}`,
      type: "website",
    },
    alternates: {
      canonical: isFirstPage
        ? `${BASE_URL}/blog/month/${month}`
        : `${BASE_URL}/blog/month/${month}?page=${pageParam}`,
    },
  };
};

const BlogMonthPage = async ({ params, searchParams }: BlogMonthPageProps) => {
  const { month } = params;

  const pageParam = searchParams.page;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const isInvalidPageParam = isNaN(currentPage) || currentPage <= 0;

  if (isInvalidPageParam) {
    redirect(`/posts/month/${month}`);
  }
  const formattedMonth = formatToKoreanMonth(month);

  const { postList, totalPostCount } = await getPostsByDate({
    type: "month",
    date: month,
    page: currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const totalPages = Math.ceil(totalPostCount / DEFAULT_PAGE_SIZE);

  return (
    <BlogDateTemplate
      dateText={formattedMonth}
      postList={postList}
      postCount={totalPostCount}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
};

export default BlogMonthPage;

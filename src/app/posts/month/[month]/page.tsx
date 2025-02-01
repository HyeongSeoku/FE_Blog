import BlogPostCard from "@/components/BlogPostCard";
import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogDateTemplate from "@/templates/BlogDateTemplate";
import { formatToKoreanMonth, getDate } from "@/utils/date";
import { getPostsByDate } from "@/utils/post";
import dayjs from "dayjs";
import { redirect } from "next/navigation";

interface BlogMonthPageProps {
  params: { month: string };
  searchParams: { [key: string]: string | undefined };
}

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

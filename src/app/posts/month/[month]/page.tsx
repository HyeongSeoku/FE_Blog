import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogDateTemplate from "@/templates/BlogDateTemplate";
import { formatToKoreanMonth } from "@/utils/date";
import { getPostsByDate } from "@/utils/post";
import { redirect } from "next/navigation";

export const generateMetadata = ({ params }: { params: { month: string } }) => {
  const { month } = params;

  const metadata = {
    title: `${month} 게시물`,
    description: `${month} 작성된 블로그 글 목록을 확인하세요.`,
    openGraph: {
      title: `${month} 게시물`,
      description: `${month} 작성된 블로그 글 목록을 확인하세요.`,
      url: `/blog/month/${month}`,
      type: "website",
    },
  };

  return metadata;
};

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

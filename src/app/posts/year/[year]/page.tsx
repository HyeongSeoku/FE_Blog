import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogDateTemplate from "@/templates/BlogDateTemplate";
import { getPostsByDate } from "@/utils/post";
import { redirect } from "next/navigation";

export const generateMetadata = ({ params }: { params: { year: string } }) => {
  const { year } = params;

  const metadata = {
    title: `${year}년도 게시물`,
    description: `${year}년도 작성된 블로그 글 목록을 확인하세요.`,
    openGraph: {
      title: `${year}년도 게시물`,
      description: `${year}년도 작성된 블로그 글 목록을 확인하세요.`,
      url: `/blog/year/${year}`,
      type: "website",
    },
  };

  return metadata;
};

interface BlogYearPageProps {
  params: { year: string };
  searchParams: { [key: string]: string | undefined };
}
const BlogYearPage = async ({ params, searchParams }: BlogYearPageProps) => {
  const { year } = params;
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
    <BlogDateTemplate
      dateText={yearText}
      postList={postList}
      postCount={totalPostCount}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
};

export default BlogYearPage;

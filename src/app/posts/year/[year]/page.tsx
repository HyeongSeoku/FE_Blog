import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogDateTemplate from "@/templates/BlogDateTemplate";
import { getPostsByDate } from "@/utils/post";
import { redirect } from "next/navigation";

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

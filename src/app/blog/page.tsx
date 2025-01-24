import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogPageTemplate from "@/templates/BlogPageTemplate";
import { getAllPosts } from "@/utils/post";
import { redirect } from "next/navigation";

export const metadata = {
  title: "블로그 페이지",
  description: "최신 블로그 글 목록을 확인하세요.",
};

export const generateStaticParams = async () => {
  const { postList } = await getAllPosts({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  return postList.map((post) => ({ slug: post.slug }));
};

interface BlogPageProps {
  searchParams: { [key: string]: string | undefined };
}

const BlogPage = async ({ searchParams }: BlogPageProps) => {
  const isInvalidPageParam =
    (searchParams.page !== undefined && isNaN(Number(searchParams.page))) ||
    Number(searchParams.page) === 0;

  if (isInvalidPageParam) {
    redirect("/blog");
  }

  const currentPage = parseInt(searchParams.page || "1", 10);
  const pageSize = DEFAULT_PAGE_SIZE;

  const { postList, totalPostCount, categoryCounts } = await getAllPosts({
    page: currentPage,
    pageSize,
  });
  const maxPage = Math.ceil(totalPostCount / pageSize);
  const totalPages = Math.ceil(totalPostCount / pageSize);

  if (maxPage && maxPage < currentPage) {
    redirect("/blog");
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

export default BlogPage;

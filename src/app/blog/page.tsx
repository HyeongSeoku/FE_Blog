import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogPageTemplate from "@/templates/BlogPageTemplate";
import { getAllPosts } from "@/utils/post";
import { redirect } from "next/navigation";

export const metadata = {
  title: "블로그 페이지",
  description: "최신 블로그 글 목록을 확인하세요.",
  openGraph: {
    title: "블로그 페이지",
    description: "최신 블로그 글 목록을 확인하세요.",
    url: "/blog",
    type: "website",
  },
};

export const revalidate = 60;

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

  if (totalPages < currentPage) {
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

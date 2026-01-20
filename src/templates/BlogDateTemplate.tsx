"use client";

import BlogPostListItem from "@/components/BlogPostListItem";
import Pagination from "@/components/Pagination";
import { PostDataProps } from "@/types/posts";
import { usePathname, useRouter } from "next/navigation";

export interface BlogDateTemplateProps {
  dateText: string;
  postCount: number;
  postList: PostDataProps[];
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

const BlogDateTemplate = ({
  dateText,
  postCount,
  postList,
  currentPage,
  totalPages,
  basePath,
}: BlogDateTemplateProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const resolvedPath = basePath || pathname;

  const handlePagination = (pageNumber: number) => {
    if (pageNumber === 1) {
      router.replace(resolvedPath);
      return;
    }
    router.replace(`${resolvedPath}/p/${pageNumber}`);
  };

  return (
    <div className="w-full h-full flex flex-col flex-grow max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {dateText}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {postCount}개의 포스트
        </p>
      </div>

      {/* 게시물 리스트 */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {postList.map((post) => (
          <BlogPostListItem
            key={post.slug}
            title={post.title}
            description={post.description}
            createdAt={post.createdAt}
            slug={post.slug}
            thumbnail={post.thumbnail}
            category={post.category}
            subCategory={post.subCategory}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <section className="mt-12 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePagination}
            moveByLink
            pathname={resolvedPath}
            pageSegment="p"
          />
        </section>
      )}
    </div>
  );
};

export default BlogDateTemplate;

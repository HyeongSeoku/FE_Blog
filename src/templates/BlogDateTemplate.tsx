"use client";

import { usePathname, useRouter } from "next/navigation";
import BlogPostListItem from "@/components/BlogPostListItem";
import Pagination from "@/components/Pagination";
import type { PostDataProps } from "@/types/posts";

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
      <div className="mb-section-lg">
        <h1 className="text-h1 font-bold text-theme mb-2">{dateText}</h1>
        <p className="text-meta text-muted">{postCount}개의 포스트</p>
      </div>

      {/* 게시물 리스트 */}
      <div className="flex flex-col gap-item">
        {postList.map((post, index) => (
          <BlogPostListItem
            key={post.slug}
            title={post.title}
            createdAt={post.createdAt}
            slug={post.slug}
            index={index}
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

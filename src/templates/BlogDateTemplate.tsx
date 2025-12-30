"use client";

import BlogPostCard from "@/components/BlogPostCard";
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
    router.replace(`${resolvedPath}/page/${pageNumber}`);
  };

  return (
    <div className="w-full h-full flex flex-col flex-grow">
      <h3 className="text-4xl font-bold">{dateText}</h3>
      <p>{postCount}개의 포스트</p>
      <ul>
        {postList.map(
          ({ title, createdAt, description, slug, tags, thumbnail }) => (
            <BlogPostCard
              key={slug}
              title={title}
              createdAt={createdAt}
              description={description}
              slug={slug}
              tagList={tags}
              thumbnail={thumbnail}
            />
          ),
        )}
      </ul>

      <section className="mt-auto">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePagination}
          moveByLink
          pathname={resolvedPath}
          pageSegment="page"
        />
      </section>
    </div>
  );
};

export default BlogDateTemplate;

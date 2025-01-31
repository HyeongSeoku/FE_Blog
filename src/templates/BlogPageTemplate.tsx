"use client";

import BlogPostCard from "@/components/BlogPostCard";
import Pagination from "@/components/Pagination";
import PostCategoryCount from "@/components/PostCategoryCount";
import { CATEGORY_MAP, DEFAULT_CATEGORY_ALL } from "@/constants/post.constants";
import { PostDataProps } from "@/types/posts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface BlogPageTemplateProps {
  postList: PostDataProps[];
  currentPage: number;
  totalPostCount: number;
  categoryCounts: Record<string, number>;
  totalPages: number;
}

const BlogPageTemplate = ({
  postList,
  currentPage,
  totalPostCount,
  categoryCounts,
  totalPages,
}: BlogPageTemplateProps) => {
  const categoryKeys = [DEFAULT_CATEGORY_ALL, ...Object.keys(CATEGORY_MAP)];
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handlePagination = (pageNumber: number) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", pageNumber.toString());

    if (pageNumber === 1) {
      router.replace(`${pathname}`);
      return;
    }
    router.replace(`${pathname}?${currentParams}`);
  };

  //TODO: 게시물이 없을때의 화면 처리 필요
  return (
    <div className="w-full h-full flex flex-col flex-grow">
      <ul className="flex items-center gap-3">
        {categoryKeys.map((key) => {
          const isKeyDefault =
            key.toUpperCase() === DEFAULT_CATEGORY_ALL.toUpperCase();
          const categoryPostCount = isKeyDefault
            ? totalPostCount
            : categoryCounts[key];

          return (
            <PostCategoryCount
              key={key}
              categoryKey={key}
              categoryPostCount={categoryPostCount}
              isDefault={isKeyDefault}
            />
          );
        })}
      </ul>
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
          pageParam="page"
        />
      </section>
    </div>
  );
};

export default BlogPageTemplate;

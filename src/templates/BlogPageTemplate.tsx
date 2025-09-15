"use client";

import BlogPostCard from "@/components/BlogPostCard";
import Pagination from "@/components/Pagination";
import PostCategoryCount from "@/components/PostCategoryCount";
import {
  CATEGORY_DESCRIPTION_BIG,
  CATEGORY_MAP,
  DEFAULT_CATEGORY_ALL,
} from "@/constants/post.constants";
import { PostDataProps } from "@/types/posts";
import classNames from "classnames";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";

const BlogPageTemplateWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-full flex flex-col flex-grow">{children}</div>
  );
};

const CategoryInfo = ({ category }: { category: string }) => {
  const upperCategory = category.toUpperCase();
  const categoryDescription =
    CATEGORY_DESCRIPTION_BIG[category.toUpperCase()] || "";
  return (
    <section
      className={classNames(
        "my-2 px-4 py-4 w-fit rounded-md bg-gray-300 bg-opacity-70 transition-colors duration-300",
        "dark:bg-gray-700 bg-opacity-70 ",
      )}
    >
      <div className="flex gap-2 items-center">
        <span className="font-bold">{upperCategory}</span>
        <span>카테고리 글입니다.</span>
      </div>

      {!!categoryDescription && <div>{categoryDescription}</div>}
    </section>
  );
};

const CategoryList = ({
  totalPostCount,
  categoryCounts,
}: {
  totalPostCount: number;
  categoryCounts: Record<string, number>;
}) => {
  const categoryKeys = [DEFAULT_CATEGORY_ALL, ...Object.keys(CATEGORY_MAP)];

  return (
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
  );
};

const CategoryPostList = ({ postList }: { postList: PostDataProps[] }) => {
  return (
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
  );
};

export interface BlogPageTemplateProps {
  postList: PostDataProps[];
  currentPage: number;
  totalPostCount: number;
  categoryCounts: Record<string, number>;
  totalPages: number;
  category?: string;
}

const BlogPageTemplate = ({
  postList,
  currentPage,
  totalPostCount,
  categoryCounts,
  totalPages,
  category = "",
}: BlogPageTemplateProps) => {
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

  if (!postList.length) {
    return (
      <BlogPageTemplateWrapper>
        <CategoryList
          totalPostCount={totalPostCount}
          categoryCounts={categoryCounts}
        />
        {!!category && <CategoryInfo category={category} />}

        <div className="flex flex-col items-center justify-center w-full h-full my-auto gap-4">
          <h3 className="text-2xl font-semibold">등록된 게시물이 없습니다.</h3>
          <button
            className="rounded-md bg-primary hover:bg-primary-hover py-2 px-3 transition-[background-color] duration-300"
            onClick={() => router.back()}
          >
            뒤로가기
          </button>
        </div>
      </BlogPageTemplateWrapper>
    );
  }

  return (
    <BlogPageTemplateWrapper>
      <CategoryList
        totalPostCount={totalPostCount}
        categoryCounts={categoryCounts}
      />
      {!!category && <CategoryInfo category={category} />}

      <CategoryPostList postList={postList} />

      <section className="mt-auto">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePagination}
          moveByLink
          pageParam="page"
        />
      </section>
    </BlogPageTemplateWrapper>
  );
};

export default BlogPageTemplate;

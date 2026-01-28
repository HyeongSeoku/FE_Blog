"use client";

import BlogPostListItem from "@/components/BlogPostListItem";
import Pagination from "@/components/Pagination";
import { CATEGORY_MAP, DEFAULT_CATEGORY_ALL } from "@/constants/post.constants";
import { PostDataProps } from "@/types/posts";
import classNames from "classnames";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

import TagIcon from "@/icon/tag.svg";
import CalendarIcon from "@/icon/calendar.svg";

const BlogPageTemplateWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-full flex flex-col flex-grow max-w-4xl mx-auto">
      {children}
    </div>
  );
};

// 카테고리 탭 네비게이션
const CategoryTabs = ({
  totalPostCount,
  categoryCounts,
  currentCategory,
}: {
  totalPostCount: number;
  categoryCounts: Record<string, number>;
  currentCategory?: string;
}) => {
  const categoryKeys = [DEFAULT_CATEGORY_ALL, ...Object.keys(CATEGORY_MAP)];
  const isAllSelected =
    !currentCategory || currentCategory === DEFAULT_CATEGORY_ALL;

  return (
    <nav className="flex items-center gap-6 mb-6 flex-wrap">
      {/* 카테고리 탭 */}
      {categoryKeys.map((key) => {
        const isKeyDefault =
          key.toUpperCase() === DEFAULT_CATEGORY_ALL.toUpperCase();
        const count = isKeyDefault ? totalPostCount : categoryCounts[key] || 0;
        const isSelected = isKeyDefault
          ? isAllSelected
          : currentCategory?.toUpperCase() === key.toUpperCase();
        const href = isKeyDefault ? "/blog" : `/blog/${key.toLowerCase()}`;

        return (
          <Link
            key={key}
            href={href}
            className={classNames(
              "text-2xl transition-colors duration-200",
              isSelected
                ? "font-bold text-gray-900 dark:text-white"
                : "font-light text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300",
            )}
            replace
          >
            {key}
            {isSelected && (
              <sup className="ml-0.5 text-xs font-normal text-gray-400">
                {count}
              </sup>
            )}
          </Link>
        );
      })}

      {/* 구분선 */}
      <span className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-600" />

      {/* 서브 링크 */}
      <div className="flex items-center gap-4">
        <Link
          href="/blog/tags"
          className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
        >
          <TagIcon className="w-4 h-4" />
          Tags
        </Link>
        <Link
          href="/blog/archive"
          className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
        >
          <CalendarIcon className="w-4 h-4" /> Archive
        </Link>
      </div>
    </nav>
  );
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  ALL: "",
  DEV: "개발 관련 기술, 트러블슈팅, 코드 리뷰 등 개발자로서의 성장 기록을 담았습니다.",
  LIFE: "일상의 소소한 이야기와 개인적인 생각들을 기록합니다.",
  ETC: "카테고리에 딱 맞지 않는 다양한 주제의 글들을 모았습니다.",
};

const BlogDescription = ({ category }: { category?: string }) => {
  const normalizedCategory = category?.toUpperCase() || "ALL";
  const description = CATEGORY_DESCRIPTIONS[normalizedCategory];

  if (!description) return null;

  return (
    <p className="text-gray-500 dark:text-gray-400 mb-12 max-w-md">
      {description}
    </p>
  );
};

// 게시물 리스트
const BlogPostList = ({ postList }: { postList: PostDataProps[] }) => {
  return (
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
  );
};

export interface BlogPageTemplateProps {
  postList: PostDataProps[];
  currentPage: number;
  totalPostCount: number;
  categoryCounts: Record<string, number>;
  totalPages: number;
  category?: string;
  basePath?: string;
}

const BlogPageTemplate = ({
  postList,
  currentPage,
  totalPostCount,
  categoryCounts,
  totalPages,
  category = "",
  basePath,
}: BlogPageTemplateProps) => {
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

  if (!postList.length) {
    return (
      <BlogPageTemplateWrapper>
        <CategoryTabs
          totalPostCount={totalPostCount}
          categoryCounts={categoryCounts}
          currentCategory={category}
        />
        <BlogDescription category={category} />

        <div className="flex flex-col items-center justify-center w-full h-64 gap-4">
          <p className="text-gray-500 dark:text-gray-400">
            등록된 게시물이 없습니다.
          </p>
          <button
            className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
      <CategoryTabs
        totalPostCount={totalPostCount}
        categoryCounts={categoryCounts}
        currentCategory={category}
      />
      <BlogDescription category={category} />

      <BlogPostList postList={postList} />

      {/* 페이지네이션 또는 Load More */}
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
    </BlogPageTemplateWrapper>
  );
};

export default BlogPageTemplate;

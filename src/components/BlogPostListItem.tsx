"use client";

import { getDate } from "@/utils/date";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";

const CATEGORY_COLORS: Record<string, string> = {
  DEV: "text-blue-600 dark:text-blue-400",
  LIFE: "text-emerald-600 dark:text-emerald-400",
  ETC: "text-purple-600 dark:text-purple-400",
  FRONTEND: "text-blue-600 dark:text-blue-400",
  BACKEND: "text-orange-600 dark:text-orange-400",
  DESIGN: "text-pink-600 dark:text-pink-400",
  DEVOPS: "text-teal-600 dark:text-teal-400",
  CAREER: "text-amber-600 dark:text-amber-400",
  REFACTORING: "text-violet-600 dark:text-violet-400",
};

const getCategoryColor = (category: string): string => {
  return (
    CATEGORY_COLORS[category.toUpperCase()] ||
    "text-gray-600 dark:text-gray-400"
  );
};

export interface BlogPostListItemProps {
  title: string;
  description: string;
  createdAt: string;
  slug: string;
  thumbnail: string;
  category: string;
  subCategory?: string;
}

const BlogPostListItem = ({
  title,
  description,
  createdAt,
  slug,
  thumbnail,
  category,
  subCategory,
}: BlogPostListItemProps) => {
  const formattedDate = getDate("MMM DD, YYYY", createdAt);
  const displayCategory = subCategory || category;
  const isDefaultThumbnail = thumbnail === "/image/default_img.webp";

  return (
    <article className="group py-8 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <div className="flex gap-6 min-md:gap-8">
        <div className="flex flex-col gap-2 flex-shrink-0">
          <Link
            href={`/posts/${slug}`}
            className={classNames(
              "rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800",
              "w-24 h-24 min-md:w-48 min-md:h-32",
            )}
          >
            {!isDefaultThumbnail ? (
              <Image
                src={thumbnail}
                alt={title}
                width={192}
                height={128}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <svg
                  className="w-6 h-6 min-md:w-8 min-md:h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </Link>
          <time className="text-xs min-md:text-sm text-gray-400 dark:text-gray-500">
            {formattedDate}
          </time>
        </div>

        <div className="flex-1 min-w-0">
          <span
            className={classNames(
              "text-xs font-semibold uppercase tracking-wider mb-2 block",
              getCategoryColor(displayCategory),
            )}
          >
            {displayCategory}
          </span>

          <Link href={`/posts/${slug}`}>
            <h2 className="text-lg min-md:text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
              {title}
            </h2>
          </Link>

          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {description}
          </p>

          <Link
            href={`/posts/${slug}`}
            className="inline-flex items-center text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
          >
            Read Article
            <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPostListItem;

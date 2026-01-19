"use client";

import { getDate } from "@/utils/date";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getTagPath } from "@/utils/path";
import classNames from "classnames";

export type BlogPostCardVariant = "featured" | "standard" | "wide";

export interface BlogPostCardProps {
  title: string;
  createdAt: string;
  description: string;
  tagList?: string[];
  slug: string;
  thumbnail: string;
  variant?: BlogPostCardVariant;
}

const BlogPostCard = ({
  title,
  createdAt,
  description,
  tagList,
  slug,
  thumbnail = "/image/default_img.webp",
  variant = "standard",
}: BlogPostCardProps) => {
  const formattedDate = getDate("YYYY.MM.DD", createdAt);
  const tagLabel = tagList?.[0];
  const isDefaultThumbnail = thumbnail === "/image/default_img.webp";

  const pathname = usePathname();
  const replacePathList = ["year", "month", "tags"];

  const isReplace = replacePathList.some((path) => pathname.includes(path));
  const isFeatured = variant === "featured";
  const isWide = variant === "wide";

  const tagListView = !!tagList?.length && (
    <ul className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
      {tagList.slice(0, 3).map((item, idx) => (
        <li
          key={`${item}_${idx}`}
          className="rounded-full bg-[var(--bg-gray-color)] px-2 py-1 transition-colors duration-300 hover:bg-[var(--bg-gray-hover-color)]"
        >
          <Link replace={isReplace} href={getTagPath(item)}>
            {item}
          </Link>
        </li>
      ))}
    </ul>
  );

  if (isFeatured) {
    return (
      <li className="h-full min-lg:col-span-2 min-lg:row-span-2">
        <article className="group relative h-full overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-neutral-900/80">
          <Link
            replace={isReplace}
            href={`/posts/${slug}`}
            aria-label={title}
            className="relative flex h-full flex-col justify-end p-6 text-white"
          >
            <Image
              src={thumbnail}
              alt={title}
              fill
              className={classNames(
                "transition-transform duration-700",
                isDefaultThumbnail
                  ? "object-contain bg-[var(--bg-gray-color)]"
                  : "object-cover",
                "group-hover:scale-105",
              )}
              sizes="(min-width: 1024px) 700px, 100vw"
              priority
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span className="relative z-10">
              {tagLabel && (
                <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-wide">
                  {tagLabel}
                </span>
              )}
              <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
                {title}
              </h2>
              <p className="mt-2 max-w-[480px] text-sm text-white/80 line-clamp-2">
                {description}
              </p>
              <time className="mt-4 text-xs text-white/70">
                {formattedDate}
              </time>
            </span>
          </Link>
        </article>
        {tagListView && <div className="mt-3">{tagListView}</div>}
      </li>
    );
  }

  return (
    <li className={classNames("h-full", isWide && "min-lg:col-span-2")}>
      <article
        className={classNames(
          "group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-neutral-900/80",
          isWide && "min-md:flex-row",
        )}
      >
        <Link
          replace={isReplace}
          href={`/posts/${slug}`}
          className={classNames(
            "relative w-full overflow-hidden",
            isWide ? "min-md:w-1/2 min-md:min-h-[220px]" : "aspect-[4/3]",
          )}
        >
          <Image
            src={thumbnail}
            alt={title}
            fill
            className={classNames(
              "transition-transform duration-700",
              isDefaultThumbnail
                ? "object-contain bg-[var(--bg-gray-color)]"
                : "object-cover",
              "group-hover:scale-105",
            )}
            sizes={isWide ? "(min-width: 768px) 360px, 100vw" : "100vw"}
            loading="lazy"
          />
        </Link>
        <div className="flex flex-1 flex-col px-5 py-4">
          {tagLabel && (
            <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs uppercase tracking-wide text-gray-600 dark:bg-white/10 dark:text-gray-300">
              {tagLabel}
            </span>
          )}
          <Link
            replace={isReplace}
            href={`/posts/${slug}`}
            className="mt-3 text-xl font-semibold leading-snug text-gray-900 transition-colors duration-300 hover:text-gray-500 dark:text-white dark:hover:text-gray-300"
          >
            {title}
          </Link>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2 dark:text-gray-400">
            {description}
          </p>
          <div className="mt-auto">
            <time className="text-xs text-gray-400">{formattedDate}</time>
            {tagListView && <div className="mt-3">{tagListView}</div>}
          </div>
        </div>
      </article>
    </li>
  );
};

export default BlogPostCard;

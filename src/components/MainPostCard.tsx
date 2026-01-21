"use client";

import { getDate } from "@/utils/date";
import { PostDataProps } from "@/types/posts";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 레이아웃 크기만 나타내는 variant (Category와 무관)
// - large: 8컬럼, 2행 - 메인 피처 카드
// - side: 4컬럼, 2행 - 사이드 피처 카드
// - standard: 4컬럼 - 기본 카드
// - wide: 12컬럼 - 전체 너비 카드
export type MainPostCardVariant = "large" | "side" | "standard" | "wide";

export interface MainPostCardProps extends Omit<
  PostDataProps,
  "slug" | "content"
> {
  link: string;
  imgAlt?: string;
  categoryType?: "SUB" | "MAIN";
  variant?: MainPostCardVariant;
}

const getCategoryLabel = (
  category: PostDataProps["category"],
  subCategory?: PostDataProps["subCategory"],
): string => {
  if (subCategory) {
    const categoryMap: Record<string, string> = {
      FE: "FRONTEND",
      BE: "BACKEND",
      DEV_OTHER: "DEV",
      WORK: "WORK",
      HOBBY: "HOBBY",
      BOOK: "BOOK",
      PHOTO: "PHOTO",
      MUSIC: "MUSIC",
    };
    return categoryMap[subCategory] || subCategory;
  }
  return category;
};

// 공통 카드 스타일 클래스
const cardBaseClass =
  "group relative overflow-hidden rounded-3xl bg-[#f8f8f8] dark:bg-neutral-900/80 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-none dark:hover:shadow-white/5 transition-all duration-500 hover:-translate-y-1 border border-gray-200/60 dark:border-white/5";

// 카테고리 태그 스타일 (standard와 동일)
const categoryTagClass =
  "w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors cursor-pointer";

// 카테고리 태그 스타일 (라이트 버전 - 배경 이미지 위에서 사용)
const categoryTagLightClass =
  "w-fit rounded-full backdrop-blur-sm bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/90 hover:bg-white/30 transition-colors border border-white/10 cursor-pointer";

// 날짜 스타일
const dateClass = "text-xs text-gray-500 dark:text-gray-500";

// 날짜 스타일 (라이트 버전)
const dateLightClass = "text-xs text-white/70";

const MainPostCard = ({
  link,
  title,
  description,
  createdAt,
  category,
  subCategory,
  imgAlt = "default image alt",
  thumbnail = "/image/default_img.webp",
  variant = "standard",
}: MainPostCardProps) => {
  const router = useRouter();
  const isDefaultThumbnail = thumbnail === "/image/default_img.webp";
  const categoryLabel = getCategoryLabel(category, subCategory);
  const formattedDate = getDate("YYYY.MM.DD", createdAt);

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/blog/${category.toLowerCase()}`);
  };

  // 모바일용 공통 카드 (md 이하에서 표시)
  const mobileCard = (
    <div className="tablet:hidden">
      <article className={classNames(cardBaseClass, "h-full")}>
        <Link href={link} className="flex h-full flex-col">
          <div className="relative aspect-[16/10] overflow-hidden">
            {!isDefaultThumbnail ? (
              <Image
                src={thumbnail}
                alt={imgAlt}
                fill
                className="transition-transform duration-700 object-cover group-hover:scale-105"
                sizes="100vw"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
            )}
          </div>
          <div className="flex flex-1 flex-col p-5 bg-white dark:bg-transparent">
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                className={categoryTagClass}
                onClick={handleCategoryClick}
              >
                {categoryLabel}
              </button>
              <time dateTime={createdAt} className={dateClass}>
                {formattedDate}
              </time>
            </div>
            <h2 className="text-xl font-semibold leading-snug text-gray-900 transition-colors duration-300 line-clamp-2 group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </Link>
      </article>
    </div>
  );

  // Large: 왼쪽 큰 카드 (8컬럼, 2행)
  if (variant === "large") {
    return (
      <>
        {mobileCard}
        <article
          className={classNames(cardBaseClass, "hidden tablet:block h-full")}
        >
          <div className="absolute inset-0 w-full h-full">
            {!isDefaultThumbnail ? (
              <Image
                src={thumbnail}
                alt={imgAlt}
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                sizes="(min-width: 768px) 66vw, 100vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
          </div>
          <Link
            href={link}
            aria-label={title}
            className="relative h-full flex flex-col justify-end p-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <button
                type="button"
                className={categoryTagLightClass}
                onClick={handleCategoryClick}
              >
                {categoryLabel}
              </button>
              <time dateTime={createdAt} className={dateLightClass}>
                {formattedDate}
              </time>
            </div>
            <h3 className="text-4xl font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-white/70 line-clamp-2 font-light max-w-lg text-base">
                {description}
              </p>
            )}
          </Link>
        </article>
      </>
    );
  }

  // Side: 오른쪽 사이드 카드 (4컬럼, 2행)
  if (variant === "side") {
    return (
      <>
        {mobileCard}
        <article
          className={classNames(
            cardBaseClass,
            "hidden tablet:flex h-full flex-col justify-between bg-white dark:bg-neutral-900/80",
          )}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-blue-500/10" />
          <Link
            href={link}
            className="relative z-10 flex flex-col justify-between h-full"
          >
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  className={categoryTagClass}
                  onClick={handleCategoryClick}
                >
                  {categoryLabel}
                </button>
                <time dateTime={createdAt} className={dateClass}>
                  {formattedDate}
                </time>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed line-clamp-3">
                  {description}
                </p>
              )}
            </div>
            <div className="mt-3 w-full h-44 overflow-hidden relative">
              {!isDefaultThumbnail ? (
                <Image
                  src={thumbnail}
                  alt={imgAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(min-width: 768px) 400px, 100vw"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
              )}
            </div>
          </Link>
        </article>
      </>
    );
  }

  // Wide: 가로 레이아웃 (전체 너비, 12컬럼)
  if (variant === "wide") {
    return (
      <>
        {mobileCard}
        <article
          className={classNames(
            cardBaseClass,
            "hidden tablet:flex flex-row h-[320px] bg-white dark:bg-neutral-900/80",
          )}
        >
          <Link href={link} className="w-1/2 h-full relative overflow-hidden">
            {!isDefaultThumbnail ? (
              <Image
                src={thumbnail}
                alt={imgAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 768px) 50vw, 100vw"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </Link>
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                className={categoryTagClass}
                onClick={handleCategoryClick}
              >
                {categoryLabel}
              </button>
              <time dateTime={createdAt} className={dateClass}>
                {formattedDate}
              </time>
            </div>
            <Link
              href={link}
              className="text-3xl font-medium text-gray-900 dark:text-white mb-4 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
            >
              {title}
            </Link>
            {description && (
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-lg mb-6 line-clamp-2">
                {description}
              </p>
            )}
            <Link
              href={link}
              className="flex items-center text-sm font-medium text-gray-900 dark:text-white group-hover:translate-x-2 transition-transform duration-300"
            >
              Read Article <span className="ml-1 text-sm">→</span>
            </Link>
          </div>
        </article>
      </>
    );
  }

  // Standard variant: 기본 카드
  return (
    <article
      className={classNames(
        cardBaseClass,
        "h-full bg-white dark:bg-neutral-900/80",
      )}
    >
      <Link href={link} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          {!isDefaultThumbnail ? (
            <Image
              src={thumbnail}
              alt={imgAlt}
              fill
              className="transition-transform duration-700 object-cover group-hover:scale-105"
              sizes="(min-width: 768px) 400px, 100vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2 mb-2">
            <button
              type="button"
              className={categoryTagClass}
              onClick={handleCategoryClick}
            >
              {categoryLabel}
            </button>
            <time dateTime={createdAt} className={dateClass}>
              {formattedDate}
            </time>
          </div>
          <h2 className="text-xl font-semibold leading-snug text-gray-900 transition-colors duration-300 line-clamp-2 group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
};

export default MainPostCard;

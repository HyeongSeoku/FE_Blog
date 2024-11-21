"use client";
import { Category, SubCategory } from "@/types/posts";
import { getDate } from "@/utils/date";
import { PostDataProps } from "@/utils/mdxServer";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

export interface PostCardProps extends Omit<PostDataProps, "slug" | "content"> {
  link: string;
  imgSrc?: string;
  imgAlt?: string;
  categoryType?: "SUB" | "MAIN";
}

const CATEGORY_COLORS: Record<Category | SubCategory, string> = {
  DEV: "bg-[var(--category-dev-bg)]",
  LIFE: "bg-[var(--category-life-bg)]",
  ETC: "bg-[var(--category-etc-bg)]",
  FE: "bg-[var(--category-fe-bg)]",
  BE: "bg-[var(--category-be-bg)]",
  DEV_OTHER: "bg-[var(--category-dev-other-bg)]",
  WORK: "bg-[var(--category-work-bg)]",
  HOBBY: "bg-[var(--category-hobby-bg)]",
  BOOK: "bg-[var(--category-book-bg)]",
  PHOTO: "bg-[var(--category-photo-bg)]",
  MUSIC: "bg-[var(--category-music-bg)]",
};

const PostCard = ({
  link,
  title,
  description,
  category,
  subCategory,
  tags,
  createdAt,
  imgSrc = "/image/default_img.png",
  imgAlt = "default image alt",
  categoryType = "MAIN",
}: PostCardProps) => {
  const [categoryText, categoryBgColor] = useMemo(() => {
    const isCategorySub = categoryType === "SUB";
    const text = isCategorySub ? (subCategory ?? category) : category;
    const bgColor = isCategorySub
      ? CATEGORY_COLORS[subCategory ?? category]
      : CATEGORY_COLORS[category];
    return [text, bgColor];
  }, [category, subCategory, categoryType]);

  return (
    <article className="w-64 h-80 box-border rounded-lg overflow-hidden shadow-md transform transition ease-in-out duration-300 hover:scale-102">
      <Link href={link} className="block w-full h-full bg-white">
        <div className="h-2/5 flex items-center justify-center p-3 relative overflow-hidden">
          <Image
            src={imgSrc}
            alt={imgAlt}
            width={300}
            height={300}
            style={{ height: "100%", width: "auto", objectFit: "contain" }}
          />
        </div>
        <div className="text-black px-5 py-4 h-3/5 flex flex-col justify-center">
          <div
            className={classNames(
              "w-fit px-2 py-[2px] rounded-md text-sm text-white border",
              categoryBgColor,
            )}
          >
            {categoryText}
          </div>
          <h3 className="text-xl font-semibold mt-1 ">{title}</h3>
          <p className="text-sm mb-3">{description}</p>
          {!!tags.length && (
            <>
              <div className="text-xs mb-1">태그</div>
              <ul className="flex gap-1">
                {tags.map((tagTitle, idx) => (
                  <li
                    key={`${idx}_${tagTitle}`}
                    className="w-fit h-5 rounded-md border px-2 py-1 text-xs box-border flex items-center justify-center "
                  >
                    {tagTitle}
                  </li>
                ))}
              </ul>
            </>
          )}

          <time
            dateTime={`${createdAt}`}
            className="text-[var(--gray1-text-color)] text-xs"
          >
            {getDate("YYYY.MM.DD", `${createdAt}`)}
          </time>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;

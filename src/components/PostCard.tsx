"use client";

import { Category, SubCategory } from "@/types/posts";
import { getDate } from "@/utils/date";
import { PostDataProps } from "@/utils/mdx";
import Image from "next/image";
import Link from "next/link";

export interface PostCardProps extends Omit<PostDataProps, "slug" | "content"> {
  link: string;
  imgSrc?: string;
  imgAlt?: string;
}

const CATEGORY_COLORS: Record<Category | SubCategory, string> = {
  DEV: "var(--category-dev-bg)",
  LIFE: "var(--category-life-bg)",
  ETC: "var(--category-etc-bg)",
  FE: "var(--category-fe-bg)",
  BE: "var(--category-be-bg)",
  DEV_OTHER: "var(--category-dev-other-bg)",
  WORK: "var(--category-work-bg)",
  HOBBY: "var(--category-hobby-bg)",
  BOOK: "var(--category-book-bg)",
  PHOTO: "var(--category-photo-bg)",
  MUSIC: "var(--category-music-bg)",
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
}: PostCardProps) => {
  return (
    <article className="w-64 h-80 box-border rounded-xl shadow-md transform transition ease-in-out duration-300 hover:scale-102">
      <Link
        href={link}
        className="block w-full h-full rounded-xl overflow-hidden bg-white"
      >
        <div className="bg-[var(--gray-bg-color)] h-1/3 flex items-center justify-center p-3">
          <Image
            src={imgSrc}
            alt={imgAlt}
            width={200}
            height={200}
            className="h-full object-contain"
          />
        </div>
        <div className="text-black px-5 py-4 h-2/3 bg-[var(--project-card-bg)]">
          <div className="w-fit px-2 py-[2px] rounded-3xl bg-red-500 text-sm">
            {category}
          </div>
          <h3 className="text-xl font-semibold mt-1 my-2">{title}</h3>
          <p className="text-sm mb-3">{description}</p>
          {!!tags.length && (
            <>
              <div className="text-xs mb-1">태그</div>
              <ul className="flex gap-1">
                {tags.map((tagTitle, idx) => (
                  <li
                    key={`${idx}_${tagTitle}`}
                    className="w-fit h-5 rounded-md border px-2 py-1 text-xs box-border flex items-center justify-center bg-primary text-white"
                  >
                    {tagTitle}
                  </li>
                ))}
              </ul>
            </>
          )}

          <time
            dateTime={`${createdAt}`}
            className="text-[var(--gray-text-color)] text-xs"
          >
            {getDate("YYYY.MM.DD", `${createdAt}`)}
          </time>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;

"use client";

import { Category, SubCategory } from "@/types/posts";
import { getDate } from "@/utils/date";
import { PostDataProps } from "@/utils/mdxServer";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";

export interface PostCardProps extends Omit<PostDataProps, "slug" | "content"> {
  link: string;
  imgSrc?: string;
  imgAlt?: string;
  categoryType?: "SUB" | "MAIN";
}

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
  return (
    <Link
      href={link}
      className="flex flex-col w-64 h-80 box-border rounded-lg overflow-hidden shadow-md transform transition ease-in-out duration-300 hover:scale-102 bg-white md:w-full md:h-20 md:flex-row md:bg-transparent"
    >
      <div className="h-2/5 flex items-center justify-center p-3 relative overflow-hidden md:hidden">
        <Image
          src={imgSrc}
          alt={imgAlt}
          width={300}
          height={300}
          style={{ height: "100%", width: "auto", objectFit: "contain" }}
        />
      </div>
      <div className="px-5 py-4 h-3/5 flex flex-col justify-center md:flex-row md:w-full md:h-full md:items-center md:justify-between min-md:text-black">
        <h3 className="text-xl font-semibold mt-1 ">{title}</h3>
        <p className="text-sm mb-3 md:hidden">{description}</p>
        {!!tags.length && (
          <div className="md:hidden">
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
          </div>
        )}

        <time
          dateTime={`${createdAt}`}
          className="text-[var(--gray1-text-color)] text-xs"
        >
          {getDate("YYYY.MM.DD", `${createdAt}`)}
        </time>
      </div>
    </Link>
  );
};

export default PostCard;

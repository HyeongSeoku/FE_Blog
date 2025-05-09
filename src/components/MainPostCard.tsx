"use client";

import { getDate } from "@/utils/date";
import { PostDataProps } from "@/types/posts";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { CATEGORY_MAP } from "@/constants/post.constants";
import { CATEGORY_COLORS } from "@/constants/style.constants";
import { getTagPath } from "@/utils/path";

export interface MainPostCardProps
  extends Omit<PostDataProps, "slug" | "content"> {
  link: string;
  imgSrc?: string;
  imgAlt?: string;
  categoryType?: "SUB" | "MAIN";
}

const MainPostCard = ({
  link,
  title,
  description,
  category,
  tags,
  createdAt,
  imgSrc = "/image/default_img.png",
  imgAlt = "default image alt",
}: MainPostCardProps) => {
  return (
    <article className="flex flex-col h-72 box-border group min-xl:min-w-80">
      <Link
        href={link}
        className={classNames(
          "aspect-[3/2] bg-opposite-theme rounded-md flex items-center justify-center p-3 relative overflow-hidden",
          "duration-300 group-hover:-translate-y-2",
          "group-hover:shadow-md",
          "dark:group-hover:shadow-[0_4px_12px_#ffffff1a]",
        )}
      >
        <Image
          src={imgSrc}
          alt={imgAlt}
          fill
          objectFit="contain"
          priority
          className="bg-gray-100 dark:bg-gray-300"
        />
        <div
          className={classNames(
            "w-fit h-6 rounded-md border px-2 py-1 text-xs box-border flex items-center justify-center absolute top-2 right-2",
          )}
          style={{
            backgroundColor: CATEGORY_COLORS[category],
            borderColor: CATEGORY_COLORS[category],
          }}
        >
          {CATEGORY_MAP[category].title}
        </div>
      </Link>
      <div className="py-2 flex flex-col justify-center">
        <Link href={link}>
          <h2
            className={classNames(
              "text-2xl font-semibold mt-1",
              "transition-colors duration-300 dark:text-gray-300 text-gray-500 hover:text-theme hover:dark:text-theme",
            )}
          >
            {title}
          </h2>
        </Link>

        <Link href={link}>
          <p
            className={classNames(
              "text-sm mb-2",
              "transition-colors duration-300 dark:text-gray-300 text-gray-500 hover:text-theme hover:dark:text-theme",
            )}
          >
            {description}
          </p>
        </Link>
        {!!tags.length && (
          <ul className="flex gap-1">
            {tags.map((tagTitle, idx) => (
              <li
                key={`${idx}_${tagTitle}`}
                className={classNames(
                  "w-fit rounded-md border px-2 py-1 text-xs box-border flex items-center justify-center",
                  "transition-colors duration-300 dark:text-gray-300 text-gray-500 hover:text-theme hover:dark:text-theme",
                )}
              >
                <Link href={getTagPath(tagTitle)}>{tagTitle}</Link>
              </li>
            ))}
          </ul>
        )}

        <time dateTime={`${createdAt}`} className="text-gray-400 text-xs mt-2">
          {getDate("YYYY.MM.DD", createdAt)}
        </time>
      </div>
    </article>
  );
};

export default MainPostCard;

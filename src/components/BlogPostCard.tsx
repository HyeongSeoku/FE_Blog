"use client";

import { getDate } from "@/utils/date";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

export interface BlogPostCardProps {
  title: string;
  createdAt: string;
  description: string;
  tagList?: string[];
  slug: string;
}

const BlogPostCard = ({
  title,
  createdAt,
  description,
  tagList,
  slug,
}: BlogPostCardProps) => {
  const formattedMonth = getDate("MMMM D", createdAt);
  const formattedYear = getDate("YYYY", createdAt);

  const pathname = usePathname();
  const replacePathList = ["year", "month", "tags"];

  const isReplace = replacePathList.some((path) => pathname.includes(path));

  return (
    <li className="py-5 border-b last:border-b-0">
      <Link
        replace={isReplace}
        href={`/posts/${slug}`}
        className="flex flex-col transition-colors duration-300 hover:text-gray-400"
      >
        <h3 className="text-3xl mb-1">{title}</h3>
      </Link>
      <div className="text-sm flex items-center gap-1">
        <Link
          replace={isReplace}
          href={`/posts/month/${getDate("YYYY.MM", createdAt)}`}
          className="flex flex-col transition-colors duration-300 hover:text-gray-400 mb-2"
        >
          {formattedMonth}
        </Link>
        <Link
          replace={isReplace}
          href={`/posts/year/${getDate("YYYY", createdAt)}`}
          className="flex flex-col transition-colors duration-300 hover:text-gray-400 mb-2"
        >
          {formattedYear}
        </Link>
      </div>

      <p className="text-md mb-2">{description}</p>

      {!!tagList?.length && (
        <ul className="flex gap-2 text-sm ">
          {tagList.map((item, idx) => (
            <li
              key={`${item}_${idx}`}
              className="py-1 px-2 rounded-full transition-colors duration-300 bg-[var(--bg-gray-color)] hover:bg-[var(--bg-gray-hover-color)]"
            >
              <Link
                replace={isReplace}
                href={`/tags/${item.toLocaleLowerCase()}`}
                className="w-full h-full block"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default BlogPostCard;
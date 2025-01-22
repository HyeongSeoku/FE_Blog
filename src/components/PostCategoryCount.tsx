"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface PostCategoryCountProps {
  categoryKey: string;
  categoryPostCount: number;
  isDefault: boolean;
}

const PostCategoryCount = ({
  categoryKey,
  categoryPostCount,
  isDefault,
}: PostCategoryCountProps) => {
  const pathname = usePathname();
  const isReplace = pathname.includes("blog");
  const isBlogPath = pathname === "/blog";
  const isCategorySamePath = pathname === `/blog/${categoryKey.toLowerCase()}`;

  if (isDefault) {
    return (
      <li>
        <Link href={`/blog`} replace={isReplace} className="flex gap-1 group">
          <div
            className={classNames("text-3xl group-hover:underline", {
              underline: isBlogPath,
            })}
          >
            {categoryKey}
          </div>
          <span className="text-sm font-thin">{categoryPostCount}</span>
        </Link>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={`/blog/${categoryKey.toLowerCase()}`}
        replace={isReplace}
        className="flex gap-1 group"
      >
        <div
          className={classNames("text-3xl group-hover:underline", {
            underline: isCategorySamePath,
          })}
        >
          {categoryKey}
        </div>
        <span className="text-sm font-thin">{categoryPostCount}</span>
      </Link>
    </li>
  );
};

export default PostCategoryCount;

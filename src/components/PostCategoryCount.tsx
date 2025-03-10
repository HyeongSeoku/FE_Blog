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
  // const isReplace = pathname.includes("blog");
  const isReplace = false;
  const isBlogPath = pathname === "/blog";
  const isCategorySamePath = pathname === `/blog/${categoryKey.toLowerCase()}`;

  if (isDefault) {
    return (
      <li>
        <Link href={`/blog`} replace={isReplace} className="flex gap-1 group">
          <div
            className={classNames(
              "text-3xl relative group",
              "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-current after:scale-x-0 after:transition-transform after:duration-300 after:origin-left",
              "group-hover:after:scale-x-100",
              {
                "after:scale-x-100": isBlogPath,
              },
            )}
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
          className={classNames(
            "text-3xl relative group",
            "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-current after:scale-x-0 after:transition-transform after:duration-300 after:origin-left",
            "group-hover:after:scale-x-100",
            {
              "after:scale-x-100": isCategorySamePath,
            },
          )}
        >
          {categoryKey}
        </div>
        <span className="text-sm font-thin">{categoryPostCount}</span>
      </Link>
    </li>
  );
};

export default PostCategoryCount;

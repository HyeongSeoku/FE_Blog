"use client";

import { useState, useEffect } from "react";
import { formatTagDisplay, getTagPath } from "@/utils/tag";
import classNames from "classnames";
import ArrowDown from "@/icon/arrow_right.svg";
import Link from "next/link";
import { MOBILE_WIDTH } from "@/constants/basic.constants";

interface TagItem {
  key: string;
  value: number;
}

interface ExpandableTagListProps {
  tagList: TagItem[];
  currentTag: string;
}

const TAG_WIDTH = 170;
const MOBILE_LIMIT = 4;
const DESKTOP_LIMIT = 5;

const ExpandableTagList = ({ tagList, currentTag }: ExpandableTagListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(DESKTOP_LIMIT);

  useEffect(() => {
    const updateLimit = () => {
      setVisibleLimit(
        window.innerWidth < MOBILE_WIDTH ? MOBILE_LIMIT : DESKTOP_LIMIT,
      );
    };

    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  const hasMore = tagList.length > visibleLimit;
  const visibleTags = isExpanded ? tagList : tagList.slice(0, visibleLimit);

  return (
    <div className="mb-8">
      <ul className="flex flex-wrap gap-2">
        {visibleTags.map(({ key, value }) => {
          const isSelected = currentTag === key;

          return (
            <li key={key}>
              <Link
                href={getTagPath(key)}
                style={{ width: TAG_WIDTH }}
                className={classNames(
                  "group relative flex items-center justify-between gap-1 px-3 py-2 rounded-lg",
                  "transition-all duration-200",
                  isSelected
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
                )}
              >
                <span className="truncate text-sm font-medium">
                  {formatTagDisplay(key)}
                </span>
                <span
                  className={classNames(
                    "flex-shrink-0 min-w-5 h-5 flex items-center justify-center rounded-full text-xs font-semibold",
                    isSelected
                      ? "bg-white/20 dark:bg-gray-900/20 text-white dark:text-gray-900"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
                  )}
                >
                  {value}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* 더보기/접기 버튼 */}
      {hasMore && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={classNames(
            "mt-3 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400",
            "hover:text-gray-700 dark:hover:text-gray-300 transition-colors",
          )}
        >
          <span>
            {isExpanded ? "접기" : `더보기 (+${tagList.length - visibleLimit})`}
          </span>
          <ArrowDown
            className={classNames(
              "w-4 h-4 transition-transform duration-200",
              isExpanded ? "-rotate-90" : "rotate-90",
            )}
          />
        </button>
      )}
    </div>
  );
};

export default ExpandableTagList;

"use client";

import { useState, useEffect } from "react";
import { formatTagDisplay } from "@/utils/tag";
import classNames from "classnames";
import ArrowDown from "@/icon/arrow_right.svg";
import CloseIcon from "@/icon/close_icon.svg";
import { MOBILE_WIDTH } from "@/constants/basic.constants";
import TagIcon from "@/icon/tag.svg";

interface TagItem {
  key: string;
  value: number;
}

interface MultiSelectTagListProps {
  tagList: TagItem[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

const TAG_WIDTH = 170;
const MOBILE_LIMIT = 4;
const DESKTOP_LIMIT = 5;
const SELECTED_TAG_LIMIT_MOBILE = 2;
const SELECTED_TAG_LIMIT_DESKTOP = 3;

const MultiSelectTagList = ({
  tagList,
  selectedTags,
  onTagToggle,
  onClearAll,
}: MultiSelectTagListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(DESKTOP_LIMIT);
  const [selectedTagLimit, setSelectedTagLimit] = useState(
    SELECTED_TAG_LIMIT_DESKTOP,
  );

  useEffect(() => {
    const updateLimit = () => {
      const isMobile = window.innerWidth < MOBILE_WIDTH;
      setVisibleLimit(isMobile ? MOBILE_LIMIT : DESKTOP_LIMIT);
      setSelectedTagLimit(
        isMobile ? SELECTED_TAG_LIMIT_MOBILE : SELECTED_TAG_LIMIT_DESKTOP,
      );
    };

    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  const hasMore = tagList.length > visibleLimit;
  const visibleTags = isExpanded ? tagList : tagList.slice(0, visibleLimit);

  const visibleSelectedTags = selectedTags.slice(0, selectedTagLimit);
  const hiddenSelectedCount = selectedTags.length - selectedTagLimit;

  return (
    <div className="mb-8">
      {/* 선택된 태그 표시 - 한 줄 유지, +N과 X는 항상 표시 */}
      <div className="mb-4 flex items-center gap-2 min-h-[32px]">
        <TagIcon
          width={16}
          height={16}
          className="flex-shrink-0 text-gray-500 dark:text-gray-400"
        />
        {selectedTags.length > 0 ? (
          <>
            {/* 태그 영역 - 넘치면 잘림 */}
            <div className="flex-1 flex items-center gap-2 overflow-hidden min-w-0">
              {visibleSelectedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagToggle(tag)}
                  className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors max-w-[120px]"
                >
                  <span className="truncate">#{formatTagDisplay(tag)}</span>
                  <span className="flex-shrink-0 text-blue-500 dark:text-blue-400">
                    ×
                  </span>
                </button>
              ))}
            </div>
            {/* +N과 X 버튼 - 항상 표시 */}
            {hiddenSelectedCount > 0 && (
              <span className="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                +{hiddenSelectedCount}
              </span>
            )}
            <button
              type="button"
              onClick={onClearAll}
              className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              title="전체 해제"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </>
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            태그를 선택하세요
          </span>
        )}
      </div>

      {/* 태그 목록 */}
      <ul className="flex flex-wrap gap-2">
        {visibleTags.map(({ key, value }) => {
          const isSelected = selectedTags.includes(key);

          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onTagToggle(key)}
                style={{ width: TAG_WIDTH }}
                className={classNames(
                  "group relative flex items-center justify-between gap-1 px-3 py-2 rounded-lg",
                  "transition-all duration-200",
                  isSelected
                    ? "bg-blue-600 dark:bg-blue-500 text-white ring-2 ring-blue-300 dark:ring-blue-400"
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
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
                  )}
                >
                  {value}
                </span>
              </button>
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

export default MultiSelectTagList;

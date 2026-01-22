"use client";

import useScrollPosition from "@/hooks/useScrollPosition";
import useScrollProgress from "@/hooks/useScrollProgress";
import ArrowTop from "@/icon/arrow_top.svg";
import classNames from "classnames";

const MoScrollProgress = () => {
  const progressWidth = useScrollProgress();
  const { isScrollTop } = useScrollPosition();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={classNames(
        "tablet:hidden flex flex-col items-end gap-2 transition-opacity duration-300 opacity-0",
        {
          hidden: isScrollTop,
          "opacity-100": !isScrollTop,
        },
      )}
    >
      {/* 퍼센트 표시 */}
      <div className="flex items-center gap-1.5 mr-1">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {Math.round(progressWidth)}%
        </span>
      </div>

      {/* 원형 버튼 */}
      <button
        onClick={scrollToTop}
        aria-label={`맨 위로 이동 (${Math.round(progressWidth)}% 읽음)`}
        className="group w-14 h-14 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200"
      >
        <ArrowTop
          style={{ width: 20, height: 20 }}
          className="text-white dark:text-gray-900 group-hover:animate-bounceSlight"
        />
      </button>
    </div>
  );
};

export default MoScrollProgress;

"use client";

import useScrollDirection from "@/hooks/useScrollDirection";
import useScrollPosition from "@/hooks/useScrollPosition";
import useScrollProgress from "@/hooks/useScrollProgress";
import { HEADER_SCROLL_THRESHOLD } from "@/constants/basic.constants";
import useMobileNavStore from "@/store/mobileNav";
import classNames from "classnames";

export interface ScrollProgressBarProps {
  className?: string;
}

const ScrollProgressBar = ({ className = "" }: ScrollProgressBarProps) => {
  const { isScrollTop } = useScrollPosition();
  const progressWidth = useScrollProgress();
  const scrollDirection = useScrollDirection(HEADER_SCROLL_THRESHOLD);
  const { isOpen: isMobileNavOpen } = useMobileNavStore();

  // 헤더가 보일 때 = 헤더 아래(top-14), 헤더가 숨겨질 때 = 최상단(top-0)
  const isHeaderVisible = scrollDirection === "up" || isScrollTop;

  // 모바일 메뉴가 열리면 숨김
  if (isMobileNavOpen) return null;

  return (
    <div
      className={classNames(
        "fixed left-0 right-0 z-20 transition-[top,opacity] duration-300",
        isHeaderVisible ? "top-14" : "top-0",
      )}
    >
      {/* 프로그레스바 */}
      <div
        className={classNames(
          "w-full h-1 bg-gray-200 dark:bg-gray-800 overflow-hidden",
          className,
        )}
      >
        <div
          className="h-full w-full bg-primary origin-left will-change-transform"
          style={{ transform: `scaleX(${progressWidth / 100})` }}
        />
      </div>
    </div>
  );
};

export default ScrollProgressBar;

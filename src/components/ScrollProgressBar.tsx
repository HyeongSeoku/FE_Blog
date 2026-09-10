"use client";

import { Progress } from "@seoku/design-system";
import classNames from "classnames";
import { HEADER_SCROLL_THRESHOLD } from "@/constants/basic.constants";
import useScrollDirection from "@/hooks/useScrollDirection";
import useScrollPosition from "@/hooks/useScrollPosition";
import useScrollProgress from "@/hooks/useScrollProgress";
import useMobileNavStore from "@/store/mobileNav";

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
      <Progress
        value={progressWidth}
        size="xsmall"
        className={classNames("!rounded-none", className)}
        indicatorClassName="!rounded-none !duration-0"
      />
    </div>
  );
};

export default ScrollProgressBar;

"use client";

import useScrollPosition from "@/hooks/useScrollPosition";
import useScrollProgress from "@/hooks/useScrollProgress";
import classNames from "classnames";

export interface ScrollProgressBarProps {
  className?: string;
}

const ScrollProgressBar = ({ className = "" }: ScrollProgressBarProps) => {
  const { isScrollTop } = useScrollPosition();
  const progressWidth = useScrollProgress();

  return (
    <div
      className={classNames(
        "fixed left-0 right-0 z-10 h-1 transition-[top,opacity] duration-300",
        {
          "top-0 opacity-1": !isScrollTop,
          "-top-14 opacity-0": isScrollTop,
        },
      )}
    >
      <div
        className={classNames(
          "absolute left-0 right-0 bottom-0 w-full h-1 bg-gray-300 z-10 md:hidden",
          className,
        )}
      >
        <div
          className="h-full bg-primary transition-width duration-100 ease-out"
          style={{ width: `${progressWidth}%` }}
        />
      </div>
    </div>
  );
};

export default ScrollProgressBar;

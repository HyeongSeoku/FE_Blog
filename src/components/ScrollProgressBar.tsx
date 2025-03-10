"use client";

import useScrollProgress from "@/hooks/useScrollProgress";
import classNames from "classnames";

export interface ScrollProgressBarProps {
  className?: string;
}

const ScrollProgressBar = ({ className = "" }: ScrollProgressBarProps) => {
  const progressWidth = useScrollProgress();

  return (
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
  );
};

export default ScrollProgressBar;

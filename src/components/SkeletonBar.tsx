"use client";

import classNames from "classnames";

const SkeletonBar = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={classNames(
        "w-full h-7 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse",
        className,
      )}
    ></div>
  );
};

export default SkeletonBar;

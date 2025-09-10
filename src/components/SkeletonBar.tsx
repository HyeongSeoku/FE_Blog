import classNames from "classnames";

const SkeletonBar = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={classNames(
        "w-full h-7 rounded-md bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-500 dark:via-gray-600 dark:to-gray-500 animate-shimmer bg-size-200",
        className,
      )}
    ></div>
  );
};

export default SkeletonBar;

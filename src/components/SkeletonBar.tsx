import { Skeleton } from "@seoku/design-system";
import classNames from "classnames";

const SkeletonBar = ({ className = "" }: { className?: string }) => {
  return <Skeleton className={classNames("w-full h-7", className)} />;
};

export default SkeletonBar;

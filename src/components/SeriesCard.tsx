import { SeriesMetadata } from "@/types/series";
import Link from "next/link";
import FallbackImage from "./FallbackImage";
import classNames from "classnames";

export interface SeriesCardProps extends SeriesMetadata {
  seriesKey: string;
  seriesCount: number;
  className?: string;
  isSelected?: boolean;
}

export default function SeriesCard({
  seriesKey,
  title,
  description,
  thumbnail,
  seriesCount,
  className = "",
  isSelected = false,
}: SeriesCardProps) {
  return (
    <Link
      href={`/blog/series/${seriesKey}`}
      className={classNames(
        "flex flex-col items-center h-[445px] rounded-lg overflow-hidden border group",
        className,
        {
          "shadow-[0_8px_24px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)]":
            isSelected,
          "dark:shadow-[0_8px_24px_rgba(0,32,64,0.5),0_2px_4px_rgba(0,32,64,0.3)]":
            isSelected,
        },
      )}
    >
      <div className="relative flex-[3_3_0%] w-full overflow-hidden">
        <FallbackImage
          src={thumbnail}
          alt={title}
          fill
          className="object-cover bg-gray-200 w-full h-full self-center transition-transform group-hover:scale-105"
        />
      </div>
      <div className="w-full flex-[2_2_0%] flex flex-col gap-2 p-5">
        <h3 className="font-bold text-xl">{title}</h3>
        <p
          className={classNames(
            "text-base grow-[1]",
            "text-gray-500",
            "dark:text-gray-400",
          )}
        >
          {description}
        </p>
        <span className="text-sm px-2 py-1 bg-gray-500 w-fit rounded-full text-white">
          아티클 {seriesCount}개
        </span>
      </div>
    </Link>
  );
}

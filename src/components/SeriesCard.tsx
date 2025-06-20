import { BASE_URL } from "@/constants/basic.constants";
import { SeriesMetadata } from "@/types/series";
import Link from "next/link";
import FallbackImage from "./FallbackImage";
import classNames from "classnames";

export interface SeriesCardProps extends SeriesMetadata {
  seriesKey: string;
  seriesCount: number;
  className?: string;
}

export default function SeriesCard({
  seriesKey,
  title,
  description,
  thumbnail,
  seriesCount,
  className = "",
}: SeriesCardProps) {
  return (
    <Link
      href={`${BASE_URL}/series/${seriesKey}`}
      className={classNames(
        "flex flex-col items-center h-[445px] rounded-lg overflow-hidden border",
        className,
      )}
    >
      <FallbackImage
        src={thumbnail}
        alt={title}
        width={100}
        height={100}
        className="bg-gray-200 w-full flex-[3_3_0%]"
        style={{ objectFit: "cover" }}
      />
      <div className="w-full flex-[2_2_0%] flex flex-col gap-2 p-5">
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="text-base grow-[1]">{description}</p>
        <span className="text-sm px-2 py-1 bg-gray-500 w-fit rounded-full">
          아티클 {seriesCount}개
        </span>
      </div>
    </Link>
  );
}

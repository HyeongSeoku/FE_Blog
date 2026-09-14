import dayjs from "dayjs";
import Link from "next/link";
import { getStaggerDelayMs } from "@/utils/animation";

export interface SeriesListItemProps {
  seriesKey: string;
  title: string;
  count: number;
  latestDate?: string;
  index?: number;
}

const SeriesListItem = ({
  seriesKey,
  title,
  count,
  latestDate,
  index = 0,
}: SeriesListItemProps) => {
  const formattedDate = latestDate ? dayjs(latestDate).format("YYYY. MM") : "";

  return (
    <Link
      href={`/series/${seriesKey}`}
      style={{ animationDelay: `${getStaggerDelayMs(index)}ms` }}
      className="fade-in flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 transition-opacity hover:opacity-[.55]"
    >
      <span className="flex min-w-[180px] flex-1 items-baseline gap-2 text-body text-theme">
        {title}
        <span className="shrink-0 rounded-full border border-hairline px-2 py-0.5 text-label text-muted">
          {count}편
        </span>
      </span>
      {formattedDate && (
        <span className="shrink-0 text-meta text-muted">{formattedDate}</span>
      )}
    </Link>
  );
};

export default SeriesListItem;

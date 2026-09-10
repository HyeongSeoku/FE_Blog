import dayjs from "dayjs";
import Link from "next/link";

export interface SeriesListItemProps {
  seriesKey: string;
  title: string;
  count: number;
  latestDate?: string;
}

const SeriesListItem = ({
  seriesKey,
  title,
  count,
  latestDate,
}: SeriesListItemProps) => {
  const formattedDate = latestDate ? dayjs(latestDate).format("YYYY. MM") : "";
  const meta = formattedDate ? `${formattedDate} · ${count}편` : `${count}편`;

  return (
    <Link
      href={`/series/${seriesKey}`}
      className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 transition-opacity hover:opacity-[.55]"
    >
      <span className="min-w-[180px] flex-1 text-sk-body text-theme">
        {title}
      </span>
      <span className="shrink-0 text-sk-meta text-muted">{meta}</span>
    </Link>
  );
};

export default SeriesListItem;

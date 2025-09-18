import dayjs from "dayjs";
import Image from "next/image";
import TimeIcon from "@/icon/time.svg";
import Link from "next/link";
import classNames from "classnames";

interface MoRecentPostCardProps extends RecentPostCardProps {
  isoDate: string;
}

export interface RecentPostCardProps {
  title: string;
  date: string;
  link: string;
  subTitle?: string;
  thumbnail?: string;
  readingTime?: string;
  thumbnailAlt?: string;
}

function ReadingTimeDisplay({
  readingTime,
  isoDate,
  date,
}: {
  readingTime?: string;
  isoDate: string;
  date: string;
}) {
  return (
    <div className="flex items-center justify-start w-full">
      <time dateTime={isoDate}>{date}</time>
      {readingTime !== undefined && (
        <div className="flex items-center gap-1">
          <TimeIcon style={{ width: 14, height: 14 }} stroke="black" />
          <span>{readingTime}분</span>
        </div>
      )}
    </div>
  );
}

function MoRecentPostCard({
  title,
  date,
  link,
  subTitle,
  thumbnail = "/image/default_img.png",
  readingTime,
  thumbnailAlt = "default image alt",
  isoDate,
}: MoRecentPostCardProps) {
  const isDefaultThumbnail = thumbnail === "/image/default_img.png";

  return (
    <div className="flex flex-col gap-2 items-center w-full overflow-hidden rounded-md bg-primary p-5 max-w-[333px] self-center min-md:hidden">
      <span className="text-opposite-theme bg-opposite-theme rounded-2xl px-5 py-1 font-semibold text-sm">
        새로운 콘텐츠
      </span>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-lg">{subTitle}</p>
      <div className="relative w-full aspect-[303/175] min-h-[100px]">
        <Image
          src={thumbnail}
          alt={thumbnailAlt}
          priority
          fill
          sizes="100vw"
          className={classNames(
            "bg-opposite-theme rounded-lg",
            isDefaultThumbnail ? "object-contain" : "object-cover",
          )}
        />
      </div>
      <ReadingTimeDisplay
        isoDate={isoDate}
        readingTime={readingTime}
        date={date}
      />
      <Link
        href={link}
        className="bg-opposite-theme w-full rounded-md p-3 text-opposite-theme flex items-center justify-center"
      >
        확인하기
      </Link>
    </div>
  );
}

function PcRecentPostCard({
  title,
  date,
  link,
  subTitle,
  thumbnail = "",
  readingTime,
  thumbnailAlt = "default image alt",
  isoDate,
}: MoRecentPostCardProps) {
  const isDefaultThumbnail = thumbnail === "/image/default_img.png";

  return (
    <Link
      href={link}
      className="h-96 flex gap-6 items-center w-full overflow-hidden rounded-md md:hidden group"
    >
      <div className="flex-[5] h-auto max-h-full flex items-center aspect-[500/384] relative rounded-md overflow-hidden">
        <Image
          src={thumbnail}
          alt={thumbnailAlt}
          priority
          fill
          sizes="(min-width: 768px) 760px, 100vw"
          className={classNames(
            "transition-transform duration-300 bg-opposite-theme rounded-lg group-hover:scale-105",
            isDefaultThumbnail ? "object-contain" : "object-cover",
          )}
        />
      </div>
      <div className="flex-[2] flex flex-col gap-2">
        <span className="rounded-2xl font-semibold text-lg">새로운 콘텐츠</span>
        <div className="transition-[color] group-hover:text-primary">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-lg mt-1">{subTitle}</p>
        </div>
        <ReadingTimeDisplay
          isoDate={isoDate}
          readingTime={readingTime}
          date={date}
        />
      </div>
    </Link>
  );
}

function RecentPostCard({
  title,
  date,
  link,
  subTitle,
  thumbnail = "",
  readingTime,
  thumbnailAlt = "default image alt",
}: RecentPostCardProps) {
  const isoDate = dayjs(date, "YYYY.MM.DD").isValid()
    ? dayjs(date, "YYYY.MM.DD").format("YYYY-MM-DD")
    : new Date().toISOString().split("T")[0];

  return (
    <>
      <MoRecentPostCard
        title={title}
        date={date}
        link={link}
        subTitle={subTitle}
        thumbnail={thumbnail}
        readingTime={readingTime}
        thumbnailAlt={thumbnailAlt}
        isoDate={isoDate}
      />
      <PcRecentPostCard
        title={title}
        date={date}
        link={link}
        subTitle={subTitle}
        thumbnail={thumbnail}
        readingTime={readingTime}
        thumbnailAlt={thumbnailAlt}
        isoDate={isoDate}
      />
    </>
  );
}

export default RecentPostCard;

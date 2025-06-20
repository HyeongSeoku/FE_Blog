import dayjs from "dayjs";
import Image from "next/image";
import TimeIcon from "@/icon/time.svg";
import Link from "next/link";
import DefaultImg from "@/icon/default_img.svg";

export interface RecentPostCardProps {
  title: string;
  date: string;
  link: string;
  subTitle?: string;
  thumbnail?: string;
  readingTime?: string;
  thumbnailAlt?: string;
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
  const isoDate = dayjs(date, "YYYY.MM.DD").format("YYYY-MM-DD");

  return (
    <div className="flex flex-col gap-2 items-center w-full overflow-hidden rounded-md bg-primary p-5 max-w-[333px] self-center">
      <span className="text-opposite-theme bg-opposite-theme rounded-2xl px-5 py-1 font-semibold text-sm">
        새로운 콘텐츠
      </span>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-lg">{subTitle}</p>
      <div className="w-full h-auto flex items-center aspect-[303/175] relative rounded-md">
        {!thumbnail ? (
          <Image
            src={thumbnail}
            alt={thumbnailAlt}
            priority
            fill
            className="bg-opposite-theme object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-opposite-theme rounded-lg">
            <DefaultImg />
          </div>
        )}
      </div>
      <div className="flex items-center justify-start w-full">
        <time dateTime={isoDate}>{date}</time>
        {readingTime !== undefined && (
          <div className="flex items-center">
            <TimeIcon style={{ width: 14, height: 14 }} stroke="black" />
            <p>{readingTime}</p>
            {/* TODO: 분,초 계산 필요 */}
            <span>분</span>
          </div>
        )}
      </div>
      <Link
        href={link}
        className="bg-opposite-theme w-full rounded-md p-3 text-opposite-theme flex items-center justify-center"
      >
        확인하기
      </Link>
    </div>
  );
}

export default RecentPostCard;

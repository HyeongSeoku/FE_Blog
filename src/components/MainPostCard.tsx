import { getDate } from "@/utils/date";
import { PostDataProps } from "@/types/posts";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";

export interface MainPostCardProps extends Omit<
  PostDataProps,
  "slug" | "content"
> {
  link: string;
  imgAlt?: string;
  categoryType?: "SUB" | "MAIN";
}

const MainPostCard = ({
  link,
  title,
  createdAt,
  imgAlt = "default image alt",
  thumbnail = "/image/default_img.webp",
}: MainPostCardProps) => {
  const isDefaultThumbnail = thumbnail === "/image/default_img.webp";
  return (
    <article
      className={classNames(
        "py-2 px-1 h-[100px] box-border rounded-lg",
        "transition-transform transform duration-300 hover:scale-102",
      )}
    >
      <Link href={link} className="flex items-center gap-2 w-full h-full">
        <div className="relative min-w-[120px] max-w-[25%] rounded-md aspect-[85/55]">
          <div className="w-full h-full relative">
            <Image
              src={thumbnail}
              alt={imgAlt}
              className={classNames(
                "w-full h-full rounded-md bg-gray-100",
                isDefaultThumbnail ? "object-contain" : "object-cover",
              )}
              fill
              loading="lazy"
            />
          </div>
        </div>
        <div className="h-full flex flex-col justify-between flex-1">
          <h2
            className={classNames(
              "text-2xl font-semibold mt-1",
              "transition-colors duration-300 dark:text-gray-300 text-gray-500 hover:text-theme hover:dark:text-theme",
              "line-clamp-2 break-words overflow-hidden",
            )}
          >
            {title}
          </h2>

          <time
            dateTime={`${createdAt}`}
            className="text-gray-400 text-sm mt-auto"
          >
            {getDate("YYYY.MM.DD", createdAt)}
          </time>
        </div>
      </Link>
    </article>
  );
};

export default MainPostCard;

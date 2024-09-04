"use client";

import { getDate } from "@/utils/date";
import Image from "next/image";
import Link from "next/link";

export interface ProjectCardProps {
  link: string;
  imgSrc?: string;
  imgAlt?: string;
  title: string;
  description: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
}

const ProjectCard = ({
  link,
  imgSrc = "/image/default_img.png",
  imgAlt = "default image alt",
  title,
  description,
  tags = [],
  startDate = "",
  endDate = "",
}: ProjectCardProps) => {
  return (
    <article className="box-border transform transition duration-300 hover:scale-102">
      <Link
        href={link}
        className="w-full h-full flex flex-col rounded-xl bg-white"
      >
        <div className="rounded-t-lg bg-[var(--gray-bg-color)] w-full">
          <Image
            src={imgSrc}
            alt={imgAlt}
            width={300}
            height={290}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="text-black px-4 py-3">
          <h3 className="text-3xl font-semibold mb-3">{title}</h3>
          <p className="text-xl mb-12">{description}</p>
          {!!tags.length && (
            <>
              <div className="mb-2">사용 기술</div>
              <ul className="flex gap-1">
                {tags.map((tagTitle, idx) => (
                  <li
                    key={`${idx}_${tagTitle}`}
                    className="w-fit h-5 rounded-md border px-2 py-1 text-xs box-border flex items-center justify-center border-primary text-primary"
                  >
                    {tagTitle}
                  </li>
                ))}
              </ul>
            </>
          )}
          {!!startDate && (
            <time
              dateTime={`${startDate}`}
              className="text-[var(--gray-text-color)] text-[14px] after:content-['-']"
            >
              {getDate("YYYY-MM-DD", startDate)}
            </time>
          )}
          {!!endDate && (
            <time
              dateTime={`${endDate}`}
              className="text-[var(--gray-text-color)] text-[14px]"
            >
              {getDate("YYYY-MM-DD", endDate)}
            </time>
          )}
        </div>
      </Link>
    </article>
  );
};

export default ProjectCard;

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
    <article className="w-64 h-80 box-border rounded-xl shadow-md transform transition ease-in-out duration-300 hover:scale-102">
      <Link
        href={link}
        className="block w-full h-full rounded-xl overflow-hidden bg-white"
      >
        <div className="bg-[var(--gray-bg-color)] h-1/2 flex items-center justify-center p-3 relative overflow-hidden">
          <Image
            src={imgSrc}
            alt={imgAlt}
            width={300}
            height={300}
            style={{ height: "100%", width: "auto", objectFit: "contain" }}
          />
        </div>
        <div className="text-black px-5 py-4 h-1/2 bg-[var(--project-card-bg)]">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-sm mb-3">{description}</p>
          {!!tags.length && (
            <>
              <div className="text-xs mb-1">사용 기술</div>
              <ul className="flex gap-1">
                {tags.map((tagTitle, idx) => (
                  <li
                    key={`${idx}_${tagTitle}`}
                    className="w-fit h-5 rounded-md border px-2 py-1 text-xs box-border flex items-center justify-center bg-primary text-white"
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
              className="text-[var(--gray1-text-color)] text-xs after:content-['-']"
            >
              {getDate("YYYY.MM.DD", `${startDate}`)}
            </time>
          )}
          {!!endDate && (
            <time
              dateTime={`${endDate}`}
              className="text-[var(--gray1-text-color)] text-xs"
            >
              {getDate("YYYY.MM.DD", `${endDate}`)}
            </time>
          )}
        </div>
      </Link>
    </article>
  );
};

export default ProjectCard;

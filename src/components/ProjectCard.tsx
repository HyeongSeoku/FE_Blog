"use client";

import useDeviceStore from "@/store/deviceType";
import Image from "next/image";
import Link from "next/link";

export interface ProjectCardProps {
  link: string;
  imgSrc?: string;
  imgAlt?: string;
  title: string;
  description: string;
  tags?: string[];
  startDate?: number;
  endDate?: number;
}

const ProjectCard = ({
  link,
  imgSrc = "/image/default_img.png",
  imgAlt = "default image alt",
  title,
  description,
  tags = [],
  startDate = 0,
  endDate = 0,
}: ProjectCardProps) => {
  const { isMobile } = useDeviceStore();

  const INITIAL_WIDTH = isMobile ? 195 : 300;
  const INITIAL_HEIGHT = isMobile ? 190 : 290;

  return (
    <article>
      <Link
        href={link}
        className="w-full h-full flex flex-col items-center p-[20px] rounded-[12px] bg-white max-md:flex-row"
      >
        <div className="max-md:w-[196px] max-md:h-[190px] rounded-[8px] flex bg-[var(--gray-bg-color)] max-md:mr-[27px]">
          <Image
            src={imgSrc}
            alt={imgAlt}
            width={INITIAL_WIDTH}
            height={INITIAL_HEIGHT}
            className="w-full h-full"
          />
        </div>
        <div className="text-black">
          <h3 className="text-[30px] font-semibold mb-[12px]">{title}</h3>
          <p className="text-[20px] mb-[45px]">{description}</p>
          {!!tags.length && (
            <>
              <div className="mb-[8px]">사용 기술</div>
              <ul className="flex gap-[6px]">
                {tags.map((tagTitle, idx) => (
                  <li
                    key={`${idx}_${tagTitle}`}
                    className="w-fit h-[19px] rounded-[16px] border px-[8px] py-[5px] text-[12px] box-border flex items-center justify-center border-primary text-primary"
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
              {new Date(startDate).toLocaleDateString()}
            </time>
          )}
          {!!endDate && (
            <time
              dateTime={`${endDate}`}
              className="text-[var(--gray-text-color)] text-[14px]"
            >
              {new Date(endDate).toLocaleDateString()}
            </time>
          )}
        </div>
      </Link>
    </article>
  );
};

export default ProjectCard;

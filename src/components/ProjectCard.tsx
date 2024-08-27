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
      <Link href={link}>
        <Image
          src={imgSrc}
          alt={imgAlt}
          width={INITIAL_WIDTH}
          height={INITIAL_HEIGHT}
          layout="responsive"
        />
        <h3>{title}</h3>
        <p>{description}</p>
        {!!startDate && (
          <time dateTime={`${startDate}`}>
            {new Date(startDate).toLocaleDateString()}
          </time>
        )}
        {!!endDate && (
          <time dateTime={`${endDate}`}>
            {new Date(endDate).toLocaleDateString()}
          </time>
        )}
        {!!tags.length && (
          <ul>
            {tags.map((tagTitle, idx) => (
              <li key={`${idx}_${tagTitle}`}>{tagTitle}</li>
            ))}
          </ul>
        )}
      </Link>
    </article>
  );
};

export default ProjectCard;

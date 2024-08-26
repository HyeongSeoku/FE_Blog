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
  const { isMobile } = useDeviceStore();

  const INITAIL_WIDTH = isMobile ? 195 : 300;
  const INITIAL_HEIGHT = isMobile ? 190 : 290;

  return (
    <article>
      <Link href={link}>
        <Image
          src={imgSrc}
          alt={imgAlt}
          width={INITAIL_WIDTH}
          height={INITIAL_HEIGHT}
          layout="responsive"
        />
        <h3>{title}</h3>
        <p>{description}</p>
        {!!startDate && (
          <time dateTime={startDate}>
            {new Date(startDate).toLocaleDateString()}
          </time>
        )}
        {!!endDate && (
          <time dateTime={endDate}>
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

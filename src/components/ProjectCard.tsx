"use client";

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
  imgSrc = "",
  imgAlt = "default image alt",
  title,
  description,
  tags,
  startDate,
  endDate,
}: ProjectCardProps) => {
  return (
    <article>
      <Link href={link}>
        <Image src={imgSrc} alt={imgAlt} />
      </Link>
    </article>
  );
};

export default ProjectCard;

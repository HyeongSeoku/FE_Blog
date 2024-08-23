"use client";

export interface ProjectCardProps {
  link: string;
  imgSrc?: string;
  title: string;
  description: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
}

const ProjectCard = ({
  link,
  imgSrc,
  title,
  description,
  tags,
  startDate,
  endDate,
}: ProjectCardProps) => {
  return <article></article>;
};

export default ProjectCard;

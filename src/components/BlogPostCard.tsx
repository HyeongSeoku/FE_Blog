"use client";

import { getDate } from "@/utils/date";
import Link from "next/link";

export interface BlogPostCardProps {
  title: string;
  createdAt: string;
  description: string;
  tagList?: string[];
  slug: string;
}

const BlogPostCard = ({
  title,
  createdAt,
  description,
  tagList,
  slug,
}: BlogPostCardProps) => {
  const formattedDate = getDate("MMMM D, YYYY", createdAt);

  return (
    <Link href={`/posts/${slug}`}>
      <h3>{title}</h3>
      <span>{formattedDate}</span>
      <p>{description}</p>
      {!!tagList?.length && (
        <ul>
          {tagList.map((item, idx) => (
            <li key={`${item}_${idx}`}>{item}</li>
          ))}
        </ul>
      )}
    </Link>
  );
};

export default BlogPostCard;

import Link from "next/link";
import { getDate } from "@/utils/date";

export interface BlogPostListItemProps {
  title: string;
  createdAt: string;
  slug: string;
}

const BlogPostListItem = ({
  title,
  createdAt,
  slug,
}: BlogPostListItemProps) => {
  const formattedDate = getDate("YYYY. MM. DD", createdAt);
  const isoDate = getDate("YYYY-MM-DD", createdAt);

  return (
    <Link
      href={`/posts/${slug}`}
      className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 transition-opacity hover:opacity-[.55]"
    >
      <span className="min-w-[180px] flex-1 text-sk-body text-theme">
        {title}
      </span>
      <time dateTime={isoDate} className="shrink-0 text-sk-meta text-muted">
        {formattedDate}
      </time>
    </Link>
  );
};

export default BlogPostListItem;

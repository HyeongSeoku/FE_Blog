import BlogPostCard from "@/components/BlogPostCard";
import { getPostsByTag } from "@/utils/post";
import classNames from "classnames";
import Link from "next/link";

const TagPage = async ({ params }: { params: { tag: string } }) => {
  const { tag } = params;
  const { list: postList, count, tagList } = await getPostsByTag(tag);

  return (
    <div>
      <h3 className="text-4xl font-bold">{tag}</h3>
      <span>총 {count}개의 포스트</span>
      <ul className="flex flex-wrap gap-2">
        {tagList.map(({ key, value }) => (
          <Link
            key={key}
            href={`/tags/${key}`}
            replace
            className={classNames(
              "bg-[var(--bg-gray-color)] hover:bg-[var(--bg-gray-hover-color)] transition-[background-color] duration-300 px-3 py-1 rounded-full",
              {
                "bg-[var(--contrasting-bg-color)] text-[var(--contrasting-text-color)] hover:bg-[var(--contrasting-bg-color)]":
                  tag === key,
              },
            )}
          >
            <span>{key}</span>
            <span>{value}</span>
          </Link>
        ))}
      </ul>

      <ul className="flex flex-col gap-3 mt-3">
        {postList.map(
          ({ title, description, slug, tags, createdAt, thumbnail }) => (
            <BlogPostCard
              key={slug}
              title={title}
              description={description}
              slug={slug}
              tagList={tags}
              createdAt={createdAt}
              thumbnail={thumbnail}
            />
          ),
        )}
      </ul>
    </div>
  );
};

export default TagPage;

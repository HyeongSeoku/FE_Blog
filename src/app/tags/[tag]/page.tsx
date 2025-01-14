import BlogPostCard from "@/components/BlogPostCard";
import { getPostsByTag } from "@/utils/post";

const TagPage = async ({ params }: { params: { tag: string } }) => {
  const { tag } = params;
  const { list: postList, count, tagCounts } = await getPostsByTag(tag);

  return (
    <div>
      <h3 className="text-4xl font-bold">{tag}</h3>
      <span>총 {count}개의 포스트</span>
      <ul className="flex flex-col gap-3 mt-3">
        {postList.map(({ title, description, slug, tags, createdAt }) => (
          <BlogPostCard
            key={slug}
            title={title}
            description={description}
            slug={slug}
            tagList={tags}
            createdAt={createdAt}
          />
        ))}
      </ul>
    </div>
  );
};

export default TagPage;

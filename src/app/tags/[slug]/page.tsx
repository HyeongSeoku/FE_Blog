import BlogPostCard from "@/components/BlogPostCard";

const TagPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { list: postList, count } = await getPostsByTag(slug);

  return (
    <div>
      <h3 className="text-4xl font-bold">{slug}</h3>
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

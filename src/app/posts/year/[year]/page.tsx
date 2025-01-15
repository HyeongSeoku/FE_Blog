import BlogPostCard from "@/components/BlogPostCard";
import { getPostsByDate } from "@/utils/post";

const BlogYearPage = async ({ params }: { params: { year: string } }) => {
  const { year } = params;
  const { postList, totalPostCount } = await getPostsByDate({
    type: "year",
    date: year,
  });
  const postCount = postList.length;

  return (
    <div>
      <h3 className="text-4xl font-bold">{year}년</h3>
      <p>{postCount}개의 포스트</p>
      <ul>
        {postList.map(
          ({ title, createdAt, description, slug, tags, thumbnail }) => (
            <BlogPostCard
              key={slug}
              title={title}
              createdAt={createdAt}
              description={description}
              slug={slug}
              tagList={tags}
              thumbnail={thumbnail}
            />
          ),
        )}
      </ul>
    </div>
  );
};

export default BlogYearPage;

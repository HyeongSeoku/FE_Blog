import BlogPostCard from "@/components/BlogPostCard";
import { getDate } from "@/utils/date";
import { getPostsByDate } from "@/utils/post";

const BlogMonthPage = async ({ params }: { params: { month: string } }) => {
  const { month } = params;
  const formattedMonth = getDate("YYYY년MM월", month);

  const { postList } = await getPostsByDate({
    type: "month",
    date: month,
  });
  const postCount = postList.length;

  return (
    <div>
      <h3>{formattedMonth}</h3>
      <p>{postCount}개의 포스트</p>
      <ul>
        {postList.map(({ title, createdAt, description, slug, tags }) => (
          <BlogPostCard
            key={slug}
            title={title}
            createdAt={createdAt}
            description={description}
            slug={slug}
            tagList={tags}
          />
        ))}
      </ul>
    </div>
  );
};

export default BlogMonthPage;

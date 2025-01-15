import BlogPostCard from "@/components/BlogPostCard";
import { getAllPosts } from "@/utils/post";

export const metadata = {
  title: "블로그 페이지",
  description: "최신 블로그 글 목록을 확인하세요.",
};

export const generateStaticParams = async () => {
  const { postList } = await getAllPosts({ page: 1, pageSize: 50 });
  return postList.map((post) => ({ slug: post.slug }));
};

const BlogPage = async () => {
  try {
    const { postList } = await getAllPosts({ page: 1, pageSize: 50 });
    return (
      <div>
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
  } catch (error) {
    console.error("Error fetching posts:", error);
    return <div>포스트를 불러오는 중 오류가 발생했습니다.</div>;
  }
};

export default BlogPage;

import BlogPostCard from "@/components/BlogPostCard";
import { getAllPosts } from "@/utils/post";

const BlogPage = async () => {
  const { postList } = await getAllPosts({
    page: 1,
    pageSize: 50,
  });

  return (
    <div>
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

export default BlogPage;

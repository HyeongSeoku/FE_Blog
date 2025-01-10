import BlogPostCard from "@/components/BlogPostCard";
import GroupPostList from "@/components/GroupPostList";
import { getAllPosts, groupPosts } from "@/utils/post";

const BlogPage = async () => {
  const { postList } = await getAllPosts({
    page: 1,
    pageSize: 50,
  });
  const groupPostList = groupPosts(postList, "year");

  return (
    <div>
      {/* <GroupPostList groupedPosts={groupPostList} groupingType="year" /> */}
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
    </div>
  );
};

export default BlogPage;

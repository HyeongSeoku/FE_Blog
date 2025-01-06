import GroupPostList from "@/components/GroupPostList";
import { getAllPosts } from "@/utils/mdxServer";
import { groupPosts } from "@/utils/posts";

const getPostList = async () => {
  const postData = await getAllPosts({
    page: 1,
    pageSize: 50,
  });
  return postData;
};

const BlogPage = async () => {
  const { postList } = await getPostList();
  const groupPostList = groupPosts(postList, "year");

  return (
    <div>
      <GroupPostList groupedPosts={groupPostList} groupingType="year" />
    </div>
  );
};

export default BlogPage;

import { getAllPosts } from "@/utils/mdxServer";

const getPostList = async () => {
  const postData = await getAllPosts({ page: 1, pageSize: 50 });
  return postData;
};

const BlogPage = async () => {};

export default BlogPage;

import BlogPostCard from "@/components/BlogPostCard";
import PostCategoryCount from "@/components/PostCategoryCount";
import { CATEGORY_MAP, DEFAUL_CATEGORY_ALL } from "@/constants/post.constants";
import { getPostsByCategory } from "@/utils/post";
import { redirect } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: { category: string };
}) => {
  const categoryTitle = `블로그 | ${params.category}`;

  const metadata = {
    title: `${categoryTitle} 카테고리`,
    description: `${params.category} 관련 블로그 글 목록을 확인하세요.`,
  };

  return metadata;
};

export const generateStaticParams = async () => {
  const categories = Object.keys(CATEGORY_MAP);

  return categories.map((category) => ({ category }));
};

const BlogCategoryPage = async ({
  params,
}: {
  params: { category: string };
}) => {
  const isCategoryKeyAll = params.category.toLowerCase() === "all";
  const isCategoryValid = Object.keys(CATEGORY_MAP).includes(
    params.category.toUpperCase(),
  );
  if (isCategoryKeyAll || !isCategoryValid) {
    redirect("/blog");
  }

  try {
    const { postList, totalPostCount, categoryCounts } =
      await getPostsByCategory({
        page: 1,
        pageSize: 50,
        categoryKey: params.category.toUpperCase(),
      });
    const categoryKeys = [DEFAUL_CATEGORY_ALL, ...Object.keys(CATEGORY_MAP)];
    return (
      <div>
        <ul className="flex items-center gap-3">
          {categoryKeys.map((key) => {
            const isKeyDefault =
              key.toUpperCase() === DEFAUL_CATEGORY_ALL.toUpperCase();
            const categoryPostCount = isKeyDefault
              ? totalPostCount
              : categoryCounts[key];

            return (
              <PostCategoryCount
                key={key}
                categoryKey={key}
                categoryPostCount={categoryPostCount}
                isDefault={isKeyDefault}
              />
            );
          })}
        </ul>
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

export default BlogCategoryPage;

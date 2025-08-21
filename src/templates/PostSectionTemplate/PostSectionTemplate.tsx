import { PostDataProps } from "@/types/posts";
import MainPostCard from "@/components/MainPostCard";

export interface PostSectionProps {
  postList: PostDataProps[];
}

const PostSectionTemplate = ({ postList }: PostSectionProps) => {
  if (!postList.length) {
    return (
      <div className="flex items-center w-full justify-center text-gray-500 p-3 min-h-60 md:min-h-30">
        게시물이 없습니다
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {postList.map(
        ({
          title,
          description,
          createdAt,
          slug,
          tags,
          category,
          subCategory,
          thumbnail,
        }) => (
          <MainPostCard
            key={slug}
            link={`/posts/${slug}`}
            title={title}
            description={description}
            createdAt={createdAt}
            tags={tags}
            category={category}
            subCategory={subCategory}
            thumbnail={thumbnail}
          />
        ),
      )}
    </div>
  );
};

export default PostSectionTemplate;

import { PostDataProps } from "@/types/posts";
import MainPostCard from "@/components/MainPostCard";

export interface PostSectionProps {
  postList: PostDataProps[];
}

const PostSectionTemplate = ({ postList }: PostSectionProps) => {
  return (
    <div className="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] gap-4 min-xl:[grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
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

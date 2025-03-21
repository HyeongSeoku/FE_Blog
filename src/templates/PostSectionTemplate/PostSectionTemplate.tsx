"use client";

import { PostDataProps } from "@/types/posts";
import MainPostCard from "@/components/MainPostCard";

export interface PostSectionProps {
  postData: PostDataProps[];
}

const PostSectionTemplate = ({ postData }: PostSectionProps) => {
  return (
    <ul>
      {postData.map(
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
          // <BlogPostCard
          //   key={slug}
          //   title={title}
          //   description={description}
          //   slug={slug}
          //   tagList={tags}
          //   createdAt={createdAt}
          //   thumbnail={thumbnail}
          // />
        ),
      )}
    </ul>
  );
};

export default PostSectionTemplate;

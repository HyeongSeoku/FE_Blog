"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { PostDataProps } from "@/utils/mdxServer";
import PostCard from "@/components/PostCard";

import "./post-section-template.css";
import classNames from "classnames";

export interface PostSectionProps {
  postData: PostDataProps[];
}

const PostSectionTemplate = ({ postData }: PostSectionProps) => {
  return (
    <>
      <Swiper
        tag="ul"
        slidesPerView="auto"
        pagination={{ clickable: true }}
        className="md:!hidden"
      >
        {postData.map(
          ({
            title,
            description,
            createdAt,
            slug,
            tags,
            category,
            subCategory,
          }) => (
            <SwiperSlide key={slug} tag="li">
              <PostCard
                link={`/posts/${slug}`}
                title={title}
                description={description}
                createdAt={createdAt}
                tags={tags}
                category={category}
                subCategory={subCategory}
              />
            </SwiperSlide>
          ),
        )}
      </Swiper>
      <ul className="min-md:hidden">
        {postData.map(
          ({
            title,
            description,
            createdAt,
            slug,
            tags,
            category,
            subCategory,
          }) => (
            <PostCard
              key={slug}
              link={`/posts/${slug}`}
              title={title}
              description={description}
              createdAt={createdAt}
              tags={tags}
              category={category}
              subCategory={subCategory}
            />
          ),
        )}
      </ul>
    </>
  );
};

export default PostSectionTemplate;

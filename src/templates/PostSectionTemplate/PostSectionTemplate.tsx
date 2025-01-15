"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { PostDataProps } from "@/types/posts";
import MainPostCard from "@/components/MainPostCard";

import "./post-section-template.css";

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
            thumbnail,
          }) => (
            <SwiperSlide key={slug} tag="li">
              <MainPostCard
                link={`/posts/${slug}`}
                title={title}
                description={description}
                createdAt={createdAt}
                tags={tags}
                category={category}
                subCategory={subCategory}
                thumbnail={thumbnail}
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
      </ul>
    </>
  );
};

export default PostSectionTemplate;

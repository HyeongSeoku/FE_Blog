"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import useDeviceStore from "@/store/deviceType";
import { PostDataProps } from "@/utils/mdxServer";
import PostCard from "@/components/PostCard";

import "./post-section-template.css";
import classNames from "classnames";

export interface PostSectionProps {
  postData: PostDataProps[];
}

const PostSectionTemplate = ({ postData }: PostSectionProps) => {
  const { isMobile } = useDeviceStore();

  /**
   * FIXME: Hydrate 이슈 수정
   * 서버사이드의 device type으로 mobile만 추출하고 그게 아니라면 pure css로 display:none 처리
   *  */

  return (
    <>
      <Swiper
        slidesPerView="auto"
        pagination={{ clickable: true }}
        className="md:!hidden"
      >
        {postData.map(
          (
            {
              title,
              description,
              createdAt,
              slug,
              tags,
              category,
              subCategory,
            },
            idx,
          ) => (
            <SwiperSlide key={slug}>
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
      <div className="min-md:hidden">
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
      </div>
    </>
  );
};

export default PostSectionTemplate;

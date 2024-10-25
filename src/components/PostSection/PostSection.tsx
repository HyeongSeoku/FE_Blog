"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import useDeviceStore from "@/store/deviceType";
import { PostDataProps } from "@/utils/mdx";
import PostCard from "../PostCard";

import "@/components/PostSection/post-section.css";

export interface PostSectionProps {
  postData: PostDataProps[];
}

const PostSection = ({ postData }: PostSectionProps) => {
  const { isMobile } = useDeviceStore();

  /**
   * FIXME: Hydrate 이슈 수정
   * 서버사이드의 device type으로 mobile만 추출하고 그게 아니라면 pure css로 display:none 처리
   *  */

  /** FIXME: swiper margin-right 랜더링 이슈 (한박지 늦게 적용됨)  */

  return (
    <>
      {isMobile ? (
        <Swiper
          spaceBetween={15}
          slidesPerView="auto"
          pagination={{ clickable: true }}
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
      ) : (
        // <div>test</div>
        <Swiper
          spaceBetween={15}
          slidesPerView="auto"
          pagination={{ clickable: true }}
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
      )}
    </>
  );
};

export default PostSection;

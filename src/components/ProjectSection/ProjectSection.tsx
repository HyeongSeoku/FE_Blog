"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import useDeviceStore from "@/store/deviceType";
import { ProjectDataProps } from "@/utils/mdx";
import ProjectCard from "@/components/ProjectCard";
import "@/components/ProjectSection/project-section.css";

export interface ProjectSectionProps {
  projectData: ProjectDataProps[];
}

const ProjectSection = ({ projectData }: ProjectSectionProps) => {
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
          {projectData.map(
            ({ title, description, startDate, endDate, slug, tags }) => (
              <SwiperSlide key={slug}>
                <ProjectCard
                  link={`/projects/${slug}`}
                  title={title}
                  description={description}
                  startDate={startDate}
                  endDate={endDate}
                  tags={tags}
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
          {projectData.map(
            ({ title, description, startDate, endDate, slug, tags }) => (
              <SwiperSlide key={slug}>
                <ProjectCard
                  link={`/projects/${slug}`}
                  title={title}
                  description={description}
                  startDate={startDate}
                  endDate={endDate}
                  tags={tags}
                />
              </SwiperSlide>
            ),
          )}
        </Swiper>
      )}
    </>
  );
};

export default ProjectSection;
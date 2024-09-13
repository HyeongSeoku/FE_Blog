"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import useDeviceStore from "@/store/deviceType";
import { ProjectDataProps } from "@/utils/mdx";
import ProjectCard from "@/components/ProjectCard";

export interface ProjectSectionProps {
  projectData: ProjectDataProps[];
}

const ProjectSection = ({ projectData }: ProjectSectionProps) => {
  const { isMobile } = useDeviceStore();
  console.log("TEST isMobile", isMobile);

  /**
   * FIXME: Hydrate 이슈 수정
   * 서버사이드의 device type으로 mobile만 추출하고 그게 아니라면 pure css로 display:none 처리
   *  */

  return (
    <>
      {isMobile ? (
        <Swiper
          spaceBetween={5}
          slidesPerView={1.3}
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
        <div>test</div>
      )}
    </>
  );
};

export default ProjectSection;

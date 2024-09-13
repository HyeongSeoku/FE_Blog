"use client";

import Image from "next/image";
import ProjectCard from "@/components/ProjectCard";
import useDeviceType from "@/hooks/useDeviceType";
import { ProjectDataProps } from "@/utils/mdx";
import SeokuLogo from "@/image-components/seoku.svg";
import MainSection from "@/components/MainSection";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ProjectSection from "@/components/ProjectSection";
import HistoryLine from "@/components/HistoryLine";

interface HomeClientProps {
  projectData: ProjectDataProps[];
}

export const HomeClient = ({ projectData }: HomeClientProps) => {
  useDeviceType();

  return (
    <div className="h-full">
      <section className="flex flex-col gap-5 mb-5">
        <SeokuLogo />
        <div className="text-lg">
          <span>배우는 것에 즐거움을 느끼는</span>
          <div className="flex gap-1">
            <b className="px-1 bg-primary rounded-md font-normal">프론트엔드</b>
            <span>개발자입니다.</span>
          </div>
        </div>
      </section>
      <MainSection title="PROJECT">
        {/* <Swiper
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
        </Swiper> */}
        <ProjectSection projectData={projectData}></ProjectSection>
      </MainSection>

      <MainSection title="HISTORY">
        <HistoryLine />
      </MainSection>
      <MainSection title="POST">test</MainSection>

      <section className="flex flex-col gap-10"></section>
    </div>
  );
};

"use client";

import useDeviceType from "@/hooks/useDeviceType";
import { ProjectDataProps } from "@/utils/mdx";
import SeokuLogo from "@/image-components/seoku.svg";
import MainSection from "@/components/MainSection";
import ProjectSection from "@/components/ProjectSection/ProjectSection";
import HistoryLine from "@/components/HistorySection/HistorySection";

interface HomeClientProps {
  projectData: ProjectDataProps[];
}

export const HomeClient = ({ projectData }: HomeClientProps) => {
  useDeviceType();

  return (
    <div className="h-full flex flex-col">
      <section className="flex flex-col gap-5">
        <SeokuLogo />
        <div className="text-base">
          <span>배우는 것에 즐거움을 느끼는</span>
          <div className="flex gap-1">
            <b className="px-1 bg-primary rounded-md font-normal">프론트엔드</b>
            <span>개발자입니다.</span>
          </div>
        </div>
      </section>
      <MainSection title="PROJECT">
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

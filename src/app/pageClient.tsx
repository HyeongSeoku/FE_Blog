"use client";

import useDeviceType from "@/hooks/useDeviceType";
import { ProjectDataProps } from "@/utils/mdx";
import MainSection from "@/components/MainSection";
import ProjectSection from "@/components/ProjectSection/ProjectSection";
import HistoryLine from "@/components/HistorySection/HistorySection";
import IntroSection from "@/components/IntroSection/IntroSection";

interface HomeClientProps {
  projectData: ProjectDataProps[];
}

export const HomeClient = ({ projectData }: HomeClientProps) => {
  useDeviceType();

  return (
    <div className="h-full flex flex-col">
      <IntroSection></IntroSection>
      <MainSection
        title="PROJECT"
        description={`개인 / 회사 프로젝트 리스트 \n 주로 react, ts를 이용하여 진행했습니다.`}
      >
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

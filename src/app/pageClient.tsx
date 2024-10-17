"use client";

import useDeviceType from "@/hooks/useDeviceType";
import { ProjectDataProps } from "@/utils/mdx";
import MainSection from "@/components/MainSection";
import ProjectSection from "@/components/ProjectSection/ProjectSection";
import HistoryLine from "@/components/HistorySection/HistorySection";
import IntroSection from "@/components/IntroSection/IntroSection";
import { useState } from "react";
import dynamic from "next/dynamic";

const Modal = dynamic(() => import("@/components/shared/Modal/Modal"), {
  ssr: false,
});

interface HomeClientProps {
  projectData: ProjectDataProps[];
}

export const HomeClient = ({ projectData }: HomeClientProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
      <button onClick={() => setIsOpen((prev) => !prev)}>toggle modal</button>

      <MainSection
        title="HISTORY"
        description={`경력 내용입니다. \n 자세한 내용은 클릭시 노출됩니다.`}
      >
        <HistoryLine />
      </MainSection>
      <MainSection title="POST">test</MainSection>

      <section className="flex flex-col gap-10"></section>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} hasCloseBtn={true}>
        test
      </Modal>
    </div>
  );
};

"use client";

import useDeviceType from "@/hooks/useDeviceType";
import { PostDataProps, ProjectDataProps } from "@/utils/mdx";
import MainSection from "@/components/MainSection";

import { useState } from "react";
import dynamic from "next/dynamic";
import ProjectSectionTemplate from "@/templates/ProjectSectionTemplate/ProjectSectionTemplate";
import IntroSectionTemplate from "@/templates/IntroSectionTemplate/IntroSectionTemplate";
import PostSectionTemplate from "@/templates/PostSectionTemplate/PostSectionTemplate";
import HistorySectionTemplate from "@/templates/HistorySectionTemplate/HistorySectionTemplate";

const Modal = dynamic(() => import("@/components/Modal/Modal"), {
  ssr: false,
});

interface HomeClientProps {
  projectData: ProjectDataProps[];
  postData: PostDataProps[];
}

export const HomeClient = ({ projectData, postData }: HomeClientProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useDeviceType();

  return (
    <div className="h-full flex flex-col">
      <IntroSectionTemplate />
      <MainSection
        title="PROJECT"
        description={`개인 / 회사 프로젝트 리스트 \n 주로 react, ts를 이용하여 진행했습니다.`}
      >
        <ProjectSectionTemplate
          projectData={projectData}
        ></ProjectSectionTemplate>
      </MainSection>
      <button onClick={() => setIsOpen((prev) => !prev)}>toggle modal</button>

      <MainSection
        title="HISTORY"
        description={`경력 내용입니다. \n 자세한 내용은 클릭시 노출됩니다.`}
      >
        <HistorySectionTemplate />
      </MainSection>
      <MainSection title="POST">
        <PostSectionTemplate postData={postData} />
      </MainSection>

      <section className="flex flex-col gap-10"></section>
      <Modal
        title="모달"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        hasCloseBtn={true}
      >
        test
      </Modal>
    </div>
  );
};

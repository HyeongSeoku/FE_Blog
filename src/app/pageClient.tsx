"use client";

import useDeviceType from "@/hooks/useDeviceType";
import { PostDataProps, ProjectDataProps } from "@/utils/mdxServer";
import MainSection from "@/components/MainSection";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import IntroSectionTemplate from "@/templates/IntroSectionTemplate/IntroSectionTemplate";
import PostSectionTemplate from "@/templates/PostSectionTemplate/PostSectionTemplate";
import { GithubUserInfo } from "@/api/github";
import useGithubInfoStore from "@/store/githubInfo";
import { PUBLIC_IMG_PATH } from "@/constants/basic.constants";
import SkillChip, { SkillName } from "@/components/SkillChip";

const Modal = dynamic(() => import("@/components/Modal/Modal"), {
  ssr: false,
});

interface HomeClientProps {
  projectData: ProjectDataProps[];
  postData: PostDataProps[];
  githubData: GithubUserInfo;
}

export const HomeClient = ({ postData, githubData }: HomeClientProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setGithubUser } = useGithubInfoStore();

  useEffect(() => {
    setGithubUser({
      imgSrc: githubData?.avatar_url,
      githubUrl: githubData?.html_url,
      githubName: githubData?.login,
    });
  }, [githubData]);

  useDeviceType();
  const SKILL_LIST: {
    skillName: SkillName;
    bgColor?: `#${string}`;
    imgSrc: string;
  }[] = [
    { skillName: "React", imgSrc: `${PUBLIC_IMG_PATH}/skill/react.svg` },
    {
      skillName: "TypeScript",
      imgSrc: `${PUBLIC_IMG_PATH}/skill/typescript.svg`,
    },
    {
      skillName: "NextJs",
      bgColor: "#363636",
      imgSrc: `${PUBLIC_IMG_PATH}/skill/nextjs.svg`,
    },
    {
      skillName: "JavaScript",
      imgSrc: `${PUBLIC_IMG_PATH}/skill/javascript.svg`,
    },
    { skillName: "HTML", imgSrc: `${PUBLIC_IMG_PATH}/skill/html5.svg` },
    { skillName: "CSS", imgSrc: `${PUBLIC_IMG_PATH}/skill/css3.svg` },
  ];

  return (
    <div className="h-full flex flex-col">
      <IntroSectionTemplate />

      <section className="flex flex-col gap-2">
        <h3>Skills</h3>
        <ul className="inline-flex flex-wrap gap-3 w-80">
          {SKILL_LIST.map(({ skillName, bgColor, imgSrc }, idx) => (
            <SkillChip
              key={`${skillName}_${idx}`}
              skillName={skillName}
              backGroundColor={bgColor}
              imgSrc={imgSrc}
              index={idx + 1}
            />
          ))}
        </ul>
      </section>
      <MainSection title="게시물">
        <PostSectionTemplate postData={postData} />
      </MainSection>

      <Modal
        title="모달"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        hasCloseBtn={true}
      >
        test
      </Modal>

      <button onClick={() => setIsOpen((prev) => !prev)}>toggle modal</button>
    </div>
  );
};

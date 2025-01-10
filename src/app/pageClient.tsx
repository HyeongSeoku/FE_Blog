"use client";

import useDeviceType from "@/hooks/useDeviceType";
import { PostDataProps } from "@/types/posts";
import MainSection from "@/components/MainSection";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import IntroSectionTemplate from "@/templates/IntroSectionTemplate/IntroSectionTemplate";
import PostSectionTemplate from "@/templates/PostSectionTemplate/PostSectionTemplate";
import { GithubUserInfo } from "@/api/github";
import useGithubInfoStore from "@/store/githubInfo";
import SkillChip from "@/components/SkillChip";
import Link from "next/link";
import { SKILL_LIST } from "@/constants/skils.constants";

const Modal = dynamic(() => import("@/components/Modal/Modal"), {
  ssr: false,
});

interface HomeClientProps {
  postList: PostDataProps[];
  githubData: GithubUserInfo;
  postCount: number;
}

export const HomeClient = ({
  postList,
  githubData,
  postCount,
}: HomeClientProps) => {
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

  return (
    <div className="h-full flex flex-col gap-4">
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
      <MainSection
        title="게시물"
        titleChildren={
          postCount > 3 ? (
            <Link
              href="/blog"
              className="text-sm text-gray-500 hover:text-[var(--text-color)] transition-colors"
            >
              더보기
            </Link>
          ) : null
        }
      >
        <PostSectionTemplate postData={postList} />
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

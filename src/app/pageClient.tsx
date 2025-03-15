"use client";

import useDeviceType from "@/hooks/useDeviceType";
import { PostDataProps } from "@/types/posts";
import MainSection from "@/components/MainSection";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import IntroSectionTemplate from "@/templates/IntroSectionTemplate/IntroSectionTemplate";
import PostSectionTemplate from "@/templates/PostSectionTemplate/PostSectionTemplate";
import { GithubUserInfo } from "@/api/github";
import useGithubInfoStore from "@/store/githubInfo";
import SkillChip from "@/components/SkillChip";
import Link from "next/link";
import { SKILL_LIST } from "@/constants/post.constants";
import BottomSheet from "@/components/BottomSheet/BottomSheet";

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
  const [targetSkill, setTargetSkill] = useState("");
  const { setGithubUser } = useGithubInfoStore();

  const isOpen = useMemo(() => {
    return !!targetSkill;
  }, [targetSkill]);

  const onClickSkillChip = (skillName: string) => {
    setTargetSkill(skillName);
  };

  const onCloseSkillModal = () => {
    setTargetSkill("");
  };

  useEffect(() => {
    setGithubUser({
      imgSrc: githubData?.avatar_url,
      githubUrl: githubData?.html_url,
      githubName: githubData?.login,
    });
  }, [githubData]);

  useDeviceType();

  return (
    <div className="h-full flex flex-col gap-3">
      <IntroSectionTemplate />

      <section className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Skills</h3>
        <ul className="inline-flex flex-wrap gap-3 w-80">
          {SKILL_LIST.map(({ skillName, bgColor, imgSrc }, idx) => (
            <SkillChip
              key={`${skillName}_${idx}`}
              skillName={skillName}
              backGroundColor={bgColor}
              imgSrc={imgSrc}
              index={idx + 1}
              onClick={() => onClickSkillChip(skillName)}
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
              className="text-sm text-gray-500 hover:text-theme transition-colors"
            >
              더보기
            </Link>
          ) : null
        }
      >
        <PostSectionTemplate postData={postList} />
      </MainSection>

      <Modal
        title={targetSkill}
        isOpen={isOpen}
        hasCloseBtn={true}
        onClose={onCloseSkillModal}
        className="w-1/2"
      >
        test
      </Modal>
    </div>
  );
};

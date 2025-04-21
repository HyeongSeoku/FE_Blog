"use client";

import useDeviceType from "@/hooks/useDeviceType";
import { PostDataProps } from "@/types/posts";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { GithubUserInfo } from "@/api/github";
import useGithubInfoStore from "@/store/githubInfo";
import SkillChip from "@/components/SkillChip";
import { SKILL_LIST } from "@/constants/post.constants";

const Modal = dynamic(() => import("@/components/Modal/Modal"), {
  ssr: false,
});

interface HomeClientProps {
  postList: PostDataProps[];
  githubData: GithubUserInfo;
  postCount: number;
}

export const HomeClient = ({ githubData }: HomeClientProps) => {
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

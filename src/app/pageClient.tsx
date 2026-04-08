"use client";

import { useEffect } from "react";
import type { GithubUserInfo } from "@/api/github";
import useDeviceType from "@/hooks/useDeviceType";
import useGithubInfoStore from "@/store/githubInfo";
import type { PostDataProps } from "@/types/posts";

interface HomeClientProps {
  postList: PostDataProps[];
  githubData: GithubUserInfo | null;
  postCount: number;
}

export const HomeClient = ({ githubData }: HomeClientProps) => {
  const { setGithubUser } = useGithubInfoStore();

  useEffect(() => {
    if (!githubData) return;
    setGithubUser({
      imgSrc: githubData.avatar_url,
      githubUrl: githubData.html_url,
      githubName: githubData.login,
    });
  }, [githubData, setGithubUser]);

  useDeviceType();

  return (
    <div className="h-full flex flex-col gap-3">
      {/* <section className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Skills</h3>
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
      </section> */}
    </div>
  );
};

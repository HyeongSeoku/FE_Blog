"use client";

import { useEffect } from "react";
import type { GithubUserInfo } from "@/api/github";
import useDeviceType from "@/hooks/useDeviceType";
import useGithubInfoStore from "@/store/githubInfo";

interface HomeClientProps {
  githubData: GithubUserInfo | null;
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

  return <div className="h-full flex flex-col gap-3" />;
};

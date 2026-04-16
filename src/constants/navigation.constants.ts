import type { HTMLAttributeAnchorTarget } from "react";

export type NAV_LIST_TYPE = {
  id: string;
  title: string;
  link: string;
  isExternalLink?: boolean;
  target?: HTMLAttributeAnchorTarget;
  baseUrl?: string[];
  isMobile?: boolean;
};

export const NAV_HOME = "HOME";
export const NAV_BLOG = "BLOG";
export const NAV_ABOUT = "ABOUT";
export const NAV_GITHUB_ISSUE = "GITHUB_ISSUE";

export const NAV_LIST: NAV_LIST_TYPE[] = [
  { id: NAV_HOME, title: "Home", link: "/", baseUrl: ["/"] },
  { id: NAV_BLOG, title: "Blog", link: "/blog", baseUrl: ["/blog", "/posts"] },
  { id: NAV_ABOUT, title: "About", link: "/about", baseUrl: ["/about"] },
  // { id: NAV_ABOUT, title: "Resume", link: "/resume", baseUrl: ["/resume"] },
  {
    id: NAV_GITHUB_ISSUE,
    title: "Github Issue Report",
    link: `${process.env.NEXT_PUBLIC_REPO_URL}/issues/new` || "",
    isExternalLink: true,
    target: "_blank",
    isMobile: true,
  },
];

export const ABOUT_NAVIGATION_ID_LIST = [
  "SKILL",
  "CAREER",
  "PROJECT",
  "OPEN_SOURCE",
  "BLOG",
];

export const ABOUT_NAVIGATION_SKILL_LABEL_MAP = {
  SKILL: "기술",
  CAREER: "경력",
  PROJECT: "프로젝트",
  OPEN_SOURCE: "오픈소스",
  BLOG: "블로그",
};

export const ABOUT_SKILLS = [
  "REACT",
  "TYPESCRIPT",
  "NEXT.JS",
  "NODE.JS",
  "PLAYWRIGHT",
];

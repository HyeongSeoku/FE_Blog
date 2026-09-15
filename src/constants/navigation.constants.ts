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

export const NAV_POSTS = "POSTS";
export const NAV_SERIES = "SERIES";
export const NAV_CATEGORIES = "CATEGORIES";
export const NAV_PORTFOLIO = "PORTFOLIO";
export const NAV_ABOUT = "ABOUT";
export const NAV_GITHUB_ISSUE = "GITHUB_ISSUE";

export const NAV_LIST: NAV_LIST_TYPE[] = [
  {
    id: NAV_POSTS,
    title: "글",
    link: "/",
    baseUrl: ["/", "/blog", "/posts", "/archive"],
  },
  { id: NAV_SERIES, title: "시리즈", link: "/series", baseUrl: ["/series"] },
  {
    id: NAV_CATEGORIES,
    title: "카테고리",
    link: "/categories",
    baseUrl: ["/categories"],
  },
  {
    id: NAV_PORTFOLIO,
    title: "포트폴리오",
    link: "/portfolio",
    baseUrl: ["/portfolio"],
  },
  { id: NAV_ABOUT, title: "소개", link: "/about", baseUrl: ["/about"] },
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

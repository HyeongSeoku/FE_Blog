import { HTMLAttributeAnchorTarget } from "react";

export type NAV_LIST_TYPE = {
  id: string;
  title: string;
  link: string;
  isExternalLink?: boolean;
  target?: HTMLAttributeAnchorTarget;
  baseUrl?: string[];
};

export const NAV_HOME = "HOME";
export const NAV_BLOG = "BLOG";
export const NAV_RESUME = "RESUME";
export const NAV_GITHUB_ISSUE = "GITHUB_ISSUE";

export const NAV_LIST: NAV_LIST_TYPE[] = [
  { id: NAV_HOME, title: "Home", link: "/", baseUrl: ["/"] },
  { id: NAV_BLOG, title: "Blog", link: "/blog", baseUrl: ["/blog", "/posts"] },
  { id: NAV_RESUME, title: "Resume", link: "/resume", baseUrl: ["/resume"] },
  {
    id: NAV_GITHUB_ISSUE,
    title: "Github Issue Report",
    link: `${process.env.NEXT_PUBLIC_REPO_URL}/issues/new` || "",
    isExternalLink: true,
    target: "_blank",
  },
];

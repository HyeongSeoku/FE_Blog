export type NAV_LIST_TYPE = {
  title: string;
  link: string;
  isExternalLink?: boolean;
};

export const NAV_LIST: NAV_LIST_TYPE[] = [
  { title: "Home", link: "/home" },
  { title: "Blog", link: "/blog" },
  { title: "Resume", link: "/resume" },
  { title: "Test", link: "www.naver.com", isExternalLink: true },
];

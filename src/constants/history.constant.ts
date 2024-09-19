export interface HISTORY_LIST_ITEM_PROPS {
  year: number;
  month: number;
  title: string;
  description?: string;
  tag?: string;
  isBigIssue?: boolean;
  logoSrc?: string;
  isCurrent?: boolean;
}

export const HISTORY_LIST: HISTORY_LIST_ITEM_PROPS[] = [
  {
    year: 2022,
    month: 7,
    title: "잡코리아",
    description: "알바몬 FE 개발",
    tag: "입사",
    isBigIssue: true,
    logoSrc: "jobkorea.webp",
  },
  {
    year: 2023,
    month: 11,
    title: "잡코리아",
    description: "알바몬 FE 개발 개인서비스 담당",
    tag: "퇴사",
    logoSrc: "jobkorea.webp",
  },
  {
    year: 2023,
    month: 11,
    title: "NHN",
    description: "NHN 서비스 운영 개발팀",
    tag: "입사",
    isBigIssue: true,
    logoSrc: "nhn.webp",
  },
  {
    year: 2024,
    month: 1,
    title: "NHN TOASTCAM",
    description: "NHN 서비스 운영 개발팀",
    tag: "분사",
    isBigIssue: true,
    logoSrc: "nhn-toastcam.webp",
    isCurrent: true,
  },
];

import { SkillName } from "@/components/SkillChip";

export const PUBLIC_IMG_PATH = "/image";

export const MOBILE_WIDTH = 768;
export const GISCUS_SECTION = "giscusSection";

export const SKILL_LIST: {
  skillName: SkillName;
  bgColor?: `#${string}`;
  imgSrc: string;
}[] = [
  { skillName: "React", imgSrc: `${PUBLIC_IMG_PATH}/skill/react.svg` },
  {
    skillName: "TypeScript",
    imgSrc: `${PUBLIC_IMG_PATH}/skill/typescript.svg`,
  },
  {
    skillName: "NextJs",
    bgColor: "#363636",
    imgSrc: `${PUBLIC_IMG_PATH}/skill/nextjs.svg`,
  },
  {
    skillName: "JavaScript",
    imgSrc: `${PUBLIC_IMG_PATH}/skill/javascript.svg`,
  },
  { skillName: "HTML", imgSrc: `${PUBLIC_IMG_PATH}/skill/html5.svg` },
  { skillName: "CSS", imgSrc: `${PUBLIC_IMG_PATH}/skill/css3.svg` },
];

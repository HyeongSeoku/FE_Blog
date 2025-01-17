import { SkillName } from "@/components/SkillChip";
import { PUBLIC_IMG_PATH, SKILL_PATH } from "./basic.constants";
import { Category, SubCategory } from "@/types/posts";

export const SKILL_LIST: {
  skillName: SkillName;
  bgColor?: `#${string}`;
  imgSrc: string;
  contentPath: string;
}[] = [
  {
    skillName: "React",
    imgSrc: `${PUBLIC_IMG_PATH}/skill/react.svg`,
    contentPath: `${SKILL_PATH}`,
  },
  {
    skillName: "TypeScript",
    imgSrc: `${PUBLIC_IMG_PATH}/skill/typescript.svg`,
    contentPath: `${SKILL_PATH}`,
  },
  {
    skillName: "Next.js",
    bgColor: "#363636",
    imgSrc: `${PUBLIC_IMG_PATH}/skill/nextjs.svg`,
    contentPath: `${SKILL_PATH}`,
  },
  {
    skillName: "JavaScript",
    imgSrc: `${PUBLIC_IMG_PATH}/skill/javascript.svg`,
    contentPath: `${SKILL_PATH}`,
  },
  {
    skillName: "HTML",
    imgSrc: `${PUBLIC_IMG_PATH}/skill/html5.svg`,
    contentPath: `${SKILL_PATH}`,
  },
  {
    skillName: "CSS",
    imgSrc: `${PUBLIC_IMG_PATH}/skill/css3.svg`,
    contentPath: `${SKILL_PATH}`,
  },
];

export const CATEGORY_MAP: Record<Category, true> = {
  DEV: true,
  LIFE: true,
  ETC: true,
};

export const SUB_CATEGORY_MAP: Record<Category, SubCategory[]> = {
  DEV: ["FE", "BE", "DEV_OTHER"],
  LIFE: ["WORK", "HOBBY", "BOOK", "PHOTO"],
  ETC: ["MUSIC"],
};

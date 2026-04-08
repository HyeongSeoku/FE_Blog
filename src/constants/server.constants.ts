import path from "node:path";
import type { SkillName } from "@/components/SkillChip";
import { DEFAULT_MDX_PATH, PUBLIC_IMG_PATH } from "./basic.constants";

export const CONTENT_IMAGE_DIR = path.join(
  process.cwd(),
  "public/content-image",
);
export const DEFAULT_MDX_DIR = path.join(process.cwd(), DEFAULT_MDX_PATH);
export const PROJECT_PATH = path.join(
  process.cwd(),
  `${DEFAULT_MDX_PATH}/project`,
);
export const POST_PATH = path.join(
  process.cwd(),
  `${DEFAULT_MDX_PATH}/content`,
);
export const SKILL_PATH = path.join(process.cwd(), `${DEFAULT_MDX_PATH}/skill`);

export const SKILL_LIST: {
  skillName: SkillName;
  bgColor?: `#${string}`;
  imgSrc: string;
  contentPath: string;
}[] = [
  {
    skillName: "React",
    imgSrc: `${PUBLIC_IMG_PATH}/skill/react.svg`,
    contentPath: SKILL_PATH,
  },
  {
    skillName: "TypeScript",
    imgSrc: `${PUBLIC_IMG_PATH}/skill/typescript.svg`,
    contentPath: SKILL_PATH,
  },
  {
    skillName: "Next.js",
    bgColor: "#363636",
    imgSrc: `${PUBLIC_IMG_PATH}/skill/nextjs.svg`,
    contentPath: SKILL_PATH,
  },
  {
    skillName: "JavaScript",
    imgSrc: `${PUBLIC_IMG_PATH}/skill/javascript.svg`,
    contentPath: SKILL_PATH,
  },
  {
    skillName: "HTML",
    imgSrc: `${PUBLIC_IMG_PATH}/skill/html5.svg`,
    contentPath: SKILL_PATH,
  },
  {
    skillName: "CSS",
    imgSrc: `${PUBLIC_IMG_PATH}/skill/css3.svg`,
    contentPath: SKILL_PATH,
  },
];

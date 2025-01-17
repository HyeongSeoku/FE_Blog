import path from "path";

export const PUBLIC_IMG_PATH = "/image";
export const PUBLIC_CONTENT_IMG_PATH = "/content-image";

export const MOBILE_WIDTH = 768;
export const GISCUS_SECTION = "giscusSection";

// 이미지 경로와 설정
export const CONTENT_IMAGE_DIR = path.join(
  process.cwd(),
  "public/content-image",
);
export const DEFAULT_MDX_PATH = "src/mdx";
export const PROJECT_PATH = path.join(
  process.cwd(),
  `${DEFAULT_MDX_PATH}/project`,
);
export const POST_PATH = path.join(
  process.cwd(),
  `${DEFAULT_MDX_PATH}/content`,
);

export const SKILL_PATH = path.join(process.cwd(), `${DEFAULT_MDX_PATH}/skill`);

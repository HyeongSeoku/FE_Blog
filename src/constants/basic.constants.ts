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
export const DEFAULT_POST_THUMBNAIL = `${PUBLIC_IMG_PATH}/default_img.webp`;

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://local-sseoku.com:3000";

export const BASE_META_TITLE = "SEOK 블로그";

export const HEADER_SCROLL_THRESHOLD = 20;

//2022.07.25
export const FIRST_WORKED_DATE = new Date(2022, 6, 25);

export const MY_GITHUB_URL = "https://github.com/HyeongSeoku";
export const LINKED_IN_URL =
  "https://www.linkedin.com/in/%ED%98%95%EC%84%9D-%EA%B9%80-901539232/";
export const EMAIL_ADDRESS = "gudtjr3437@gmail.com";

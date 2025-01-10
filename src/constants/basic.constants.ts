import path from "path";

export const PUBLIC_IMG_PATH = "/image";

export const MOBILE_WIDTH = 768;
export const GISCUS_SECTION = "giscusSection";

export const DEFAULT_MDX_PATH = "src/mdx";
export const PROJECT_PATH = path.join(
  process.cwd(),
  `${DEFAULT_MDX_PATH}/project`,
);
export const POST_PATH = path.join(
  process.cwd(),
  `${DEFAULT_MDX_PATH}/content`,
);

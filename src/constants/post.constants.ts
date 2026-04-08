import type { Category, SubCategory } from "@/types/posts";
import { CATEGORY_COLORS } from "./style.constants";

export const CATEGORY_MAP: Record<
  Category,
  {
    title: string;
    color: (typeof CATEGORY_COLORS)[keyof typeof CATEGORY_COLORS];
  }
> = {
  DEV: { title: "개발", color: CATEGORY_COLORS.DEV },
  LIFE: { title: "일상", color: CATEGORY_COLORS.LIFE },
  ETC: { title: "기타", color: CATEGORY_COLORS.ETC },
};

export const SUB_CATEGORY_MAP: Record<Category, SubCategory[]> = {
  DEV: ["FE", "BE", "DEV_OTHER"],
  LIFE: ["WORK", "HOBBY", "BOOK", "PHOTO"],
  ETC: ["MUSIC"],
};

export const DEFAULT_CATEGORY_ALL = "All";
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_MAIN_POST_COUNT = 6; // 벤토 UI 최대 개수
export const SERIES_MAX_LENGTH = 4;

export const CATEGORY_DESCRIPTION_BIG: Record<string, string> = {
  DEV: "프론트엔드, 백엔드, 기술 관련 개발 글을 모아둔 카테고리입니다.",
  LIFE: "일상, 취미, 책, 사진 등 다양한 라이프 스타일 글을 모아둔 카테고리입니다.",
  ETC: "기타 주제와 잡다한 글들을 모아둔 카테고리입니다.",
};

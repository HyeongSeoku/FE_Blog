import { Category, SubCategory } from "@/types/posts";

export const CATEGORY_COLORS: Record<Category | SubCategory, string> = {
  DEV: "var(--category-dev-bg)",
  LIFE: "var(--category-life-bg)",
  ETC: "var(--category-etc-bg)",
  FE: "var(--category-fe-bg)",
  BE: "var(--category-be-bg)",
  DEV_OTHER: "var(--category-dev-other-bg)",
  WORK: "var(--category-work-bg)",
  HOBBY: "var(--category-hobby-bg)",
  BOOK: "var(--category-book-bg)",
  PHOTO: "var(--category-photo-bg)",
  MUSIC: "var(--category-music-bg)",
};

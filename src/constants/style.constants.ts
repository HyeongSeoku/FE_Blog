import { Category, SubCategory } from "@/types/posts";

export const CATEGORY_COLORS: Record<Category | SubCategory, string> = {
  DEV: "bg-[var(--category-dev-bg)]",
  LIFE: "bg-[var(--category-life-bg)]",
  ETC: "bg-[var(--category-etc-bg)]",
  FE: "bg-[var(--category-fe-bg)]",
  BE: "bg-[var(--category-be-bg)]",
  DEV_OTHER: "bg-[var(--category-dev-other-bg)]",
  WORK: "bg-[var(--category-work-bg)]",
  HOBBY: "bg-[var(--category-hobby-bg)]",
  BOOK: "bg-[var(--category-book-bg)]",
  PHOTO: "bg-[var(--category-photo-bg)]",
  MUSIC: "bg-[var(--category-music-bg)]",
};

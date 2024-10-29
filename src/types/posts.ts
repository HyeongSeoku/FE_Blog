export type Category = "DEV" | "LIFE" | "ETC";
export type SubCategory =
  | "FE"
  | "BE"
  | "DEV_OTHER"
  | "WORK"
  | "HOBBY"
  | "BOOK"
  | "PHOTO"
  | "MUSIC";

export const categoryMap: Record<Category, true> = {
  DEV: true,
  LIFE: true,
  ETC: true,
};

export const SubCategoryMap: Record<Category, SubCategory[]> = {
  DEV: ["FE", "BE", "DEV_OTHER"],
  LIFE: ["WORK", "HOBBY", "BOOK", "PHOTO"],
  ETC: ["MUSIC"],
};

export interface PostProps {
  title: string;
  description: string;
  category: Category;
  subCategory?: SubCategory;
  tags: string[];
  createdAt: string;
}

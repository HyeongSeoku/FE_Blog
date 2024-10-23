export type Category = "TECH" | "LIFE" | "OTHER";
export type SubCategory =
  | "FE"
  | "BE"
  | "TECH_OTHER"
  | "WORK"
  | "HOBBY"
  | "BOOK"
  | "PHOTO"
  | "MUSIC";

export const SubCategoryMap: Record<Category, SubCategory[]> = {
  TECH: ["FE", "BE", "TECH_OTHER"],
  LIFE: ["WORK", "HOBBY", "BOOK", "PHOTO"],
  OTHER: ["MUSIC"],
};

export interface PostProps {
  title: string;
  description: string;
  category: Category;
  subCategory?: SubCategory;
  tags: string[];
  createdAt: string;
}

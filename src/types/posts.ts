export type Category = "TECH" | "LIFE" | "OTHER";

export type SubCategoryMap = {
  TECH: "FE" | "BE" | "TECH_OTHER";
  LIFE: "WORK" | "HOBBY" | "BOOK" | "PHOTO";
  OTHER: "MUSIC";
};

export type SubCategory<C extends Category> = C extends keyof SubCategoryMap
  ? SubCategoryMap[C]
  : never;

export interface PostProps<C extends Category> {
  title: string;
  body: string;
  category: Category;
  subCategory?: SubCategory<C>;
  tags: string[];
  createdAt: string;
}

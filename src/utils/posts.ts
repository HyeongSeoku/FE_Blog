import { Category, SubCategory, SubCategoryMap } from "@/types/posts";

export const isValidSubCategory = (
  category: Category,
  subCategory?: SubCategory,
): boolean => {
  if (!subCategory) return true;
  return SubCategoryMap[category].includes(subCategory);
};

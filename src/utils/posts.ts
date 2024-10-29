import {
  Category,
  categoryMap,
  SubCategory,
  SubCategoryMap,
} from "@/types/posts";

export const isValidCategory = (category: Category): boolean => {
  return !!categoryMap[category];
};

export const isValidSubCategory = (
  category: Category,
  subCategory?: SubCategory,
): boolean => {
  if (!subCategory) return false;
  return SubCategoryMap[category].includes(subCategory);
};

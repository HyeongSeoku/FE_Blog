import {
  Category,
  categoryMap,
  SubCategory,
  SubCategoryMap,
} from "@/types/posts";
import { PostDataProps } from "./mdxServer";

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

// 년도별 그룹화 함수
const groupPostsByYear = (
  postList: PostDataProps[],
): Record<number, PostDataProps[]> => {
  return postList.reduce<Record<number, PostDataProps[]>>((acc, post) => {
    const year = new Date(post.createdAt).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});
};

// 년도-월별 그룹화 함수
const groupPostsByMonth = (
  postList: PostDataProps[],
): Record<string, PostDataProps[]> => {
  return postList.reduce<Record<string, PostDataProps[]>>((acc, post) => {
    const date = new Date(post.createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    if (!acc[month]) acc[month] = [];
    acc[month].push(post);

    return acc;
  }, {});
};

// 옵션에 따라 그룹화 방식 선택
export const groupPosts = (
  postList: PostDataProps[],
  groupBy: "year" | "month",
): Record<number, any> => {
  if (groupBy === "year") {
    return groupPostsByYear(postList);
  } else if (groupBy === "month") {
    return groupPostsByMonth(postList);
  }
  throw new Error("Invalid grouping option. Use 'year' or 'month'.");
};

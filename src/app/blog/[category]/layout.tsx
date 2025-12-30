import { CATEGORY_MAP } from "@/constants/post.constants";
import { ReactNode } from "react";

export const dynamicParams = false;

export function generateStaticParams() {
  const categories = Object.keys(CATEGORY_MAP);
  return categories.map((category) => ({ category: category.toLowerCase() }));
}

const BlogCategoryLayout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default BlogCategoryLayout;

import DefaultLayout from "@/layout/DefaultLayout";
import React, { ReactNode } from "react";

const BlogYearLayout = ({ children }: { children: ReactNode }) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default BlogYearLayout;

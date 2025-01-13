import DefaultLayout from "@/layout/DefaultLayout";
import React, { ReactNode } from "react";

const BlogMonthLayout = ({ children }: { children: ReactNode }) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default BlogMonthLayout;

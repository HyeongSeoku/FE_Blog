import DefaultLayout from "@/layout/DefaultLayout";
import React, { ReactNode } from "react";

const BlogLayout = ({ children }: { children: ReactNode }) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default BlogLayout;

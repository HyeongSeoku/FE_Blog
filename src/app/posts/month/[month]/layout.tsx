import DefaultLayout from "@/layout/DefaultLayout";
import React, { ReactNode } from "react";

const BlogMonthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <DefaultLayout>
      <div className="px-44 py-10 md-lg:px-32 md:px-12">{children}</div>
    </DefaultLayout>
  );
};

export default BlogMonthLayout;

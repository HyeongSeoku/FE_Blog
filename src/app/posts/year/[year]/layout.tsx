import DefaultLayout from "@/layout/DefaultLayout";
import React, { ReactNode } from "react";

const BlogYearLayout = ({ children }: { children: ReactNode }) => {
  return (
    <DefaultLayout>
      <div className="flex flex-col flex-grow">{children}</div>
    </DefaultLayout>
  );
};

export default BlogYearLayout;

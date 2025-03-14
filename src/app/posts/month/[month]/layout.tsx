import DefaultLayout from "@/layout/DefaultLayout";
import React, { ReactNode } from "react";

const BlogMonthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <DefaultLayout>
      <div className="px-64 lg-xl:px-44 md-lg:px-32 md:px-5 flex flex-col flex-grow">
        {children}
      </div>
    </DefaultLayout>
  );
};

export default BlogMonthLayout;

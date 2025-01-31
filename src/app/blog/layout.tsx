import DefaultLayout from "@/layout/DefaultLayout";
import { ReactNode } from "react";

const BlogLayout = ({ children }: { children: ReactNode }) => {
  return (
    <DefaultLayout>
      <div className="px-44 flex-grow md-lg:px-32 md:px-12 flex flex-col">
        {children}
      </div>
    </DefaultLayout>
  );
};

export default BlogLayout;

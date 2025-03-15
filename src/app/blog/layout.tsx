import DefaultLayout from "@/layout/DefaultLayout";
import { ReactNode } from "react";

const BlogLayout = ({ children }: { children: ReactNode }) => {
  return (
    <DefaultLayout>
      <div className="flex-grow flex flex-col">{children}</div>
    </DefaultLayout>
  );
};

export default BlogLayout;

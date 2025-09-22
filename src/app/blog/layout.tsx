import { BASE_URL } from "@/constants/basic.constants";
import DefaultLayout from "@/layout/DefaultLayout";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
};

const BlogLayout = ({ children }: { children: ReactNode }) => {
  return (
    <DefaultLayout>
      <div className="flex-grow flex flex-col">{children}</div>
    </DefaultLayout>
  );
};

export default BlogLayout;

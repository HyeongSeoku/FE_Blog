import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BASE_URL } from "@/constants/basic.constants";
import DefaultLayout from "@/layout/DefaultLayout";

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

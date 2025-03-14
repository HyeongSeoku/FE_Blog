import DefaultLayout from "@/layout/DefaultLayout";
import { ReactNode } from "react";

export default function PostsDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DefaultLayout hasHeaderAnimation={true}>
      <div className="px-64 py-10 lg-xl:px-44 md-lg:px-32 md:px-5">
        {children}
      </div>
    </DefaultLayout>
  );
}

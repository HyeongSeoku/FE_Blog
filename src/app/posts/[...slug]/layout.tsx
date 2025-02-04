import DefaultLayout from "@/layout/DefaultLayout";
import { ReactNode } from "react";

export default function PostsDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DefaultLayout hasHeaderAnimation={true}>
      <div className="px-44 py-10 md-lg:px-32 md:px-12">{children}</div>
    </DefaultLayout>
  );
}

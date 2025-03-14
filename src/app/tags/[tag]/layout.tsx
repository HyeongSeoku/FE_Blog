import DefaultLayout from "@/layout/DefaultLayout";
import { ReactNode } from "react";

export default function TagLayout({ children }: { children: ReactNode }) {
  return (
    <DefaultLayout>
      <div className="px-64 flex-grow lg-xl:px-44 md-lg:px-32 md:px-5 flex flex-col">
        {children}
      </div>
    </DefaultLayout>
  );
}

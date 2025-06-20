import DefaultLayout from "@/layout/DefaultLayout";
import { ReactNode } from "react";

export default function SeriesLayout({ children }: { children: ReactNode }) {
  return (
    <DefaultLayout>
      <div>series</div>
      {children}
    </DefaultLayout>
  );
}

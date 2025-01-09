import DefaultLayout from "@/layout/DefaultLayout";
import { ReactNode } from "react";

export default function TagLayout({ children }: { children: ReactNode }) {
  return <DefaultLayout showScrollProgress={true}>{children}</DefaultLayout>;
}

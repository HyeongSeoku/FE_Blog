import { ReactNode } from "react";
import AboutLayoutComponent from "@/layout/AboutLayout";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <AboutLayoutComponent>
      <div className="flex-grow flex flex-col">{children}</div>
    </AboutLayoutComponent>
  );
}

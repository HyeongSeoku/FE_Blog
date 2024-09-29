"use client";

import { ReactNode } from "react";

export interface MainSectionProps {
  title: string;
  children: ReactNode;
}

const MainSection = ({ title, children }: MainSectionProps) => {
  return (
    <section className="my-10">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <div className="w-full h-fit">{children}</div>
    </section>
  );
};

export default MainSection;

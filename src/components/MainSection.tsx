"use client";

import { ReactNode } from "react";

export interface MainSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const MainSection = ({
  title,
  description = "",
  children,
}: MainSectionProps) => {
  return (
    <section className="my-10 flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      {description && (
        <p className="text-center flex flex-col justify-center text-[var(--description-text-color)] whitespace-pre-line">
          {description}
        </p>
      )}
      <div className="w-full h-fit">{children}</div>
    </section>
  );
};

export default MainSection;

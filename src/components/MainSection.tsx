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
    <section className="my-10 flex flex-col justify-center">
      <h3 className="text-lg font-bold">{title}</h3>
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

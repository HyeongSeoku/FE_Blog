import { ReactNode } from "react";

export interface MainSectionProps {
  title: string;
  titleChildren?: ReactNode;
  children: ReactNode;
}

const MainSection = ({ title, titleChildren, children }: MainSectionProps) => {
  return (
    <section className="my-10 flex flex-col justify-center">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        {titleChildren && titleChildren}
      </div>
      <div className="w-full h-fit">{children}</div>
    </section>
  );
};

export default MainSection;

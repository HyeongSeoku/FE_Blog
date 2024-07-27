import { ReactNode } from "react";
import Header, { HeaderType } from "~/components/shared/header";

export interface DefaultLayoutProps {
  children: ReactNode;
  headerType?: HeaderType;
}

const DefaultLayout = ({
  children,
  headerType = "DEFAULT",
}: DefaultLayoutProps) => {
  return (
    <div className="py-2 px-4 max-w-7xl mx-auto">
      <Header headerType={headerType}></Header>
      <section className="">{children}</section>
    </div>
  );
};

export default DefaultLayout;

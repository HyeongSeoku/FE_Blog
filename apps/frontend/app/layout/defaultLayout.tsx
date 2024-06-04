import { ReactNode } from "react";
import Header from "~/components/shared/header";

export interface DefaultLayoutProps {
  children: ReactNode;
  headerType?: string;
}

const DefaultLayout = ({
  children,
  headerType = "DEFAULT",
}: DefaultLayoutProps) => {
  return (
    <div className="py-2 max-w-7xl mx-auto">
      <Header headerType={headerType}></Header>
      <section className="">{children}</section>
    </div>
  );
};

export default DefaultLayout;

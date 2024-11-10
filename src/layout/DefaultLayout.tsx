import { ReactNode } from "react";
import Header, { HeaderType } from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export interface DefaultLayoutProps {
  children: ReactNode;
  headerType?: HeaderType;
}

const DefaultLayout = ({
  children,
  headerType = "DEFAULT",
}: DefaultLayoutProps) => {
  return (
    <div className="py-2 px-4 max-w-7xl w-full h-full mx-auto box-border break-keep">
      <Header headerType={headerType}></Header>
      <main className="">{children}</main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;

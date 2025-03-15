import { ReactNode } from "react";
import Header, { HeaderType } from "@/components/Header";
import Footer from "@/components/Footer";

export interface DefaultLayoutProps {
  children: ReactNode;
  headerType?: HeaderType;
  hasHeaderAnimation?: boolean;
}

const DefaultLayout = ({
  children,
  headerType = "DEFAULT",
  hasHeaderAnimation = false,
}: DefaultLayoutProps) => {
  return (
    <div className="w-full h-auto min-h-fit flex flex-col flex-grow">
      <Header headerType={headerType} hasAnimation={hasHeaderAnimation} />
      <main className="box-border w-full h-full min-h-fit flex flex-col flex-grow px-64 py-10 lg-xl:px-44 md-lg:px-32 md:px-5 max-w-[1600px] mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;

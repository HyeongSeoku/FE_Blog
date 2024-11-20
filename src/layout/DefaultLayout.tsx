import { ReactNode } from "react";
import Header, { HeaderType } from "@/components/Header";
import Footer from "@/components/Footer";
import { cookies } from "next/headers";
import { LIGHT_DARK_THEME } from "@/constants/cookie.constants";

export interface DefaultLayoutProps {
  children: ReactNode;
  headerType?: HeaderType;
}

const DefaultLayout = ({
  children,
  headerType = "DEFAULT",
}: DefaultLayoutProps) => {
  const cookieStore = cookies();
  const initialTheme = cookieStore.get(LIGHT_DARK_THEME)?.value || "light";

  return (
    <div className="py-2 px-4 max-w-7xl w-full h-full mx-auto box-border break-keep">
      <Header headerType={headerType} initialTheme={initialTheme}></Header>
      <main className="">{children}</main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;

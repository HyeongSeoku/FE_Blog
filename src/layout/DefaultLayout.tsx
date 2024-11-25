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
    <div
      id="container"
      className="max-w-7xl w-full h-full box-border break-keep flex flex-col"
    >
      <Header headerType={headerType} initialTheme={initialTheme}></Header>
      <main className="box-border w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;

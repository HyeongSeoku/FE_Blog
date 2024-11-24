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
    <section className="max-w-7xl w-full h-full mx-auto box-border break-keep flex flex-col">
      <Header headerType={headerType} initialTheme={initialTheme}></Header>
      <main className="h-full box-border">{children}</main>
      <Footer />
    </section>
  );
};

export default DefaultLayout;

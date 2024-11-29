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
      className="w-full h-full box-border break-keep flex flex-col items-center"
    >
      <Header headerType={headerType} initialTheme={initialTheme} />
      <main className="max-w-7xl box-border w-full h-full min-h-fit flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;

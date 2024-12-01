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
    <div className="max-w-4xl">
      <Header headerType={headerType} initialTheme={initialTheme} />
      <main className="box-border w-full h-full min-h-fit flex flex-col px-4 py-2">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;

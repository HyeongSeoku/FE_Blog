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
    <div className="max-w-4xl w-full h-full min-h-fit flex flex-col">
      <Header headerType={headerType} initialTheme={initialTheme} />
      <main className="box-border w-full h-full min-h-fit flex flex-col px-10 py-10 md:px-8 md:py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;

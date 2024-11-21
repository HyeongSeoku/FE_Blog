import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

import { ReactNode } from "react";
import { cookies } from "next/headers";
import { LIGHT_DARK_THEME } from "@/constants/cookie.constants";

export const metadata: Metadata = {
  title: "SEOK 개발 블로그",
  description: "프론트엔드 개발자 김형석의 개발 블로그 입니다.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = cookies();
  const theme = cookieStore.get(LIGHT_DARK_THEME)?.value || "light";

  return (
    <html lang="en" data-theme={theme === "dark" ? "dark" : "light"}>
      <body>
        {children}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}

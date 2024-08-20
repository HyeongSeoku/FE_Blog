import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import classNames from "classnames";
import { cookies } from "next/headers";
import { LIGHT_DARK_THEME } from "@/constants/cookie.constants";

const inter = Inter({ subsets: ["latin"] });

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
    <html
      lang="en"
      className="h-full w-full"
      data-theme={theme === "dark" ? "dark" : "light"}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={classNames("h-full w-full block")}>{children}</body>
    </html>
  );
}
